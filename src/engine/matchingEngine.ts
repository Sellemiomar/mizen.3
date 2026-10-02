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

/**
 * Evaluates whether a program is applicable to the applicant's financing need.
 * Hard applicability gate executed BEFORE any criteria scoring or rule evaluations.
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

  // 1. HOUSING PROGRAMS (Premier Logement, FOPROLOS Construction/Achat)
  const isHousingProgram = program.id === 'premier_logement' || 
    program.id === 'foprolos_construction' ||
    (program.purposes.length === 1 && (program.purposes[0] === 'first_home' || program.purposes[0] === 'home_construction')) ||
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

    // Premier Logement is specifically for purchase (acquisition)
    if (program.id === 'premier_logement' && journey === 'home_construction' && purpose === 'home_construction') {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable à la construction sur terrain propre : le Premier Logement cible l’acquisition auprès d’un promoteur agréé.",
          ar: "غير مطابق للبناء على أرض خاصة : برنامج المسكن الأول موجه لاقتناء مسكن منجز لدى باعث عقاري معتمد."
        }
      };
    }

    return {
      status: 'APPLICABLE',
      reason: {
        fr: "Programme d’habitat applicable au besoin exprimé.",
        ar: "برنامج سكني مطابق لنوعية الحاجة المصرح بها."
      }
    };
  }

  // 2. VEHICLE PROGRAMS (Crédit Auto Particulier vs Leasing Véhicule Pro)
  if (program.id === 'banque_credit_auto') {
    const isCarJourney = journey === 'car' || purpose === 'vehicle';
    if (!isCarJourney) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable : ce crédit bancaire est exclusivement destiné à l’acquisition d’un véhicule.",
          ar: "غير مطابق : هذا القرض البنكي مخصص حصراً لاقتناء سيارة."
        }
      };
    }

    // Crédit auto particulier is for individual salaried applicants
    if (applicant.vehicleBuyerType === 'business' || applicant.generalApplicantType === 'business') {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable aux flottes d’entreprises : ce crédit s’adresse aux particuliers et salariés.",
          ar: "غير مطابق لعربات الشركات : هذا القرض موجه للأفراد والأجراء."
        }
      };
    }

    return {
      status: 'APPLICABLE',
      reason: {
        fr: "Crédit auto bancaire applicable à l’acquisition d’un véhicule particulier.",
        ar: "قرض سيارة مطابق لاقتناء عربة للأفراد."
      }
    };
  }

  if (program.id === 'leasing_vehicule_pro') {
    if (journey === 'home_purchase' || journey === 'home_construction') {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable aux projets immobiliers ou d’habitat.",
          ar: "غير مطابق للمشاريع العقارية أو السكنية."
        }
      };
    }

    if (journey === 'car' && applicant.vehicleBuyerType === 'individual' && applicant.vehicleUsage === 'personal') {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable aux véhicules à usage strictement personnel (leasing professionnel réservé aux entreprises et patentés).",
          ar: "غير مطابق للسيارات ذات الاستعمال الشخصي البحت (الإيجار المالي المهني مخصص للشركات والتجار والمهنيين)."
        }
      };
    }

    const isVehicleOrEquipmentNeed = journey === 'car' || journey === 'equipment' || journey === 'business_expansion' ||
      purpose === 'vehicle' || purpose === 'equipment' || purpose === 'expansion';

    if (!isVehicleOrEquipmentNeed) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable : ce leasing est réservé à l’acquisition de véhicules utilitaires et matériels professionnels.",
          ar: "غير مطابق : هذا الإيجار المالي مخصص للمركبات النفعية والمعدات المهنية."
        }
      };
    }

    return {
      status: 'APPLICABLE',
      reason: {
        fr: "Leasing professionnel applicable aux véhicules et flottes d’entreprise.",
        ar: "إيجار مالي مهني مطابق للمركبات والأسطول المهني."
      }
    };
  }

  // 3. CORPORATE & STARTUP MECHANISMS (BFPME, FOPRODI, Startup Act, SOTUGAR, BTS, etc.)
  // When user is in housing or personal car journeys, business investment programs are NOT APPLICABLE
  const isPersonalJourney = journey === 'home_purchase' || journey === 'home_construction' ||
    (journey === 'car' && applicant.vehicleBuyerType !== 'business');

  if (isPersonalJourney) {
    return {
      status: 'NOT_APPLICABLE',
      reason: {
        fr: "Non applicable : ce mécanisme finance exclusivement les entreprises et investissements professionnels (hors dépenses personnelles ou logement).",
        ar: "غير مطابق : هذه الآلية تمول حصراً المشاريع المهنية والشركات (دون النفقات الشخصية أو السكن)."
      }
    };
  }

  // Specialized Business checks:
  if (program.id === 'startup_act_bourse') {
    if (journey !== 'startup' && purpose !== 'creation' && purpose !== 'innovation_rd') {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable : les bourses et avantages Startup Act ciblent exclusivement la création d'entreprises innovantes et labellisées.",
          ar: "غير مطابق : منح ستارت آب آكت موجهة حصراً لبعث الشركات الناشئة المبتكرة والمتحصلة على العلامة."
        }
      };
    }
  }

  if (program.id === 'aneti_cheque_entreprendre') {
    if (journey !== 'startup' && purpose !== 'creation') {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: "Non applicable : le Chèque Entreprendre ANETI est réservé à la phase d'accompagnement et de création d'entreprise.",
          ar: "غير مطابق : صك المؤسسة موجه لمرحلة المرافقة وتأسيس المشاريع الجديدة."
        }
      };
    }
  }

  // Purpose compatibility check for general business programs
  if (purpose && !program.purposes.includes(purpose)) {
    // Check if journey maps naturally (e.g. equipment journey with equipment purpose)
    const journeyMatches = (journey === 'equipment' && program.purposes.includes('equipment')) ||
      (journey === 'business_expansion' && program.purposes.includes('expansion')) ||
      (journey === 'startup' && program.purposes.includes('creation')) ||
      (journey === 'agriculture' && program.purposes.includes('agriculture'));

    if (!journeyMatches) {
      return {
        status: 'NOT_APPLICABLE',
        reason: {
          fr: `Non applicable : l'objet (${purpose}) ne fait pas partie des dépenses admises par ce programme (${program.purposes.join(', ')}).`,
          ar: `غير مطابق : موضوع التمويل لا يندرج ضمن نفقات هذا البرنامج (${program.purposes.join(', ')}).`
        }
      };
    }
  }

  return {
    status: 'APPLICABLE',
    reason: {
      fr: "Mécanisme applicable à ce domaine de financement.",
      ar: "آلية تمويلية مطابقة لمجال التدخل المطلوب."
    }
  };
}

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
      label: { fr: "Gouvernorat d'implantation", ar: 'الولاية' },
      value: applicant.location
    });
  }
  if (applicant.sector) {
    knownFields.push({
      key: 'sector',
      label: { fr: "Secteur d'activité", ar: 'قطاع النشاط' },
      value: applicant.sector
    });
  }

  // Missing fields from rules evaluated to UNKNOWN
  for (const rule of ruleEvaluations) {
    if (rule.status === 'UNKNOWN') {
      missingApplicantFields.push({
        key: rule.ruleId,
        label: rule.label
      });
    }
  }

  // Unverified/Lender confirmation fields from program verification
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
 * 2. Rule Evaluations (Critical vs Informational)
 * 3. Financial Compatibility
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

  // =========================================================================
  // DIMENSION 1 — APPLICABILITY GATE
  // =========================================================================
  const applicability = evaluateApplicability(applicant, program);

  if (applicability.status === 'NOT_APPLICABLE') {
    potentialIssues.push(applicability.reason);

    const costEstimate = calculateFinancingCost(0, program);
    const applicationReadiness = evaluateApplicationReadiness(applicant, program, []);

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
        confidenceScore: program.verification.status === 'VERIFIED' ? 'HIGH' : 'LOW',
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
      compatibilitySummary: {
        fr: `Non applicable à ce besoin de financement.`,
        ar: `غير مطابق لهذا الاحتياج التمويلي.`
      },
      scoreWeight: 0
    };
  }

  // If applicability is unknown / unverified
  if (applicability.status === 'UNKNOWN') {
    needsVerification.push(applicability.reason);
  } else {
    matchedBecause.push({
      fr: `Objet et nature du financement compatibles avec le champ d'intervention du programme.`,
      ar: `طبيعة وموضوع التمويل متطابقان مع مجال تدخل هذا البرنامج.`
    });
    if (program.id === 'banque_credit_auto' || program.id === 'leasing_vehicule_pro') {
      matchedBecause.push({
        fr: "Acquisition de véhicule conforme aux critères de financement automobile.",
        ar: "اقتناء وسيلة نقل متطابق مع شروط تمويل السيارات."
      });
    }
  }

  // =========================================================================
  // DIMENSION 2 — RULE EVALUATIONS (CRITICAL vs NON-CRITICAL)
  // =========================================================================
  const isPersonalJourney = applicant.journey === 'home_purchase' || 
    applicant.journey === 'home_construction' || 
    (applicant.journey === 'car' && applicant.vehicleBuyerType !== 'business');

  // Rule: Degree Requirement (e.g. BTS Diplômés)
  if (program.eligibilityCriteria.requiresDegree) {
    if (applicant.hasHigherEducationDegree === true) {
      ruleEvaluations.push({
        ruleId: 'requires_degree',
        label: { fr: 'Diplôme d’enseignement supérieur', ar: 'شهادة التعليم العالي' },
        criticality: 'CRITICAL',
        status: 'PASS',
        explanation: {
          fr: "Diplôme d'enseignement supérieur homologué confirmé.",
          ar: "شهادة تعليم عالٍ جامعية متوفرة."
        }
      });
      matchedBecause.push({
        fr: "Diplôme d'enseignement supérieur validé : éligible au plafond de 150 000 DT.",
        ar: "شهادة تعليم عالٍ متوفرة : تتيح الانتفاع بالسقف الأقصى البالغ 150 ألف دينار."
      });
    } else if (applicant.hasHigherEducationDegree === false) {
      ruleEvaluations.push({
        ruleId: 'requires_degree',
        label: { fr: 'Diplôme d’enseignement supérieur', ar: 'شهادة التعليم العالي' },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: "Ce volet spécifique exige impérativement un diplôme universitaire homologué.",
          ar: "هذا المسار يشترط وجوباً شهادة جامعية معادلة."
        }
      });
      potentialIssues.push({
        fr: "Ce volet spécifique exige impérativement un diplôme universitaire homologué.",
        ar: "هذا المسار يشترط وجوباً شهادة جامعية معادلة."
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'requires_degree',
        label: { fr: 'Diplôme d’enseignement supérieur', ar: 'شهادة التعليم العالي' },
        criticality: 'CRITICAL',
        status: 'UNKNOWN',
        explanation: {
          fr: "Diplôme universitaire requis pour ce programme : à confirmer.",
          ar: "شهادة جامعية مطلوبة لهذا البرنامج : يتعين التأكيد."
        }
      });
      needsVerification.push({
        fr: "Diplôme d'enseignement supérieur requis : veuillez confirmer si vous êtes titulaire d'un diplôme universitaire.",
        ar: "شهادة تعليم عالٍ مطلوبة : يرجى تأكيد ما إذا كنتم حاصلين على شهادة جامعية."
      });
    }
  }

  // Rule: Startup Act Label
  if (program.eligibilityCriteria.requiresStartupLabel) {
    if (applicant.hasStartupActLabel === true) {
      ruleEvaluations.push({
        ruleId: 'requires_startup_label',
        label: { fr: 'Label Startup Act', ar: 'علامة مؤسسة ناشئة' },
        criticality: 'CRITICAL',
        status: 'PASS',
        explanation: {
          fr: "Labellisation Startup Act confirmée par le collège officiel.",
          ar: "علامة مؤسسة ناشئة مؤكدة من اللجنة الرسمية."
        }
      });
      matchedBecause.push({
        fr: "Labellisation Startup Act confirmée : déblocage des bourses et avantages fiscaux.",
        ar: "علامة مؤسسة ناشئة متوفرة : تفعيل المنحة الشهرية والامتيازات الجبائية."
      });
    } else if (applicant.hasStartupActLabel === false) {
      ruleEvaluations.push({
        ruleId: 'requires_startup_label',
        label: { fr: 'Label Startup Act', ar: 'علامة مؤسسة ناشئة' },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: "Nécessite l'obtention préalable du Label Startup Act auprès du collège de labellisation.",
          ar: "يشترط نيل علامة مؤسسة ناشئة مسبقاً من لجنة إسناد العلامة."
        }
      });
      potentialIssues.push({
        fr: "Nécessite l'obtention préalable du Label Startup Act auprès du collège de labellisation.",
        ar: "يشترط نيل علامة مؤسسة ناشئة مسبقاً من لجنة إسناد العلامة."
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'requires_startup_label',
        label: { fr: 'Label Startup Act', ar: 'علامة مؤسسة ناشئة' },
        criticality: 'CRITICAL',
        status: 'UNKNOWN',
        explanation: {
          fr: "Obtention du Label Startup Act à vérifier.",
          ar: "الحصول على علامة مؤسسة ناشئة للتأكد."
        }
      });
      needsVerification.push({
        fr: "Labellisation Startup Act : nécessite l'obtention préalable du label officiel auprès du collège de labellisation.",
        ar: "علامة مؤسسة ناشئة : يتطلب نيل العلامة مسبقاً من لجنة إسناد العلامة."
      });
    }
  }

  // Rule: Premier Logement Housing Rules
  if (program.id === 'premier_logement') {
    if (applicant.isFirstPropertyPurchase === true) {
      ruleEvaluations.push({
        ruleId: 'premier_logement_primo',
        label: { fr: 'Primo-accédant', ar: 'المسكن الأول' },
        criticality: 'CRITICAL',
        status: 'PASS',
        explanation: {
          fr: "Condition de premier achat immobilier respectée (primo-accédant).",
          ar: "شرط المسكن الأول متوفر (اقتناء لأول مرة)."
        }
      });
      matchedBecause.push({
        fr: "Condition de premier achat immobilier respectée (primo-accédant).",
        ar: "شرط المسكن الأول متوفر (اقتناء لأول مرة)."
      });
    } else if (applicant.isFirstPropertyPurchase === false) {
      ruleEvaluations.push({
        ruleId: 'premier_logement_primo',
        label: { fr: 'Primo-accédant', ar: 'المسكن الأول' },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: "Réservé exclusivement aux primo-accédants ne possédant aucun autre logement.",
          ar: "مخصص حصراً لمن لا يملكون مسكناً سابقاً (المسكن الأول)."
        }
      });
      potentialIssues.push({
        fr: "Réservé exclusivement aux primo-accédants ne possédant aucun autre logement.",
        ar: "مخصص حصراً لمن لا يملكون مسكناً سابقاً (المسكن الأول)."
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'premier_logement_primo',
        label: { fr: 'Primo-accédant', ar: 'المسكن الأول' },
        criticality: 'CRITICAL',
        status: 'UNKNOWN',
        explanation: {
          fr: "Condition de premier achat immobilier à confirmer (attestation de non-possession).",
          ar: "شرط اقتناء المسكن الأول بحاجة للتأكيد (شهادة عدم ملكية)."
        }
      });
      needsVerification.push({
        fr: "Vérifier la condition de premier achat (ne pas être propriétaire d’un logement).",
        ar: "التأكد من شرط المسكن الأول (عدم امتلاك مسكن سابقاً)."
      });
    }

    if (applicant.monthlyIncomeRange === '1000_1500' || applicant.monthlyIncomeRange === '1500_2500' || applicant.monthlyIncomeRange === '2500_4000') {
      ruleEvaluations.push({
        ruleId: 'premier_logement_income',
        label: { fr: 'Tranche de revenu classe moyenne', ar: 'شريحة الدخل المتوسط' },
        criticality: 'IMPORTANT',
        status: 'PASS',
        explanation: {
          fr: "Revenu mensuel conforme au barème classe moyenne (4,5 à 10 fois SMIG).",
          ar: "الدخل الشهري مطابق لمعايير الفئة المتوسطة (4.5 إلى 10 أضعاف الأجر الأدنى)."
        }
      });
      matchedBecause.push({
        fr: "Tranche de revenu mensuel déclarée conforme aux critères de la classe moyenne (4,5 à 10 fois SMIG).",
        ar: "شريحة الدخل الشهري المصرح بها متوافقة مع معايير الفئة المتوسطة (4.5 إلى 10 أضعاف الأجر الأدنى)."
      });
    } else if (applicant.monthlyIncomeRange === 'under_1000' || applicant.monthlyIncomeRange === 'over_4000') {
      ruleEvaluations.push({
        ruleId: 'premier_logement_income',
        label: { fr: 'Tranche de revenu classe moyenne', ar: 'شريحة الدخل المتوسط' },
        criticality: 'IMPORTANT',
        status: 'FAIL',
        explanation: {
          fr: "Revenu en dehors de la fourchette réglementaire Premier Logement (4,5 à 10 SMIG).",
          ar: "الدخل يقع خارج النطاق القانوني للمسكن الأول (4.5 إلى 10 أضعاف الأجر الأدنى)."
        }
      });
      potentialIssues.push({
        fr: "Revenu en dehors de la fourchette réglementaire Premier Logement (4,5 à 10 SMIG).",
        ar: "الدخل يقع خارج النطاق القانوني للمسكن الأول (4.5 إلى 10 أضعاف الأجر الأدنى)."
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'premier_logement_income',
        label: { fr: 'Tranche de revenu classe moyenne', ar: 'شريحة الدخل المتوسط' },
        criticality: 'IMPORTANT',
        status: 'UNKNOWN',
        explanation: {
          fr: "Revenu du ménage à vérifier par rapport au seuil de 4,5 à 10 fois le SMIG.",
          ar: "دخل العائلة بحاجة للتثبت مقارنة بسقف 4.5 إلى 10 أضعاف الأجر الأدنى."
        }
      });
      needsVerification.push({
        fr: "Revenu du ménage à vérifier par rapport au seuil officiel de 4,5 à 10 fois le SMIG.",
        ar: "دخل العائلة بحاجة للتثبت مقارنة بسقف 4.5 إلى 10 أضعاف الأجر الأدنى."
      });
    }
  }

  // Rule: FOPROLOS Salaried Affiliation
  if (program.id === 'foprolos_construction') {
    if (applicant.employmentStatus === 'salaried_private' || applicant.employmentStatus === 'salaried_public') {
      ruleEvaluations.push({
        ruleId: 'foprolos_salaried',
        label: { fr: 'Affiliation CNSS/CNRPS', ar: 'انخراط بالصناديق الاجتماعية' },
        criticality: 'CRITICAL',
        status: 'PASS',
        explanation: {
          fr: "Statut salarié affilié à la sécurité sociale conforme aux conditions FOPROLOS.",
          ar: "صفة أجير منخرط بالصناديق الاجتماعية متوافقة مع شروط فوبرولوس."
        }
      });
      matchedBecause.push({
        fr: "Statut salarié affilié aux régimes de sécurité sociale (CNSS / CNRPS) compatible avec le FOPROLOS.",
        ar: "صفة أجير منخرط بالصناديق الاجتماعية (CNSS/CNRPS) مؤهلة للانتفاع بفوبرولوس."
      });
    } else if (applicant.employmentStatus) {
      ruleEvaluations.push({
        ruleId: 'foprolos_salaried',
        label: { fr: 'Affiliation CNSS/CNRPS', ar: 'انخراط بالصناديق الاجتماعية' },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: "Le FOPROLOS est strictement réservé aux salariés cotisants affiliés (CNSS / CNRPS).",
          ar: "فوبرولوس مخصص حصراً للأجراء المنخرطين بالصناديق الاجتماعية (CNSS/CNRPS)."
        }
      });
      potentialIssues.push({
        fr: "Le FOPROLOS est strictement réservé aux salariés cotisants affiliés (CNSS / CNRPS).",
        ar: "فوبرولوس مخصص حصراً للأجراء المنخرطين بالصناديق الاجتماعية (CNSS/CNRPS)."
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'foprolos_salaried',
        label: { fr: 'Affiliation CNSS/CNRPS', ar: 'انخراط بالصناديق الاجتماعية' },
        criticality: 'CRITICAL',
        status: 'UNKNOWN',
        explanation: {
          fr: "Affiliation sociale salariée (CNSS/CNRPS) à confirmer.",
          ar: "الانخراط بالصناديق الاجتماعية كأجير بحاجة للتأكيد."
        }
      });
      needsVerification.push({
        fr: "Vérifier l'affiliation et l'ancienneté de cotisation aux régimes CNSS ou CNRPS.",
        ar: "التأكد من الانخراط وأقدمية المساهمة في صندوق الضمان الاجتماعي أو التقاعد."
      });
    }
  }

  // Rule: Legal Structure for Business Programs
  if (!isPersonalJourney) {
    if (!applicant.legalStructure) {
      ruleEvaluations.push({
        ruleId: 'legal_structure',
        label: { fr: 'Forme juridique', ar: 'الشكل القانوني' },
        criticality: 'IMPORTANT',
        status: 'UNKNOWN',
        explanation: {
          fr: `Forme juridique non précisée (admissibles : ${program.eligibilityCriteria.allowedLegalForms.join(', ')}).`,
          ar: `الشكل القانوني غير محدد (المؤهلة : ${program.eligibilityCriteria.allowedLegalForms.join(', ')}).`
        }
      });
      needsVerification.push({
        fr: `Forme juridique non précisée : ce mécanisme s'adresse aux structures (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`,
        ar: `الشكل القانوني غير محدد : يتطلب هذا البرنامج أشكالاً قانونية محددة (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`
      });
    } else if (program.eligibilityCriteria.allowedLegalForms.includes(applicant.legalStructure)) {
      ruleEvaluations.push({
        ruleId: 'legal_structure',
        label: { fr: 'Forme juridique', ar: 'الشكل القانوني' },
        criticality: 'IMPORTANT',
        status: 'PASS',
        explanation: {
          fr: `Forme juridique (${applicant.legalStructure.toUpperCase()}) admise par ce dispositif.`,
          ar: `الصيغة القانونية (${applicant.legalStructure.toUpperCase()}) مقبولة ومؤهلة لدى هذه الآلية.`
        }
      });
      matchedBecause.push({
        fr: `Forme juridique (${applicant.legalStructure.toUpperCase()}) admise par ce dispositif.`,
        ar: `الصيغة القانونية (${applicant.legalStructure.toUpperCase()}) مقبولة ومؤهلة لدى هذه الآلية.`
      });
    } else if (applicant.legalStructure === 'not_yet_created' && applicant.businessStage === 'idea_project') {
      ruleEvaluations.push({
        ruleId: 'legal_structure',
        label: { fr: 'Forme juridique', ar: 'الشكل القانوني' },
        criticality: 'IMPORTANT',
        status: 'UNKNOWN',
        explanation: {
          fr: "Entreprise en cours de création : choix de forme juridique à finaliser.",
          ar: "المؤسسة في طور التأسيس : اختيار الصيغة القانونية قيد الاستكمال."
        }
      });
      needsVerification.push({
        fr: `Entreprise en cours de constitution : choisir une forme juridique éligible (${program.eligibilityCriteria.allowedLegalForms.filter(f => f !== 'not_yet_created').map(f => f.toUpperCase()).join(', ')}) avant le déblocage.`,
        ar: `المؤسسة في طور التأسيس : يتعين اختيار شكل قانوني مؤهل (${program.eligibilityCriteria.allowedLegalForms.filter(f => f !== 'not_yet_created').map(f => f.toUpperCase()).join(', ')}) قبل صرف التمويل.`
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'legal_structure',
        label: { fr: 'Forme juridique', ar: 'الشكل القانوني' },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: `Forme juridique (${applicant.legalStructure.toUpperCase()}) non admise (requises : ${program.eligibilityCriteria.allowedLegalForms.join(', ')}).`,
          ar: `الصيغة القانونية (${applicant.legalStructure.toUpperCase()}) غير مؤهلة (المطلوبة : ${program.eligibilityCriteria.allowedLegalForms.join(', ')}).`
        }
      });
      potentialIssues.push({
        fr: `Forme juridique (${applicant.legalStructure.toUpperCase()}) non admise : les formes requises sont (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`,
        ar: `الصيغة القانونية (${applicant.legalStructure.toUpperCase()}) غير مؤهلة : الأشكال المقبولة هي (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`
      });
    }
  }

  // Rule: Sector for Business Programs
  if (!isPersonalJourney) {
    if (!applicant.sector) {
      ruleEvaluations.push({
        ruleId: 'sector',
        label: { fr: 'Secteur d’activité', ar: 'قطاع النشاط' },
        criticality: 'IMPORTANT',
        status: 'UNKNOWN',
        explanation: {
          fr: "Secteur d'activité non précisé.",
          ar: "قطاع النشاط غير محدد."
        }
      });
      needsVerification.push({
        fr: `Secteur d'activité non précisé : vérifier que votre secteur figure parmi les secteurs admis auprès de cet organisme.`,
        ar: `قطاع النشاط غير محدد : يرجى التثبت من إدراج قطاع نشاطكم ضمن القطاعات المؤهلة لدى هذه المؤسسة.`
      });
    } else if (program.eligibilityCriteria.sectors.includes(applicant.sector)) {
      ruleEvaluations.push({
        ruleId: 'sector',
        label: { fr: 'Secteur d’activité', ar: 'قطاع النشاط' },
        criticality: 'IMPORTANT',
        status: 'PASS',
        explanation: {
          fr: `Secteur d'activité (${applicant.sector}) admissible.`,
          ar: `قطاع النشاط مؤهل.`
        }
      });
      matchedBecause.push({
        fr: `Secteur d'activité admissible auprès de cet organisme.`,
        ar: `قطاع النشاط مؤهل ومدعوم لدى هذه المؤسسة.`
      });
    } else {
      ruleEvaluations.push({
        ruleId: 'sector',
        label: { fr: 'Secteur d’activité', ar: 'قطاع النشاط' },
        criticality: 'CRITICAL',
        status: 'FAIL',
        explanation: {
          fr: `Secteur d'activité (${applicant.sector}) exclu ou non prioritaire pour ce fonds.`,
          ar: `قطاع النشاط غير ذي أولوية أو مستثنى من تدخل هذا الصندوق.`
        }
      });
      potentialIssues.push({
        fr: `Secteur d'activité généralement exclu ou non prioritaire pour ce fonds.`,
        ar: `قطاع النشاط غير ذي أولوية أو مستثنى من تدخل هذا الصندوق.`
      });
    }
  }

  // Rule: Age limit
  if (program.eligibilityCriteria.maxAge) {
    if (applicant.applicantAge && applicant.applicantAge > 0) {
      if (applicant.applicantAge <= program.eligibilityCriteria.maxAge) {
        ruleEvaluations.push({
          ruleId: 'max_age',
          label: { fr: 'Critère d’âge', ar: 'شرط السن' },
          criticality: 'CRITICAL',
          status: 'PASS',
          explanation: {
            fr: `Critère d'âge respecté (${applicant.applicantAge} ans <= ${program.eligibilityCriteria.maxAge} ans).`,
            ar: `شرط السن متوفر (${applicant.applicantAge} سنة <= ${program.eligibilityCriteria.maxAge} سنة).`
          }
        });
        matchedBecause.push({
          fr: `Critère d'âge respecté (${applicant.applicantAge} ans <= ${program.eligibilityCriteria.maxAge} ans).`,
          ar: `شرط السن متوفر (${applicant.applicantAge} سنة <= ${program.eligibilityCriteria.maxAge} سنة).`
        });
      } else {
        ruleEvaluations.push({
          ruleId: 'max_age',
          label: { fr: 'Critère d’âge', ar: 'شرط السن' },
          criticality: 'CRITICAL',
          status: 'FAIL',
          explanation: {
            fr: `Âge (${applicant.applicantAge} ans) supérieur au plafond fixé à ${program.eligibilityCriteria.maxAge} ans.`,
            ar: `السن (${applicant.applicantAge} سنة) يتجاوز السقف المحدد بـ ${program.eligibilityCriteria.maxAge} سنة.`
          }
        });
        potentialIssues.push({
          fr: `Âge du porteur (${applicant.applicantAge} ans) supérieur au plafond fixé à ${program.eligibilityCriteria.maxAge} ans pour ce dispositif.`,
          ar: `سن الباعث (${applicant.applicantAge} سنة) يتجاوز السقف المحدد بـ ${program.eligibilityCriteria.maxAge} سنة لهذه الآلية.`
        });
      }
    } else {
      ruleEvaluations.push({
        ruleId: 'max_age',
        label: { fr: 'Critère d’âge', ar: 'شرط السن' },
        criticality: 'IMPORTANT',
        status: 'UNKNOWN',
        explanation: {
          fr: `Plafond d'âge fixé à ${program.eligibilityCriteria.maxAge} ans pour ce programme.`,
          ar: `السقف الأقصى للسن محدد بـ ${program.eligibilityCriteria.maxAge} سنة.`
        }
      });
      needsVerification.push({
        fr: `Critère d'âge à confirmer : plafond fixé à < ${program.eligibilityCriteria.maxAge} ans pour les bénéficiaires de ce programme.`,
        ar: `شرط السن للتأكيد : السقف الأقصى محدد بـ ${program.eligibilityCriteria.maxAge} سنة للمنتفعين بهذا البرنامج.`
      });
    }
  }

  // Rule: Regional Development Zone (ZDR) bonus
  if (program.hasRegionalDevelopmentBonus) {
    if (applicant.location) {
      const isZdrLocation = applicant.isRegionalDevelopmentZone || REGIONAL_DEVELOPMENT_ZONES.includes(applicant.location);
      if (isZdrLocation) {
        matchedBecause.push({
          fr: `Implantation en Zone de Développement Régional (${applicant.location}): éligibilité aux avantages et taux de garantie ou primes majorés.`,
          ar: `الانتصاب بمنطقة تنمية جهوية (${applicant.location}): التمتع بحوافز استثمار ونسب ضمان تفاضلية معززة.`
        });
      }
    } else {
      needsVerification.push({
        fr: `Localisation régionale non précisée : à vérifier pour l'éligibilité aux bonifications et primes de développement régional (ZDR).`,
        ar: `الموقع الجغرافي غير محدد : للتأكد من أحقية التمتع بحوافز وتفاضليات التنمية الجهوية.`
      });
    }
  }

  // =========================================================================
  // DIMENSION 3 — FINANCIAL COMPATIBILITY EVALUATION
  // =========================================================================
  const amount = (applicant.financingRequested && applicant.financingRequested > 0)
    ? applicant.financingRequested 
    : ((applicant.totalProjectCost && applicant.totalProjectCost > 0)
        ? (applicant.totalProjectCost - (applicant.userContribution || 0))
        : 0);

  let amountStatus: RuleEvaluation['status'] = 'UNKNOWN';
  const financialDetails: { fr: string; ar: string }[] = [];

  if (amount <= 0) {
    amountStatus = 'UNKNOWN';
    needsVerification.push({
      fr: `Montant de financement non précisé : vérifier que le besoin se situe dans la fourchette d'intervention [${program.minAmount.toLocaleString('fr-FR')} - ${program.maxAmount.toLocaleString('fr-FR')} DT].`,
      ar: `المبلغ المطلوب غير محدد : يرجى التأكد من أن الحاجة تقع ضمن نطاق البرنامج [${program.minAmount.toLocaleString('fr-FR')} - ${program.maxAmount.toLocaleString('fr-FR')} د].`
    });
  } else if (amount >= program.minAmount && amount <= program.maxAmount) {
    amountStatus = 'PASS';
    matchedBecause.push({
      fr: `Montant demandé (${amount.toLocaleString('fr-FR')} DT) aligné avec le plafond du programme [${program.minAmount.toLocaleString('fr-FR')} - ${program.maxAmount.toLocaleString('fr-FR')} DT].`,
      ar: `المبلغ المطلوب (${amount.toLocaleString('fr-FR')} د) متطابق مع سقف البرنامج [${program.minAmount.toLocaleString('fr-FR')} - ${program.maxAmount.toLocaleString('fr-FR')} د].`
    });
  } else if (amount < program.minAmount) {
    amountStatus = 'FAIL';
    potentialIssues.push({
      fr: `Montant demandé (${amount.toLocaleString('fr-FR')} DT) inférieur au seuil minimum d'intervention (${program.minAmount.toLocaleString('fr-FR')} DT).`,
      ar: `المبلغ المطلوب (${amount.toLocaleString('fr-FR')} د) أقل من الحد الأدنى للتدخل (${program.minAmount.toLocaleString('fr-FR')} د).`
    });
  } else {
    amountStatus = 'FAIL';
    potentialIssues.push({
      fr: `Montant demandé (${amount.toLocaleString('fr-FR')} DT) dépasse le plafond autorisé de ${program.maxAmount.toLocaleString('fr-FR')} DT pour ce mécanisme.`,
      ar: `المبلغ المطلوب (${amount.toLocaleString('fr-FR')} د) يتجاوز السقف الأقصى المسموح به (${program.maxAmount.toLocaleString('fr-FR')} د).`
    });
  }

  // Contribution evaluation
  let contributionStatus: RuleEvaluation['status'] = 'UNKNOWN';
  if (!applicant.totalProjectCost || applicant.totalProjectCost <= 0) {
    contributionStatus = 'UNKNOWN';
    if (program.minContributionPercent > 0) {
      needsVerification.push({
        fr: `Coût global du projet non précisé : ce mécanisme requiert au moins ${program.minContributionPercent}% d'apport personnel sur le budget total d'investissement.`,
        ar: `الكلفة الجملية للمشروع غير محددة : يشترط هذا البرنامج مساهمة ذاتية لا تقل عن ${program.minContributionPercent}% من الكلفة الإجمالية.`
      });
    }
  } else if (applicant.userContribution === undefined) {
    contributionStatus = 'UNKNOWN';
    if (program.minContributionPercent > 0) {
      needsVerification.push({
        fr: `Apport personnel non renseigné : ce mécanisme requiert un apport propre d'au moins ${program.minContributionPercent}% du coût global de ${applicant.totalProjectCost.toLocaleString('fr-FR')} DT (soit au moins ${Math.round((applicant.totalProjectCost * program.minContributionPercent) / 100).toLocaleString('fr-FR')} DT).`,
        ar: `التمويل الذاتي غير مصرح به : يشترط هذا البرنامج مساهمة ذاتية لا تقل عن ${program.minContributionPercent}% من الكلفة الإجمالية البالغة ${applicant.totalProjectCost.toLocaleString('fr-FR')} د.`
      });
    }
  } else {
    const contributionRatio = (applicant.userContribution / applicant.totalProjectCost) * 100;
    if (contributionRatio >= program.minContributionPercent) {
      contributionStatus = 'PASS';
      if (program.minContributionPercent > 0) {
        matchedBecause.push({
          fr: `Apport personnel déclaré (${contributionRatio.toFixed(1)}%) suffisant par rapport au minimum requis (${program.minContributionPercent}%).`,
          ar: `التمويل الذاتي المصرح به (${contributionRatio.toFixed(1)}%) كافٍ مقارنة بالحد الأدنى المطلوب (${program.minContributionPercent}%).`
        });
      }
    } else {
      contributionStatus = 'FAIL';
      potentialIssues.push({
        fr: `Apport personnel (${contributionRatio.toFixed(1)}%) inférieur au seuil réglementaire requis (${program.minContributionPercent}%). Un complément d'autofinancement sera exigé.`,
        ar: `التمويل الذاتي (${contributionRatio.toFixed(1)}%) أقل من النسبة القانونية المطلوبة (${program.minContributionPercent}%). سيتطلب الملف استكمال التمويل الذاتي.`
      });
    }
  }

  const financialEvaluation: FinancialEvaluation = {
    amountStatus,
    contributionStatus,
    overallFinancialStatus: (amountStatus === 'PASS' && contributionStatus === 'PASS') 
      ? 'COMPATIBLE' 
      : (amountStatus === 'FAIL' ? 'INCOMPATIBLE' : 'PARTIALLY_COMPATIBLE'),
    details: financialDetails
  };

  // Verification items notes - distinguish lender underwriting vs catalog consolidation vs regulatory updates
  if (program.verification.unverifiedFields.length > 0) {
    needsVerification.push({
      fr: formatVerificationNeed('LENDER_CONFIRMATION_REQUIRED', program.verification.unverifiedFields, 'fr'),
      ar: formatVerificationNeed('LENDER_CONFIRMATION_REQUIRED', program.verification.unverifiedFields, 'ar')
    });
  }

  // =========================================================================
  // DIMENSION 4 — EVIDENCE CONFIDENCE EVALUATION
  // =========================================================================
  const isOutdated = program.verification.status === 'OUTDATED';
  const isUnverifiedEvidence = program.verification.status === 'UNVERIFIED' || program.verification.status === 'SOURCE_UNAVAILABLE';
  
  if (isOutdated) {
    needsVerification.push({
      fr: formatVerificationNeed('PROGRAMME_RULE_UNCLEAR_OR_OUTDATED', 'rate', 'fr'),
      ar: formatVerificationNeed('PROGRAMME_RULE_UNCLEAR_OR_OUTDATED', 'rate', 'ar')
    });
  } else if (isUnverifiedEvidence) {
    needsVerification.push({
      fr: formatVerificationNeed('DATA_NOT_VERIFIED_IN_MIZEN', 'eligibilityCriteria', 'fr'),
      ar: formatVerificationNeed('DATA_NOT_VERIFIED_IN_MIZEN', 'eligibilityCriteria', 'ar')
    });
  }
  const confidenceScore: 'HIGH' | 'MEDIUM' | 'LOW' = (program.verification.status === 'VERIFIED' || program.verification.status === 'PARTIALLY_VERIFIED') && !isOutdated
    ? 'HIGH'
    : (isOutdated ? 'LOW' : 'MEDIUM');

  const evidenceEvaluation: EvidenceEvaluation = {
    status: program.verification.status,
    isOutdated,
    hasUnverifiedFields: program.verification.unverifiedFields.length > 0,
    confidenceScore,
    notes: program.verification.notes
  };

  // Calculate Cost
  const costEstimate = calculateFinancingCost(amount, program);

  // =========================================================================
  // RESULT CLASSIFICATION & DETERMINISTIC ORDERING
  // =========================================================================
  const criticalFailures = ruleEvaluations.filter(r => r.criticality === 'CRITICAL' && r.status === 'FAIL');
  const criticalUnknowns = ruleEvaluations.filter(r => r.criticality === 'CRITICAL' && r.status === 'UNKNOWN');
  const passedRules = ruleEvaluations.filter(r => r.status === 'PASS');
  const failedRules = ruleEvaluations.filter(r => r.status === 'FAIL');
  const unknownRules = ruleEvaluations.filter(r => r.status === 'UNKNOWN');

  let status: MatchStatus = 'STRONG_ALIGNMENT';
  let alignmentLevel: MatchReason['alignmentLevel'] = 'strong_alignment';
  let scoreWeight = 800; // Secondary ranking categorical bucket

  if (criticalFailures.length > 0 || amountStatus === 'FAIL') {
    // 1. Critical failure: cannot be a match
    status = 'NOT_MATCHED';
    alignmentLevel = 'potential_blockers';
    scoreWeight = 200 + (passedRules.length * 10) - (failedRules.length * 20);
  } else if (criticalUnknowns.length > 0 || isOutdated || isUnverifiedEvidence) {
    // 2. Critical information unknown or evidence outdated
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
      ? `Adéquation à confirmer — informations ou conditions préalables à vérifier.`
      : `Critères bloquants identifiés pour ce dispositif.`,
    ar: status === 'STRONG_ALIGNMENT'
      ? `تطابق قوي مع المعايير العامة المنشورة لدى ${provider.acronym}.`
      : status === 'POTENTIAL_ALIGNMENT'
      ? `تطابق محتمل — المعايير الأساسية متوافقة.`
      : status === 'REQUIRES_CONFIRMATION'
      ? `أهلية تتطلب التأكيد — معطيات أو شروط قيد التثبت.`
      : `وجود شروط غير متوفرة تعيق الاستفادة من هذا البرنامج.`
  };

  const applicationReadiness = evaluateApplicationReadiness(applicant, program, ruleEvaluations);

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
    compatibilitySummary,
    scoreWeight
  };
}

export function runMatchingEngine(applicant: ApplicantProfile): MatchResult[] {
  const providerMap = new Map(PROVIDERS.map(p => [p.id, p]));

  const results = FINANCING_PROGRAMS.map(program => {
    const provider = providerMap.get(program.providerId) || PROVIDERS[0];
    return evaluateProgramCompatibility(applicant, program, provider);
  });

  // Sort primarily by categorical status:
  // 1. STRONG_ALIGNMENT (scoreWeight 800+)
  // 2. POTENTIAL_ALIGNMENT (scoreWeight 600+)
  // 3. REQUIRES_CONFIRMATION (scoreWeight 400+)
  // 4. NOT_MATCHED (scoreWeight 200+)
  // 5. NOT_APPLICABLE (scoreWeight 0)
  results.sort((a, b) => b.scoreWeight - a.scoreWeight);

  return results;
}
