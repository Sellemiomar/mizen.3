import { CostEstimate, FinancingProgram, RateOrigin } from '../types/financing';

/**
 * Mizen Financial Calculation Module
 * 
 * Strict discipline:
 * - Distinguishes Total Project Cost, User Contribution, and Financing Requested.
 * - Distinguishes Rate Origins:
 *     * official_current_benchmark (e.g. BCT TMM benchmark)
 *     * subsidized_fixed_decree (e.g. BTS subsidized rate by decree)
 *     * user_provided (user entered rate)
 *     * estimated_market_spread (e.g. TMM + estimated bank margin)
 *     * interest_free_grant (0% for public subsidies)
 *     * unavailable (rate cannot be determined without bank quotation)
 * - If rate or terms are variable, negotiable, or unverified: explicitly returns canCalculateReliably: false.
 * - NEVER fabricates missing interest rates or silent 7% defaults.
 * - Clearly documents assumptions (annuités constantes, différé d'amortissement).
 */

export const TUNISIAN_TMM_BENCHMARK = {
  rate: 7.99,
  name: 'Taux Moyen Mensuel du Marché Monétaire (TMM)',
  institution: 'Banque Centrale de Tunisie (BCT)',
  referencePeriod: '2024-2026 (Référence active BCT)',
  sourceUrl: 'https://www.bct.gov.tn'
};

export const CURRENT_TUNISIAN_TMM_PERCENT = TUNISIAN_TMM_BENCHMARK.rate;

