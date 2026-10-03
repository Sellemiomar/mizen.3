import { 
  ApplicantProfile, 
  FinancingProgram, 
  MatchReason, 
  MatchResult, 
  Provider,
  ApplicabilityStatus,
  RuleEvaluation,
  FinancialEvaluation,
  EvidenceEvaluation,
  MatchStatus,
  ApplicationReadiness
} from '../types/financing';
import { FINANCING_PROGRAMS, PROVIDERS, REGIONAL_DEVELOPMENT_ZONES } from '../data/financingData';
import { calculateFinancingCost } from './financialCalculations';
import { formatVerificationNeed, getFieldLabel } from '../utils/verificationLabels';
import { getOfficialSimulator, generateExclusionReason } from '../knowledge/catalogueAdapter';
import { getCanonicalProgram, isFieldVerifiedCurrent, getProgramOperationalStatus } from '../knowledge/knowledgeRegistry';

/**
 * Evaluates whether a program is applicable to the applicant's financing need.
 * Hard applicability gate executed BEFORE any criteria scoring or rule evaluations.
 * Purely data-driven from program metadata, supportedJourneys, supportedPurposes, and buyerTypes.
 */
export function evaluateApplicability(
  applicant: ApplicantProfile,
  program: FinancingProgram
): { status: ApplicabilityStatus; reason: { fr: string; ar: string } } {
  // Check if program applicability is explicitly marked unverified
  if (program.applicability?.unverifiedApplicability) {
    return {
      status: 'UNKNOWN',
      reason: {
        fr: "Applicabilité du mécanisme non vérifiée auprès des sources officielles.",
        ar: "مجال تطبيق هذه الآلية غير مؤكد استناداً للمصادر الرسمية."
      }
    };
  }

  const journey = applicant.journey;
  const purpose = applicant.purpose;

  // When neither journey nor purpose is specified by applicant, applicability cannot be judged definitively
  if (!journey && !purpose) {
    return {
      status: 'UNKNOWN',
      reason: {
        fr: `Objet ou besoin de financement non précisé : vérifier l'éligibilité pour ce mécanisme (${program.purposes.join(', ')}).`,
        ar: `موضوع أو طبيعة التمويل غير محددة : يرجى التأكد من تطابق النفقات مع هذا البرنامج (${program.purposes.join(', ')}).`
      }
    };
  }

  // 1. Check supportedJourneys metadata
  if (program.applicability?.supportedJourneys && journey) {
    if (!program.applicability.supportedJourneys.includes(journey)) {
      const hasDirectPurposeMatch = purpose && program.purposes.includes(purpose);
      if (!hasDirectPurposeMatch) {
        return {
          status: 'NOT_APPLICABLE',
          reason: {
            fr: `Non applicable au parcours sélectionné (${journey}) : ce dispositif est destiné à d'autres objets (${program.purposes.join(', ')}).`,
            ar: `غير مطابق لهذا المسار : هذا البرنامج مخصص لأغراض تمويلية أخرى (${program.purposes.join(', ')}).`
          }
        };
      }
    }
  }

  // 2. Check supportedPurposes metadata
  if (program.applicability?.supportedPurposes && purpose) {
    if (!program.applicability.supportedPurposes.includes(purpose)) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: `Non applicable à cet objet de dépense (${purpose}) : dépenses admises (${program.applicability.supportedPurposes.join(', ')}).`,
          ar: `غير مطابق لهذا النوع من النفقات : النفقات المؤهلة تشمل (${program.applicability.supportedPurposes.join(', ')}).`
        }
      };
    }
  }

  // 3. Check Buyer Type metadata (individual vs business)
  if (program.applicability?.supportedBuyerTypes) {
    const isBusinessBuyer = applicant.vehicleBuyerType === 'business' || 
                            applicant.generalApplicantType === 'business' ||
                            applicant.legalStructure === 'suarl' ||
                            applicant.legalStructure === 'sarl' ||
                            applicant.legalStructure === 'sa';
    
    const isIndividualBuyer = (applicant.vehicleBuyerType === 'individual' && applicant.vehicleUsage === 'personal') ||
                              applicant.generalApplicantType === 'individual' ||
                              (applicant.journey === 'car' && applicant.vehicleBuyerType === 'individual') ||
                              applicant.journey === 'home_purchase' ||
                              applicant.journey === 'home_construction';

    if (isBusinessBuyer && !program.applicability.supportedBuyerTypes.includes('business')) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable aux entreprises : ce dispositif est réservé aux particuliers.",
          ar: "غير مطابق للمؤسسات : هذا التمويل مخصص حصراً للأفراد."
        }
      };
    }

    if (isIndividualBuyer && !program.applicability.supportedBuyerTypes.includes('individual') && !isBusinessBuyer) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable aux particuliers à usage privé : ce dispositif est réservé aux professionnels et personnes morales.",
          ar: "غير مطابق للأفراد للاستعمال الشخصي : هذا البرنامج موجه حصراً للشركات والمهنيين."
        }
      };
    }
  }

  // 4. Check Business Entity Requirement
  if (program.applicability?.requiresBusinessEntity) {
    const isStrictPersonal = (journey === 'car' && applicant.vehicleBuyerType === 'individual' && applicant.vehicleUsage === 'personal') ||
                             journey === 'home_purchase' ||
                             journey === 'home_construction';
    if (isStrictPersonal) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable : ce mécanisme finance exclusivement les entreprises et investissements professionnels.",
          ar: "غير مطابق : هذه الآلية تمول حصراً المشاريع المهنية والشركات."
        }
      };
    }
  }

  // 5. Check First Property Requirement
  if (program.applicability?.isFirstPropertyOnly) {
    if (applicant.isFirstPropertyPurchase === false) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable : réservé exclusivement aux primo-accédants (première acquisition résidentielle).",
          ar: "غير مطابق : مخصص حصراً للمسكن الأول (عدم امتلاك مسكن سابق)."
        }
      };
    }
  }

  // 6. Check Housing Intent
  const isHousingProgram = (program.purposes.length === 1 && (program.purposes[0] === 'first_home' || program.purposes[0] === 'home_construction')) ||
    (program.purposes.every(p => p === 'first_home' || p === 'home_construction'));

  if (isHousingProgram) {
    const isHousingIntent = journey === 'home_purchase' || journey === 'home_construction' ||
      purpose === 'first_home' || purpose === 'home_construction';
    if (!isHousingIntent) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable à ce besoin. Les critères publiés concernent exclusivement le financement du logement (achat ou construction).",
          ar: "غير مطابق لهذا الاحتياج. هذا البرنامج مخصص حصراً لتمويل السكن (اقتناء أو بناء مسكن)."
        }
      };
    }
  }

  // 7. Check Personal vs Corporate Journey separation
  const isPersonalJourney = journey === 'home_purchase' || journey === 'home_construction' ||
    (journey === 'car' && applicant.vehicleBuyerType === 'individual' && applicant.vehicleUsage !== 'professional');

  const isCorporateProgram = program.category === 'bank_loan' && !isHousingProgram && 
    (program.purposes.includes('creation') || program.purposes.includes('expansion')) &&
    !program.purposes.includes('vehicle') && !program.purposes.includes('first_home');

  if (isPersonalJourney && isCorporateProgram) {
    return {
      status: 'NOT_APPLICABLE',
      reason: {
        fr: "Non applicable : ce mécanisme finance exclusivement les entreprises et investissements professionnels (hors dépenses personnelles ou logement).",
        ar: "غير مطابق : هذه الآلية تمول حصراً المشاريع المهنية والشركات (دون النفقات الشخصية أو السكن)."
      }
    };
  }

  return {
    status: 'APPLICABLE',
    reason: {
      fr: `Dispositif en adéquation thématique avec votre projet (${program.purposes.join(', ')}).`,
      ar: `البرنامج متطابق مع طبيعة مشروعكم (${program.purposes.join(', ')}).`
    }
  };
}

