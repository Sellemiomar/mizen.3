import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Calculator, 
  MapPin, 
  Building, 
  GraduationCap, 
  Rocket, 
  ShieldAlert, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ApplicantProfile, 
  FinancingPurpose, 
  BusinessSector, 
  BusinessStage, 
  LegalStructure, 
  Language 
} from '../types/financing';
import { TUNISIAN_GOVERNORATES, REGIONAL_DEVELOPMENT_ZONES } from '../data/financingData';
import { TRANSLATIONS } from '../i18n/translations';
import { TrustBadge } from './TrustBadge';

interface QuestionnaireFlowProps {
  initialProfile: ApplicantProfile;
  language: Language;
  onComplete: (profile: ApplicantProfile) => void;
  onCancel: () => void;
}

export const QuestionnaireFlow: React.FC<QuestionnaireFlowProps> = ({
  initialProfile,
  language,
  onComplete,
  onCancel
}) => {
  const t = TRANSLATIONS[language];
  const [profile, setProfile] = useState<ApplicantProfile>(initialProfile);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Auto-sync Financing Requested when Total Project Cost or User Contribution changes
  const handleCostChange = (total: number, contribution: number) => {
    const validTotal = Math.max(0, total);
    const validContribution = Math.max(0, contribution);
    const requested = Math.max(0, validTotal - validContribution);
    setProfile(prev => ({
      ...prev,
      totalProjectCost: validTotal,
      userContribution: validContribution,
      financingRequested: requested
    }));
  };

  // Auto-detect Regional Development Zone (ZDR)
  useEffect(() => {
    const isZdr = REGIONAL_DEVELOPMENT_ZONES.includes(profile.location);
    if (isZdr !== profile.isRegionalDevelopmentZone) {
      setProfile(prev => ({ ...prev, isRegionalDevelopmentZone: isZdr }));
    }
  }, [profile.location]);

  const contributionPercent = profile.totalProjectCost > 0
    ? Math.round((profile.userContribution / profile.totalProjectCost) * 100)
    : 0;

  const sectors: { id: BusinessSector; label: { fr: string; ar: string } }[] = [
    { id: 'industry', label: { fr: 'Industrie manufacturière & Chimie', ar: 'الصناعات المعملية والكيميائية' } },
    { id: 'services', label: { fr: 'Services & Conseil aux entreprises', ar: 'الخدمات والاستشارات' } },
    { id: 'ict_tech', label: { fr: 'Technologies, Logiciels & Digital', ar: 'تكنولوجيا المعلومات والبرمجيات' } },
    { id: 'agriculture_agribusiness', label: { fr: 'Agriculture & Agroalimentaire', ar: 'الفلاحة والصناعات الغذائية' } },
    { id: 'crafts_trades', label: { fr: 'Artisanat & Métiers manuels', ar: 'الصناعات التقليدية والحرف' } },
    { id: 'commerce', label: { fr: 'Commerce & Distribution', ar: 'التجارة والتوزيع' } },
    { id: 'renewable_energy', label: { fr: 'Énergies renouvelables & Environnement', ar: 'الطاقات المتجددة والبيئة' } },
    { id: 'tourism', label: { fr: 'Tourisme, Hébergement & Restauration', ar: 'السياحة والإيواء والإطعام' } },
    { id: 'other', label: { fr: 'Autre secteur d’activité', ar: 'قطاع نشاط آخر' } }
  ];

  const stages: { id: BusinessStage; label: { fr: string; ar: string }; desc: { fr: string; ar: string } }[] = [
    {
      id: 'idea_project',
      label: { fr: 'Idée ou étude en cours', ar: 'فكرة أو دراسة في طور الإعداد' },
      desc: { fr: 'Entreprise non encore créée au RNE', ar: 'المؤسسة لم تسجل بعد بالسجل الوطني للمؤسسات' }
    },
    {
      id: 'creation_underway',
      label: { fr: 'Création en cours', ar: 'إجراءات التأسيس جارية' },
      desc: { fr: 'Statuts déposés ou RNE récent', ar: 'تم إيداع القانون الأساسي أو الحصول على المعرف' }
    },
    {
      id: 'established_under_2y',
      label: { fr: 'Entreprise de moins de 2 ans', ar: 'مؤسسة قائمة منذ أقل من سنتين' },
      desc: { fr: 'Nouveau promoteur en phase de démarrage', ar: 'باعث جديد في مرحلة الانطلاق والترويج' }
    },
    {
      id: 'established_over_2y',
      label: { fr: 'Entreprise établie (+ de 2 ans)', ar: 'مؤسسة قائمة منذ أكثر من سنتين' },
      desc: { fr: 'Phase d’extension, d’équipement ou trésorerie', ar: 'مرحلة التوسعة أو تحديث الآلات أو دعم السيولة' }
    }
  ];

  const legalForms: { id: LegalStructure; label: string }[] = [
    { id: 'suarl', label: 'SUARL (Société Unipersonnelle)' },
    { id: 'sarl', label: 'SARL (Société à Responsabilité Limitée)' },
    { id: 'individual', label: 'Entreprise Individuelle (Personne Physique)' },
    { id: 'sa', label: 'SA (Société Anonyme)' },
    { id: 'agricultural_coop', label: 'Société Mutuelle de Services Agricoles (SMSA)' },
    { id: 'not_yet_created', label: 'Non encore créée (En réflexion)' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Questionnaire Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Step Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
              {language === 'ar' ? `المرحلة ${currentStep} من 4` : `Étape ${currentStep} sur 4`}
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {currentStep === 1 && t.step1Title}
              {currentStep === 2 && t.step2Title}
              {currentStep === 3 && t.step3Title}
              {currentStep === 4 && t.step4Title}
            </h2>
          </div>
          <TrustBadge type="user_provided" language={language} subtle />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: AMOUNTS & DISCIPLINE */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">
                    {language === 'ar' ? 'فصل المعطيات المالية :' : 'Discipline financière Mizen :'}
                  </strong>
                  <p className="mt-0.5 leading-relaxed">
                    {language === 'ar'
                      ? 'تمويل المشروع في تونس يقوم على الجمع بين كلفة المشروع الإجمالية ومساهمتك الذاتية ومبلغ القرض المطلوب.'
                      : 'Les banques tunisiennes (BFPME, BTS) exigent une distinction rigoureuse entre le coût total, l’apport personnel et le crédit demandé.'}
                  </p>
                </div>
              </div>

              {/* Total Project Cost */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  {t.totalCostLabel}
                </label>
                <div className="relative">
                  <input
                    id="input-total-cost"
                    type="number"
                    min="1000"
                    step="1000"
                    value={profile.totalProjectCost || ''}
                    onChange={(e) => handleCostChange(parseFloat(e.target.value) || 0, profile.userContribution)}
                    placeholder="Ex: 100000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 font-semibold outline-hidden"
                  />
                  <span className="absolute right-4 rtl:left-4 rtl:right-auto top-3.5 text-xs font-bold text-slate-600">
                    DT
                  </span>
                </div>
              </div>

              {/* User Contribution (Apport Personnel) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-bold text-slate-800">
                    {t.userContributionLabel}
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    contributionPercent >= 20 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {contributionPercent}% du projet
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="input-user-contribution"
                    type="number"
                    min="0"
                    step="1000"
                    value={profile.userContribution || ''}
                    onChange={(e) => handleCostChange(profile.totalProjectCost, parseFloat(e.target.value) || 0)}
                    placeholder="Ex: 25000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 font-semibold outline-hidden"
                  />
                  <span className="absolute right-4 rtl:left-4 rtl:right-auto top-3.5 text-xs font-bold text-slate-600">
                    DT
                  </span>
                </div>
              </div>

              {/* Financing Requested (Calculated automatically) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-700 font-medium">
                      {t.financingRequestedLabel}
                    </span>
                    <div className="text-2xl font-extrabold text-blue-900 mt-0.5">
                      {profile.financingRequested.toLocaleString('fr-FR')} DT
                    </div>
                  </div>
                  <Calculator className="w-8 h-8 text-blue-600/40" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PURPOSE & SECTOR */}
          {currentStep === 2 && (
            <div className="space-y-5">
              {/* Purpose */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  {t.purposeLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'creation', label: { fr: 'Création d’entreprise', ar: 'بعث مؤسسة' } },
                    { id: 'equipment', label: { fr: 'Achat d’équipements', ar: 'اقتناء معدات' } },
                    { id: 'expansion', label: { fr: 'Extension / Croissance', ar: 'توسعة النشاط' } },
                    { id: 'working_capital', label: { fr: 'Fonds de roulement', ar: 'رأس مال عامل' } },
                    { id: 'agriculture', label: { fr: 'Projet agricole', ar: 'مشروع فلاحي' } },
                    { id: 'innovation_rd', label: { fr: 'Tech & R&D', ar: 'تجديد وتكنولوجيا' } }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProfile(prev => ({ ...prev, purpose: p.id as FinancingPurpose }))}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                        profile.purpose === p.id
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  {t.sectorLabel}
                </label>
                <select
                  id="select-sector"
                  value={profile.sector}
                  onChange={(e) => setProfile(prev => ({ ...prev, sector: e.target.value as BusinessSector }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 font-medium outline-hidden bg-white"
                >
                  {sectors.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.label[language]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location (Governorates) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-800">
                    {t.locationLabel}
                  </label>
                  {profile.isRegionalDevelopmentZone && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-700" />
                      {language === 'ar' ? 'منطقة تنمية جهوية (ZDR)' : 'Zone de Développement Régional (ZDR)'}
                    </span>
                  )}
                </div>
                <select
                  id="select-location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 font-medium outline-hidden bg-white"
                >
                  {TUNISIAN_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov} {REGIONAL_DEVELOPMENT_ZONES.includes(gov) ? '★ (Zone de Développement Régional)' : ''}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500 mt-1 block">
                  {language === 'ar'
                    ? 'الولايات المحددة بعلامة ★ تتمتع بامتيازات التنمية الجهوية (ضمان بنسبة 75% ومنح فبرودي).'
                    : 'Les gouvernorats marqués ★ bénéficient des incitations territoriales (garantie 75% et primes FOPRODI).'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: STAGE & LEGAL FORM */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Stage */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  {t.stageLabel}
                </label>
                <div className="space-y-2">
                  {stages.map((stg) => (
                    <div
                      key={stg.id}
                      onClick={() => setProfile(prev => ({ ...prev, businessStage: stg.id }))}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        profile.businessStage === stg.id
                          ? 'bg-blue-50/70 border-blue-600 text-blue-950 font-semibold'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-bold">{stg.label[language]}</div>
                        <div className="text-xs text-slate-500">{stg.desc[language]}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        profile.businessStage === stg.id
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300'
                      }`}>
                        {profile.businessStage === stg.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Form */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  {t.legalFormLabel}
                </label>
                <select
                  id="select-legal-form"
                  value={profile.legalStructure}
                  onChange={(e) => setProfile(prev => ({ ...prev, legalStructure: e.target.value as LegalStructure }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 font-medium outline-hidden bg-white"
                >
                  {legalForms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: QUALIFYING TRAITS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Higher education degree */}
              <div
                onClick={() => setProfile(prev => ({ ...prev, hasHigherEducationDegree: !prev.hasHigherEducationDegree }))}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  profile.hasHigherEducationDegree
                    ? 'bg-blue-50/70 border-blue-600 text-blue-950'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800 mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{t.degreeLabel}</div>
                  <p className="text-xs text-slate-500 mt-0.5">{t.degreeHelp}</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.hasHigherEducationDegree}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              {/* Startup Act */}
              <div
                onClick={() => setProfile(prev => ({ ...prev, hasStartupActLabel: !prev.hasStartupActLabel }))}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  profile.hasStartupActLabel
                    ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-800 mt-0.5">
                  <Rocket className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{t.startupLabel}</div>
                  <p className="text-xs text-slate-500 mt-0.5">{t.startupHelp}</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.hasStartupActLabel}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {/* Sharia preference */}
              <div
                onClick={() => setProfile(prev => ({
                  ...prev,
                  structurePreference: prev.structurePreference === 'islamic' ? 'any' : 'islamic'
                }))}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  profile.structurePreference === 'islamic'
                    ? 'bg-emerald-50/70 border-emerald-600 text-emerald-950'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                  <Building className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{t.shariaLabel}</div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'ar'
                      ? 'البحث المفضل عن صيغ المرابحة والإجارة الإسلامية (مصرف الزيتونة، البركة).'
                      : 'Prioriser les contrats de Mourabaha et formules conformes à la Charia.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={profile.structurePreference === 'islamic'}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              {/* Guarantees preference */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  {t.collateralLabel}
                </label>
                <select
                  value={profile.collateralPreference}
                  onChange={(e) => setProfile(prev => ({ ...prev, collateralPreference: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 text-slate-900 font-medium outline-hidden bg-white"
                >
                  <option value="none">
                    {language === 'ar' ? 'لا أملك رهوناً عقارية (البحث عن ضمان سوتوغار أو كفالة شخصية)' : 'Aucune hypothèque disponible (Recherche de garantie SOTUGAR ou caution)'}
                  </option>
                  <option value="limited">
                    {language === 'ar' ? 'ضمانات محدودة / معدات المشروع فقط' : 'Garanties limitées / Nantissement du matériel seul'}
                  </option>
                  <option value="available">
                    {language === 'ar' ? 'أملك ضمانات عينية أو عقارية كافية' : 'Garanties réelles ou hypothèques disponibles'}
                  </option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                <span>{language === 'ar' ? 'السابق' : 'Précédent'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-sm font-medium transition-all"
              >
                {language === 'ar' ? 'إلغاء' : 'Retour'}
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-all shadow-xs flex items-center gap-1.5 ml-auto"
              >
                <span>{language === 'ar' ? 'المرحلة التالية' : 'Suivant'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-run-matching"
                onClick={() => onComplete(profile)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all shadow-sm flex items-center gap-2 ml-auto"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{language === 'ar' ? 'عرض خيارات التمويل' : 'Lancer l’analyse Mizen'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
