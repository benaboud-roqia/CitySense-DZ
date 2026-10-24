import React, { useState } from 'react';
import { WilayaCode, MunicipalPlan, IncidentAlert } from '../types';
import { WILAYAS } from '../data/mockData';
import { 
  Building2, 
  TrafficCone, 
  Sparkles, 
  Split, 
  Wrench, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Coins, 
  Download,
  Sliders,
  Radio,
  Timer
} from 'lucide-react';

interface MunicipalModuleProps {
  selectedWilaya: WilayaCode;
  onSelectWilaya: (code: WilayaCode) => void;
  incidents: IncidentAlert[];
}

export const MunicipalModule: React.FC<MunicipalModuleProps> = ({
  selectedWilaya,
  onSelectWilaya,
  incidents,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'signals' | 'detours' | 'road_audit' | 'ai_strategy'>('signals');
  const [selectedCommune, setSelectedCommune] = useState<string>('');
  const [greenWaveMode, setGreenWaveMode] = useState<'morning_peak' | 'evening_peak' | 'balanced' | 'night'>('morning_peak');
  const [signalCycleSeconds, setSignalCycleSeconds] = useState<number>(90);

  // Gemini Municipal AI Strategy states
  const [strategyType, setStrategyType] = useState<string>('signal_optimization');
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategyResult, setStrategyResult] = useState<MunicipalPlan | null>(null);

  const currentWilaya = WILAYAS.find(w => w.code === selectedWilaya) || WILAYAS[0];
  const activeCommune = selectedCommune || currentWilaya.communes[0];

  const handleGenerateAIStrategy = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/municipal/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyType,
          wilaya: currentWilaya.name,
          commune: activeCommune,
          trafficIndex: 72,
          currentIncidents: incidents.filter(i => i.wilayaCode === selectedWilaya && i.status !== 'Résolu'),
        }),
      });

      if (!res.ok) throw new Error('Erreur de requête');
      const data: MunicipalPlan = await res.json();
      setStrategyResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setStrategyResult({
        title: `Plan d'optimisation d'urgence — Commune de ${activeCommune}`,
        executiveSummary: `Recommandations stratégiques générées pour désengorger le réseau routier communal suite aux saturations constatées. Déploiement d'une onde verte et délestage préventif.`,
        actionPlan: [
          {
            step: 1,
            title: "Reconfiguration Onde Verte (Feux Connectés)",
            details: "Prolongation de la phase verte de 35s sur l'axe structurant vers la sortie de ville.",
            stakeholder: "APC",
            timeframe: "Immédiat (< 10 min)",
            estimatedCostDzd: 0
          },
          {
            step: 2,
            title: "Activation du plan de déviation RN10",
            details: "Balisage et guidage dynamique des flux de transit par la voie de contournement est.",
            stakeholder: "DGSN",
            timeframe: "20 minutes",
            estimatedCostDzd: 18000
          },
          {
            step: 3,
            title: "Colmatage d'urgence des nids-de-poule prioritaires",
            details: "Intervention rapide brigade voirie avec enrobé tiède sur 3 points critiques identifiés.",
            stakeholder: "DTP",
            timeframe: "48 heures",
            estimatedCostDzd: 95000
          }
        ],
        trafficImpactForecast: {
          congestionReductionPercent: 28,
          averageDelaySavedMinutes: 16,
          co2ReductionTonsPerDay: 5.4
        },
        citizenAdvisory: "Avis à la population: Travaux de réfection ciblés et régulation dynamique des feux en cours. Privilégiez les transports urbains.",
        kpisToMonitor: [
          "Temps de parcours moyen aux heures de pointe",
          "File d'attente résiduelle aux carrefours",
          "Taux de satisfaction des usagers des bus municipaux"
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Road audit sample items
  const roadAuditItems = [
    {
      id: 'audit-01',
      location: `Carrefour Central (${activeCommune})`,
      defect: 'Nid-de-poule profond (profondeur 8cm, diamètre 65cm)',
      severity: 'Critique',
      pciIndex: 32,
      estimatedDzd: 38000,
      status: 'À programmer d\'urgence',
      impact: 'Ralentissement de 40% sur la voie de droite',
    },
    {
      id: 'audit-02',
      location: `Axe Sortie Rocade Sud`,
      defect: 'Fissuration en peau de crocodile & orniérage',
      severity: 'Majeur',
      pciIndex: 48,
      estimatedDzd: 185000,
      status: 'Plan triennal DTP',
      impact: 'Dégradation du confort et bruit de roulement',
    },
    {
      id: 'audit-03',
      location: `Boulevard de l'Université`,
      defect: 'Avaloir pluvial partiellement obstrué',
      severity: 'Majeur',
      pciIndex: 54,
      estimatedDzd: 22000,
      status: 'Équipe APC mobilisée',
      impact: 'Risque de nappe d\'eau en cas d\'averse',
    },
    {
      id: 'audit-04',
      location: `Rond-point d'entrée Est`,
      defect: 'Signalisation verticale dégradée (panneau cédez le passage)',
      severity: 'Modéré',
      pciIndex: 72,
      estimatedDzd: 15000,
      status: 'Remplacement sous 7j',
      impact: 'Flou de priorité aux heures creuses',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Wilaya Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Aide à la Décision Municipale & Infrastructures (APC & DTP)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Optimisation des feux tricolores, plans de déviation d'urgence, audit prédictif de voirie et génération de notes techniques pour le P/APC.
          </p>
        </div>

        {/* Commune / Wilaya selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedWilaya}
              onChange={(e) => {
                onSelectWilaya(e.target.value as WilayaCode);
                setSelectedCommune('');
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {WILAYAS.map(w => (
                <option key={w.code} value={w.code} className="bg-slate-900">
                  Wilaya {w.code} ({w.name})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs">
            <select
              value={activeCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {currentWilaya.communes.map(c => (
                <option key={c} value={c} className="bg-slate-900">
                  Commune: {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSelectedSubTab('signals')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
            selectedSubTab === 'signals'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Régulation Feux "Onde Verte"</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('detours')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
            selectedSubTab === 'detours'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          <span>Plans de Déviation & PMV</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('road_audit')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
            selectedSubTab === 'road_audit'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Audit Voirie & Budget DTP</span>
        </button>

        <button
          onClick={() => setSelectedSubTab('ai_strategy')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-2 ${
            selectedSubTab === 'ai_strategy'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Assistant Stratégique P/APC (IA)</span>
        </button>
      </div>

      {/* SubTab 1: Traffic Signals Synchronization (Onde Verte) */}
      {selectedSubTab === 'signals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Paramétrage Onde Verte Dynamique</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Synchronisation des carrefours à feux pour minimiser les arrêts et les émissions polluantes.
                </p>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="text-xs text-slate-300 block mb-2 font-medium">Scénario de Trafic Urbain:</label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'morning_peak', label: 'Pointe Matin (07h-09h) — Entrée de ville', greenAdd: '+30s axe entrant' },
                    { id: 'evening_peak', label: 'Pointe Soir (16h30-19h) — Sortie vers rocade', greenAdd: '+35s axe sortant' },
                    { id: 'balanced', label: 'Régime Équilibré (Heures creuses)', greenAdd: 'Cycles normés 60s' },
                    { id: 'night', label: 'Mode Nuit (23h-06h) — Orange clignotant / Détection radar', greenAdd: 'À la demande' },
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setGreenWaveMode(m.id as any)}
                      className={`p-2.5 rounded border cursor-pointer transition-colors ${
                        greenWaveMode === m.id
                          ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-white">{m.label}</div>
                      <div className="text-[11px] text-emerald-400 font-mono mt-0.5">{m.greenAdd}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cycle length slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Durée totale du cycle</span>
                  <span className="font-mono font-bold text-emerald-400">{signalCycleSeconds} secondes</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="5"
                  value={signalCycleSeconds}
                  onChange={(e) => setSignalCycleSeconds(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 bg-slate-950"
                />
              </div>

              <button
                onClick={() => alert(`Synchronisation transmise aux contrôleurs de feux connectés de la commune de ${activeCommune}. Latence d'application: 4 secondes.`)}
                className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
              >
                Appliquer le Plan aux Feux Connectés
              </button>
            </div>

            {/* Intersections corridor simulation view (2 columns) */}
            <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Corridor Névralgique: Axe Principal {activeCommune}</h3>
                  <span className="text-xs text-slate-400">4 carrefours successifs équipés de contrôleurs NTCIP/IP</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Onde Verte Active
                </span>
              </div>

              {/* Graphical timing diagram */}
              <div className="space-y-4">
                {[
                  { name: 'Carrefour 01: Échangeur Rocade', dist: '0 m', green: 55, orange: 5, red: 30, vph: '2 100 véh/h' },
                  { name: 'Carrefour 02: Place Centrale / Mairie', dist: '+420 m (Décalage +18s)', green: 50, orange: 5, red: 35, vph: '1 650 véh/h' },
                  { name: 'Carrefour 03: Boulevard de l\'Université', dist: '+850 m (Décalage +36s)', green: 45, orange: 5, red: 40, vph: '1 400 véh/h' },
                  { name: 'Carrefour 04: Sortie Est vers Zone d\'Activité', dist: '+1 300 m (Décalage +54s)', green: 55, orange: 5, red: 30, vph: '1 850 véh/h' },
                ].map((c, idx) => (
                  <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{c.name}</span>
                        <span className="text-slate-400 font-mono ml-2">({c.dist})</span>
                      </div>
                      <span className="font-mono text-slate-400">{c.vph}</span>
                    </div>

                    {/* Progress bars representing Green / Orange / Red timing */}
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800 border border-slate-700">
                      <div style={{ width: `${c.green}%` }} className="bg-emerald-500 flex items-center justify-center text-[9px] font-mono text-slate-950 font-bold">
                        V: {c.green}%
                      </div>
                      <div style={{ width: `${c.orange}%` }} className="bg-amber-400 flex items-center justify-center text-[9px] font-mono text-slate-950 font-bold">
                        O
                      </div>
                      <div style={{ width: `${c.red}%` }} className="bg-red-500 flex items-center justify-center text-[9px] font-mono text-white font-bold">
                        R: {c.red}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Vitesse d'onde verte recommandée pour traversée fluide sans arrêt:</span>
                <strong className="text-emerald-400 font-mono text-sm">45 km/h</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Detours & VMS (Panneaux à Messages Variables) */}
      {selectedSubTab === 'detours' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Detour Plans */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Scénarios de Déviation Pré-établis</h3>
              <p className="text-xs text-slate-400">
                Itinéraires de délestage automatique en cas d'accident sur l'artère principale ou travaux de voirie.
              </p>

              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Déviation A: Rocade Sud → Rocade Nord</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Activée
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Dérivation des véhicules légers via l'échangeur des Bananiers vers la corniche pour contourner le carambolage.
                  </p>
                  <div className="text-[11px] font-mono text-slate-300 pt-1">
                    Capacité reportée: 1 400 véh/h · Temps additionnel estimé: +6 min
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Déviation B: RN10 Axe Université → Contournement Est</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      En veille
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Orientation des poids lourds vers la route de contournement pour protéger la chaussée urbaine face au campus d'Oum El Bouaghi.
                  </p>
                  <div className="text-[11px] font-mono text-slate-300 pt-1">
                    Capacité reportée: 800 véh/h · Temps additionnel: +4 min
                  </div>
                </div>
              </div>
            </div>

            {/* VMS Simulated Electronic Signs */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Panneaux à Messages Variables (PMV Connectés)</h3>
              <p className="text-xs text-slate-400">
                Affichage dynamique en temps réel pour orienter les conducteurs avant les carrefours clés.
              </p>

              {/* High-contrast simulated LED panel */}
              <div className="bg-black p-4 rounded-lg border-2 border-slate-700 shadow-inner space-y-2 text-center select-none">
                <div className="text-[11px] font-mono text-slate-500 uppercase">
                  [PMV-01 · Entrée Agglomération {activeCommune}]
                </div>
                <div className="text-amber-400 font-mono font-bold text-sm tracking-wide">
                  تنبيه: ازدحام عند المدخل الرئيسي
                </div>
                <div className="text-amber-300 font-mono font-bold text-xs tracking-wider">
                  ALERTE: EMBouteillage Rocade SUD
                </div>
                <div className="text-emerald-400 font-mono font-semibold text-xs pt-1">
                  PRENEZ LA DÉVIATION PAR L'EST → GAIN 14 MIN
                </div>
              </div>

              <div className="bg-black p-4 rounded-lg border-2 border-slate-700 shadow-inner space-y-2 text-center select-none">
                <div className="text-[11px] font-mono text-slate-500 uppercase">
                  [PMV-02 · Axe Universitaire]
                </div>
                <div className="text-amber-400 font-mono font-bold text-sm tracking-wide">
                  أشغال تهيئة الطريق — سرعة 40 كم/سا
                </div>
                <div className="text-amber-300 font-mono font-bold text-xs tracking-wider">
                  TRAVAUX VOIRIE — VITESSE LIMITÉE 40 KM/H
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Road Infrastructure Audit & DTP Budget */}
      {selectedSubTab === 'road_audit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Indice État Voirie (PCI)</span>
              <span className="text-3xl font-bold font-mono text-amber-400">68/100</span>
              <span className="text-[11px] text-slate-500 block mt-1">Niveau moyen communal</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Nids-de-poule cartographiés</span>
              <span className="text-3xl font-bold font-mono text-red-400">14</span>
              <span className="text-[11px] text-slate-500 block mt-1">Détectés par Vision IA & Citoyens</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Coût Réfection Estimé</span>
              <span className="text-2xl font-bold font-mono text-white">385 000 DZD</span>
              <span className="text-[11px] text-slate-500 block mt-1">Budget d'urgence requis</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">Économies Usure Véhicules</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">1.2M DZD/an</span>
              <span className="text-[11px] text-slate-500 block mt-1">Évitement de bris de suspension</span>
            </div>
          </div>

          {/* Table of road defects */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Registre Technique des Dégradations de Voirie</h3>
                <span className="text-xs text-slate-400">Priorisation algorithmique basée sur le débit de véhicules et la gravité</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Localisation</th>
                    <th className="p-3">Type d'Anomalie</th>
                    <th className="p-3">Sévérité</th>
                    <th className="p-3 text-right">Indice PCI</th>
                    <th className="p-3 text-right">Budget Estimé</th>
                    <th className="p-3">Statut DTP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {roadAuditItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-semibold text-white">{item.location}</td>
                      <td className="p-3">{item.defect}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                          item.severity === 'Critique' ? 'bg-red-950 text-red-400 border-red-800' :
                          item.severity === 'Majeur' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                          'bg-blue-950 text-blue-400 border-blue-800'
                        }`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-amber-400">{item.pciIndex}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">
                        {item.estimatedDzd.toLocaleString()} DZD
                      </td>
                      <td className="p-3">
                        <span className="text-slate-400">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 4: Strategic AI Decision Support (Gemini 3.8 Flash) */}
      {selectedSubTab === 'ai_strategy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Prompt Setup */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Générateur de Décision Municipale IA</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Alimenté par Gemini 3.8 Flash pour concevoir des notes de synthèse techniques pour le Maire / P-APC et les services de voirie.
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">Type d'arbitrage requis:</label>
                <select
                  value={strategyType}
                  onChange={(e) => setStrategyType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none"
                >
                  <option value="signal_optimization">Plan de régulation tricolore & Onde Verte d'urgence</option>
                  <option value="detour_plan">Stratégie de déviation d'urgence suite à incident majeur</option>
                  <option value="road_audit">Programme d'intervention et priorisation budgétaire voirie</option>
                  <option value="apc_briefing">Note de synthèse hebdomadaire pour le Conseil d'Administration APC</option>
                </select>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200 block">Périmètre d'analyse:</span>
                <div>Wilaya: <strong className="text-white">{currentWilaya.name}</strong></div>
                <div>Commune: <strong className="text-white">{activeCommune}</strong></div>
                <div>Indice d'engorgement actuel: <strong className="text-amber-400">72%</strong></div>
              </div>

              <button
                onClick={handleGenerateAIStrategy}
                disabled={isGenerating}
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calcul de la Stratégie IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Générer le Plan Décisionnel IA</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Generated Strategy Document (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              {strategyResult ? (
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 space-y-5">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                      Rapport d'Aide à la Décision Municipale — CitySense DZ
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1">{strategyResult.title}</h2>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                      {strategyResult.executiveSummary}
                    </p>
                  </div>

                  {/* Forecast impact counters */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                      <span className="text-[11px] text-slate-400 block">Désengorgement Attendu</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        -{strategyResult.trafficImpactForecast.congestionReductionPercent}%
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                      <span className="text-[11px] text-slate-400 block">Temps Moyen Gagné</span>
                      <span className="text-xl font-bold font-mono text-white">
                        {strategyResult.trafficImpactForecast.averageDelaySavedMinutes} min
                      </span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                      <span className="text-[11px] text-slate-400 block">CO2 Évité / Jour</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">
                        {strategyResult.trafficImpactForecast.co2ReductionTonsPerDay} t
                      </span>
                    </div>
                  </div>

                  {/* Step by step action plan */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                      Feuille de Route & Actions Concrètes
                    </h4>
                    <div className="space-y-2.5">
                      {strategyResult.actionPlan.map(action => (
                        <div key={action.step} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3 text-xs">
                          <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                            {action.step}
                          </span>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{action.title}</span>
                              <span className="text-[10px] font-mono text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                Entité: {action.stakeholder}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px]">{action.details}</p>
                            <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                              <span>Délai: <strong className="text-slate-300">{action.timeframe}</strong></span>
                              <span>Coût estimé: <strong className="text-slate-300">{action.estimatedCostDzd.toLocaleString()} DZD</strong></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Citizen advisory box */}
                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-slate-300 block">Communiqué Usagers & Médias Locaux:</span>
                    <p className="text-slate-400 text-[11px] italic">
                      "{strategyResult.citizenAdvisory}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center space-y-3">
                  <Building2 className="w-10 h-10 text-slate-700 mx-auto" />
                  <h3 className="text-sm font-semibold text-white">Prêt à Générer l'Analyse Stratégique</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Sélectionnez le type d'arbitrage souhaité et lancez le calcul pour obtenir un plan d'action communal certifié et chiffré en Dinars Algériens.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
