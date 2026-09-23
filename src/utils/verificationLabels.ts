import { Language } from '../types/financing';

export const FIELD_VERIFICATION_LABELS: Record<string, { fr: string; ar: string }> = {
  maxAmount: { fr: "Plafond d'intervention (Montant max)", ar: "سقف التمويل الأقصى" },
  minAmount: { fr: "Montant plancher", ar: "الحد الأدنى للتمويل" },
  minContributionPercent: { fr: "Apport personnel minimum", ar: "نسبة التمويل الذاتي الأدنى" },
  rate: { fr: "Taux d'intérêt / Formule", ar: "نسبة الفائدة / كلفة التمويل" },
  rateType: { fr: "Formule de taux réglementée", ar: "صيغة الفائدة القانونية" },
  durationMonths: { fr: "Durée d'amortissement", ar: "مدة السداد" },
  durationMonthsMax: { fr: "Durée maximale", ar: "أقصى مدة سداد" },
  gracePeriodMonths: { fr: "Période de différé (franchise)", ar: "فترة الإمهال" },
  gracePeriodMonthsMax: { fr: "Différé maximal", ar: "أقصى فترة إمهال" },
  guaranteeRequirements: { fr: "Garanties & Sûretés exigées", ar: "شروط الضمانات المطلوبة" },
  requiresDegree: { fr: "Exigence de diplôme supérieur", ar: "شرط الشهادة الجامعية" },
  requiresStartupLabel: { fr: "Label officiel Startup Act", ar: "علامة مؤسسة ناشئة الرسمية" },
  targetAudience: { fr: "Public cible admissible", ar: "الفئات المؤهلة" },
  purposes: { fr: "Dépenses & objets éligibles", ar: "نفقات الاستثمار المؤهلة" },
  eligibilityCriteria: { fr: "Critères d'accès & secteur", ar: "شروط الأهلية والقطاع" },
  exactMarginOverTMM: { fr: "Marge bancaire commerciale sur TMM", ar: "الهامش التجاري البنكي فوق TMM" },
  variableCommercialSpread: { fr: "Marge bancaire négociée", ar: "الهامش البنكي التفاوضي" },
  exactEffectiveRatePerProfile: { fr: "Taux effectif selon profil", ar: "النسبة الفعلية حسب التقييم" },
  processingFees: { fr: "Frais de dossier d'agence", ar: "مصاريف دراسة الملف" },
  exactProfitMarginRate: { fr: "Marge Mourabaha contractuelle", ar: "هامش المرابحة التعاقدي" },
  takafulInsuranceRate: { fr: "Coût de l'assurance Takaful", ar: "كلفة التأمين التكافلي" },
  partnerBankApproval: { fr: "Accord préalable de la banque partenaire", ar: "موافقة البنك الشريك المسبقة" },
  exactGuaranteeShare: { fr: "Quotité de garantie finale", ar: "نسبة الضمان النهائية" },
  regionalBonusRate: { fr: "Prime ZDR selon délégation exacte", ar: "منحة التنمية الجهوية الدقيقة" },
  collegeDecision: { fr: "Décision du Collège des Startups", ar: "قرار لجنة علامة المؤسسات الناشئة" },
  regionalQuota: { fr: "Quota budgétaire du bureau d'emploi", ar: "الحصة المالية لمكتب التشغيل" },
  applicationSteps: { fr: "Circuit & étapes d'instruction", ar: "مسار دراسة الملف" },
  requiredDocuments: { fr: "Checklist documentaire requise", ar: "قائمة الوثائق المطلوبة" },
  caveats: { fr: "Délais réels & contraintes de décaissement", ar: "الآجال الفعلية وضوابط الصرف" },
};

export function getFieldLabel(fieldKey: string, language: Language): string {
  return FIELD_VERIFICATION_LABELS[fieldKey]?.[language] || fieldKey;
}

export function formatFieldList(fields: string[], language: Language): string {
  if (!fields || fields.length === 0) return language === 'ar' ? 'لا يوجد' : 'Aucun';
  return fields.map(f => getFieldLabel(f, language)).join(' • ');
}
