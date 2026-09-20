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
  const amount = applicant.financingRequested > 0 
    ? applicant.financingRequested 
    : (applicant.totalProjectCost - applicant.userContribution);

  if (amount >= program.minAmount && amount <= program.maxAmount) {
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
  if (program.purposes.includes(applicant.purpose)) {
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
  if (program.eligibilityCriteria.stages.includes(applicant.businessStage)) {
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
  if (program.eligibilityCriteria.sectors.includes(applicant.sector)) {
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
  const totalCost = applicant.totalProjectCost > 0 ? applicant.totalProjectCost : (amount + applicant.userContribution);
  const contributionRatio = totalCost > 0 ? (applicant.userContribution / totalCost) * 100 : 0;

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

  // 6. Regional Development Zone (ZDR) bonus
  const isZdrLocation = applicant.isRegionalDevelopmentZone || REGIONAL_DEVELOPMENT_ZONES.includes(applicant.location);
  if (isZdrLocation) {
    if (program.id === 'foprodi_dotation' || program.id === 'sotugar_guarantee' || program.id === 'bfpme_creation') {
      matchedBecause.push({
        fr: `Implantation en Zone de Développement Régional (${applicant.location}): éligibilité aux avantages et taux de garantie majorés.`,
        ar: `الانتصاب بمنطقة تنمية جهوية (${applicant.location}): التمتع بحوافز استثمار ونسب ضمان تفاضلية معززة.`
      });
      scoreWeight += 15;
    }
  }

  // 7. Degree Requirement (e.g. BTS Diplômés)
  if (program.eligibilityCriteria.requiresDegree) {
    if (applicant.hasHigherEducationDegree) {
      matchedBecause.push({
        fr: `Diplôme d'enseignement supérieur validé: ouvre l'accès au plafond supérieur de 150 000 DT.`,
        ar: `شهادة تعليم عالٍ متوفرة: تتيح الانتفاع بالسقف الأقصى البالغ 150 ألف دينار.`
      });
      scoreWeight += 20;
    } else {
      potentialIssues.push({
        fr: `Ce volet spécifique exige impérativement un diplôme universitaire homologué.`,
        ar: `هذا المسار يشترط وجوباً شهادة جامعية معادلة.`
      });
      scoreWeight -= 40;
    }
  }

  // 8. Startup Act Label
  if (program.eligibilityCriteria.requiresStartupLabel) {
    if (applicant.hasStartupActLabel) {
      matchedBecause.push({
        fr: `Labellisation Startup Act confirmée: déblocage des bourses et avantages fiscaux.`,
        ar: `علامة مؤسسة ناشئة متوفرة: تفعيل المنحة الشهرية والامتيازات الجبائية.`
      });
      scoreWeight += 30;
    } else {
      potentialIssues.push({
        fr: `Nécessite l'obtention préalable du Label Startup Act auprès du collège de labellisation.`,
        ar: `يشترط نيل علامة مؤسسة ناشئة مسبقاً من لجنة إسناد العلامة.`
      });
      needsVerification.push({
        fr: `Vérifier l'éligibilité aux critères d'innovation et de scalabilité du Startup Act.`,
        ar: `التثبت من توفر معايير التجديد والقدرة على التوسع لمنظومة ستارت آب آكت.`
      });
      scoreWeight -= 30;
    }
  }

  // 9. Structure preference (Islamic Finance)
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

  // 10. Collateral / Guarantees
  if (applicant.collateralPreference === 'none' || applicant.collateralPreference === 'limited') {
    if (program.category === 'guarantee' || program.id === 'bts_diplomes' || program.id === 'enda_microcredit_equip') {
      matchedBecause.push({
        fr: `Dispositif adapté aux porteurs de projet sans garanties réelles ou hypothèques lourdes.`,
        ar: `آلية مناسبة لأصحاب المشاريع الذين لا يملكون رهوناً عقارية أو ضمانات عينية ثقيلة.`
      });
      scoreWeight += 15;
    }
  }

  // 11. Verification items
  if (program.verification.unverifiedFields.length > 0) {
    needsVerification.push({
      fr: `Préciser auprès du chargé d'affaires: ${program.verification.unverifiedFields.join(', ')}.`,
      ar: `استيضاح هذه النقاط مع مسؤول الفرع: ${program.verification.unverifiedFields.join(', ')}.`
    });
  }

  needsVerification.push({
    fr: `Confirmation de l'acceptation du dossier par le comité de crédit territorial.`,
    ar: `التأكد من قبول الملف من طرف لجنة التمويل الجهوية المختصة.`
  });

  // Calculate Cost
  const costEstimate = calculateFinancingCost(amount, program);

  // Overall Compatibility Level
  let eligibilityLevel: MatchReason['eligibilityLevel'] = 'high';
  if (potentialIssues.length >= 2 || scoreWeight < 85) {
    eligibilityLevel = 'moderate';
  }
  if (potentialIssues.length >= 3 || scoreWeight < 65) {
    eligibilityLevel = 'potential_blockers';
  }

  // Neutral, transparent summary (Never "X% chance of approval")
  const compatibilitySummary = {
    fr: eligibilityLevel === 'high'
      ? `Forte adéquation technique avec les critères réglementaires de ${provider.acronym}.`
      : eligibilityLevel === 'moderate'
      ? `Opportunité envisageable sous réserve d'ajustements (garanties ou apport).`
      : `Éligibilité restreinte: des critères bloquants nécessitent une restructuration du projet.`,
    ar: eligibilityLevel === 'high'
      ? `تطابق فني قوي مع المعايير القانونية المعتمدة لدى ${provider.acronym}.`
      : eligibilityLevel === 'moderate'
      ? `فرصة ممكنة مع اشتراط تسوية بعض النقاط (الضمانات أو التمويل الذاتي).`
      : `أهلية محدودة: وجود شروط تستوجب تعديل هيكلة المشروع.`
  };

  return {
    program,
    provider,
    reasons: {
      matchedBecause,
      potentialIssues,
      needsVerification,
      eligibilityLevel
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