/**
 * Evaluates application readiness based on profile data, required documents, and verification state.
 */
export function evaluateApplicationReadiness(
  applicant: ApplicantProfile,
  program: FinancingProgram,
  ruleEvaluations: RuleEvaluation[]
): ApplicationReadiness {
  const knownFields: ApplicationReadiness['knownFields'] = [];
  const missingApplicantFields: ApplicationReadiness['missingApplicantFields'] = [];
  const lenderConfirmationFields: ApplicationReadiness['lenderConfirmationFields'] = [];

  if (applicant.financingRequested) {
    knownFields.push({
      key: 'financingRequested',
      label: { fr: 'Financement demandé', ar: 'التمويل المطلوب' },
      value: `${applicant.financingRequested.toLocaleString('fr-TN')} TND`
    });
  }

  if (applicant.userContribution !== undefined) {
    knownFields.push({
      key: 'userContribution',
      label: { fr: 'Apport personnel', ar: 'التمويل الذاتي' },
      value: `${applicant.userContribution.toLocaleString('fr-TN')} TND`
    });
  }

  if (applicant.location) {
    knownFields.push({
      key: 'location',
      label: { fr: 'Gouvernorat d’implantation', ar: 'ولاية الانتصاب' },
      value: applicant.location
    });
  }

  if (applicant.hasHigherEducationDegree !== undefined) {
    knownFields.push({
      key: 'hasHigherEducationDegree',
      label: { fr: 'Diplôme du supérieur', ar: 'شهادة التعليم العالي' },
      value: applicant.hasHigherEducationDegree ? 'Oui' : 'Non'
    });
  }

  if (applicant.hasStartupActLabel !== undefined) {
    knownFields.push({
      key: 'hasStartupActLabel',
      label: { fr: 'Label Startup Act', ar: 'علامة مؤسسة ناشئة' },
      value: applicant.hasStartupActLabel ? 'Oui' : 'Non'
    });
  }

  for (const rule of ruleEvaluations) {
    if (rule.status === 'UNKNOWN') {
      missingApplicantFields.push({
        key: rule.ruleId,
        label: rule.label
      });
    }
  }

  if (program.verification.unverifiedFields && program.verification.unverifiedFields.length > 0) {
    for (const field of program.verification.unverifiedFields) {
      lenderConfirmationFields.push({
        key: field,
        label: {
          fr: getFieldLabel(field, 'fr'),
          ar: getFieldLabel(field, 'ar')
        }
      });
    }
  }

  const requiredDocuments = program.requiredDocuments || [];
  const totalWeight = Math.max(knownFields.length + missingApplicantFields.length, 1);
  const readinessScorePercent = Math.min(100, Math.round((knownFields.length / totalWeight) * 100));

  return {
    knownFields,
    missingApplicantFields,
    lenderConfirmationFields,
    requiredDocuments,
    readinessScorePercent
  };
}

