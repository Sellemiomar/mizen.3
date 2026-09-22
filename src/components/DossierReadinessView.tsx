import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  HelpCircle, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Download, 
  Printer, 
  Loader2, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { ApplicantProfile, FinancingProgram, Provider, Language } from '../types/financing';
import { TRANSLATIONS } from '../i18n/translations';
import { TrustBadge } from './TrustBadge';

interface DossierReadinessViewProps {
  applicantProfile: ApplicantProfile;
  selectedProgram?: FinancingProgram;
  provider?: Provider;
  allPrograms: FinancingProgram[];
  language: Language;
}

export const DossierReadinessView: React.FC<DossierReadinessViewProps> = ({
  applicantProfile,
  selectedProgram,
  provider,
  allPrograms,
  language
}) => {
  const t = TRANSLATIONS[language];

  // Documentation checklist begins empty without fabricated defaults: user marks what is ready
  const [completedDocs, setCompletedDocs] = useState<Record<string, boolean>>({});

  const [currentProgramId, setCurrentProgramId] = useState<string>(
    selectedProgram?.id || (allPrograms.length > 0 ? allPrograms[0].id : '')
  );

  const [aiAdvice, setAiAdvice] = useState<{ checklist?: string[]; questionsForOfficer?: string[] } | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  const toggleDoc = (id: string) => {
    setCompletedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeProgram = allPrograms.find(p => p.id === currentProgramId) || selectedProgram || allPrograms[0];

  const standardChecklist = [
    {
      id: 'doc-cin',
      title: { fr: 'Copie de la Carte d’Identité Nationale (CIN)', ar: 'نسخة من بطاقة التعريف الوطنية للمروجين' },
      desc: { fr: 'Pour le gérant et tous les associés détenant plus de 10% du capital.', ar: 'للوكيل ولكافة الشركاء الذين يملكون أكثر من 10% من رأس المال.' },
      mandatory: true
    },
    {
      id: 'doc-rne',
      title: { fr: 'Extrait récent du Registre National des Entreprises (RNE)', ar: 'مضمون حديث من السجل الوطني للمؤسسات (RNE)' },
      desc: { fr: 'Datant de moins de 3 mois avec mention du statut juridique à jour.', ar: 'لم يمض على استخراجه أكثر من 3 أشهر ومطابق للوضعية الجبائية.' },
      mandatory: true
    },
    {
      id: 'doc-plan',
      title: { fr: 'Étude technico-économique & Plan d’affaires chiffré', ar: 'دراسة جدوى فنية واقتصادية ومخطط أعمال' },
      desc: { fr: 'Comprenant compte de résultat prévisionnel sur 3 ans et plan de trésorerie mensuel.', ar: 'تتضمن جدول حسابات النتائج التقديري لـ 3 سنوات ومخطط السيولة.' },
      mandatory: true
    },
    {
      id: 'doc-devis',
      title: { fr: 'Factures pro-forma & Devis récents signés', ar: 'فواتير تقديرية (Pro-forma) حديثة ومختومة' },
      desc: { fr: 'Validité minimale de 60 jours, indispensables pour le déblocage des fonds d’équipement.', ar: 'صالحة لمدة لا تقل عن 60 يوماً ومحددة لشراء التجهيزات والمعدات.' },
      mandatory: true
    },
    {
      id: 'doc-bail',
      title: { fr: 'Contrat de bail enregistré ou titre de propriété du local', ar: 'عقد تسويغ مسجل بالقباضة أو شهادة ملكية للمقر' },
      desc: { fr: 'Indispensable pour justifier de l’implantation territoriale et du siège.', ar: 'ضروري لإثبات المقر والانتصاب الجغرافي للمشروع.' },
      mandatory: true
    },
    {
      id: 'doc-diplome',
      title: { fr: 'Diplôme d’enseignement supérieur ou attestation d’aptitude', ar: 'شهادة التعليم العالي أو شهادة كفاءة مهنية' },
      desc: { fr: 'Obligatoire pour les crédits BTS plafonnés à 150 kDT et aides ANETI.', ar: 'إلزامية لقروض بنك التضامن حتى 150 ألف د ومرافقة مكاتب التشغيل.' },
      mandatory: applicantProfile.hasHigherEducationDegree
    },
    {
      id: 'doc-cnss',
      title: { fr: 'Attestation de situation régulière CNSS / Quittance fiscale', ar: 'شهادة إبراء ذمة من الصندوق الوطني للضمان الاجتماعي (CNSS)' },
      desc: { fr: 'Exigé pour les entreprises existantes ou en cas d’exercice antérieur.', ar: 'مطلوبة للمؤسسات القائمة أو من كان له نشاط مهني سابق.' },
      mandatory: applicantProfile.businessStage !== 'idea_project'
    }
  ];

  const totalMandatory = standardChecklist.filter(d => d.mandatory).length;
  const completedMandatory = standardChecklist.filter(d => d.mandatory && completedDocs[d.id]).length;
  const readinessPercent = Math.round((completedMandatory / totalMandatory) * 100);

  const fetchAiAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
      const res = await fetch('/api/gemini/dossier-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantProfile,
          selectedPrograms: [activeProgram.name[language]],
          language
        })
      });
      const data = await res.json();
      if (data.advice) {
        setAiAdvice(data.advice);
      }
    } catch (err) {
      console.error('Error fetching advice:', err);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              {language === 'ar' ? 'جاهزية الملف' : 'Accompagnement Mizen'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <label htmlFor="dossier-program-select" className="text-slate-500 font-medium">
                {language === 'ar' ? 'البرنامج المستهدف :' : 'Dispositif ciblé :'}
              </label>
              <select
                id="dossier-program-select"
                value={currentProgramId}
                onChange={(e) => setCurrentProgramId(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              >
                {allPrograms.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
            {t.readinessTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t.readinessSub}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'طباعة القائمة' : 'Imprimer la check-list'}</span>
          </button>
        </div>
      </div>

      {/* Readiness Metric Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl ${
            readinessPercent >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {readinessPercent}%
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.readinessScoreLabel}
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              {completedMandatory} sur {totalMandatory} pièces obligatoires prêtes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {readinessPercent >= 75
                ? 'Votre dossier présente une maturité solide pour un premier rendez-vous en agence.'
                : 'Complétez les documents manquants (notamment factures pro-forma) pour éviter tout rejet initial.'}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-emerald-600 h-2.5 transition-all duration-300"
            style={{ width: `${readinessPercent}%` }}
          />
        </div>
      </div>

      {/* Documentation Checklist */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-700" />
            <span>{t.docChecklistTitle}</span>
          </h2>
          <TrustBadge type="verified_fact" language={language} subtle />
        </div>

        <div className="space-y-3">
          {standardChecklist.map((item) => {
            const isDone = Boolean(completedDocs[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => toggleDoc(item.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isDone
                    ? 'bg-slate-50 border-slate-200 text-slate-900'
                    : 'bg-white border-slate-200/80 hover:border-blue-300'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {item.title[language]}
                    </span>
                    {item.mandatory && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 mt-1 leading-relaxed">
                    {item.desc[language]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bank Interview Strategy & Questions to Ask */}
      <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <h2 className="text-base font-bold text-indigo-950 font-display">
                {t.interviewQuestionsTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Questions concrètes à poser au banquier pour négocier sereinement la marge et les garanties.
            </p>
          </div>

          <TrustBadge type="ai_interpretation" language={language} subtle />
        </div>

        {aiAdvice ? (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-2">
              <span className="font-bold text-indigo-900 block uppercase tracking-wider text-[11px]">
                Questions clés à poser au chargé d'affaires :
              </span>
              <ul className="space-y-2">
                {aiAdvice.questionsForOfficer?.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-800">
                    <span className="font-bold text-indigo-600">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {aiAdvice.checklist && aiAdvice.checklist.length > 0 && (
              <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-900 block uppercase tracking-wider text-[11px]">
                  Points d'attention spécifiques à votre secteur ({applicantProfile.sector}) :
                </span>
                <ul className="space-y-1.5 text-slate-700">
                  {aiAdvice.checklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/80 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Générez les questions stratégiques adaptées à votre profil ({applicantProfile.purpose}, {applicantProfile.location}) via le moteur Gemini de Mizen.
            </div>
            <button
              onClick={fetchAiAdvice}
              disabled={isLoadingAdvice}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              {isLoadingAdvice ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Générer mes questions d'entretien</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Official Institutional Contacts */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs">
        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-600" />
          <span>Réseau territorial & Guichets uniques en Tunisie</span>
        </h3>
        <p className="text-slate-600 leading-relaxed mb-3">
          Vous pouvez déposer ou faire viser votre dossier auprès des directions régionales de l'APII (Agence de Promotion de l'Industrie et de l'Innovation), des espaces Entreprendre de l'ANETI, ou directement aux agences régionales BFPME et BTS.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://www.tunisieindustrie.nat.tn"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1"
          >
            <span>Portail APII Tunisie Industrie</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="https://www.aneti.nat.tn"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1"
          >
            <span>Espaces Entreprendre ANETI</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
