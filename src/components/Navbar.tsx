import React from 'react';
import { Scale, Compass, CheckSquare, FileText, BarChart3, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types/financing';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentTab: 'home' | 'questionnaire' | 'results' | 'explore' | 'compare' | 'dossier' | 'docscan';
  setCurrentTab: (tab: 'home' | 'questionnaire' | 'results' | 'explore' | 'compare' | 'dossier' | 'docscan') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  compareCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  compareCount
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            id="brand-logo-btn"
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 text-amber-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Scale className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">Mizen</span>
                <span className="text-sm font-bold text-amber-700 font-['Cairo']">ميزان</span>
              </div>
              <span className="text-[11px] text-slate-700 hidden sm:inline-block leading-tight">
                {t.appTagline}
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-tab-home"
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t.navHome}
            </button>

            <button
              id="nav-tab-explore"
              onClick={() => setCurrentTab('explore')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'explore'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-slate-500" />
                {t.navExplore}
              </span>
            </button>

            <button
              id="nav-tab-compare"
              onClick={() => setCurrentTab('compare')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                currentTab === 'compare'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                {t.navCompare}
                {compareCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-blue-600 text-white font-bold">
                    {compareCount}
                  </span>
                )}
              </span>
            </button>

            <button
              id="nav-tab-dossier"
              onClick={() => setCurrentTab('dossier')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'dossier'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-slate-500" />
                {t.navDossier}
              </span>
            </button>

            <button
              id="nav-tab-docscan"
              onClick={() => setCurrentTab('docscan')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'docscan'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                {t.navDocScan}
              </span>
            </button>
          </nav>

          {/* Right Action: Language toggle & CTA */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
              <button
                id="btn-lang-fr"
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'fr'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                FR
              </button>
              <button
                id="btn-lang-ar"
                type="button"
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors font-['Cairo'] ${
                  language === 'ar'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                العربية
              </button>
            </div>

            {/* Quick Diagnostic CTA */}
            <button
              id="header-cta-start"
              onClick={() => setCurrentTab('questionnaire')}
              className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ar' ? 'تشخيص التمويل' : 'Faire le diagnostic'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-100 gap-1 scrollbar-none">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 ${
              currentTab === 'home' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {t.navHome}
          </button>
          <button
            onClick={() => setCurrentTab('explore')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 ${
              currentTab === 'explore' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {t.navExplore}
          </button>
          <button
            onClick={() => setCurrentTab('compare')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 ${
              currentTab === 'compare' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {t.navCompare} {compareCount > 0 ? `(${compareCount})` : ''}
          </button>
          <button
            onClick={() => setCurrentTab('dossier')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 ${
              currentTab === 'dossier' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {t.navDossier}
          </button>
          <button
            onClick={() => setCurrentTab('docscan')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium shrink-0 ${
              currentTab === 'docscan' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-slate-50'
            }`}
          >
            {t.navDocScan}
          </button>
        </div>
      </div>
    </header>
  );
};