/**
 * Main compatibility evaluator combining the 4 independent dimensions:
 * 1. Applicability Gate
 * 2. Rule Evaluations (Critical vs Informational, Current vs Historical)
 * 3. Financial Compatibility (Ceilings, Ratios, Cost thresholds)
 * 4. Evidence Confidence
 */
export function evaluateProgramCompatibility(
  applicant: ApplicantProfile,
  program: FinancingProgram,
  provider: Provider
): MatchResult {
  const matchedBecause: MatchReason['matchedBecause'] = [];
  const potentialIssues: MatchReason['potentialIssues'] = [];
  const needsVerification: MatchReason['needsVerification'] = [];
  const ruleEvaluations: RuleEvaluation[] = [];

  const canonical = getCanonicalProgram(program.id);
  const operationalStatus = getProgramOperationalStatus(program.id);
  const officialSimulator = getOfficialSimulator(program.id);

  // =========================================================================
  // DIMENSION 1 — APPLICABILITY GATE
  // =========================================================================
  const applicability = evaluateApplicability(applicant, program);

  if (applicability.status === 'NOT_APPLICABLE') {
    potentialIssues.push(applicability.reason);

    const costEstimate = calculateFinancingCost(0, program);
    const applicationReadiness = evaluateApplicationReadiness(applicant, program, []);
    const exclusionReason = generateExclusionReason(program, 'PURPOSE_MISMATCH', applicability.reason);

    return {
      program,
      provider,
      status: 'NOT_APPLICABLE',
      applicabilityStatus: 'NOT_APPLICABLE',
      applicabilityReason: applicability.reason,
      ruleEvaluations: [],
      financialEvaluation: {
        amountStatus: 'NOT_APPLICABLE',
        contributionStatus: 'NOT_APPLICABLE',
        overallFinancialStatus: 'INCOMPATIBLE',
        details: [applicability.reason]
      },
      evidenceEvaluation: {
        status: program.verification.status,
        isOutdated: program.verification.status === 'OUTDATED',
        hasUnverifiedFields: program.verification.unverifiedFields.length > 0,
        confidenceScore: 'LOW',
        notes: program.verification.notes
      },
      reasons: {
        matchedBecause: [],
        potentialIssues,
        needsVerification: [],
        alignmentLevel: 'not_applicable'
      },
      costEstimate,
      applicationReadiness,
      exclusionReason,
      officialSimulator,
      compatibilitySummary: {
        fr: `Non applicable à ce besoin de financement.`,
        ar: `غير مطابق لهذا الاحتياج التمويلي.`
      },
      scoreWeight: 0
    };
  }

  if (applicability.status === 'UNKNOWN') {
    needsVerification.push(applicability.reason);
  } else {
    matchedBecause.push(applicability.reason);
  }

  // =========================================================================
  // DIMENSION 2 — CRITERIA & RULE EVALUATIONS
  // =========================================================================

  // Rule: Degree requirement (BTS Diplômés)
  if (program.eligibilityCriteria.requiresDegree) {
    if (applicant.hasHigherEducationDegree === true) {
      ruleEvaluations.push({
        ruleId: 'requiresDegree',
        label: { fr: "Diplôme de l'enseignement supérieur", ar: "شهادة التعليم العالي" },
        criticality: 'CRITICAL',
        status: 'PASS',
        explanation: {
          fr: "Diplôme de l'enseignement supérieur validé.",
          ar: "شرط الشهادة الجامعية متوفر لدى المترشح."
        }
      });
      matchedBecause.push({
        fr: "Diplôme de l'enseignement supérieur validé.",
        ar: "شرط الشهادة الجامعية متوفر."
      });
    } else if (applicant.hasHigherEducationDegree === false) {
      ruleEvaluations.push({
        ruleId: 'requiresDegree',
        label: { fr: "Diplôme de l'enseignement supérieur", ar: "شهادة التعليم العالي" },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: "Ce programme exige obligatoirement un diplôme universitaire homologué.",
          ar: "هذا البرنامج يشترط وجوباً شهادة جامعية معترف بها."
        }
      });
      potentialIssues.push({
        fr: "Diplôme de l'enseignement supérieur obligatoire non renseigné ou non détenu.",
        ar: "شهادة التعليم العالي مشروطة قانوناً لهذا البرنامج."
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'requiresDegree',
        label: { fr: "Diplôme de l'enseignement supérieur", ar: "شهادة التعليم العالي" },
        criticality: 'CRITICAL',
        status: 'UNKNOWN',
        explanation: {
          fr: "Diplôme universitaire à confirmer dans votre profil.",
          ar: "يرجى تأكيد توفر الشهادة الجامعية في الملف."
        }
      });
      needsVerification.push({
        fr: formatVerificationNeed('USER_INPUT_REQUIRED', 'requiresDegree', 'fr'),
        ar: formatVerificationNeed('USER_INPUT_REQUIRED', 'requiresDegree', 'ar')
      });
    }
  }

  // Rule: Startup Act Label requirement (Startup Guarantee Fund / Smart Capital)
  if (program.eligibilityCriteria.requiresStartupLabel || program.id === 'startup_act_bourse') {
    if (applicant.hasStartupActLabel === true) {
      ruleEvaluations.push({
        ruleId: 'requiresStartupLabel',
        label: { fr: "Label officiel Startup Act", ar: "علامة مؤسسة ناشئة الرسمية" },
        criticality: 'CRITICAL',
        status: 'PASS',
        explanation: {
          fr: "Label officiel Startup Act obtenu auprès du Collège des Startups.",
          ar: "علامة مؤسسة ناشئة متحصل عليها رسمياً من لجنة الستارتاب."
        }
      });
      matchedBecause.push({
        fr: "Label officiel Startup Act validé.",
        ar: "علامة مؤسسة ناشئة رسمية متوفرة."
      });
    } else if (applicant.hasStartupActLabel === false) {
      ruleEvaluations.push({
        ruleId: 'requiresStartupLabel',
        label: { fr: "Label officiel Startup Act", ar: "علامة مؤسسة ناشئة الرسمية" },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: "Ce dispositif exige l'obtention préalable du label officiel Startup Act.",
          ar: "يشترط الحصول المسبق على علامة مؤسسة ناشئة الرسمية."
        }
      });
      potentialIssues.push({
        fr: "Label officiel Startup Act requis non obtenu.",
        ar: "علامة مؤسسة ناشئة الرسمية مطلوبة للاستفادة."
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'requiresStartupLabel',
        label: { fr: "Label officiel Startup Act", ar: "علامة مؤسسة ناشئة الرسمية" },
        criticality: 'CRITICAL',
        status: 'UNKNOWN',
        explanation: {
          fr: "Label Startup Act à confirmer.",
          ar: "علامة مؤسسة ناشئة قيد التثبت."
        }
      });
      needsVerification.push({
        fr: formatVerificationNeed('USER_INPUT_REQUIRED', 'requiresStartupLabel', 'fr'),
        ar: formatVerificationNeed('USER_INPUT_REQUIRED', 'requiresStartupLabel', 'ar')
      });
    }
  }

  // Rule: Legal Structure requirement
  if (program.eligibilityCriteria.allowedLegalForms && applicant.legalStructure) {
    if (program.eligibilityCriteria.allowedLegalForms.includes(applicant.legalStructure)) {
      matchedBecause.push({
        fr: `Forme juridique (${applicant.legalStructure.toUpperCase()}) éligible.`,
        ar: `الصيغة القانونية (${applicant.legalStructure.toUpperCase()}) متطابقة مع الشروط.`
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'legalStructure',
        label: { fr: "Forme juridique", ar: "الشكل القانوني" },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: `Forme juridique (${applicant.legalStructure}) non admise pour ce guichet. Formes admises : ${program.eligibilityCriteria.allowedLegalForms.join(', ')}.`,
          ar: `الشكل القانوني (${applicant.legalStructure}) غير مقبول لهذا البرنامج. الأشكال المقبولة : ${program.eligibilityCriteria.allowedLegalForms.join(', ')}.`
        }
      });
      potentialIssues.push({
        fr: `Forme juridique actuelle (${applicant.legalStructure}) non admise pour ce dispositif.`,
        ar: `الشكل القانوني الحالي للمؤسسة غير مطابق لشروط هذا البرنامج.`
      });
    }
  }

  // Rule: Sector & Exclusion checks (e.g. BFPME exclusions)
  if (program.id === 'bfpme_creation' || program.id === 'bfpme_extension') {
    if (applicant.sector === 'hotels_accommodation') {
      ruleEvaluations.push({
        ruleId: 'sectorExclusionHotel',
        label: { fr: "Exclusion hôtellerie classique", ar: "استثناء الفندقة الكلاسيكية" },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: "L'hôtellerie d'hébergement classique est formellement exclue du financement BFPME.",
          ar: "الفندقة الكلاسيكية مستثناة رسمياً من تمويل بنك BFPME."
        }
      });
      potentialIssues.push({
        fr: "Activité d'hôtellerie classique exclue des financements BFPME.",
        ar: "نشاط الفندقة الكلاسيكية مستثنى من تمويلات BFPME."
      });
    } else if (applicant.sector === 'real_estate_development') {
      ruleEvaluations.push({
        ruleId: 'sectorExclusionRealEstate',
        label: { fr: "Exclusion promotion immobilière résidentielle", ar: "استثناء البعث العقاري السكني" },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: "La promotion immobilière résidentielle est formellement exclue du financement BFPME.",
          ar: "البعث العقاري السكني مستثنى رسمياً من تمويل بنك BFPME."
        }
      });
      potentialIssues.push({
        fr: "Activité de promotion immobilière résidentielle exclue des financements BFPME.",
        ar: "نشاط البعث العقاري السكني مستثنى من تمويلات BFPME."
      });
    }
  }

  // Rule: Regional Development Zone (ZDR) bonus
  if (applicant.location && REGIONAL_DEVELOPMENT_ZONES.includes(applicant.location)) {
    if (program.hasRegionalDevelopmentBonus) {
      matchedBecause.push({
        fr: `Implantation à ${applicant.location} en Zone de Développement Régional (ZDR) : prime et bonification applicables.`,
        ar: `الانتصاب في ${applicant.location} بمنطقة تنمية جهوية : إمكانية التمتع بمنحة تشجيع وتفاضل.`
      });
    }
  }

  // =========================================================================
  // DIMENSION 3 — FINANCIAL COMPATIBILITY & SIMULATION
  // =========================================================================
  const financialDetails: { fr: string; ar: string }[] = [];
  let amountStatus: RuleEvaluation['status'] = 'PASS';
  let contributionStatus: RuleEvaluation['status'] = 'PASS';

  // 1. Requested financing amount vs Program limits
  if (applicant.financingRequested !== undefined && applicant.financingRequested > 0) {
    // BFPME CMLT Loan Ceiling: 2,500,000 TND (verified current)
    if (program.id === 'bfpme_creation' && applicant.financingRequested > 2500000) {
      amountStatus = 'FAIL';
      const detail = {
        fr: `Le montant de crédit CMLT demandé (${applicant.financingRequested.toLocaleString('fr-TN')} TND) dépasse le plafond d'intervention BFPME de 2 500 000 TND.`,
        ar: `مبلغ قرض CMLT المطلوب (${applicant.financingRequested.toLocaleString('fr-TN')} د) يتجاوز سقف تدخل بنك BFPME البالغ 2.5 مليون دينار.`
      };
      financialDetails.push(detail);
      potentialIssues.push(detail);
    } else if (applicant.financingRequested > program.maxAmount) {
      amountStatus = 'FAIL';
      const detail = {
        fr: `Montant demandé (${applicant.financingRequested.toLocaleString('fr-TN')} TND) dépasse le plafond publié (${program.maxAmount.toLocaleString('fr-TN')} TND).`,
        ar: `المبلغ المطلوب (${applicant.financingRequested.toLocaleString('fr-TN')} د) يتجاوز السقف المنشور (${program.maxAmount.toLocaleString('fr-TN')} د).`
      };
      financialDetails.push(detail);
      potentialIssues.push(detail);
    } else if (applicant.financingRequested < program.minAmount) {
      amountStatus = 'FAIL';
      const detail = {
        fr: `Montant demandé (${applicant.financingRequested.toLocaleString('fr-TN')} TND) inférieur au seuil minimal (${program.minAmount.toLocaleString('fr-TN')} TND).`,
        ar: `المبلغ المطلوب (${applicant.financingRequested.toLocaleString('fr-TN')} د) أقل من الحد الأدنى (${program.minAmount.toLocaleString('fr-TN')} د).`
      };
      financialDetails.push(detail);
      potentialIssues.push(detail);
    } else {
      matchedBecause.push({
        fr: `Montant demandé (${applicant.financingRequested.toLocaleString('fr-TN')} TND) dans la fourchette d'intervention (${program.minAmount.toLocaleString('fr-TN')} - ${program.maxAmount.toLocaleString('fr-TN')} TND).`,
        ar: `المبلغ المطلوب (${applicant.financingRequested.toLocaleString('fr-TN')} د) يقع ضمن السقف المتاح للبرنامج.`
      });
    }
  } else {
    amountStatus = 'UNKNOWN';
  }

  // 2. Project Cost Range Checks (e.g. BFPME 150k - 15m TND; FGJC max 500k TND)
  if (applicant.totalProjectCost !== undefined && applicant.totalProjectCost > 0) {
    if (program.id === 'bfpme_creation') {
      if (applicant.totalProjectCost > 15000000) {
        amountStatus = 'FAIL';
        const detail = {
          fr: `Le coût d'investissement total du projet (${applicant.totalProjectCost.toLocaleString('fr-TN')} TND) dépasse le plafond BFPME de 15 000 000 TND.`,
          ar: `الكلفة الاستثمارية الجملية للمشروع (${applicant.totalProjectCost.toLocaleString('fr-TN')} د) تتجاوز سقف BFPME البالغ 15 مليون دينار.`
        };
        financialDetails.push(detail);
        potentialIssues.push(detail);
      } else if (applicant.totalProjectCost < 150000) {
        amountStatus = 'FAIL';
        const detail = {
          fr: `Le coût d'investissement total du projet (${applicant.totalProjectCost.toLocaleString('fr-TN')} TND) est inférieur au seuil minimal BFPME de 150 000 TND.`,
          ar: `الكلفة الاستثمارية الجملية للمشروع (${applicant.totalProjectCost.toLocaleString('fr-TN')} د) أقل من الحد الأدنى لـ BFPME البالغ 150 ألف دينار.`
        };
        financialDetails.push(detail);
        potentialIssues.push(detail);
      }

      // 65% CMLT Ceiling ratio check
      if (applicant.financingRequested !== undefined && applicant.financingRequested > 0) {
        const cmltRatio = applicant.financingRequested / applicant.totalProjectCost;
        if (cmltRatio > 0.65) {
          amountStatus = 'FAIL';
          const detail = {
            fr: `Le crédit CMLT demandé (${Math.round(cmltRatio * 100)}% du coût total) dépasse le plafond réglementaire de 65% de l'investissement.`,
            ar: `قرض CMLT المطلوب (${Math.round(cmltRatio * 100)}% من كلفة المشروع) يتجاوز السقف القانوني المحدد بـ 65%.`
          };
          financialDetails.push(detail);
          potentialIssues.push(detail);
        }
      }
    }

    // SOTUGAR FGJC (Young Creator): Max 500,000 TND project cost
    if (program.id === 'sotugar_fgjc' && applicant.totalProjectCost > 500000) {
      amountStatus = 'FAIL';
      const detail = {
        fr: `Le coût du projet (${applicant.totalProjectCost.toLocaleString('fr-TN')} TND) dépasse le plafond FGJC de 500 000 TND.`,
        ar: `كلفة المشروع (${applicant.totalProjectCost.toLocaleString('fr-TN')} د) تتجاوز سقف صندوق الباعثين الشبان البالغ 500 ألف دينار.`
      };
      financialDetails.push(detail);
      potentialIssues.push(detail);
    }
  }

  // 3. Own contribution check (only when verified rule exists and not project-dependent)
  if (applicant.userContribution !== undefined && applicant.totalProjectCost && applicant.totalProjectCost > 0) {
    if (program.minContributionPercent !== undefined && program.minContributionPercent > 0) {
      const calculatedContributionPercent = (applicant.userContribution / applicant.totalProjectCost) * 100;
      if (calculatedContributionPercent < program.minContributionPercent) {
        contributionStatus = 'FAIL';
        const detail = {
          fr: `Apport propre déclaré (${Math.round(calculatedContributionPercent)}%) inférieur au minimum réglementaire de ${program.minContributionPercent}%.`,
          ar: `التمويل الذاتي المصرح (${Math.round(calculatedContributionPercent)}%) أقل من النسبة المشروطة (${program.minContributionPercent}%).`
        };
        financialDetails.push(detail);
        potentialIssues.push(detail);
      } else {
        matchedBecause.push({
          fr: `Apport personnel (${Math.round(calculatedContributionPercent)}%) conforme à l'exigence minimale de ${program.minContributionPercent}%.`,
          ar: `التمويل الذاتي (${Math.round(calculatedContributionPercent)}%) يستجيب للنسبة المطلوبة (${program.minContributionPercent}%).`
        });
      }
    }
  }

  // Project cost verification note when either totalProjectCost or userContribution is missing
  if (applicant.totalProjectCost === undefined || applicant.userContribution === undefined) {
    needsVerification.push({
      fr: "Coût total du projet ou apport personnel non spécifié : vérification de l'apport requise.",
      ar: "الكلفة الجملية للمشروع أو التمويل الذاتي غير محددة : يتطلب التثبت لتحديد نسبة التمويل."
    });
  }

  const overallFinancialStatus: FinancialEvaluation['overallFinancialStatus'] = 
    amountStatus === 'FAIL' || contributionStatus === 'FAIL'
      ? 'INCOMPATIBLE'
      : amountStatus === 'UNKNOWN'
      ? 'UNKNOWN'
      : 'COMPATIBLE';

  const financialEvaluation: FinancialEvaluation = {
    amountStatus,
    contributionStatus,
    overallFinancialStatus,
    details: financialDetails
  };

  // Run financial calculations
  const costEstimate = calculateFinancingCost(
    applicant.financingRequested || 0,
    program
  );

  // =========================================================================
  // DIMENSION 4 — EVIDENCE CONFIDENCE & UNVERIFIED PARAMETERS
  // =========================================================================
  const isOutdated = program.verification.status === 'OUTDATED';
  const isUnverifiedEvidence = program.verification.status === 'UNVERIFIED';
  const isPartiallyVerified = program.verification.status === 'PARTIALLY_VERIFIED';
  const isHistorical = program.verification.status === 'VERIFIED_HISTORICAL' || canonical?.ruleStatus === 'VERIFIED_HISTORICAL';

  if (program.verification.unverifiedFields && program.verification.unverifiedFields.length > 0) {
    needsVerification.push({
      fr: formatVerificationNeed('LENDER_CONFIRMATION_REQUIRED', program.verification.unverifiedFields, 'fr'),
      ar: formatVerificationNeed('LENDER_CONFIRMATION_REQUIRED', program.verification.unverifiedFields, 'ar')
    });
  }

  // Strict Evidence Confidence Rule:
  // VERIFIED_CURRENT -> potentially HIGH
  // PARTIALLY_VERIFIED -> maximum MEDIUM (NEVER HIGH)
  // VERIFIED_HISTORICAL / UNVERIFIED / OUTDATED / UNKNOWN -> LOW
  const confidenceScore: 'HIGH' | 'MEDIUM' | 'LOW' = 
    isPartiallyVerified 
      ? 'MEDIUM' 
      : isHistorical || isOutdated || isUnverifiedEvidence 
      ? 'LOW' 
      : program.verification.status === 'VERIFIED' && program.verification.unverifiedFields.length === 0 
      ? 'HIGH' 
      : 'MEDIUM';

  const evidenceEvaluation: EvidenceEvaluation = {
    status: program.verification.status,
    isOutdated,
    hasUnverifiedFields: program.verification.unverifiedFields.length > 0,
    confidenceScore,
    notes: program.verification.notes
  };

  // =========================================================================
  // SYNTHESIS & CATEGORICAL ORDERING
  // =========================================================================
  const criticalFailures = ruleEvaluations.filter(r => r.criticality === 'CRITICAL' && r.status === 'FAIL');
  const criticalUnknowns = ruleEvaluations.filter(r => r.criticality === 'CRITICAL' && r.status === 'UNKNOWN');
  const passedRules = ruleEvaluations.filter(r => r.status === 'PASS');
  const failedRules = ruleEvaluations.filter(r => r.status === 'FAIL');
  const unknownRules = ruleEvaluations.filter(r => r.status === 'UNKNOWN');

  let status: MatchStatus = 'STRONG_ALIGNMENT';
  let alignmentLevel: MatchReason['alignmentLevel'] = 'strong_alignment';
  let scoreWeight = 800; // Categorical order aid

  if (criticalFailures.length > 0 || amountStatus === 'FAIL') {
    // 1. Critical failure on verified rule: cannot be a match
    status = 'NOT_MATCHED';
    alignmentLevel = 'potential_blockers';
    scoreWeight = 200 + (passedRules.length * 10) - (failedRules.length * 20);
  } else if (criticalUnknowns.length > 0 || isOutdated || isUnverifiedEvidence || operationalStatus === 'ACTIVE_NOT_CONFIRMED' || isHistorical) {
    // 2. Critical information unknown or operational acceptance unconfirmed
    status = 'REQUIRES_CONFIRMATION';
    alignmentLevel = 'partial_alignment';
    scoreWeight = 400 + (passedRules.length * 10) - (unknownRules.length * 5);
  } else if (failedRules.length > 0 || unknownRules.length > 1 || contributionStatus === 'FAIL') {
    // 3. Potential alignment: main criteria fit, minor points to adjust
    status = 'POTENTIAL_ALIGNMENT';
    alignmentLevel = 'partial_alignment';
    scoreWeight = 600 + (passedRules.length * 10) - (failedRules.length * 10);
  } else {
    // 4. Strong verified alignment
    status = 'STRONG_ALIGNMENT';
    alignmentLevel = 'strong_alignment';
    scoreWeight = 800 + (passedRules.length * 10);
  }

  const compatibilitySummary = {
    fr: status === 'STRONG_ALIGNMENT'
      ? `Forte adéquation avec les critères publics de ${provider.acronym}.`
      : status === 'POTENTIAL_ALIGNMENT'
      ? `Adéquation potentielle — critères principaux alignés.`
      : status === 'REQUIRES_CONFIRMATION'
      ? `Adéquation à confirmer — conditions vérifiées d'après la source officielle; acceptation opérationnelle ou paramètres à confirmer.`
      : `Critères bloquants identifiés pour ce dispositif.`,
    ar: status === 'STRONG_ALIGNMENT'
      ? `تطابق قوي مع المعايير العامة المنشورة لدى ${provider.acronym}.`
      : status === 'POTENTIAL_ALIGNMENT'
      ? `تطابق محتمل — المعايير الأساسية متوافقة.`
      : status === 'REQUIRES_CONFIRMATION'
      ? `أهلية تتطلب التأكيد — الشروط موثقة رسمياً ولكن يتطلب التأكيد مع المؤسسة.`
      : `وجود شروط غير متوفرة تعيق الاستفادة من هذا البرنامج.`
  };

  const applicationReadiness = evaluateApplicationReadiness(applicant, program, ruleEvaluations);
  const exclusionReason = status === 'NOT_MATCHED' 
    ? generateExclusionReason(program, 'CRITICAL_FAILURE', potentialIssues[0])
    : undefined;

  return {
    program,
    provider,
    status,
    applicabilityStatus: 'APPLICABLE',
    applicabilityReason: applicability.reason,
    ruleEvaluations,
    financialEvaluation,
    evidenceEvaluation,
    reasons: {
      matchedBecause,
      potentialIssues,
      needsVerification,
      alignmentLevel
    },
    costEstimate,
    applicationReadiness,
    exclusionReason,
    officialSimulator,
    compatibilitySummary,
    scoreWeight
  };
}

