import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { MapModule } from './components/MapModule';
import { VisionModule } from './components/VisionModule';
import { IncidentsModule } from './components/IncidentsModule';
import { MunicipalModule } from './components/MunicipalModule';
import { AnalyticsModule } from './components/AnalyticsModule';
import { ReportModal } from './components/ReportModal';
import { 
  INITIAL_ROAD_SEGMENTS, 
  INITIAL_CCTV_CAMERAS, 
  INITIAL_INCIDENTS,
  WILAYAS
} from './data/mockData';
import { 
  RoadSegment, 
  CCTVCamera, 
  IncidentAlert, 
  IncidentStatus, 
  WilayaCode 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('carto');
  const [selectedWilaya, setSelectedWilaya] = useState<WilayaCode>('16'); // Alger by default
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>(INITIAL_ROAD_SEGMENTS);
  const [cameras, setCameras] = useState<CCTVCamera[]>(INITIAL_CCTV_CAMERAS);
  const [incidents, setIncidents] = useState<IncidentAlert[]>(INITIAL_INCIDENTS);
  const [selectedCamera, setSelectedCamera] = useState<CCTVCamera>(INITIAL_CCTV_CAMERAS[0]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Live real-time traffic pulse simulation (gentle fluctuation every 7s)
  useEffect(() => {
    const interval = setInterval(() => {
      setRoadSegments(prev =>
        prev.map(seg => {
          const deltaSpeed = (Math.random() - 0.5) * 3;
          const newSpeed = Math.max(10, Math.min(seg.speedLimitKmh, Math.round(seg.averageSpeedKmh + deltaSpeed)));
          const deltaFlow = Math.round((Math.random() - 0.5) * 60);
          const newFlow = Math.max(300, seg.flowVehiclesPerHour + deltaFlow);
          const occupancy = Math.min(100, Math.round((newFlow / seg.capacityVehiclesPerHour) * 100));
          
          let level = seg.congestionLevel;
          if (occupancy > 88) level = 'sature';
          else if (occupancy > 65) level = 'dense';
          else level = 'fluide';

          return {
            ...seg,
            averageSpeedKmh: newSpeed,
            flowVehiclesPerHour: newFlow,
            occupancyPercent: occupancy,
            congestionLevel: level,
            lastUpdated: 'À l\'instant',
          };
        })
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
  };

  const handleAddIncident = (newInc: IncidentAlert) => {
    setIncidents(prev => [newInc, ...prev]);
    // Switch to incidents tab to view the newly created alert
    setActiveTab('incidents');
  };

  const handleCameraSelectFromMap = (cam: CCTVCamera) => {
    setSelectedCamera(cam);
    setActiveTab('vision');
  };

  const handleIncidentSelectFromMap = (_inc: IncidentAlert) => {
    setActiveTab('incidents');
  };

  const activeIncidentsCount = incidents.filter(i => i.status !== 'Résolu').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1-Row 3-Zone Header Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeIncidentCount={activeIncidentsCount}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 w-full flex flex-col">
        {activeTab === 'carto' && (
          <MapModule
            selectedWilaya={selectedWilaya}
            onSelectWilaya={setSelectedWilaya}
            roadSegments={roadSegments}
            cameras={cameras}
            incidents={incidents}
            onSelectCamera={handleCameraSelectFromMap}
            onSelectIncident={handleIncidentSelectFromMap}
          />
        )}

        {activeTab === 'vision' && (
          <VisionModule
            cameras={cameras}
            selectedCamera={selectedCamera}
            onSelectCamera={setSelectedCamera}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentsModule
            incidents={incidents}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            selectedWilaya={selectedWilaya}
            onSelectWilaya={setSelectedWilaya}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'municipal' && (
          <MunicipalModule
            selectedWilaya={selectedWilaya}
            onSelectWilaya={setSelectedWilaya}
            incidents={incidents}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsModule
            selectedWilaya={selectedWilaya}
            onSelectWilaya={setSelectedWilaya}
          />
        )}
      </main>

      {/* Manual Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onAddIncident={handleAddIncident}
        defaultWilaya={selectedWilaya}
      />
    </div>
  );
}
