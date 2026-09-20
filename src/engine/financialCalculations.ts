import { CostEstimate, FinancingProgram } from '../types/financing';

/**
 * Mizen Financial Calculation Module
 * 
 * Strict discipline:
 * - Distinguishes Total Project Cost, User Contribution, and Financing Requested.
 * - If rate or terms are variable/incomplete, explicitly returns canCalculateReliably: false.
 * - Clearly documents assumptions (e.g. Tunisian TMM benchmark at ~7.99% BCT, annuités constantes).
 */

export const CURRENT_TUNISIAN_TMM_PERCENT = 7.99; // BCT Taux Moyen Mensuel du Marché Monétaire (2026 Reference)

export function calculateFinancingCost(
  financingRequested: number,
  program: FinancingProgram,
  preferredDurationMonths?: number
): CostEstimate {
  // If amount requested is zero or negative
  if (financingRequested <= 0) {
    return {
      canCalculateReliably: false,
      calculationExplanation: {
        fr: 'Montant de financement non renseigné.',
        ar: 'المبلغ المطلوب للتمويل غير محدد.'
      },
      unreliableReason: {
        fr: 'Veuillez préciser le montant souhaité.',
        ar: 'يرجى تحديد المبلغ المطلوب.'
      }
    };
  }

  // Grant / Subsidy non-reimbursable
  if (program.category === 'grant_subsidy' && program.rateType === 'interest_free') {
    return {
      canCalculateReliably: true,
      monthlyPayment: 0,
      totalRepayment: 0,
      totalCostOfFinancing: 0,
      assumedRatePercent: 0,
      durationMonths: program.durationMonthsMin,
      gracePeriodMonths: 0,
      calculationExplanation: {
        fr: 'Subvention ou prime publique non remboursable sous réserve du respect du cahier des charges.',
        ar: 'منحة عمومية غير قابلة للاسترجاع بشرط الالتزام بكراس الشروط.'
      }
    };
  }

  // Pure Guarantee Mechanism (SOTUGAR) - Not a direct loan
  if (program.category === 'guarantee') {
    const commissionAnnual = program.estimatedRateAnnual || 0.75;
    const durationMonths = preferredDurationMonths || 60;
    const years = durationMonths / 12;
    const totalGuaranteeFee = Math.round(financingRequested * (commissionAnnual / 100) * years);

    return {
      canCalculateReliably: true,
      monthlyPayment: undefined, // Not a monthly loan installment
      totalRepayment: undefined,
      totalCostOfFinancing: totalGuaranteeFee,
      assumedRatePercent: commissionAnnual,
      durationMonths,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Commission de garantie publique estimée à ${commissionAnnual}% l'an sur ${years} ans (~${totalGuaranteeFee} DT au total), s'ajoutant aux conditions du prêt bancaire garanti.`,
        ar: `عمولة ضمان عمومي تقديرية بنسبة ${commissionAnnual}% سنوياً على ${years} سنوات (~${totalGuaranteeFee} د إجمالاً)، تضاف لشروط القرض البنكي المضمون.`
      }
    };
  }

  // Variable rates with unverified exact bank margin
  if (program.rateType === 'variable_tmm' && program.verification.unverifiedFields.includes('exactMarginOverTMM')) {
    const assumedRate = (program.estimatedRateAnnual || (CURRENT_TUNISIAN_TMM_PERCENT + 2.5));
    const duration = preferredDurationMonths 
      ? Math.min(Math.max(preferredDurationMonths, program.durationMonthsMin), program.durationMonthsMax)
      : Math.round((program.durationMonthsMin + program.durationMonthsMax) / 2);

    // Provide indicative simulation with mandatory caveat
    const monthlyRate = assumedRate / 100 / 12;
    const n = duration;
    // Standard annuity formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = Math.round(
      (financingRequested * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1)
    );
    const totalRepayment = Math.round(monthlyPayment * n);
    const totalCostOfFinancing = totalRepayment - financingRequested;

    return {
      canCalculateReliably: false,
      monthlyPayment,
      totalRepayment,
      totalCostOfFinancing,
      assumedRatePercent: assumedRate,
      durationMonths: duration,
      gracePeriodMonths: program.gracePeriodMonthsMin,
      calculationExplanation: {
        fr: `Simulation purement indicative: mensualité d'environ ${monthlyPayment.toLocaleString('fr-FR')} DT/mois sur ${duration} mois. Basée sur l'hypothèse d'un TMM de ${CURRENT_TUNISIAN_TMM_PERCENT}% + marge estimée de ${(assumedRate - CURRENT_TUNISIAN_TMM_PERCENT).toFixed(2)}%.`,
        ar: `محاكاة تقديرية استئناسية: قسط شهري يقارب ${monthlyPayment.toLocaleString('fr-FR')} د على ${duration} شهراً. مبنية على فرضية TMM بنسبة ${CURRENT_TUNISIAN_TMM_PERCENT}% + هامش مقدر بـ ${(assumedRate - CURRENT_TUNISIAN_TMM_PERCENT).toFixed(2)}%.`
      },
      unreliableReason: {
        fr: 'Taux indexé sur le TMM de la Banque Centrale de Tunisie: la marge exacte et les frais de dossier dépendent de la décision finale du comité de crédit.',
        ar: 'النسبة متغيرة ومرتبطة بـ TMM البنك المركزي التونسي: الهامش النهائي يحدده البنك بعد دراسة الملف.'
      }
    };
  }

  // Known subsidized or fixed rate (e.g. BTS, Mourabaha, FONAPRAM)
  const rateAnnual = program.estimatedRateAnnual ?? 7.0;
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
    monthlyPayment,
    totalRepayment,
    totalCostOfFinancing,
    assumedRatePercent: rateAnnual,
    durationMonths: duration,
    gracePeriodMonths: program.gracePeriodMonthsMin,
    calculationExplanation: {
      fr: `Mensualité estimée de ${monthlyPayment.toLocaleString('fr-FR')} DT/mois sur ${duration} mois (taux annuel conventionné de ${rateAnnual}%, hors différé d'amortissement éventuel de ${program.gracePeriodMonthsMin} mois).`,
      ar: `قسط شهري تقديري بقيمة ${monthlyPayment.toLocaleString('fr-FR')} د/شهرياً على ${duration} شهراً (نسبة سنوية ${rateAnnual}%، دون احتساب فترة إمهال تصل إلى ${program.gracePeriodMonthsMin} شهراً).`
    }
  };
}
