import React, { useState } from 'react';
import { 
  Building2, 
  Wrench, 
  TrendingUp, 
  Coins, 
  Tractor, 
  Lightbulb, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Edit2,
  RotateCcw,
  Info,
  Home,
  Hammer,
  ShieldCheck,
  Layers,
  FileCheck2,
  HelpCircle,
  Clock,
  Calculator,
  ExternalLink
} from 'lucide-react';
import { 
  Language, 
  FinancingPurpose, 
  FinancingJourney,
  ApplicantProfile,
  BusinessSector,
  BusinessStage,
  DemoScenario
} from '../types/financing';
import { TUNISIAN_GOVERNORATES } from '../data/financingData';
import { TRANSLATIONS } from '../i18n/translations';
import { parseTextToProfileFallback } from '../utils/intakeParser';
import { DemoScenarioDeck } from './DemoScenarioDeck';

interface HeroSectionProps {
  language: Language;
  onSelectPurpose: (purpose: FinancingPurpose) => void;
  onSelectJourney?: (journey: FinancingJourney) => void;
  onAiParsed: (extractedProfile: Partial<ApplicantProfile>) => void;
  onSelectDemoScenario?: (scenario: DemoScenario) => void;
  onExploreAll: () => void;
  onStartFullDiagnostic: () => void;
}

