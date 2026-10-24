import React, { useState } from 'react';
import { WilayaCode } from '../types';
import { HOURLY_TRAFFIC_DATA, MODAL_SPLIT, MUNICIPAL_INFRASTRUCTURE_METRICS, WILAYAS } from '../data/mockData';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Car, 
  Leaf, 
  Download, 
  Calendar, 
  Zap, 
  ArrowUpRight, 
  LineChart,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface AnalyticsModuleProps {
  selectedWilaya: WilayaCode;
  onSelectWilaya: (code: WilayaCode) => void;
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  selectedWilaya,
  onSelectWilaya,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'congestion' | 'flow' | 'speed'>('congestion');
  const [forecastHorizonHours, setForecastHorizonHours] = useState<number>(6);

  const currentWilaya = WILAYAS.find(w => w.code === selectedWilaya) || WILAYAS[0];

  // Predictive congestion forecast for the next 6 hours
  const predictiveForecast = [
    { time: '12:00', predictedIndex: 68, confidence: 96, state: 'Sortie administrative' },
    { time: '13:00', predictedIndex: 62, confidence: 94, state: 'Flux modéré' },
    { time: '14:00', predictedIndex: 48, confidence: 92, state: 'Creux d\'après-midi' },
    { time: '15:00', predictedIndex: 59, confidence: 91, state: 'Reprise progressive' },
    { time: '16:00', predictedIndex: 81, confidence: 89, state: 'Amorce pointe soir' },
    { time: '17:00', predictedIndex: 93, confidence: 88, state: 'Pic critique de congestion' },
    { time: '18:00', predictedIndex: 91, confidence: 86, state: 'Engorgement persistant' },
  ].slice(0, forecastHorizonHours + 1);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Heure,Débit (véh/h),Congestion (%),Vitesse Moy (km/h)\n"
      + HOURLY_TRAFFIC_DATA.map(e => `${e.hour},${e.flow},${e.congestion},${e.speed}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `citysense_dz_data_wilaya_${selectedWilaya}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Wilaya Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Data Science & Modélisation Prédictive de la Mobilité</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Indicateurs d'impact, analyse des séries temporelles et prévisions algorithmiques pour la Wilaya {selectedWilaya} ({currentWilaya.name}).
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exporter CSV des Données</span>
        </button>
      </div>

      {/* Top High-Level KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Indice de Fluidité Urbaine (IFU)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {MUNICIPAL_INFRASTRUCTURE_METRICS.averageCityFluidityIndex}/100
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">+4.2% vs semaine précédente</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>CO2 Évité (Optimisation Feux)</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {MUNICIPAL_INFRASTRUCTURE_METRICS.carbonSavedTonsPerMonth} tonnes/mois
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Équivalent 5 800 arbres plantés</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Capteurs & Boucles IoT</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {MUNICIPAL_INFRASTRUCTURE_METRICS.totalSensors}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">99.4% de disponibilité réseau</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Feux Connectés à l'Onde Verte</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {MUNICIPAL_INFRASTRUCTURE_METRICS.connectedTrafficLights}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Réseau communal intelligent</span>
        </div>
      </div>

      {/* Main Temporal Congestion Chart View */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LineChart className="w-4 h-4 text-emerald-400" />
              <span>Profil Journalier de Circulation (Cycle 24 Heures)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Moyenne glissante des flux mesurés sur l'ensemble des axes de la Wilaya
            </span>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedMetric('congestion')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedMetric === 'congestion' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Congestion (%)
            </button>
            <button
              onClick={() => setSelectedMetric('flow')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedMetric === 'flow' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Débit (véh/h)
            </button>
            <button
              onClick={() => setSelectedMetric('speed')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedMetric === 'speed' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vitesse (km/h)
            </button>
          </div>
        </div>

        {/* CSS/SVG Bar Chart with Hover Tooltips */}
        <div className="pt-4">
          <div className="h-56 flex items-end gap-1.5 sm:gap-2">
            {HOURLY_TRAFFIC_DATA.map((item, idx) => {
              let value = item.congestion;
              let maxValue = 100;
              let unit = '%';
              let barColor = 'bg-emerald-500';

              if (selectedMetric === 'flow') {
                value = item.flow;
                maxValue = 4500;
                unit = ' véh/h';
                barColor = 'bg-blue-500';
              } else if (selectedMetric === 'speed') {
                value = item.speed;
                maxValue = 90;
                unit = ' km/h';
                barColor = 'bg-purple-500';
              } else {
                if (value > 80) barColor = 'bg-red-500';
                else if (value > 55) barColor = 'bg-amber-500';
              }

              const heightPercent = Math.max(Math.round((value / maxValue) * 100), 5);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-mono px-2 py-1 rounded border border-slate-700 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {item.hour}: {value}{unit}
                  </div>

                  {/* The bar */}
                  <div className="w-full bg-slate-950 h-full flex items-end rounded-t overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full ${barColor} group-hover:brightness-125 transition-all rounded-t`}
                    />
                  </div>

                  {/* Hour label */}
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
                    {idx % 2 === 0 ? item.hour : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-3 border-t border-slate-800">
            <span>Pointe du matin: 07h30 - 09h00 (Entrée vers centres économiques)</span>
            <span>Pointe du soir: 16h30 - 18h45 (Sortie vers agglomérations)</span>
          </div>
        </div>
      </div>

      {/* Two columns: Modal Split & Predictive AI Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modal Split */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-400" />
            <span>Répartition Modale des Déplacements</span>
          </h3>
          <p className="text-xs text-slate-400">
            Comptage automatique par vision par ordinateur des différentes typologies de véhicules en circulation.
          </p>

          <div className="space-y-3 pt-2">
            {MODAL_SPLIT.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{item.mode}</span>
                  <span className="font-mono font-bold text-emerald-400">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 block text-right">
                  Volume estimé: {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive AI Forecasting Model */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Modèle Prédictif de Congestion (Prochaines 6h)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">IA LSTM / XGBoost</span>
          </div>

          <p className="text-xs text-slate-400">
            Prévision calculée à partir de la météo, de l'historique saisonnier et des conditions actuelles de trafic.
          </p>

          <div className="space-y-2 pt-2">
            {predictiveForecast.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-white w-12">{item.time}</span>
                  <span className="text-slate-300">{item.state}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold ${
                    item.predictedIndex > 80 ? 'text-red-400' :
                    item.predictedIndex > 55 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {item.predictedIndex}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Conf: {item.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Recommandation automatique envoyée à la commission de circulation pour anticiper la pointe de 17h00.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
