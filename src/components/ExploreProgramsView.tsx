import React, { useState } from 'react';
import { Search, Filter, ArrowRight, BarChart3, ExternalLink } from 'lucide-react';
import { FinancingProgram, Provider, Language } from '../types/financing';
import { TRANSLATIONS } from '../i18n/translations';
import { VerificationBadge } from './VerificationBadge';

interface ExploreProgramsViewProps {
  programs: FinancingProgram[];
  providers: Map<string, Provider>;
  language: Language;
  onSelectProgram: (id: string) => void;
  onToggleCompare: (id: string) => void;
  comparedProgramIds: string[];
}

export const ExploreProgramsView: React.FC<ExploreProgramsViewProps> = ({
  programs,
  providers,
  language,
  onSelectProgram,
  onToggleCompare,
  comparedProgramIds
}) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  const categories = [
    { id: 'all', label: { fr: 'Toutes les catégories', ar: 'جميع الفئات' } },
    { id: 'sme_loan', label: { fr: 'Prêt bancaire PME', ar: 'قروض المؤسسات الصغرى والمتوسطة' } },
    { id: 'microfinance', label: { fr: 'Microcrédit', ar: 'التمويل الأصغر' } },
    { id: 'guarantee', label: { fr: 'Garantie publique', ar: 'الضمان العمومي' } },
    { id: 'grant_subsidy', label: { fr: 'Prime & Subvention', ar: 'المنح والدعم' } },
    { id: 'quasi_equity', label: { fr: 'Fonds propres & Quasi-fonds', ar: 'التمويل التشاركي وشبه الذاتي' } },
    { id: 'islamic_finance', label: { fr: 'Finance Islamique (Mourabaha)', ar: 'الصيرفة الإسلامية' } }
  ];

  const filteredPrograms = programs.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesProvider = selectedProvider === 'all' || p.providerId === selectedProvider;
    const matchesSearch = 
      p.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tagline.ar.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesProvider && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
          {language === 'ar' ? 'دليل آليات التمويل الموثقة في تونس' : 'Annuaire officiel des dispositifs de financement en Tunisie'}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          {language === 'ar'
            ? 'تصفح كافة البرامج الرسمية المعتمدة من البنوك وصناديق التنمية مع التدقيق المستمر في شروط الإسناد.'
            : 'Explorez l’ensemble des instruments publics et bancaires répertoriés avec traçabilité vers les sources officielles.'}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par mot-clé (ex: BTS, SOTUGAR, matériel, diplômé)..."
              className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white text-slate-800 outline-hidden"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label[language]}
              </option>
            ))}
          </select>

          {/* Provider Filter */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:bg-white text-slate-800 outline-hidden"
          >
            <option value="all">Tous les organismes</option>
            {Array.from(providers.values()).map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.acronym} - {prov.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrograms.map((program) => {
          const provider = providers.get(program.providerId);
          const isCompared = comparedProgramIds.includes(program.id);

          return (
            <div
              key={program.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-bold">
                    {provider?.acronym}
                  </span>
                  <VerificationBadge verification={program.verification} language={language} showSourceLink={false} />
                </div>

                <h3
                  onClick={() => onSelectProgram(program.id)}
                  className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {program.name[language]}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {program.tagline[language]}
                </p>

                <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Plafond :</span>
                    <span className="font-bold text-slate-900">
                      {program.minAmount.toLocaleString('fr-FR')} - {program.maxAmount.toLocaleString('fr-FR')} DT
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Taux / Formule :</span>
                    <span className="font-bold text-slate-900">
                      {program.rateDescription[language]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleCompare(program.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                    isCompared
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{isCompared ? t.removeFromCompare : t.addToCompare}</span>
                </button>

                <button
                  onClick={() => onSelectProgram(program.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>{t.viewDetailBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