export function calculateFinancingCost(
  financingRequested: number,
  program: FinancingProgram,
  preferredDurationMonths?: number,
  userProvidedRate?: number
): CostEstimate {
  // If amount requested is zero or negative
  if (financingRequested <= 0) {
    return {
      canCalculateReliably: false,
      rateOrigin: 'unavailable',
      rateOriginLabel: {
        fr: 'Montant non renseigné',
        ar: 'المبلغ غير محدد'
      },
      calculationExplanation: {
        fr: 'Montant de financement non renseigné.',
        ar: 'المبلغ المطلوب للتمويل غير محدد.'
      },
      unreliableReason: {
        fr: 'Veuillez préciser le montant souhaité pour simuler l’échéancier.',
        ar: 'يرجى تحديد المبلغ المطلوب لاحتساب جدول السداد.'
      }
    };
  }

  // If user provided a verified quote/rate they received
  if (userProvidedRate !== undefined && userProvidedRate > 0) {
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    const monthlyRate = userProvidedRate / 100 / 12;
    const n = duration;
    const monthlyPayment = Math.round(
      (financingRequested * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1)
    );
    const totalRepayment = Math.round(monthlyPayment * n);
    const totalCostOfFinancing = totalRepayment - financingRequested;

    return {
      canCalculateReliably: true,
      rateOrigin: 'user_provided',
      rateOriginLabel: {
        fr: `Taux personnalisé renseigné par l'utilisateur (${userProvidedRate}%)`,
        ar: `نسبة خاصة مصرح بها من المستخدم (${userProvidedRate}%)`
      },
      monthlyPayment,
      totalRepayment,
      totalCostOfFinancing,
      assumedRatePercent: userProvidedRate,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Simulation basée sur le taux fourni par l'utilisateur (${userProvidedRate}% l'an) sur ${duration} mois.`,
        ar: `محاكاة مبنية على النسبة المصرح بها من المستخدم (${userProvidedRate}% سنوياً) على ${duration} شهراً.`
      }
    };
  }

  // 1. Grant / Subsidy non-reimbursable (e.g. ANETI Chèque Entreprise, Startup Act)
  if (program.category === 'grant_subsidy' && program.rateType === 'interest_free') {
    return {
      canCalculateReliably: true,
      rateOrigin: 'interest_free_grant',
      rateOriginLabel: {
        fr: 'Subvention publique (0% intérêt)',
        ar: 'منحة عمومية (0% فائدة)'
      },
      monthlyPayment: 0,
      totalRepayment: 0,
      totalCostOfFinancing: 0,
      assumedRatePercent: 0,
      durationMonths: program.durationMonthsMin,
      gracePeriodMonths: 0,
      calculationExplanation: {
        fr: 'Subvention ou prime publique non remboursable sous réserve du respect des obligations conventionnelles.',
        ar: 'منحة عمومية غير قابلة للاسترجاع بشرط الالتزام بكراس الشروط والالتزامات التعاقدية.'
      }
    };
  }

  // 2. Pure Guarantee Mechanism (SOTUGAR) - Commission réglementée
  if (program.category === 'guarantee') {
    const commissionAnnual = program.estimatedRateAnnual ?? 0.75;
    const durationMonths = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : 60;
    const years = durationMonths / 12;
    const totalGuaranteeFee = Math.round(financingRequested * (commissionAnnual / 100) * years);

    return {
      canCalculateReliably: true,
      rateOrigin: 'official_current_benchmark',
      rateOriginLabel: {
        fr: 'Commission de garantie SOTUGAR réglementée',
        ar: 'عمولة ضمان عمومي سوتوغار محددة قانوناً'
      },
      rateBenchmarkSource: 'SOTUGAR / Ministère des Finances',
      rateBenchmarkDate: 'Barème réglementaire officiel 2026',
      monthlyPayment: undefined, // Not a monthly installment loan
      totalRepayment: undefined,
      totalCostOfFinancing: totalGuaranteeFee,
      assumedRatePercent: commissionAnnual,
      durationMonths,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Commission de garantie publique légale de ${commissionAnnual}% l'an sur ${years} ans (~${totalGuaranteeFee.toLocaleString('fr-FR')} DT au total). Attention : cette commission s'ajoute aux intérêts et amortissements du prêt bancaire garanti.`,
        ar: `عمولة ضمان عمومي بنسبة ${commissionAnnual}% سنوياً على ${years} سنوات (~${totalGuaranteeFee.toLocaleString('fr-FR')} د إجمالاً). تنبيه: هذا المبلغ يضاف لفوائد وأصل القرض البنكي المضمون.`
      }
    };
  }

  // 3. Variable rates indexed to BCT TMM (e.g. BFPME, Commercial Banks)
  // Shows sensitivity range (TMM + 2.5% to TMM + 3.5%) rather than a single fake-precise number
  if (program.rateType === 'variable_tmm') {
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    const minSpread = 2.5;
    const maxSpread = 3.5;
    const lowRate = CURRENT_TUNISIAN_TMM_PERCENT + minSpread;  // ~10.49%
    const highRate = CURRENT_TUNISIAN_TMM_PERCENT + maxSpread; // ~11.49%

    const monthlyRateLow = lowRate / 100 / 12;
    const monthlyRateHigh = highRate / 100 / 12;
    const n = duration;

    const monthlyLow = Math.round(
      (financingRequested * monthlyRateLow * Math.pow(1 + monthlyRateLow, n)) /
      (Math.pow(1 + monthlyRateLow, n) - 1)
    );
    const monthlyHigh = Math.round(
      (financingRequested * monthlyRateHigh * Math.pow(1 + monthlyRateHigh, n)) /
      (Math.pow(1 + monthlyRateHigh, n) - 1)
    );

    return {
      canCalculateReliably: false, // Variable TMM cannot be reliably fixed upfront as a quote
      rateOrigin: 'estimated_market_spread',
      rateOriginLabel: {
        fr: `Formule TMM BCT (${CURRENT_TUNISIAN_TMM_PERCENT}%) + Marge (${minSpread}% à ${maxSpread}%)`,
        ar: `صيغة TMM البنك المركزي (${CURRENT_TUNISIAN_TMM_PERCENT}%) + هامش (${minSpread}% إلى ${maxSpread}%)`
      },
      rateBenchmarkSource: TUNISIAN_TMM_BENCHMARK.name,
      rateBenchmarkDate: `${TUNISIAN_TMM_BENCHMARK.referencePeriod} (TMM BCT actif : ${CURRENT_TUNISIAN_TMM_PERCENT}%)`,
      monthlyPayment: undefined, // No single fake-precise quote
      totalRepayment: undefined,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Simulation indicative de Mizen — ce n'est pas un taux ni une offre du financeur. Fourchette de sensibilité indicative : environ ${monthlyLow.toLocaleString('fr-FR')} DT à ${monthlyHigh.toLocaleString('fr-FR')} DT/mois sur ${duration} mois. Formule réglementaire : TMM (${CURRENT_TUNISIAN_TMM_PERCENT}%) + marge bancaire négociée (+${minSpread}% à +${maxSpread}%).`,
        ar: `محاكاة استئناسية من ميزان — لا تعتبر نسبة معتمدة أو عرضاً من الممول. نطاق تقديري استئناسي : بين ${monthlyLow.toLocaleString('fr-FR')} د و ${monthlyHigh.toLocaleString('fr-FR')} د شهرياً على ${duration} شهراً. الصيغة القانونية : TMM (${CURRENT_TUNISIAN_TMM_PERCENT}%) + هامش بنكي (+${minSpread}% إلى +${maxSpread}%).`
      },
      unreliableReason: {
        fr: 'Taux indexé sur le TMM de la Banque Centrale de Tunisie : la marge exacte et les frais de dossier dépendent exclusivement de la décision finale du comité de crédit.',
        ar: 'النسبة متغيرة ومرتبطة بـ TMM البنك المركزي : الهامش الفعلي ومصاريف الملف يحددهما البنك بعد موافقة لجنة التمويل.'
      }
    };
  }

  // 4. Microcredit with variable/tier rates (e.g. Enda Tamweel: 16%-24%)
  // DO NOT use an arbitrary default such as 18% to create a seemingly precise repayment quote.
  if (program.category === 'microcredit') {
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    return {
      canCalculateReliably: false,
      rateOrigin: 'unavailable',
      rateOriginLabel: {
        fr: 'Fourchette microfinance variable (TEG ~16% à 24%)',
        ar: 'نطاق تمويل أصغر متغير (نسبة شاملة ~16% إلى 24%)'
      },
      monthlyPayment: undefined, // NO single fake-precise number
      totalRepayment: undefined,
      totalCostOfFinancing: undefined,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Barème variable selon l'agence : le taux effectif global en microfinance s'établit généralement entre 16% et 24% l'an selon le type d'équipement, la durée et l'évaluation de proximité. Aucun devis fixe ne peut être automatisé sans étude locale.`,
        ar: `جدول متغير حسب الفرع : يتراوح المعدل الفعلي الشامل في مؤسسات التمويل الأصغر عادة بين 16% و24% سنوياً حسب نوع المعدات والمدة ونتائج المعاينة الميدانية. لا يمكن استخراج قسط محدد دون دراسة ميدانية.`
      },
      unreliableReason: {
        fr: 'Taux non disponible — simulation de remboursement impossible avec les informations vérifiées (devis d’agence requis).',
        ar: 'النسبة غير متوفرة — يتعذر إجراء محاكاة سداد دقيقة بالمعلومات الموثقة (يتطلب عرضاً رسمياً من الفرع).'
      }
    };
  }

  // 5. Islamic Mourabaha (e.g. Banque Zitouna)
  // DO NOT use an invented/default margin such as 9.5% to calculate a precise repayment.
  if (program.category === 'islamic_finance' || program.rateType === 'profit_margin') {
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    return {
      canCalculateReliably: false,
      rateOrigin: 'unavailable',
      rateOriginLabel: {
        fr: 'Marge Mourabaha contractuelle à confirmer',
        ar: 'هامش ربح مرابحة تعاقدي خاضع للتأكيد'
      },
      monthlyPayment: undefined, // NO single fake-precise quote
      totalRepayment: undefined,
      totalCostOfFinancing: undefined,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: 'Marge/prix final à confirmer auprès du financeur. Marge bénéficiaire fixée par contrat Mourabaha — à confirmer auprès de la banque. En finance islamique, le prix de revente et l\'échéancier dépendent des factures pro-forma agréées par le comité de conformité.',
        ar: 'هامش الربح والسعر النهائي رهن التأكيد من الممول. هامش ربح محدد بموجب عقد المرابحة — رهن التأكيد من البنك. في الصيرفة الإسلامية، يتحدد ثمن البيع وجدول الأقساط بناءً على فواتير المزود المعتمدة من هيئة الرقابة الشرعية.'
      },
      unreliableReason: {
        fr: 'Marge/prix final à confirmer auprès du financeur — simulation de remboursement chiffrée impossible sans offre formelle de la banque.',
        ar: 'هامش الربح والسعر النهائي رهن التأكيد من الممول — يتعذر احتساب قسط محدد دون عرض تمويل رسمي من المصرف.'
      }
    };
  }

  // 6. Known Subsidized Fixed Rates (e.g. BTS Diplômés 6%, FONAPRAM 5%, FOPRODI 2%)
  // Only executed if program has an official, decree-backed subsidized fixed rate!
  if (program.estimatedRateAnnual !== undefined && program.rateType === 'subsidized') {
    const rateAnnual = program.estimatedRateAnnual;
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    const monthlyRate = rateAnnual / 100 / 12;
    const n = duration;
    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      monthlyPayment = Math.round(financingRequested / n);
    } else {
      monthlyPayment = Math.round(
        (financingRequested * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1)
      );
    }

    const totalRepayment = Math.round(monthlyPayment * n);
    const totalCostOfFinancing = totalRepayment - financingRequested;

    return {
      canCalculateReliably: true,
      rateOrigin: 'subsidized_fixed_decree',
      rateOriginLabel: {
        fr: `Taux bonifié réglementé par convention (${rateAnnual}%)`,
        ar: `نسبة تفاضلية مدعومة ومحددة بنصوص قانونية (${rateAnnual}%)`
      },
      rateBenchmarkSource: 'Textes d’application & circulaires bancaires',
      monthlyPayment,
      totalRepayment,
      totalCostOfFinancing,
      assumedRatePercent: rateAnnual,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Mensualité calculée de ${monthlyPayment.toLocaleString('fr-FR')} DT/mois sur ${duration} mois (taux annuel conventionné de ${rateAnnual}%, hors différé d'amortissement de ${program.gracePeriodMonthsMin} mois).`,
        ar: `قسط شهري محسوب بقيمة ${monthlyPayment.toLocaleString('fr-FR')} د/شهرياً على ${duration} شهراً (نسبة سنوية ${rateAnnual}%، دون احتساب فترة إمهال قدرها ${program.gracePeriodMonthsMin} شهراً).`
      }
    };
  }

  // 7. Rate Truly Unavailable — DO NOT FABRICATE A DEFAULT
  return {
    canCalculateReliably: false,
    rateOrigin: 'unavailable',
    rateOriginLabel: {
      fr: 'Taux non disponible',
      ar: 'النسبة غير متوفرة'
    },
    durationMonths: preferredDurationMonths ?? program.durationMonthsMin,
    gracePeriodMonths: program.gracePeriodMonthsMin,
    calculationExplanation: {
      fr: 'Taux non disponible — simulation de remboursement impossible avec les informations vérifiées.',
      ar: 'النسبة غير متوفرة — يتعذر إجراء محاكاة سداد بالمعلومات الموثقة.'
    },
    unreliableReason: {
      fr: 'Taux non disponible — simulation de remboursement impossible avec les informations vérifiées. Un devis officiel émis par l’établissement est requis.',
      ar: 'النسبة غير متوفرة — يتعذر إجراء محاكاة سداد بالمعلومات الموثقة. يتطلب الأمر جدولاً رسمياً صادراً عن المؤسسة المعنية.'
    }
  };
}
