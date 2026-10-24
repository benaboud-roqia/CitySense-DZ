import React, { useState } from 'react';
import { IncidentAlert, IncidentSeverity, IncidentStatus, WilayaCode } from '../types';
import { WILAYAS } from '../data/mockData';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  CheckCircle, 
  PhoneCall, 
  Filter, 
  Search, 
  Truck, 
  Flame, 
  CheckCheck,
  ChevronRight,
  Send
} from 'lucide-react';

interface IncidentsModuleProps {
  incidents: IncidentAlert[];
  onUpdateIncidentStatus: (id: string, newStatus: IncidentStatus) => void;
  selectedWilaya: WilayaCode;
  onSelectWilaya: (code: WilayaCode) => void;
  onOpenReportModal: () => void;
}

export const IncidentsModule: React.FC<IncidentsModuleProps> = ({
  incidents,
  onUpdateIncidentStatus,
  selectedWilaya,
  onSelectWilaya,
  onOpenReportModal,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIncident, setSelectedIncident] = useState<IncidentAlert | null>(null);

  // Filter incidents
  const filtered = incidents.filter(inc => {
    if (selectedWilaya && inc.wilayaCode !== selectedWilaya) return false;
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (filterStatus === 'active' && inc.status === 'Résolu') return false;
    if (filterStatus === 'resolved' && inc.status !== 'Résolu') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return inc.title.toLowerCase().includes(q) || 
             inc.location.toLowerCase().includes(q) ||
             inc.commune.toLowerCase().includes(q) ||
             inc.category.toLowerCase().includes(q);
    }
    return true;
  });

  const criticalCount = incidents.filter(i => i.severity === 'Critique' && i.status !== 'Résolu').length;
  const majorCount = incidents.filter(i => i.severity === 'Majeur' && i.status !== 'Résolu').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & KPI summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span>Gestion des Incidents & Alertes de Circulation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Détection automatique par vision CCTV et télémesure des anomalies routières avec déclenchement d'intervention communale.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>Créer une Alerte Manuelle</span>
        </button>
      </div>

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">Incidents Actifs</span>
          <span className="text-2xl font-bold font-mono text-white tabular-nums">
            {incidents.filter(i => i.status !== 'Résolu').length}
          </span>
        </div>
        <div className="bg-slate-900 p-3.5 rounded-lg border border-red-900/40">
          <span className="text-xs text-red-400 block">Sévérité Critique</span>
          <span className="text-2xl font-bold font-mono text-red-400 tabular-nums">
            {criticalCount}
          </span>
        </div>
        <div className="bg-slate-900 p-3.5 rounded-lg border border-amber-900/40">
          <span className="text-xs text-amber-400 block">Impact Majeur</span>
          <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {majorCount}
          </span>
        </div>
        <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 block">Délai Moyen d'Intervention</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            11.4 min
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Wilaya Filter */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedWilaya}
              onChange={(e) => onSelectWilaya(e.target.value as WilayaCode)}
              className="bg-slate-950 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none"
            >
              {WILAYAS.map(w => (
                <option key={w.code} value={w.code}>
                  W.{w.code} — {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Severity filter buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterSeverity === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Toutes sévérités
            </button>
            <button
              onClick={() => setFilterSeverity('Critique')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterSeverity === 'Critique' ? 'bg-red-950 text-red-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critique
            </button>
            <button
              onClick={() => setFilterSeverity('Majeur')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterSeverity === 'Majeur' ? 'bg-amber-950 text-amber-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Majeur
            </button>
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterStatus === 'active' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterStatus === 'resolved' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Résolus
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px] w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher axe, commune, type..."
            className="w-full bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Main Incidents Table & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Table List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center space-y-3">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-semibold text-white">Aucun incident pour les filtres sélectionnés</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                La circulation sur les axes communaux est nominale ou les incidents ont été résolus.
              </p>
            </div>
          ) : (
            filtered.map(inc => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`bg-slate-900 rounded-lg p-4 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-400 bg-slate-900/90 ring-1 ring-emerald-400'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                          inc.severity === 'Critique' ? 'bg-red-950 text-red-400 border-red-800' :
                          inc.severity === 'Majeur' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                          'bg-blue-950 text-blue-400 border-blue-800'
                        }`}>
                          {inc.severity}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Détecté à {inc.detectedAt}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-xs text-slate-400">Source: {inc.source}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white pt-1">{inc.title}</h3>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{inc.location} ({inc.commune})</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono px-2 py-1 rounded ${
                        inc.status === 'Résolu' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        inc.status === 'Équipe dépêchée' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  {/* Impact and Lanes strip */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Impact Circulation</span>
                      <span className="font-bold text-amber-400">{inc.impactScore}/100</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Voies neutralisées</span>
                      <span className="font-bold text-white">{inc.lanesBlocked} / {inc.totalLanes}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Délai estimé</span>
                      <span className="font-bold text-slate-300">{inc.estimatedClearanceMinutes} min</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Incident Triage & Dispatch Action Panel */}
        <div className="space-y-4">
          {selectedIncident ? (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-4 sticky top-20">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-emerald-400 uppercase">
                  Détail & Gestion d'Intervention
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedIncident.location}</p>
              </div>

              {/* Status workflow updater */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">
                  Faire évoluer le statut opérationnel:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {(['Détecté', 'Équipe dépêchée', 'Sécurisation', 'Résolu'] as IncidentStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => onUpdateIncidentStatus(selectedIncident.id, st)}
                      className={`px-2 py-1.5 rounded text-left transition-colors border ${
                        selectedIncident.status === st
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-semibold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Municipal Action */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <span className="font-semibold text-amber-400 block">Consigne Opérationnelle:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {selectedIncident.recommendedAction}
                </p>
              </div>

              {/* Assigned Service Team */}
              <div className="text-xs space-y-1">
                <span className="text-slate-400 block text-[11px]">Équipe d'Intervention Assignée:</span>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-slate-200">
                  {selectedIncident.assignedTeam || 'En attente d\'affectation'}
                </div>
              </div>

              {/* Quick Emergency Dispatch Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400 block font-semibold">
                  Déclenchement d'urgence (Centrale APC):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      alert(`Alerte transmise à la Protection Civile (14) pour l'incident: ${selectedIncident.title}`);
                      onUpdateIncidentStatus(selectedIncident.id, 'Équipe dépêchée');
                    }}
                    className="p-2 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Protection Civile (14)</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`Alerte transmise aux services de la Sûreté Urbaine / DGSN (1548) pour régulation.`);
                      onUpdateIncidentStatus(selectedIncident.id, 'Équipe dépêchée');
                    }}
                    className="p-2 bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-800 rounded font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Police DGSN (1548)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-center text-xs text-slate-400 space-y-2">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Sélectionnez un incident dans la liste pour afficher la fiche de régulation et déployer les secours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
