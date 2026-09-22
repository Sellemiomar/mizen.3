import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Calculator, 
  ArrowRight, 
  BarChart3, 
  Building2, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Info
} from 'lucide-react';
import { MatchResult, Language, ApplicantProfile } from '../types/financing';
import { TRANSLATIONS } from '../i18n/translations';
import { VerificationBadge } from './VerificationBadge';
import { TrustBadge } from './TrustBadge';

interface ResultsViewProps {
  results: MatchResult[];
  applicantProfile: ApplicantProfile;
  language: Language;
  onSelectProgram: (programId: string) => void;
  onToggleCompare: (programId: string) => void;
  comparedProgramIds: string[];
  onOpenDossier: (programId: string) => void;
  onRestartDiagnostic: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  applicantProfile,
  language,
  onSelectProgram,
  onToggleCompare,
  comparedProgramIds,
  onOpenDossier,
  onRestartDiagnostic
}) => {
  const t = TRANSLATIONS[language];
  const [filterLevel, setFilterLevel] = useState<'all' | 'high' | 'moderate'>('all');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredResults = results.filter(r => {
    if (filterLevel === 'all') return true;
    return r.reasons.eligibilityLevel === filterLevel;
  });

  const isProfileEmpty = !applicantProfile.financingRequested && 
    !applicantProfile.totalProjectCost && 
    !applicantProfile.purpose && 
    !applicantProfile.sector && 
    !applicantProfile.location && 
    !applicantProfile.businessStage;

  if (isProfileEmpty) {
    return (
      <div id="results-empty-state" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shadow-2xs">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">
          {language === 'ar' ? 'لم يتم تحديد أي ملف تعريف بعد' : 'Aucun profil défini'}
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
          {language === 'ar'
            ? 'لبدء تحليل الأهلية ومطابقة آليات التمويل التونسية، يرجى ملء الاستبيان أو وصف مشروعك من الصفحة الرئيسية.'
            : 'Commencez par le questionnaire ou décrivez votre projet pour identifier les dispositifs de financement compatibles.'}
        </p>
        <button
          id="empty-results-start-btn"
          onClick={onRestartDiagnostic}
          className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-all shadow-xs"
        >
          {language === 'ar' ? 'بدء تشخيص المشروع' : 'Remplir le questionnaire'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
              {results.length} {language === 'ar' ? 'آليات تمويل مطابقة' : 'Dispositifs analysés'}
            </span>
            <span className="text-xs text-slate-500">
              {(applicantProfile.financingRequested ?? 0) > 0 
                ? `${applicantProfile.financingRequested?.toLocaleString('fr-FR')} DT` 
                : (language === 'ar' ? 'مبلغ غير محدد' : 'Montant non spécifié')}
              {applicantProfile.location ? ` • ${applicantProfile.location}` : ''}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            {t.resultsTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {t.resultsSub}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onRestartDiagnostic}
            className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            {language === 'ar' ? 'تعديل المعطيات' : 'Modifier mes critères'}
          </button>
        </div>
      </div>

      {/* Trust & Transparency Banner */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-slate-200 leading-relaxed">
            <strong className="text-amber-300 font-bold">Principe d'intégrité Mizen :</strong> Aucun résultat n'est garanti. Mizen évalue la compatibilité technique selon les barèmes officiels vérifiés de chaque institution.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <TrustBadge type="verified_fact" language={language} subtle />
          <TrustBadge type="calculated" language={language} subtle />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterLevel('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterLevel === 'all'
              ? 'bg-blue-700 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {language === 'ar' ? 'جميع العروض' : 'Toutes les options'} ({results.length})
        </button>

        <button
          onClick={() => setFilterLevel('high')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterLevel === 'high'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {language === 'ar' ? 'توافق قوي' : 'Adéquation forte'} ({results.filter(r => r.reasons.eligibilityLevel === 'high').length})
        </button>

        <button
          onClick={() => setFilterLevel('moderate')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterLevel === 'moderate'
              ? 'bg-amber-700 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {language === 'ar' ? 'توافق مع شروط للتحقق' : 'Points à clarifier'} ({results.filter(r => r.reasons.eligibilityLevel === 'moderate').length})
        </button>
      </div>

      {/* Program Cards List */}
      <div className="space-y-4">
        {filteredResults.map((item) => {
          const { program, provider, reasons, costEstimate } = item;
          const isCompared = comparedProgramIds.includes(program.id);
          const isExpanded = Boolean(expandedCards[program.id]);

          return (
            <div
              key={program.id}
              id={`result-card-${program.id}`}
              className={`rounded-2xl border transition-all duration-200 bg-white overflow-hidden ${
                reasons.eligibilityLevel === 'high'
                  ? 'border-slate-300/90 shadow-xs hover:border-blue-400'
                  : 'border-slate-200 shadow-2xs'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                        {provider.acronym}
                      </span>
                      <VerificationBadge verification={program.verification} language={language} />
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                        onClick={() => onSelectProgram(program.id)}>
                      {program.name[language]}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {program.tagline[language]}
                    </p>
                  </div>

                  {/* Eligibility Level Badge */}
                  <div className="shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      reasons.eligibilityLevel === 'high'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : reasons.eligibilityLevel === 'moderate'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {reasons.eligibilityLevel === 'high' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>
                        {reasons.eligibilityLevel === 'high'
                          ? t.eligibilityLevelHigh
                          : reasons.eligibilityLevel === 'moderate'
                          ? t.eligibilityLevelModerate
                          : t.eligibilityLevelBlocker}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Key Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-slate-700 block font-medium">Plafond d'intervention</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {program.minAmount.toLocaleString('fr-FR')} - {program.maxAmount.toLocaleString('fr-FR')} DT
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-700 block font-medium">Taux / Formule</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {program.rateDescription[language]}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-700 block font-medium">Durée & Franchise</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {Math.round(program.durationMonthsMax / 12)} ans ({program.gracePeriodMonthsMin}m différé)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-700 block font-medium">Apport requis</span>
                    <span className="font-bold text-slate-900 text-sm">
                      Min. {program.minContributionPercent}%
                    </span>
                  </div>
                </div>

                {/* Explanations Grid: MATCHED BECAUSE / POTENTIAL ISSUES / NEEDS VERIFICATION */}
                <div className="space-y-3 pt-2">
                  {/* Matched Because */}
                  {reasons.matchedBecause.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{t.matchedBecauseTitle}</span>
                      </div>
                      <ul className="space-y-1 pl-5 rtl:pr-5 text-xs text-slate-700">
                        {reasons.matchedBecause.map((r, i) => (
                          <li key={i} className="list-disc">
                            {r[language]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Potential Issues */}
                  {reasons.potentialIssues.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>{t.potentialIssuesTitle}</span>
                      </div>
                      <ul className="space-y-1 pl-5 rtl:pr-5 text-xs text-amber-900">
                        {reasons.potentialIssues.map((r, i) => (
                          <li key={i} className="list-disc">
                            {r[language]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Needs Verification */}
                  {reasons.needsVerification.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-1.5">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                        <span>{t.needsVerificationTitle}</span>
                      </div>
                      <ul className="space-y-1 pl-5 rtl:pr-5 text-xs text-slate-600">
                        {reasons.needsVerification.map((r, i) => (
                          <li key={i} className="list-disc">
                            {r[language]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Financial Calculation Simulation Box */}
                {costEstimate && (
                  <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/80 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/70">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Calculator className="w-4 h-4 text-blue-700" />
                        <span>{t.estMonthlyPayment} :</span>
                        {costEstimate.canCalculateReliably && costEstimate.monthlyPayment ? (
                          <span className="text-blue-900 text-sm font-extrabold">
                            ~{costEstimate.monthlyPayment.toLocaleString('fr-FR')} DT/mois
                          </span>
                        ) : costEstimate.monthlyPayment ? (
                          <span className="text-slate-800 text-sm font-bold">
                            ~{costEstimate.monthlyPayment.toLocaleString('fr-FR')} DT/mois
                            <span className="text-amber-800 text-[11px] font-normal ml-1">
                              ({language === 'ar' ? 'تقديري مشروط' : 'indicatif'})
                            </span>
                          </span>
                        ) : (
                          <span className="text-amber-800 font-semibold">
                            {t.cannotCalculateReliably}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {costEstimate.rateOriginLabel && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                            {costEstimate.rateOriginLabel[language]}
                          </span>
                        )}
                        <TrustBadge type="calculated" language={language} subtle />
                      </div>
                    </div>

                    {costEstimate.rateBenchmarkSource && (
                      <div className="text-[11px] text-slate-500 mb-1.5 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">
                          {language === 'ar' ? 'المرجع المعتمد :' : 'Référence de calcul :'}
                        </span>
                        <span>{costEstimate.rateBenchmarkSource}</span>
                        {costEstimate.rateBenchmarkDate && (
                          <span className="text-slate-400">({costEstimate.rateBenchmarkDate})</span>
                        )}
                      </div>
                    )}

                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {costEstimate.calculationExplanation[language]}
                    </p>

                    {costEstimate.unreliableReason && (
                      <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{costEstimate.unreliableReason[language]}</span>
                      </div>
                    )}

                    {costEstimate.totalCostOfFinancing !== undefined && costEstimate.totalCostOfFinancing > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-600">
                        <span>
                          {language === 'ar' ? 'الكلفة الإجمالية التقديرية للتمويل :' : 'Coût global estimé du financement :'}
                        </span>
                        <span className="font-bold text-slate-800">
                          ~{costEstimate.totalCostOfFinancing.toLocaleString('fr-FR')} DT
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Mandatory Regulatory & Objectivity Disclaimer */}
                <div className="mt-4 py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {language === 'ar'
                      ? 'يقوم ميزان بتقييم الانسجام الفني مع المعايير العامة المنشورة. لا يمثل هذا التقييم موافقة مبدئية ولا ضماناً للتمويل ولا وعداً بالقبول من لجنة التمويل.'
                      : "Mizen évalue la cohérence technique avec les critères publics déclarés. Cette évaluation ne constitue ni un accord de principe, ni une garantie de financement, ni une promesse d'acceptation par le comité du financeur."}
                  </span>
                </div>

                {/* Action Toolbar */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-detail-${program.id}`}
                      onClick={() => onSelectProgram(program.id)}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>{t.viewDetailBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>

                    <button
                      id={`btn-compare-${program.id}`}
                      onClick={() => onToggleCompare(program.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                        isCompared
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isCompared ? t.removeFromCompare : t.addToCompare}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDossier(program.id)}
                      className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.prepareDossierBtn}</span>
                    </button>

                    {program.verification.sourceUrl && (
                      <a
                        href={program.verification.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-medium transition-colors"
                        title={program.verification.sourceTitle}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