interface ExtractedDraft {
  financingRequested?: number;
  totalProjectCost?: number;
  userContribution?: number;
  purpose?: FinancingPurpose;
  sector?: BusinessSector;
  location?: string;
  businessStage?: BusinessStage;
  hasHigherEducationDegree?: boolean;
  missingCriticalFields?: string[];
  unassumedFields?: string[];
  summaryText?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onSelectPurpose,
  onSelectJourney,
  onAiParsed,
  onSelectDemoScenario,
  onExploreAll,
  onStartFullDiagnostic
}) => {
  const t = TRANSLATIONS[language];
  const [naturalQuery, setNaturalQuery] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // AI Intake Confirmation State
  const [extractedDraft, setExtractedDraft] = useState<ExtractedDraft | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  const sectorLabels: Record<BusinessSector, { fr: string; ar: string }> = {
    industry: { fr: 'Industrie manufacturière', ar: 'الصناعات المعملية' },
    services: { fr: 'Services & Conseil', ar: 'الخدمات والاستشارات' },
    ict_tech: { fr: 'Technologies & Logiciels', ar: 'تكنولوجيا المعلومات' },
    agriculture_agribusiness: { fr: 'Agriculture & Agroalimentaire', ar: 'الفلاحة والصناعات الغذائية' },
    crafts_trades: { fr: 'Artisanat & Métiers', ar: 'الصناعات التقليدية' },
    commerce: { fr: 'Commerce & Distribution', ar: 'التجارة والتوزيع' },
    renewable_energy: { fr: 'Énergies renouvelables', ar: 'الطاقات المتجددة' },
    tourism: { fr: 'Tourisme & Restauration', ar: 'السياحة والإطعام' },
    real_estate: { fr: 'Immobilier & Promotion', ar: 'العقارات والبعث العقاري' },
    residential_real_estate_promotion: { fr: 'Promotion immobilière résidentielle', ar: 'البعث العقاري السكني' },
    other: { fr: 'Autre secteur', ar: 'قطاع آخر' }
  };

  const stageLabels: Record<BusinessStage, { fr: string; ar: string }> = {
    idea_project: { fr: 'Idée ou étude en cours', ar: 'فكرة أو دراسة' },
    creation_underway: { fr: 'Création en cours', ar: 'في طور التأسيس' },
    established_under_2y: { fr: 'Moins de 2 ans d’activité', ar: 'أقل من سنتين نشاط' },
    established_over_2y: { fr: 'Plus de 2 ans d’activité', ar: 'أكثر من سنتين نشاط' }
  };

  const purposeLabels: Record<FinancingPurpose, { fr: string; ar: string }> = {
    creation: { fr: 'Création d’entreprise', ar: 'بعث وتأسيس مشروع' },
    equipment: { fr: 'Achat d’équipements', ar: 'اقتناء معدات وآلات' },
    expansion: { fr: 'Extension / Développement', ar: 'توسعة النشاط' },
    working_capital: { fr: 'Fonds de roulement', ar: 'رأس مال عامل وسيولة' },
    agriculture: { fr: 'Projet agricole', ar: 'مشروع فلاحي' },
    innovation_rd: { fr: 'Tech & R&D', ar: 'تجديد وتكنولوجيا' },
    export: { fr: 'Développement export', ar: 'تصدير وأسواق خارجية' },
    first_home: { fr: 'Premier Logement (Achat)', ar: 'المسكن الأول (شراء)' },
    home_construction: { fr: 'Construction de logement', ar: 'بناء مسكن فردي' },
    vehicle: { fr: 'Financement Véhicule', ar: 'تمويل سيارة / وسيلة نقل' }
  };

  const handleAiIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;

    setIsParsing(true);
    setParseError(null);

    try {
      const res = await fetch('/api/gemini/parse-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: naturalQuery, language })
      });

      if (!res.ok) {
        throw new Error('Erreur lors du traitement de la requête');
      }

      const data = await res.json();
      if (data.extracted) {
        setExtractedDraft({
          financingRequested: data.extracted.financingRequested ?? undefined,
          totalProjectCost: data.extracted.totalProjectCost ?? undefined,
          userContribution: data.extracted.userContribution ?? undefined,
          purpose: data.extracted.purpose ?? undefined,
          sector: data.extracted.sector ?? undefined,
          location: data.extracted.location ?? undefined,
          businessStage: data.extracted.businessStage ?? undefined,
          missingCriticalFields: data.extracted.missingCriticalFields || [],
          unassumedFields: data.extracted.unassumedFields || [],
          summaryText: data.extracted.summaryText
        });
      }
    } catch (err: any) {
      console.warn('AI intake fallback to local heuristic extractor:', err);
      const parsed = parseTextToProfileFallback(naturalQuery, language);
      const missing: string[] = [];
      if (!parsed.financingRequested) missing.push(language === 'ar' ? 'مبلغ التمويل المطلوب' : 'Montant du financement souhaité');
      if (!parsed.totalProjectCost) missing.push(language === 'ar' ? 'الكلفة الجملية للمشروع' : 'Coût global du projet');
      if (!parsed.userContribution) missing.push(language === 'ar' ? 'المساهمة الذاتية' : 'Apport personnel');
      if (!parsed.purpose) missing.push(language === 'ar' ? 'موضوع التمويل' : 'Objet du financement');
      if (!parsed.location) missing.push(language === 'ar' ? 'الولاية' : 'Gouvernorat');

      setExtractedDraft({
        purpose: parsed.purpose,
        financingRequested: parsed.financingRequested,
        totalProjectCost: parsed.totalProjectCost,
        userContribution: parsed.userContribution,
        location: parsed.location,
        sector: parsed.sector,
        businessStage: parsed.businessStage,
        missingCriticalFields: missing,
        unassumedFields: [
          language === 'ar' ? 'لم يتم اختلاق أي فائدة أو نسبة' : 'Aucun taux ou marge inventé',
          language === 'ar' ? 'الشكل القانوني غير مفترض' : 'Forme juridique non assumée'
        ]
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmDraft = () => {
    if (!extractedDraft) return;
    onAiParsed({
      financingRequested: extractedDraft.financingRequested,
      totalProjectCost: extractedDraft.totalProjectCost,
      userContribution: extractedDraft.userContribution,
      purpose: extractedDraft.purpose,
      sector: extractedDraft.sector,
      location: extractedDraft.location,
      businessStage: extractedDraft.businessStage,
      hasHigherEducationDegree: extractedDraft.hasHigherEducationDegree
    });
  };

  const journeyCards = [
    {
      journey: 'startup' as FinancingJourney,
      purpose: 'creation' as FinancingPurpose,
      title: { fr: 'Créer une entreprise', ar: 'بعث وتأسيس مشروع' },
      icon: <Building2 className="w-5 h-5 text-indigo-600" />,
      desc: { fr: 'BFPME, BTS Bank, dotations APII, diplômés et nouveaux promoteurs', ar: 'BFPME، بنك التضامن، منح APII، أصحاب الشهادات والباعثون الجدد' }
    },
    {
      journey: 'business_expansion' as FinancingJourney,
      purpose: 'expansion' as FinancingPurpose,
      title: { fr: 'Développer une PME', ar: 'توسعة وتحديث مؤسسة' },
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
      desc: { fr: 'Augmentation de capacité, fonds de roulement, couverture SOTUGAR', ar: 'زيادة طاقة الإنتاج، رأس المال العامل، وتغطية كفالة سوتوغار' }
    },
    {
      journey: 'equipment' as FinancingJourney,
      purpose: 'equipment' as FinancingPurpose,
      title: { fr: 'Machines & Équipements', ar: 'اقتناء معدات وآلات' },
      icon: <Wrench className="w-5 h-5 text-purple-600" />,
      desc: { fr: 'Lignes de production, outillage industriel, leasing matériel', ar: 'خطوط إنتاج، أدوات صناعية، إيجار مالي للمعدات' }
    },
    {
      journey: 'agriculture' as FinancingJourney,
      purpose: 'agriculture' as FinancingPurpose,
      title: { fr: 'Projet agricole', ar: 'مشروع فلاحي' },
      icon: <Tractor className="w-5 h-5 text-lime-600" />,
      desc: { fr: 'Arboriculture, élevage, serres, irrigation moderne et APIA', ar: 'غراسات، تربية ماشية، بيوت مكيفة، ري حديث ووكالة النهوض بالاستثمارات الفلاحية' }
    },
    {
      journey: 'home_purchase' as FinancingJourney,
      purpose: 'first_home' as FinancingPurpose,
      title: { fr: 'Acheter un logement', ar: 'شراء مسكن' },
      icon: <Home className="w-5 h-5 text-blue-600" />,
      desc: { fr: 'Premier Logement (MEHAT/BH), crédit bancaire acquéreur', ar: 'المسكن الأول، قروض عقارية مدعمة وبنك الإسكان' }
    },
    {
      journey: 'home_construction' as FinancingJourney,
      purpose: 'home_construction' as FinancingPurpose,
      title: { fr: 'Construire / Rénover', ar: 'بناء أو تهيئة مسكن' },
      icon: <Hammer className="w-5 h-5 text-emerald-600" />,
      desc: { fr: 'FOPROLOS, travaux sur terrain propre, surélévation', ar: 'فوبرولوس، بناء على أرض خاصة، أشغال وتوسعة' }
    },
    {
      journey: 'car' as FinancingJourney,
      purpose: 'vehicle' as FinancingPurpose,
      title: { fr: 'Acheter un véhicule', ar: 'شراء سيارة / وسيلة نقل' },
      icon: <Wrench className="w-5 h-5 text-amber-600" />,
      desc: { fr: 'Véhicule neuf ou occasion, leasing utilitaire pro, crédit auto', ar: 'سيارة جديدة أو مستعملة، ليزينغ نفعي مهني، قرض سيارة' }
    },
    {
      journey: 'other_professional' as FinancingJourney,
      purpose: 'working_capital' as FinancingPurpose,
      title: { fr: 'Autre financement pro', ar: 'تمويل مهني آخر' },
      icon: <Coins className="w-5 h-5 text-slate-600" />,
      desc: { fr: 'Professions libérales, commerce, trésorerie et besoins mixtes', ar: 'مهن حرة، تجارة وتوزيع، سيولة وحاجيات مهنية متنوعة' }
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & AI PROJECT INTAKE                                       */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-10 pb-6 sm:pt-16 sm:pb-12 bg-gradient-to-b from-slate-100/70 via-slate-50 to-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Proposition Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            {/* Unboxed Kicker */}
            <div className="text-xs font-semibold text-slate-500 tracking-wide mb-3 flex items-center justify-center gap-2">
              <span className="text-slate-900 font-bold">Mizen</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span>{language === 'ar' ? 'استخبارات التمويل في تونس' : 'Intelligence de Financement'}</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span>{language === 'ar' ? 'تونس' : 'Tunisie'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.15] text-balance mb-5">
              {t.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto text-balance">
              {t.heroSubheadline}
            </p>

            {/* Core Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <button
                id="hero-cta-start"
                type="button"
                onClick={onStartFullDiagnostic}
                className="min-h-[44px] px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-xs hover:shadow transition-all flex items-center gap-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <span>{t.heroStartBtn}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <button
                id="hero-cta-explore"
                type="button"
                onClick={onExploreAll}
                className="min-h-[44px] px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base border border-slate-200/90 shadow-2xs transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {t.heroExploreBtn}
              </button>
            </div>

            {/* Trust Indicators (Unboxed typography with separators) */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-y-1.5 gap-x-2 text-xs text-slate-500 font-medium">
              <span>{t.heroTrustSource}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{t.heroTrustDistinction}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{t.heroTrustNoPromise}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{t.heroTrustBilingual}</span>
            </div>
          </div>

          {/* Natural-Language Project Intake Console */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm relative">
              <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>{t.heroAiIntakeTitle}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {language === 'ar' ? 'استخراج ذكي بدون افتراضات عشوائية' : 'Extraction neutre & sans supposition'}
                </div>
              </div>

              {/* Form Mode */}
              {!extractedDraft ? (
                <form onSubmit={handleAiIntake} className="space-y-3.5">
                  <div className="relative">
                    <label htmlFor="hero-ai-input" className="sr-only">
                      {t.heroAiIntakeTitle}
                    </label>
                    <textarea
                      id="hero-ai-input"
                      value={naturalQuery}
                      onChange={(e) => setNaturalQuery(e.target.value)}
                      placeholder={t.heroAiIntakePlaceholder}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-800 text-sm placeholder-slate-400 transition-all outline-hidden resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="text-xs text-slate-500 leading-normal flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.heroAiIntakeHint}</span>
                    </div>

                    <button
                      id="hero-ai-submit-btn"
                      type="submit"
                      disabled={isParsing || !naturalQuery.trim()}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 sm:self-auto shadow-xs shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      {isParsing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{language === 'ar' ? 'جارٍ تحليل المشروع...' : 'Analyse du projet...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>{t.heroAiIntakeSubmit}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Extracted Draft Confirmation & Review Card */
                <div id="ai-confirmation-review-card" className="space-y-4 pt-1">
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        {language === 'ar' 
                          ? 'إليك ما استوعبناه من معطيات مشروعك :' 
                          : 'Voici ce que Mizen a compris de votre projet :'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingDraft(!isEditingDraft)}
                        className="min-h-[40px] px-2 py-1 text-xs text-indigo-700 hover:text-indigo-950 font-semibold flex items-center gap-1 rounded-md hover:bg-indigo-100/50 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{isEditingDraft ? (language === 'ar' ? 'إنهاء التعديل' : 'Terminer') : (language === 'ar' ? 'تعديل المعطيات' : 'Corriger')}</span>
                      </button>
                    </div>
                    {extractedDraft.summaryText && (
                      <p className="text-xs text-indigo-900 leading-relaxed">
                        {extractedDraft.summaryText}
                      </p>
                    )}
                  </div>

                  {/* Extracted Fields Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Secteur */}
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <span className="text-slate-500 block mb-1 font-medium">
                        {language === 'ar' ? 'القطاع :' : 'Secteur d’activité :'}
                      </span>
                      {isEditingDraft ? (
                        <select
                          value={extractedDraft.sector || ''}
                          onChange={(e) => setExtractedDraft({ ...extractedDraft, sector: (e.target.value as BusinessSector) || undefined })}
                          className="w-full p-2 rounded-md border border-slate-300 bg-white font-medium text-slate-800"
                        >
                          <option value="">{language === 'ar' ? '-- غير محدد --' : '-- Non précisé --'}</option>
                          {Object.entries(sectorLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label[language]}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`font-semibold ${extractedDraft.sector ? 'text-slate-900' : 'text-amber-700'}`}>
                          {extractedDraft.sector ? sectorLabels[extractedDraft.sector][language] : (language === 'ar' ? 'غير محدد' : 'Non précisé')}
                        </span>
                      )}
                    </div>

                    {/* Montant souhaité */}
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <span className="text-slate-500 block mb-1 font-medium">
                        {language === 'ar' ? 'التمويل المطلوب :' : 'Financement souhaité :'}
                      </span>
                      {isEditingDraft ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={extractedDraft.financingRequested || ''}
                            onChange={(e) => setExtractedDraft({
                              ...extractedDraft,
                              financingRequested: parseFloat(e.target.value) || undefined
                            })}
                            placeholder="Ex: 80000"
                            className="w-full p-2 rounded-md border border-slate-300 bg-white font-medium text-slate-800"
                          />
                          <span className="font-bold text-slate-500">DT</span>
                        </div>
                      ) : (
                        <span className={`font-semibold ${extractedDraft.financingRequested ? 'text-blue-900' : 'text-amber-700'}`}>
                          {extractedDraft.financingRequested ? `${extractedDraft.financingRequested.toLocaleString('fr-FR')} DT` : (language === 'ar' ? 'غير محدد' : 'Non précisé')}
                        </span>
                      )}
                    </div>

                    {/* Coût global du projet */}
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <span className="text-slate-500 block mb-1 font-medium">
                        {language === 'ar' ? 'الكلفة الجملية للمشروع :' : 'Coût global du projet :'}
                      </span>
                      {isEditingDraft ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={extractedDraft.totalProjectCost || ''}
                            onChange={(e) => setExtractedDraft({
                              ...extractedDraft,
                              totalProjectCost: parseFloat(e.target.value) || undefined
                            })}
                            placeholder="Ex: 100000"
                            className="w-full p-2 rounded-md border border-slate-300 bg-white font-medium text-slate-800"
                          />
                          <span className="font-bold text-slate-500">DT</span>
                        </div>
                      ) : (
                        <span className={`font-semibold ${extractedDraft.totalProjectCost ? 'text-slate-900' : 'text-amber-700'}`}>
                          {extractedDraft.totalProjectCost ? `${extractedDraft.totalProjectCost.toLocaleString('fr-FR')} DT` : (language === 'ar' ? 'غير محدد' : 'Non précisé')}
                        </span>
                      )}
                    </div>

                    {/* Apport personnel */}
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <span className="text-slate-500 block mb-1 font-medium">
                        {language === 'ar' ? 'المساهمة الذاتية :' : 'Apport personnel :'}
                      </span>
                      {isEditingDraft ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={extractedDraft.userContribution || ''}
                            onChange={(e) => setExtractedDraft({
                              ...extractedDraft,
                              userContribution: parseFloat(e.target.value) || undefined
                            })}
                            placeholder="Ex: 20000"
                            className="w-full p-2 rounded-md border border-slate-300 bg-white font-medium text-slate-800"
                          />
                          <span className="font-bold text-slate-500">DT</span>
                        </div>
                      ) : (
                        <span className={`font-semibold ${extractedDraft.userContribution ? 'text-slate-900' : 'text-amber-700'}`}>
                          {extractedDraft.userContribution ? `${extractedDraft.userContribution.toLocaleString('fr-FR')} DT` : (language === 'ar' ? 'غير محدد' : 'Non précisé')}
                        </span>
                      )}
                    </div>

                    {/* Région / Gouvernorat */}
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <span className="text-slate-500 block mb-1 font-medium">
                        {language === 'ar' ? 'الولاية :' : 'Région / Gouvernorat :'}
                      </span>
                      {isEditingDraft ? (
                        <select
                          value={extractedDraft.location || ''}
                          onChange={(e) => setExtractedDraft({ ...extractedDraft, location: e.target.value || undefined })}
                          className="w-full p-2 rounded-md border border-slate-300 bg-white font-medium text-slate-800"
                        >
                          <option value="">{language === 'ar' ? '-- غير محدد --' : '-- Non précisé --'}</option>
                          {TUNISIAN_GOVERNORATES.map(gov => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`font-semibold ${extractedDraft.location ? 'text-slate-900' : 'text-amber-700'}`}>
                          {extractedDraft.location || (language === 'ar' ? 'غير محدد' : 'Non précisé')}
                        </span>
                      )}
                    </div>

                    {/* Stade */}
                    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                      <span className="text-slate-500 block mb-1 font-medium">
                        {language === 'ar' ? 'مرحلة المشروع :' : 'Stade d’avancement :'}
                      </span>
                      {isEditingDraft ? (
                        <select
                          value={extractedDraft.businessStage || ''}
                          onChange={(e) => setExtractedDraft({ ...extractedDraft, businessStage: (e.target.value as BusinessStage) || undefined })}
                          className="w-full p-2 rounded-md border border-slate-300 bg-white font-medium text-slate-800"
                        >
                          <option value="">{language === 'ar' ? '-- غير محدد --' : '-- Non précisé --'}</option>
                          {Object.entries(stageLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label[language]}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`font-semibold ${extractedDraft.businessStage ? 'text-slate-900' : 'text-amber-700'}`}>
                          {extractedDraft.businessStage ? stageLabels[extractedDraft.businessStage][language] : (language === 'ar' ? 'غير محدد' : 'Non précisé')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Missing / Unassumed items notice */}
                  {((extractedDraft.missingCriticalFields && extractedDraft.missingCriticalFields.length > 0) || 
                    (extractedDraft.unassumedFields && extractedDraft.unassumedFields.length > 0)) && (
                    <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <Info className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'ar' ? 'معطيات لم يتم اختلاقها (تبقى للتثبت لاحقاً) :' : 'Données non assumées (restent à vérifier) :'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[...(extractedDraft.unassumedFields || []), ...(extractedDraft.missingCriticalFields || [])].map((item, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-800">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confirmation Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setExtractedDraft(null);
                        setIsEditingDraft(false);
                      }}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'إعادة الصياغة' : 'Recommencer la saisie'}</span>
                    </button>

                    <button
                      id="ai-confirm-submit-btn"
                      type="button"
                      onClick={handleConfirmDraft}
                      className="min-h-[44px] px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-xs hover:shadow"
                    >
                      <span>{language === 'ar' ? 'تأكيد والبحث عن التمويل' : 'Confirmer et lancer l’analyse'}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {parseError && (
                <div className="mt-3 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* ========================================================================= */}
        {/* 2. THREE-STEP EDITORIAL FLOW ("COMMENT FONCTIONNE MIZEN")                  */}
        {/* ========================================================================= */}
        <section aria-labelledby="section-how-it-works">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 id="section-how-it-works" className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
              {t.howItWorksTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 text-balance">
              {t.howItWorksSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 01 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-700 tracking-wider block mb-2">
                  {language === 'ar' ? 'المرحلة 01' : 'Étape 01'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {t.step1CardTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.step1CardDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{language === 'ar' ? 'فصل الكلفة عن التمويل الذاتي' : 'Distinction coût vs apport'}</span>
              </div>
            </div>

            {/* Step 02 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-700 tracking-wider block mb-2">
                  {language === 'ar' ? 'المرحلة 02' : 'Étape 02'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {t.step2CardTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.step2CardDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{language === 'ar' ? 'تطبيق القواعد الإقصائية الرسمية' : 'Règles éliminatoires vérifiées'}</span>
              </div>
            </div>

            {/* Step 03 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-700 tracking-wider block mb-2">
                  {language === 'ar' ? 'المرحلة 03' : 'Étape 03'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {t.step3CardTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.step3CardDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{language === 'ar' ? 'تحليل التركيبات المتكاملة' : 'Analyse de co-financement'}</span>
              </div>
            </div>
          </div>

          {/* Guarantee Clarification Notice */}
          <div className="mt-6 p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.guaranteeClarification}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. USER-CENTRIC FINANCING JOURNEYS                                        */}
        {/* ========================================================================= */}
        <section aria-labelledby="section-journeys">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 id="section-journeys" className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
              {language === 'ar' ? 'ما الذي ترغب في تمويله بالتحديد؟' : 'Que souhaitez-vous financer ?'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 text-balance">
              {language === 'ar'
                ? 'اختر موضوع التمويل لعزل الآليات البنكية وصناديق الضمان المخصصة لكل مجال'
                : 'Sélectionnez votre objet de financement pour isoler directement les dispositifs concernés'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {journeyCards.map((item) => (
              <div
                key={item.journey}
                id={`journey-card-${item.journey}`}
                onClick={() => {
                  if (onSelectJourney) {
                    onSelectJourney(item.journey);
                  } else {
                    onSelectPurpose(item.purpose);
                  }
                }}
                className="group p-5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center mb-3.5 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {item.title[language]}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {item.desc[language]}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                  <span>{language === 'ar' ? 'بدء هذا المسار' : 'Lancer ce parcours'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. FINANCING STACK & MULTI-SOURCE POSITIONING                             */}
        {/* ========================================================================= */}
        <section aria-labelledby="section-stacking" className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-md">
          <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              {language === 'ar' ? 'هيكلة التمويل المتقدم' : 'Intelligence de Montage'}
            </span>
            <h2 id="section-stacking" className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-balance">
              {t.stackTitle}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed text-balance">
              {t.stackSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Single Source */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                {language === 'ar' ? 'النمط التقليدي' : 'Schéma Classique'}
              </span>
              <h3 className="text-base font-bold text-white mb-2">
                {t.stackCard1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.stackCard1Desc}
              </p>
            </div>

            {/* Multi-Source Stack */}
            <div className="p-5 rounded-2xl bg-blue-950/60 border border-blue-500/40">
              <span className="text-xs font-semibold text-amber-300 block mb-1">
                {language === 'ar' ? 'هندسة التمويل المركب' : 'Montage Multi-Mécanismes'}
              </span>
              <h3 className="text-base font-bold text-white mb-2">
                {t.stackCard2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {t.stackCard2Desc}
              </p>
            </div>
          </div>

          {/* Stacking Rule Warning */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.stackRuleNotice}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. TRANSPARENCY & KNOWLEDGE ARCHITECTURE                                  */}
        {/* ========================================================================= */}
        <section aria-labelledby="section-transparency">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 id="section-transparency" className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
              {t.transparencyTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 text-balance">
              {t.transparencySub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Verified */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.transpVerifiedTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.transpVerifiedDesc}
              </p>
            </div>

            {/* 2. Historical */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.transpHistoricalTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.transpHistoricalDesc}
              </p>
            </div>

            {/* 3. Calculated */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.transpCalculatedTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.transpCalculatedDesc}
              </p>
            </div>

            {/* 4. Unknown */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                {t.transpUnknownTitle}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.transpUnknownDesc}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. INSTITUTIONAL ECOSYSTEM                                                */}
        {/* ========================================================================= */}
        <section aria-labelledby="section-institutions" className="pt-6 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="section-institutions" className="text-lg sm:text-xl font-bold text-slate-900 font-display">
              {t.institutionsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.institutionsSub}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { name: 'BFPME', sub: { fr: 'Banque des PME', ar: 'بنك تمويل المؤسسات الصغرى والمتوسطة' } },
              { name: 'BTS Bank', sub: { fr: 'Banque de Solidarité', ar: 'البنك التونسي للتضامن' } },
              { name: 'SOTUGAR', sub: { fr: 'Société de Garantie', ar: 'الشركة التونسية للضمان' } },
              { name: 'APII / FOPRODI', sub: { fr: 'Industrie & Innovation', ar: 'وكالة النهوض بالصناعة' } },
              { name: 'Startup Act', sub: { fr: 'Smart Capital & ANAVA', ar: 'الشركات الناشئة والتجديد' } },
              { name: 'BH Bank', sub: { fr: 'Habitat & Entreprise', ar: 'بنك الإسكان' } },
              { name: 'Enda / Advans', sub: { fr: 'Microfinance Professionnelle', ar: 'التمويل الأصغر المهني' } },
              { name: 'Banque Zitouna', sub: { fr: 'Finance Islamique Mourabaha', ar: 'الصيرفة الإسلامية' } }
            ].map((inst) => (
              <div key={inst.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-sm font-bold text-slate-900 block">{inst.name}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">{inst.sub[language]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. DEMO SCENARIOS DECK (OPTIONAL EXPLORATION)                             */}
        {/* ========================================================================= */}
        {onSelectDemoScenario && (
          <section aria-labelledby="section-demo-scenarios" className="pt-6 border-t border-slate-200/80">
            <DemoScenarioDeck
              language={language}
              onSelectScenario={onSelectDemoScenario}
            />
          </section>
        )}
      </div>
    </div>
  );
};
