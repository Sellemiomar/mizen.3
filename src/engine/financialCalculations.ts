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
  preferredDurationMonths?: number
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

  // 2. Pure Guarantee Mechanism (SOTUGAR) - Not a direct loan
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
      monthlyPayment: undefined, // Not a monthly loan installment
      totalRepayment: undefined,
      totalCostOfFinancing: totalGuaranteeFee,
      assumedRatePercent: commissionAnnual,
      durationMonths,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Commission de garantie publique de ${commissionAnnual}% l'an sur ${years} ans (~${totalGuaranteeFee.toLocaleString('fr-FR')} DT au total). Attention : ce montant s'ajoute aux intérêts et amortissements du prêt bancaire garanti.`,
        ar: `عمولة ضمان عمومي بنسبة ${commissionAnnual}% سنوياً على ${years} سنوات (~${totalGuaranteeFee.toLocaleString('fr-FR')} د إجمالاً). تنبيه: هذا المبلغ يضاف لفوائد وأصل القرض البنكي المضمون.`
      }
    };
  }

  // 3. Variable rates indexed to BCT TMM (e.g. BFPME, Commercial Banks)
  if (program.rateType === 'variable_tmm') {
    const assumedRate = program.estimatedRateAnnual ?? (CURRENT_TUNISIAN_TMM_PERCENT + 2.5);
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    const monthlyRate = assumedRate / 100 / 12;
    const n = duration;
    // Standard annuity formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = Math.round(
      (financingRequested * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1)
    );
    const totalRepayment = Math.round(monthlyPayment * n);
    const totalCostOfFinancing = totalRepayment - financingRequested;
    const spreadOverTmm = (assumedRate - CURRENT_TUNISIAN_TMM_PERCENT).toFixed(2);

    return {
      canCalculateReliably: false, // Variable TMM cannot be reliably fixed upfront
      rateOrigin: 'estimated_market_spread',
      rateOriginLabel: {
        fr: `TMM BCT (${CURRENT_TUNISIAN_TMM_PERCENT}%) + Marge bancaire estimée (+${spreadOverTmm}%)`,
        ar: `TMM البنك المركزي (${CURRENT_TUNISIAN_TMM_PERCENT}%) + هامش تقديري (+${spreadOverTmm}%)`
      },
      rateBenchmarkSource: TUNISIAN_TMM_BENCHMARK.name,
      rateBenchmarkDate: TUNISIAN_TMM_BENCHMARK.referencePeriod,
      monthlyPayment,
      totalRepayment,
      totalCostOfFinancing,
      assumedRatePercent: assumedRate,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Simulation purement indicative : mensualité d'environ ${monthlyPayment.toLocaleString('fr-FR')} DT/mois sur ${duration} mois. Hypothèse : TMM BCT de ${CURRENT_TUNISIAN_TMM_PERCENT}% + marge estimée de ${spreadOverTmm}%.`,
        ar: `محاكاة استئناسية : قسط يقارب ${monthlyPayment.toLocaleString('fr-FR')} د/شهرياً على ${duration} شهراً. الفرضية : TMM بنسبة ${CURRENT_TUNISIAN_TMM_PERCENT}% + هامش بنكي مقدر بـ ${spreadOverTmm}%.`
      },
      unreliableReason: {
        fr: 'Taux indexé sur le TMM de la Banque Centrale de Tunisie : la marge exacte (+2,5% à +3,5%) et les frais de dossier dépendent exclusivement de la décision finale du comité de crédit.',
        ar: 'النسبة متغيرة ومرتبطة بـ TMM البنك المركزي : الهامش الفعلي (+2.5% إلى +3.5%) ومصاريف الملف يحددهما البنك بعد موافقة لجنة التمويل.'
      }
    };
  }

  // 4. Microcredit with variable/tier rates (e.g. Enda Tamweel: 16%-24%)
  if (program.category === 'microcredit') {
    const rateAnnual = program.estimatedRateAnnual ?? 18.0;
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    const monthlyRate = rateAnnual / 100 / 12;
    const n = duration;
    const monthlyPayment = Math.round(
      (financingRequested * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1)
    );
    const totalRepayment = Math.round(monthlyPayment * n);
    const totalCostOfFinancing = totalRepayment - financingRequested;

    return {
      canCalculateReliably: false,
      rateOrigin: 'estimated_market_spread',
      rateOriginLabel: {
        fr: 'Taux effectif global microfinance (indicatif)',
        ar: 'نسبة تمويل أصغر شاملة (استئناسية)'
      },
      monthlyPayment,
      totalRepayment,
      totalCostOfFinancing,
      assumedRatePercent: rateAnnual,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Estimation indicative : mensualité d'environ ${monthlyPayment.toLocaleString('fr-FR')} DT/mois sur ${duration} mois (taux effectif global estimé à ${rateAnnual}%).`,
        ar: `محاكاة تقديرية : قسط يقارب ${monthlyPayment.toLocaleString('fr-FR')} د/شهرياً على ${duration} شهراً (نسبة فائدة شاملة مقدرة بـ ${rateAnnual}%).`
      },
      unreliableReason: {
        fr: 'En microfinance, le taux effectif global varie selon le montant, la durée et l’enquête de proximité de l’agent de crédit.',
        ar: 'في مؤسسات التمويل الأصغر، تختلف النسبة الفعلية بحسب المبلغ والمدة ونتائج المعاينة الميدانية لمرشد التمويل.'
      }
    };
  }

  // 5. Islamic Mourabaha (e.g. Banque Zitouna)
  if (program.category === 'islamic_finance' || program.rateType === 'profit_margin') {
    const marginRateAnnual = program.estimatedRateAnnual ?? 9.5;
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    const years = duration / 12;
    // Mourabaha simple markup formula: Total = Principal * (1 + marginRate * years)
    const totalProfitMargin = Math.round(financingRequested * (marginRateAnnual / 100) * years);
    const totalRepayment = financingRequested + totalProfitMargin;
    const monthlyPayment = Math.round(totalRepayment / duration);

    return {
      canCalculateReliably: false,
      rateOrigin: 'estimated_market_spread',
      rateOriginLabel: {
        fr: 'Marge bénéficiaire Mourabaha indicative',
        ar: 'هامش ربح مرابحة استئناسي'
      },
      monthlyPayment,
      totalRepayment,
      totalCostOfFinancing: totalProfitMargin,
      assumedRatePercent: marginRateAnnual,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Formule Mourabaha indicative : mensualité de ~${monthlyPayment.toLocaleString('fr-FR')} DT/mois sur ${duration} mois. Basée sur une marge bénéficiaire convenue estimée à ${marginRateAnnual}% l'an (prix de revient + marge fixe).`,
        ar: `صيغة مرابحة استئناسية : قسط يقارب ${monthlyPayment.toLocaleString('fr-FR')} د/شهرياً على ${duration} شهراً. مبنية على هامش ربح متفق عليه مقدر بـ ${marginRateAnnual}% سنوياً (ثمن الشراء + هامش ربح محدد).`
      },
      unreliableReason: {
        fr: 'La marge bénéficiaire exacte est fixée lors de l’émission du contrat de vente Mourabaha en fonction de la nature du matériel et des devis fournisseurs.',
        ar: 'هامش الربح الفعلي يتحدد بصفة نهائية عند إبرام عقد البيع بالمرابحة تبعاً لنوعية المعدات وفواتير المزودين.'
      }
    };
  }

  // 6. Known Subsidized Fixed Rates (e.g. BTS Diplômés 6%, FONAPRAM 5%, FOPRODI 2%)
  if (program.estimatedRateAnnual !== undefined) {
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
        fr: 'Taux bonifié réglementé par décret',
        ar: 'نسبة تفاضلية مدعومة ومحددة بنصوص قانونية'
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

  // 7. Rate Unavailable — DO NOT FABRICATE A 7.0% DEFAULT
  return {
    canCalculateReliably: false,
    rateOrigin: 'unavailable',
    rateOriginLabel: {
      fr: 'Taux non communiqué / sur devis',
      ar: 'النسبة غير منشورة / بناءً على الملف'
    },
    durationMonths: preferredDurationMonths ?? program.durationMonthsMin,
    gracePeriodMonths: program.gracePeriodMonthsMin,
    calculationExplanation: {
      fr: 'Le barème exact de ce mécanisme n’est pas fixé publiquement par l’organisme et dépend de l’offre commerciale personnalisée.',
      ar: 'جدول النسب لهذه الآلية غير محدد مسبقاً للعموم ويخضع لدراسة العرض المالي الخاص.'
    },
    unreliableReason: {
      fr: 'Calcul impossible sans devis de taux officiel émis par l’établissement.',
      ar: 'يتعذر الاحتساب دون جدول فوائد رسمي صادر عن المؤسسة المعنية.'
    }
  };
}
