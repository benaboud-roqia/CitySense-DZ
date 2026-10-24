export type WilayaCode = '16' | '04' | '31' | '25' | '19';

export interface WilayaInfo {
  code: WilayaCode;
  name: string;
  center: [number, number];
  zoom: number;
  communes: string[];
  description: string;
  populationEstimate: string;
  networkLengthKm: number;
}

export type CongestionLevel = 'fluide' | 'dense' | 'sature' | 'bloque';

export interface RoadSegment {
  id: string;
  name: string;
  wilayaCode: WilayaCode;
  commune: string;
  coordinates: [number, number][];
  congestionLevel: CongestionLevel;
  averageSpeedKmh: number;
  speedLimitKmh: number;
  flowVehiclesPerHour: number;
  capacityVehiclesPerHour: number;
  occupancyPercent: number;
  lengthKm: number;
  lastUpdated: string;
}

export interface CCTVCamera {
  id: string;
  name: string;
  code: string;
  wilayaCode: WilayaCode;
  commune: string;
  location: string;
  coordinates: [number, number];
  imageUrl: string;
  status: 'online' | 'degraded' | 'offline';
  streamFps: number;
  vehicleCount: number;
  averageSpeedKmh: number;
  incidentDetected: boolean;
  incidentType?: string;
}

export type IncidentSeverity = 'Critique' | 'Majeur' | 'Modéré';
export type IncidentStatus = 'Détecté' | 'Équipe dépêchée' | 'Sécurisation' | 'Résolu';
export type IncidentCategory = 
  | 'Accident corporel / matériel'
  | 'Goulot d\'étranglement / Embouteillage'
  | 'Nid-de-poule / Chaussée dégradée'
  | 'Panne feux de signalisation'
  | 'Véhicule en panne'
  | 'Inondation / Accumulation pluviale'
  | 'Obstacle / Débris sur voie';

export interface IncidentAlert {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  wilayaCode: WilayaCode;
  commune: string;
  location: string;
  coordinates: [number, number];
  detectedAt: string;
  source: 'Vision IA (CCTV)' | 'Capteur Radar' | 'Signalement Citoyen' | 'Patrouille DGSN';
  estimatedClearanceMinutes: number;
  impactScore: number; // 0-100
  assignedTeam?: string;
  recommendedAction: string;
  lanesBlocked: number;
  totalLanes: number;
}

export interface VisionDetection {
  label: string;
  box2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in 0-1000 scale
  confidence: number;
}

export interface VisionAnalysisResult {
  trafficDensity: 'Fluide' | 'Dense' | 'Congestionné' | 'Bloqué';
  congestionIndex: number;
  averageSpeedEstimateKmh: number;
  vehicleCounts: {
    cars: number;
    buses: number;
    trucks: number;
    motorcycles: number;
    total: number;
  };
  detectedHazards: {
    type: string;
    severity: 'Faible' | 'Moyen' | 'Critique';
    description: string;
    actionRequired: string;
  }[];
  communeRecommendations: {
    entity: 'APC Voirie' | 'DGSN Police' | 'Protection Civile' | 'DTP Wilaya';
    action: string;
    priority: 'Haute' | 'Moyenne' | 'Immédiate';
  }[];
  detections: VisionDetection[];
  summary: string;
}

export interface MunicipalActionItem {
  step: number;
  title: string;
  details: string;
  stakeholder: 'APC' | 'DTP' | 'DGSN' | 'Protection Civile';
  timeframe: string;
  estimatedCostDzd: number;
}

export interface MunicipalPlan {
  title: string;
  executiveSummary: string;
  actionPlan: MunicipalActionItem[];
  trafficImpactForecast: {
    congestionReductionPercent: number;
    averageDelaySavedMinutes: number;
    co2ReductionTonsPerDay: number;
  };
  citizenAdvisory: string;
  kpisToMonitor: string[];
}
