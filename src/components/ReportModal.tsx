import React, { useState } from 'react';
import { IncidentAlert, IncidentCategory, IncidentSeverity, WilayaCode } from '../types';
import { WILAYAS } from '../data/mockData';
import { X, AlertTriangle, MapPin, Send, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncident: (incident: IncidentAlert) => void;
  defaultWilaya: WilayaCode;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onAddIncident,
  defaultWilaya,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Accident corporel / matériel');
  const [severity, setSeverity] = useState<IncidentSeverity>('Majeur');
  const [wilayaCode, setWilayaCode] = useState<WilayaCode>(defaultWilaya);
  const [commune, setCommune] = useState('');
  const [location, setLocation] = useState('');
  const [lanesBlocked, setLanesBlocked] = useState<number>(1);
  const [totalLanes, setTotalLanes] = useState<number>(3);
  const [recommendedAction, setRecommendedAction] = useState('');

  if (!isOpen) return null;

  const currentWilaya = WILAYAS.find(w => w.code === wilayaCode) || WILAYAS[0];
  const activeCommune = commune || currentWilaya.communes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newIncident: IncidentAlert = {
      id: `inc-manual-${Date.now()}`,
      title: title || `${category} — ${location || activeCommune}`,
      category,
      severity,
      status: 'Détecté',
      wilayaCode,
      commune: activeCommune,
      location: location || `Axe principal ${activeCommune}`,
      coordinates: currentWilaya.center,
      detectedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      source: 'Signalement Citoyen',
      estimatedClearanceMinutes: severity === 'Critique' ? 60 : severity === 'Majeur' ? 40 : 20,
      impactScore: severity === 'Critique' ? 85 : severity === 'Majeur' ? 60 : 35,
      assignedTeam: 'Services Techniques APC / DGSN en cours d\'affectation',
      recommendedAction: recommendedAction || 'Dépêcher une patrouille de vérification et sécuriser le périmètre.',
      lanesBlocked,
      totalLanes,
    };

    onAddIncident(newIncident);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Signaler un Incident ou une Anomalie de Voirie</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Catégorie de l'incident / anomalie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IncidentCategory)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Accident corporel / matériel">Accident corporel / matériel</option>
              <option value="Goulot d'étranglement / Embouteillage">Goulot d'étranglement / Embouteillage</option>
              <option value="Nid-de-poule / Chaussée dégradée">Nid-de-poule / Chaussée dégradée</option>
              <option value="Panne feux de signalisation">Panne feux de signalisation</option>
              <option value="Véhicule en panne">Véhicule en panne</option>
              <option value="Inondation / Accumulation pluviale">Inondation / Accumulation pluviale</option>
              <option value="Obstacle / Débris sur voie">Obstacle / Débris sur voie</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Wilaya</label>
              <select
                value={wilayaCode}
                onChange={(e) => {
                  setWilayaCode(e.target.value as WilayaCode);
                  setCommune('');
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
              >
                {WILAYAS.map(w => (
                  <option key={w.code} value={w.code}>
                    {w.code} — {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Commune</label>
              <select
                value={activeCommune}
                onChange={(e) => setCommune(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
              >
                {currentWilaya.communes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Localisation précise (Axe, repère, point kilométrique)
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Rocade Sud km 12 face à la passerelle"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Niveau de Sévérité</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
              >
                <option value="Modéré">Modéré (Ralentissement léger)</option>
                <option value="Majeur">Majeur (File dense & risque)</option>
                <option value="Critique">Critique (Blocage total / Urgence)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Voies neutralisées</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={lanesBlocked}
                  onChange={(e) => setLanesBlocked(parseInt(e.target.value, 10))}
                  className="w-16 bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-center font-mono"
                />
                <span className="text-slate-400">sur 3 voies</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Consigne opérationnelle recommandée (optionnel)
            </label>
            <textarea
              rows={2}
              value={recommendedAction}
              onChange={(e) => setRecommendedAction(e.target.value)}
              placeholder="Ex: Dépêcher brigade voirie pour balisage d'urgence."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmettre au PC Régulation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
