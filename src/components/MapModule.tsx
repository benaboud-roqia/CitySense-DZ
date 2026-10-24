import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RoadSegment, CCTVCamera, IncidentAlert, WilayaCode } from '../types';
import { WILAYAS } from '../data/mockData';
import { 
  Video, 
  AlertTriangle, 
  Layers, 
  MapPin, 
  Gauge, 
  Navigation, 
  Clock, 
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface MapModuleProps {
  selectedWilaya: WilayaCode;
  onSelectWilaya: (code: WilayaCode) => void;
  roadSegments: RoadSegment[];
  cameras: CCTVCamera[];
  incidents: IncidentAlert[];
  onSelectCamera: (camera: CCTVCamera) => void;
  onSelectIncident: (incident: IncidentAlert) => void;
}

export const MapModule: React.FC<MapModuleProps> = ({
  selectedWilaya,
  onSelectWilaya,
  roadSegments,
  cameras,
  incidents,
  onSelectCamera,
  onSelectIncident,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    cameras: true,
    incidents: true,
  });

  const [selectedRoad, setSelectedRoad] = useState<RoadSegment | null>(null);
  const currentWilayaInfo = WILAYAS.find(w => w.code === selectedWilaya) || WILAYAS[0];

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentWilayaInfo.center,
        zoom: currentWilayaInfo.zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // CartoDB Dark Matter tiles or OpenStreetMap with dark filter
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
        className: 'leaflet-dark-tiles',
      }).addTo(map);

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map stays mounted
    };
  }, []);

  // Update center when Wilaya changes
  useEffect(() => {
    if (mapInstanceRef.current && currentWilayaInfo) {
      mapInstanceRef.current.setView(currentWilayaInfo.center, currentWilayaInfo.zoom, {
        animate: true,
      });
    }
  }, [selectedWilaya]);

  // Render map overlays (polylines, markers)
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const group = layersGroupRef.current;
    group.clearLayers();

    // 1. Render Traffic Road Segments
    if (activeLayers.traffic) {
      roadSegments
        .filter(seg => seg.wilayaCode === selectedWilaya)
        .forEach(seg => {
          let color = '#10b981'; // fluide
          let weight = 5;
          if (seg.congestionLevel === 'dense') color = '#f59e0b';
          if (seg.congestionLevel === 'sature') {
            color = '#ef4444';
            weight = 7;
          }
          if (seg.congestionLevel === 'bloque') {
            color = '#dc2626';
            weight = 8;
          }

          const polyline = L.polyline(seg.coordinates, {
            color,
            weight,
            opacity: 0.88,
            lineCap: 'round',
            lineJoin: 'round',
          });

          polyline.on('click', () => {
            setSelectedRoad(seg);
          });

          polyline.bindTooltip(
            `<div class="text-xs font-semibold text-slate-100">${seg.name}</div>
             <div class="text-[11px] text-slate-300 font-mono">${seg.averageSpeedKmh} km/h · ${seg.flowVehiclesPerHour} véh/h · ${seg.occupancyPercent}% occup.</div>`,
            { className: 'bg-slate-900 border border-slate-700 text-white rounded p-1 shadow-lg' }
          );

          polyline.addTo(group);
        });
    }

    // 2. Render CCTV Cameras
    if (activeLayers.cameras) {
      cameras
        .filter(cam => cam.wilayaCode === selectedWilaya)
        .forEach(cam => {
          const iconHtml = `
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 text-emerald-400 shadow-md hover:scale-110 transition-transform cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              ${cam.incidentDetected ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-slate-950"></span>' : ''}
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'cctv-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker(cam.coordinates, { icon: customIcon });
          marker.on('click', () => {
            onSelectCamera(cam);
          });

          marker.bindTooltip(
            `<div class="text-xs font-semibold">${cam.name}</div>
             <div class="text-[11px] text-slate-400 font-mono">${cam.vehicleCount} véh. détectés · ${cam.averageSpeedKmh} km/h</div>`,
            { className: 'bg-slate-900 border border-slate-700 text-white rounded p-1 shadow' }
          );

          marker.addTo(group);
        });
    }

    // 3. Render Incident Markers
    if (activeLayers.incidents) {
      incidents
        .filter(inc => inc.wilayaCode === selectedWilaya && inc.status !== 'Résolu')
        .forEach(inc => {
          const isCritical = inc.severity === 'Critique';
          const iconBg = isCritical ? 'bg-red-600' : 'bg-amber-600';
          const borderColor = isCritical ? 'border-red-400' : 'border-amber-400';

          const iconHtml = `
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${iconBg} border-2 ${borderColor} text-white shadow-lg cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'incident-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker(inc.coordinates, { icon: customIcon });
          marker.on('click', () => {
            onSelectIncident(inc);
          });

          marker.bindTooltip(
            `<div class="text-xs font-bold text-red-300">[${inc.severity}] ${inc.category}</div>
             <div class="text-[11px] text-slate-200">${inc.location}</div>
             <div class="text-[10px] text-slate-400 font-mono">Délai estimé: ${inc.estimatedClearanceMinutes} min</div>`,
            { className: 'bg-slate-900 border border-slate-700 text-white rounded p-1 shadow-xl' }
          );

          marker.addTo(group);
        });
    }
  }, [selectedWilaya, activeLayers, roadSegments, cameras, incidents]);

  const filteredSegments = roadSegments.filter(s => s.wilayaCode === selectedWilaya);
  const filteredIncidents = incidents.filter(i => i.wilayaCode === selectedWilaya && i.status !== 'Résolu');
  const filteredCameras = cameras.filter(c => c.wilayaCode === selectedWilaya);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-950 overflow-hidden">
      {/* Top Workspace Toolbar (Wilaya selection, metrics strip) */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-lg border border-slate-800 shadow-xl max-w-[calc(100vw-2rem)]">
        {/* Wilaya Picker */}
        <div className="flex items-center gap-2 px-2 border-r border-slate-800">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <select
            value={selectedWilaya}
            onChange={(e) => onSelectWilaya(e.target.value as WilayaCode)}
            className="bg-transparent text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer pr-4"
          >
            {WILAYAS.map(w => (
              <option key={w.code} value={w.code} className="bg-slate-900 text-slate-100">
                W.{w.code} — {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Wilaya Summary */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 px-2 font-mono">
          <span>{filteredSegments.length} axes surveillés</span>
          <span aria-hidden="true">·</span>
          <span>{filteredCameras.length} caméras CCTV</span>
          <span aria-hidden="true">·</span>
          <span className={filteredIncidents.length > 0 ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
            {filteredIncidents.length} alertes en cours
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800 text-xs">
          <button
            onClick={() => setActiveLayers(prev => ({ ...prev, traffic: !prev.traffic }))}
            className={`px-2 py-1 rounded transition-colors ${
              activeLayers.traffic ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Trafic
          </button>
          <button
            onClick={() => setActiveLayers(prev => ({ ...prev, cameras: !prev.cameras }))}
            className={`px-2 py-1 rounded transition-colors ${
              activeLayers.cameras ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CCTV
          </button>
          <button
            onClick={() => setActiveLayers(prev => ({ ...prev, incidents: !prev.incidents }))}
            className={`px-2 py-1 rounded transition-colors ${
              activeLayers.incidents ? 'bg-red-950 text-red-300 border border-red-800' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Alertes
          </button>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="flex-1 w-full h-full relative">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs shadow-xl hidden sm:block">
          <div className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Légende Réseau Urbain</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-500 rounded-sm"></span>
              <span>Fluide (&gt;45 km/h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-500 rounded-sm"></span>
              <span>Dense (20-45 km/h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-red-500 rounded-sm"></span>
              <span>Saturé / Bloqué (&lt;20 km/h)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Selected Road Inspector / Communes status */}
      <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-64 lg:h-full z-20 overflow-y-auto">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Inspection de Voirie</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Wilaya {selectedWilaya}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {currentWilayaInfo.description}
          </p>
        </div>

        {selectedRoad ? (
          <div className="p-4 space-y-4">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{selectedRoad.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Commune: {selectedRoad.commune} · Longueur: {selectedRoad.lengthKm} km
                  </div>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border uppercase ${
                  selectedRoad.congestionLevel === 'fluide' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                  selectedRoad.congestionLevel === 'dense' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                  'bg-red-950 text-red-400 border-red-800'
                }`}>
                  {selectedRoad.congestionLevel}
                </span>
              </div>

              {/* Road metrics */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Vitesse moyenne</span>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">
                    {selectedRoad.averageSpeedKmh} <span className="text-xs font-normal text-slate-400">/ {selectedRoad.speedLimitKmh} km/h</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Débit de véhicules</span>
                  <span className="text-lg font-bold font-mono text-white tabular-nums">
                    {selectedRoad.flowVehiclesPerHour} <span className="text-xs font-normal text-slate-400">véh/h</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Taux d'occupation</span>
                  <span className="text-base font-semibold font-mono text-amber-400 tabular-nums">
                    {selectedRoad.occupancyPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Capacité théorique</span>
                  <span className="text-base font-semibold font-mono text-slate-300 tabular-nums">
                    {selectedRoad.capacityVehiclesPerHour} véh/h
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      selectedRoad.occupancyPercent > 85 ? 'bg-red-500' :
                      selectedRoad.occupancyPercent > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(selectedRoad.occupancyPercent, 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedRoad(null)}
                  className="w-full py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-700 transition-colors"
                >
                  Fermer l'inspection
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-slate-200 block mb-1">Guide d'interaction:</span>
              Cliquez sur un tracé routier coloré pour inspecter les flux en temps réel, ou sur un marqueur caméra pour ouvrir le flux vidéo en vision par ordinateur.
            </div>

            {/* List of Road segments */}
            <div>
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Axes Principaux de la Wilaya ({filteredSegments.length})
              </div>
              <div className="space-y-2">
                {filteredSegments.map(seg => (
                  <div
                    key={seg.id}
                    onClick={() => setSelectedRoad(seg)}
                    className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-200 truncate pr-2">
                        {seg.name}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                        seg.congestionLevel === 'fluide' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                        seg.congestionLevel === 'dense' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                        'bg-red-950 text-red-400 border-red-800'
                      }`}>
                        {seg.congestionLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1.5">
                      <span>{seg.averageSpeedKmh} km/h</span>
                      <span aria-hidden="true">·</span>
                      <span>{seg.flowVehiclesPerHour} véh/h</span>
                      <span aria-hidden="true">·</span>
                      <span>{seg.commune}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
