import { ApplicantProfile, FinancingProgram, MatchReason, MatchResult, Provider } from '../types/financing';
import { FINANCING_PROGRAMS, PROVIDERS, REGIONAL_DEVELOPMENT_ZONES } from '../data/financingData';
import { calculateFinancingCost } from './financialCalculations';

export function evaluateProgramCompatibility(
  applicant: ApplicantProfile,
  program: FinancingProgram,
  provider: Provider
): MatchResult {
  const matchedBecause: MatchReason['matchedBecause'] = [];
  const potentialIssues: MatchReason['potentialIssues'] = [];
  const needsVerification: MatchReason['needsVerification'] = [];

  let scoreWeight = 100; // Internal ranking aid ONLY, NEVER shown as "approval probability"

  // 1. Amount Evaluation
  const amount = (applicant.financingRequested && applicant.financingRequested > 0)
    ? applicant.financingRequested 
    : ((applicant.totalProjectCost && applicant.totalProjectCost > 0)
        ? (applicant.totalProjectCost - (applicant.userContribution || 0))
        : 0);

  if (amount <= 0) {
    needsVerification.push({
      fr: `Montant de financement non précisé : vérifier que le besoin se situe dans la fourchette d'intervention [${program.minAmount.toLocaleString('fr-FR')} - ${program.maxAmount.toLocaleString('fr-FR')} DT].`,
      ar: `المبلغ المطلوب غير محدد : يرجى التأكد من أن الحاجة تقع ضمن نطاق البرنامج [${program.minAmount.toLocaleString('fr-FR')} - ${program.maxAmount.toLocaleString('fr-FR')} د].`
    });
  } else if (amount >= program.minAmount && amount <= program.maxAmount) {
    matchedBecause.push({
      fr: `Montant demandé (${amount.toLocaleString('fr-FR')} DT) aligné avec le plafond du programme [${program.minAmount.toLocaleString('fr-FR')} - ${program.maxAmount.toLocaleString('fr-FR')} DT].`,
      ar: `المبلغ المطلوب (${amount.toLocaleString('fr-FR')} د) متطابق مع سقف البرنامج [${program.minAmount.toLocaleString('fr-FR')} - ${program.maxAmount.toLocaleString('fr-FR')} د].`
    });
    scoreWeight += 25;
  } else if (amount < program.minAmount) {
    potentialIssues.push({
      fr: `Montant demandé (${amount.toLocaleString('fr-FR')} DT) inférieur au seuil minimum d'intervention (${program.minAmount.toLocaleString('fr-FR')} DT).`,
      ar: `المبلغ المطلوب (${amount.toLocaleString('fr-FR')} د) أقل من الحد الأدنى للتدخل (${program.minAmount.toLocaleString('fr-FR')} د).`
    });
    scoreWeight -= 30;
  } else {
    potentialIssues.push({
      fr: `Montant demandé (${amount.toLocaleString('fr-FR')} DT) dépasse le plafond autorisé de ${program.maxAmount.toLocaleString('fr-FR')} DT pour ce mécanisme.`,
      ar: `المبلغ المطلوب (${amount.toLocaleString('fr-FR')} د) يتجاوز السقف الأقصى المسموح به (${program.maxAmount.toLocaleString('fr-FR')} د).`
    });
    scoreWeight -= 45;
  }

  // 2. Purpose Evaluation
  if (!applicant.purpose) {
    needsVerification.push({
      fr: `Objet de financement non précisé : vérifier l'éligibilité des dépenses prévues pour ce mécanisme (${program.purposes.join(', ')}).`,
      ar: `موضوع التمويل غير محدد : يرجى التأكد من أن نفقات المشروع مشمولة بهذا البرنامج (${program.purposes.join(', ')}).`
    });
  } else if (program.purposes.includes(applicant.purpose)) {
    matchedBecause.push({
      fr: `L'objet de financement sélectionné correspond directement aux dépenses éligibles du produit.`,
      ar: `موضوع التمويل المختار يندرج مباشرة ضمن النفقات القابلة للتمويل في هذا البرنامج.`
    });
    scoreWeight += 20;
  } else {
    potentialIssues.push({
      fr: `L'objet du financement n'est pas la cible principale de ce mécanisme.`,
      ar: `موضوع التمويل لا يعد الهدف الرئيسي لهذه الآلية التمويلية.`
    });
    scoreWeight -= 25;
  }

  // 3. Stage & Business Age
  if (!applicant.businessStage) {
    needsVerification.push({
      fr: `Stade d'avancement non précisé : ce programme cible en priorité (${program.eligibilityCriteria.stages.join(', ')}).`,
      ar: `مرحلة تقدم المشروع غير محددة : هذا البرنامج يستهدف أساساً (${program.eligibilityCriteria.stages.join(', ')}).`
    });
  } else if (program.eligibilityCriteria.stages.includes(applicant.businessStage)) {
    matchedBecause.push({
      fr: `Stade d'avancement du projet conforme aux critères d'admission.`,
      ar: `مرحلة تقدم المشروع متطابقة مع شروط القبول.`
    });
    scoreWeight += 15;
  } else {
    potentialIssues.push({
      fr: `Ce programme cible en priorité d'autres stades de maturité d'entreprise.`,
      ar: `هذا البرنامج يستهدف أساساً مراحل نمو أخرى للشركات.`
    });
    scoreWeight -= 20;
  }

  // 4. Sector
  if (!applicant.sector) {
    needsVerification.push({
      fr: `Secteur d'activité non précisé : vérifier que votre secteur figure parmi les secteurs admis auprès de cet organisme.`,
      ar: `قطاع النشاط غير محدد : يرجى التثبت من إدراج قطاع نشاطكم ضمن القطاعات المؤهلة لدى هذه المؤسسة.`
    });
  } else if (program.eligibilityCriteria.sectors.includes(applicant.sector)) {
    matchedBecause.push({
      fr: `Secteur d'activité admissible auprès de cet organisme.`,
      ar: `قطاع النشاط مؤهل ومدعوم لدى هذه المؤسسة.`
    });
    scoreWeight += 15;
  } else {
    potentialIssues.push({
      fr: `Secteur d'activité généralement exclu ou non prioritaire pour ce fonds.`,
      ar: `قطاع النشاط غير ذي أولوية أو مستثنى من تدخل هذا الصندوق.`
    });
    scoreWeight -= 30;
  }

  // 5. Apport personnel (Contribution %)
  // Strict rule: financingRequested ≠ totalProjectCost.
  if (!applicant.totalProjectCost || applicant.totalProjectCost <= 0) {
    if (program.minContributionPercent > 0) {
      needsVerification.push({
        fr: `Coût global du projet non précisé : ce mécanisme requiert au moins ${program.minContributionPercent}% d'apport personnel sur le budget total d'investissement.`,
        ar: `الكلفة الجملية للمشروع غير محددة : يشترط هذا البرنامج مساهمة ذاتية لا تقل عن ${program.minContributionPercent}% من الكلفة الإجمالية.`
      });
    }
  } else if (applicant.userContribution === undefined) {
    if (program.minContributionPercent > 0) {
      needsVerification.push({
        fr: `Apport personnel non renseigné : ce mécanisme requiert un apport propre d'au moins ${program.minContributionPercent}% du coût global de ${applicant.totalProjectCost.toLocaleString('fr-FR')} DT (soit au moins ${Math.round((applicant.totalProjectCost * program.minContributionPercent) / 100).toLocaleString('fr-FR')} DT).`,
        ar: `التمويل الذاتي غير مصرح به : يشترط هذا البرنامج مساهمة ذاتية لا تقل عن ${program.minContributionPercent}% من الكلفة الإجمالية البالغة ${applicant.totalProjectCost.toLocaleString('fr-FR')} د.`
      });
    }
  } else {
    const contributionRatio = (applicant.userContribution / applicant.totalProjectCost) * 100;
    if (contributionRatio >= program.minContributionPercent) {
      if (program.minContributionPercent > 0) {
        matchedBecause.push({
          fr: `Apport personnel déclaré (${contributionRatio.toFixed(1)}%) suffisant par rapport au minimum requis (${program.minContributionPercent}%).`,
          ar: `التمويل الذاتي المصرح به (${contributionRatio.toFixed(1)}%) كافٍ مقارنة بالحد الأدنى المطلوب (${program.minContributionPercent}%).`
        });
        scoreWeight += 15;
      }
    } else {
      potentialIssues.push({
        fr: `Apport personnel (${contributionRatio.toFixed(1)}%) inférieur au seuil réglementaire requis (${program.minContributionPercent}%). Un complément d'autofinancement sera exigé.`,
        ar: `التمويل الذاتي (${contributionRatio.toFixed(1)}%) أقل من النسبة القانونية المطلوبة (${program.minContributionPercent}%). سيتطلب الملف استكمال التمويل الذاتي.`
      });
      scoreWeight -= 25;
    }
  }

  // 6. Forme juridique (Legal Structure)
  if (!applicant.legalStructure) {
    needsVerification.push({
      fr: `Forme juridique non précisée : ce mécanisme s'adresse aux structures (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`,
      ar: `الشكل القانوني غير محدد : يتطلب هذا البرنامج أشكالاً قانونية محددة (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`
    });
  } else if (applicant.legalStructure === 'not_yet_created') {
    if (program.eligibilityCriteria.allowedLegalForms.includes('not_yet_created') || applicant.businessStage === 'idea_project') {
      needsVerification.push({
        fr: `Entreprise en cours de constitution : choisir une forme juridique éligible (${program.eligibilityCriteria.allowedLegalForms.filter(f => f !== 'not_yet_created').map(f => f.toUpperCase()).join(', ')}) avant le déblocage.`,
        ar: `المؤسسة في طور التأسيس : يتعين اختيار شكل قانوني مؤهل (${program.eligibilityCriteria.allowedLegalForms.filter(f => f !== 'not_yet_created').map(f => f.toUpperCase()).join(', ')}) قبل صرف التمويل.`
      });
    } else {
      potentialIssues.push({
        fr: `Structure juridique formalisée requise : ce mécanisme s'adresse aux entreprises déjà immatriculées au RNE (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`,
        ar: `يشترط وجود هيكل قانوني مسجل : هذه الآلية مخصصة للمؤسسات المسجلة بالسجل الوطني للمؤسسات (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`
      });
      scoreWeight -= 20;
    }
  } else if (program.eligibilityCriteria.allowedLegalForms.includes(applicant.legalStructure)) {
    matchedBecause.push({
      fr: `Forme juridique (${applicant.legalStructure.toUpperCase()}) admise par ce dispositif.`,
      ar: `الصيغة القانونية (${applicant.legalStructure.toUpperCase()}) مقبولة ومؤهلة لدى هذه الآلية.`
    });
    scoreWeight += 10;
  } else {
    potentialIssues.push({
      fr: `Forme juridique (${applicant.legalStructure.toUpperCase()}) non admise : les formes requises sont (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`,
      ar: `الصيغة القانونية (${applicant.legalStructure.toUpperCase()}) غير مؤهلة : الأشكال المقبولة هي (${program.eligibilityCriteria.allowedLegalForms.map(f => f.toUpperCase()).join(', ')}).`
    });
    scoreWeight -= 25;
  }

  // 7. Âge du promoteur (Applicant Age)
  if (program.eligibilityCriteria.maxAge) {
    if (applicant.applicantAge && applicant.applicantAge > 0) {
      if (applicant.applicantAge <= program.eligibilityCriteria.maxAge) {
        matchedBecause.push({
          fr: `Critère d'âge respecté (${applicant.applicantAge} ans <= ${program.eligibilityCriteria.maxAge} ans).`,
          ar: `شرط السن متوفر (${applicant.applicantAge} سنة <= ${program.eligibilityCriteria.maxAge} سنة).`
        });
        scoreWeight += 10;
      } else {
        potentialIssues.push({
          fr: `Âge du porteur (${applicant.applicantAge} ans) supérieur au plafond fixé à ${program.eligibilityCriteria.maxAge} ans pour ce dispositif.`,
          ar: `سن الباعث (${applicant.applicantAge} سنة) يتجاوز السقف المحدد بـ ${program.eligibilityCriteria.maxAge} سنة لهذه الآلية.`
        });
        scoreWeight -= 30;
      }
    } else {
      needsVerification.push({
        fr: `Critère d'âge à confirmer : plafond fixé à < ${program.eligibilityCriteria.maxAge} ans pour les bénéficiaires de ce programme.`,
        ar: `شرط السن للتأكيد : السقف الأقصى محدد بـ ${program.eligibilityCriteria.maxAge} سنة للمنتفعين بهذا البرنامج.`
      });
    }
  }

  // 8. Regional Development Zone (ZDR) bonus (Data-driven: program.hasRegionalDevelopmentBonus)
  if (program.hasRegionalDevelopmentBonus) {
    if (applicant.location) {
      const isZdrLocation = applicant.isRegionalDevelopmentZone || REGIONAL_DEVELOPMENT_ZONES.includes(applicant.location);
      if (isZdrLocation) {
        matchedBecause.push({
          fr: `Implantation en Zone de Développement Régional (${applicant.location}): éligibilité aux avantages et taux de garantie ou primes majorés.`,
          ar: `الانتصاب بمنطقة تنمية جهوية (${applicant.location}): التمتع بحوافز استثمار ونسب ضمان تفاضلية معززة.`
        });
        scoreWeight += 15;
      }
    } else {
      needsVerification.push({
        fr: `Localisation régionale non précisée : à vérifier pour l'éligibilité aux bonifications et primes de développement régional (ZDR).`,
        ar: `الموقع الجغرافي غير محدد : للتأكد من أحقية التمتع بحوافز وتفاضليات التنمية الجهوية.`
      });
    }
  }

  // 9. Degree Requirement (e.g. BTS Diplômés)
  // CRITICAL: If degree is unknown (undefined), DO NOT DISQUALIFY! Flag as needsVerification!
  if (program.eligibilityCriteria.requiresDegree) {
    if (applicant.hasHigherEducationDegree === true) {
      matchedBecause.push({
        fr: `Diplôme d'enseignement supérieur validé : ouvre l'accès au plafond supérieur de 150 000 DT.`,
        ar: `شهادة تعليم عالٍ متوفرة : تتيح الانتفاع بالسقف الأقصى البالغ 150 ألف دينار.`
      });
      scoreWeight += 20;
    } else if (applicant.hasHigherEducationDegree === false) {
      potentialIssues.push({
        fr: `Ce volet spécifique exige impérativement un diplôme universitaire homologué.`,
        ar: `هذا المسار يشترط وجوباً شهادة جامعية معادلة.`
      });
      scoreWeight -= 40;
    } else {
      // Degree is unknown / not specified
      needsVerification.push({
        fr: `Diplôme d'enseignement supérieur requis : veuillez confirmer si vous êtes titulaire d'un diplôme universitaire.`,
        ar: `شهادة تعليم عالٍ مطلوبة : يرجى تأكيد ما إذا كنتم حاصلين على شهادة جامعية.`
      });
    }
  }

  // 10. Startup Act Label
  if (program.eligibilityCriteria.requiresStartupLabel) {
    if (applicant.hasStartupActLabel === true) {
      matchedBecause.push({
        fr: `Labellisation Startup Act confirmée : déblocage des bourses et avantages fiscaux.`,
        ar: `علامة مؤسسة ناشئة متوفرة : تفعيل المنحة الشهرية والامتيازات الجبائية.`
      });
      scoreWeight += 30;
    } else if (applicant.hasStartupActLabel === false) {
      potentialIssues.push({
        fr: `Nécessite l'obtention préalable du Label Startup Act auprès du collège de labellisation.`,
        ar: `يشترط نيل علامة مؤسسة ناشئة مسبقاً من لجنة إسناد العلامة.`
      });
      needsVerification.push({
        fr: `Vérifier l'éligibilité aux critères d'innovation et de scalabilité du Startup Act.`,
        ar: `التثبت من توفر معايير التجديد والقدرة على التوسع لمنظومة ستارت آب آكت.`
      });
      scoreWeight -= 30;
    } else {
      needsVerification.push({
        fr: `Labellisation Startup Act : nécessite l'obtention préalable du label officiel auprès du collège de labellisation.`,
        ar: `علامة مؤسسة ناشئة : يتطلب نيل العلامة مسبقاً من لجنة إسناد العلامة.`
      });
    }
  }

  // 11. Structure preference (Islamic Finance)
  if (applicant.structurePreference === 'islamic') {
    if (program.category === 'islamic_finance') {
      matchedBecause.push({
        fr: `Conforme à la préférence exprimée pour la finance islamique (contrat Mourabaha sans intérêts).`,
        ar: `مطابق لرغبة المتعامل في المعاملات المالية المتوافقة مع الشريعة الإسلامية (مرابحة دون ربا).`
      });
      scoreWeight += 20;
    } else {
      potentialIssues.push({
        fr: `Produit de financement bancaire conventionnel à taux d'intérêt standard.`,
        ar: `تمويل بنكي تقليدي موظف بنسبة فائدة قياسية.`
      });
    }
  }

  // 12. Collateral / Guarantees (Data-driven: program.accessibleWithoutHeavyCollateral)
  if (applicant.collateralPreference === 'none' || applicant.collateralPreference === 'limited') {
    if (program.accessibleWithoutHeavyCollateral || program.category === 'guarantee') {
      matchedBecause.push({
        fr: `Dispositif adapté aux porteurs de projet sans garanties réelles ou hypothèques lourdes.`,
        ar: `آلية مناسبة لأصحاب المشاريع الذين لا يملكون رهوناً عقارية أو ضمانات عينية ثقيلة.`
      });
      scoreWeight += 15;
    }
  }

  // 13. Verification items
  if (program.verification.unverifiedFields.length > 0) {
    needsVerification.push({
      fr: `Préciser auprès du chargé d'affaires : ${program.verification.unverifiedFields.join(', ')}.`,
      ar: `استيضاح هذه النقاط مع مسؤول الفرع : ${program.verification.unverifiedFields.join(', ')}.`
    });
  }

  needsVerification.push({
    fr: `Confirmation finale de l'admissibilité du dossier par le comité de crédit territorial.`,
    ar: `التأكد النهائي من قبول الملف من طرف لجنة التمويل الجهوية المختصة.`
  });

  // Calculate Cost
  const costEstimate = calculateFinancingCost(amount, program);

  // Overall Alignment Level with public official criteria
  let alignmentLevel: MatchReason['alignmentLevel'] = 'strong_alignment';
  if (potentialIssues.length >= 2 || scoreWeight < 85) {
    alignmentLevel = 'partial_alignment';
  }
  if (potentialIssues.length >= 3 || scoreWeight < 65) {
    alignmentLevel = 'potential_blockers';
  }

  // Neutral, transparent summary reflecting alignment with public criteria (Never "X% approval chance")
  const compatibilitySummary = {
    fr: alignmentLevel === 'strong_alignment'
      ? `Forte adéquation avec les critères publics de ${provider.acronym}.`
      : alignmentLevel === 'partial_alignment'
      ? `Adéquation partielle — points à vérifier avant soumission.`
      : `Critères potentiellement bloquants identifiés pour ce dispositif.`,
    ar: alignmentLevel === 'strong_alignment'
      ? `تطابق قوي مع المعايير العامة المنشورة لدى ${provider.acronym}.`
      : alignmentLevel === 'partial_alignment'
      ? `تطابق جزئي — نقاط تتطلب التثبت والاستيضاح.`
      : `وجود شروط قد تعيق القبول الفني لهذا البرنامج.`
  };

  return {
    program,
    provider,
    reasons: {
      matchedBecause,
      potentialIssues,
      needsVerification,
      alignmentLevel
    },
    costEstimate,
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

  // Sort by internal ranking aid scoreWeight descending
  results.sort((a, b) => b.scoreWeight - a.scoreWeight);

  return results;
}
