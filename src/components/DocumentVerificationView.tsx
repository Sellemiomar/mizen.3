import React, { useState } from 'react';
import { 
  FileSearch, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  HelpCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ApplicantProfile, Language } from '../types/financing';
import { TRANSLATIONS } from '../i18n/translations';
import { TrustBadge } from './TrustBadge';

interface DocumentVerificationViewProps {
  applicantProfile: ApplicantProfile;
  language: Language;
}

export const DocumentVerificationView: React.FC<DocumentVerificationViewProps> = ({
  applicantProfile,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [docText, setDocText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    identifiedFields?: { key: string; label: string; extractedValue: string; status: string; comment?: string }[];
    contradictions?: string[];
    missingMandatoryDocs?: string[];
    recommendations?: string[];
  } | null>(null);

  const samples = [
    {
      label: 'Exemple 1: Devis Matériel Industriel (Sousse)',
      text: `FACTURE PRO-FORMA N° 2026/048
Société d'Équipements Industriels du Sahel (SEIS) - Z.I Sidi Abdelhamid, Sousse
Client: Atelier Confection El Amen - SUARL en cours de constitution
Objet: 2 Machines à coudre industrielles automatisées + 1 Table de coupe
Montant Total Hors Taxes: 74 000,000 DT
TVA 19%: 14 060,000 DT
Montant Total TTC: 88 060,000 DT
Validité de l'offre: 90 jours à compter du 15 Janvier 2026.
Modalités de paiement: 30% à la commande, solde par crédit bancaire BFPME / BTS.`
    },
    {
      label: 'Exemple 2: Extrait RNE & Contradiction Âge',
      text: `RÉPUBLIQUE TUNISIENNE - REGISTRE NATIONAL DES ENTREPRISES (RNE)
Identifiant Unique: 1849204/K
Dénomination Sociale: STE AGRI-BIO DU CENTRE
Forme Juridique: SARL
Date d'immatriculation au RNE: 14 Mars 2020 (Ancienneté: 6 ans)
Activité Principale: Huilerie moderne et conditionnement d'huile d'olive
Gouvernorat: Sidi Bouzid
Capital Social: 20 000 DT
Chiffre d'affaires déclaré N-1: 180 000 DT.`
    },
    {
      label: 'Exemple 3: Pitch Startup Act & R&D',
      text: `Projet SynapseTech Tunisia
Secteur: HealthTech & Intelligence Artificielle appliquée à l'imagerie médicale
Stade: Prototype validé (TRL 5), demande de Label Startup Act déposée auprès de Smart Capital en Novembre 2025.
Besoin de financement: 120 000 DT (Bourses fondateurs 12 mois + développement plateforme cloud).
Apport personnel réuni: 15 000 DT par les deux ingénieurs diplômés de l'ENIT.`
    }
  ];

  const handleAnalyze = async () => {
    if (!docText.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/gemini/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: docText,
          applicantProfile,
          language
        })
      });

      const data = await res.json();
      if (data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error('Error analyzing document:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-950 text-xs font-bold uppercase tracking-wider">
            {language === 'ar' ? 'فحص الوثائق والتناقضات' : 'Contrôle de conformité documentaire'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          {language === 'ar' ? 'فحص الوثائق وكشف التناقضات' : 'Vérification documentaire & Détection de contradictions'}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          {language === 'ar'
            ? 'ألصق مقتطفاً من دراسة الجدوى أو الفاتورة التقديرية أو السجل التجاري لفحص تطابقها مع معطياتك قبل الذهاب للبنك.'
            : 'Collez le texte d’un devis pro-forma, d’un extrait RNE ou du résumé de votre plan d’affaires pour détecter toute incohérence avec votre profil avant le dépôt bancaire.'}
        </p>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {language === 'ar' ? 'محتوى الوثيقة أو الفاتورة :' : 'Texte du document ou devis à analyser :'}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {samples.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDocText(s.text)}
                className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {s.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        <textarea
          id="textarea-doc-verify"
          value={docText}
          onChange={(e) => setDocText(e.target.value)}
          rows={6}
          placeholder="Collez ici le texte de votre facture pro-forma, extrait RNE, ou description de projet..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs sm:text-sm font-mono text-slate-800 outline-hidden resize-y"
        />

        <div className="flex items-center justify-between">
          <TrustBadge type="ai_interpretation" language={language} subtle />
          <button
            id="btn-analyze-document"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !docText.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'ar' ? 'جارٍ الفحص...' : 'Analyse en cours...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'ar' ? 'بدء فحص الوثيقة' : 'Analyser avec Mizen Gemini'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Contradictions Banner */}
          {analysisResult.contradictions && analysisResult.contradictions.length > 0 ? (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
              <h2 className="font-bold text-rose-950 flex items-center gap-2 text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{analysisResult.contradictions.length} contradiction(s) ou incohérence(s) détectée(s) :</span>
              </h2>
              <ul className="space-y-1.5 pl-6 rtl:pr-6 text-rose-900">
                {analysisResult.contradictions.map((c, i) => (
                  <li key={i} className="list-disc leading-relaxed">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">
                Aucune contradiction bloquante relevée entre le document et votre profil déclaré ({applicantProfile.purpose}, {applicantProfile.financingRequested} DT).
              </span>
            </div>
          )}

          {/* Extracted Fields Table */}
          {analysisResult.identifiedFields && analysisResult.identifiedFields.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
                Données chiffrées identifiées dans la pièce
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {analysisResult.identifiedFields.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-2">
                    <div>
                      <span className="text-slate-500 font-medium block">{f.label}</span>
                      <span className="text-slate-900 font-bold mt-0.5 block">{f.extractedValue}</span>
                      {f.comment && <span className="text-[11px] text-slate-500 mt-1 block">{f.comment}</span>}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.status === 'matches_profile'
                        ? 'bg-emerald-100 text-emerald-800'
                        : f.status === 'contradiction'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {f.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Documents & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {analysisResult.missingMandatoryDocs && analysisResult.missingMandatoryDocs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Pièces indispensables à joindre à ce devis</span>
                </h3>
                <ul className="space-y-1.5 text-slate-600">
                  {analysisResult.missingMandatoryDocs.map((doc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Recommandations pour consolider votre dossier</span>
                </h3>
                <ul className="space-y-1.5 text-slate-600">
                  {analysisResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