/**
 * Returns categorical rank for strictly explainable, transparent ordering.
 * 1. APPLICABLE + STRONG_ALIGNMENT
 * 2. APPLICABLE + POTENTIAL_ALIGNMENT
 * 3. APPLICABLE + REQUIRES_CONFIRMATION
 * 4. APPLICABLE + NOT_MATCHED
 * 5. UNKNOWN_APPLICABILITY
 * 6. NOT_APPLICABLE
 */
export function getCategoricalRank(result: MatchResult): number {
  if (result.applicabilityStatus === 'NOT_APPLICABLE') return 6;
  if (result.applicabilityStatus === 'UNKNOWN') return 5;
  switch (result.status) {
    case 'STRONG_ALIGNMENT': return 1;
    case 'POTENTIAL_ALIGNMENT': return 2;
    case 'REQUIRES_CONFIRMATION': return 3;
    case 'NOT_MATCHED': return 4;
    case 'NOT_APPLICABLE': return 6;
    default: return 5;
  }
}

export function runMatchingEngine(applicant: ApplicantProfile): MatchResult[] {
  const providerMap = new Map(PROVIDERS.map(p => [p.id, p]));

  const results = FINANCING_PROGRAMS.map(program => {
    const provider = providerMap.get(program.providerId) || PROVIDERS[0];
    return evaluateProgramCompatibility(applicant, program, provider);
  });

  // Sort strictly by categorical ranking bucket (1 through 6)
  results.sort((a, b) => {
    const rankDiff = getCategoricalRank(a) - getCategoricalRank(b);
    if (rankDiff !== 0) return rankDiff;
    return b.scoreWeight - a.scoreWeight;
  });

  return results;
}
