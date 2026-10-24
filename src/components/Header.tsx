import React from 'react';
import { PlusCircle } from 'lucide-react';

export type NavTab = 'carto' | 'vision' | 'incidents' | 'municipal' | 'analytics';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenReportModal: () => void;
  activeIncidentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  activeIncidentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            CitySense <span className="text-emerald-400">DZ</span>
          </span>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            / Ville Intelligente
          </span>
        </div>

        {/* Zone 2: 5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('carto')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'carto'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Supervision Carto
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'vision'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Vision IA & Caméras
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'incidents'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span>Incidents & Alertes</span>
            {activeIncidentCount > 0 && (
              <span className="text-xs font-mono text-amber-400">
                ({activeIncidentCount})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('municipal')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'municipal'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Aide Décisionnelle APC
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeTab === 'analytics'
                ? 'text-emerald-400 border-emerald-400 font-semibold'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Data Science & KPIs
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap shadow-sm shadow-emerald-500/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Signaler Incident</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-slate-900 border-t border-slate-800 gap-4 text-xs font-medium">
        <button
          onClick={() => setActiveTab('carto')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'carto' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Cartographie
        </button>
        <button
          onClick={() => setActiveTab('vision')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'vision' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Vision IA
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'incidents' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Incidents ({activeIncidentCount})
        </button>
        <button
          onClick={() => setActiveTab('municipal')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'municipal' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Aide APC
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`whitespace-nowrap shrink-0 py-1 ${activeTab === 'analytics' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          Data Science
        </button>
      </div>
    </header>
  );
};
