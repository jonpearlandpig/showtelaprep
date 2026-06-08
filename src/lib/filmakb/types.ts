export type FilmAkbEntityType =
  | "artifact"
  | "scene"
  | "character"
  | "location"
  | "crew"
  | "cast"
  | "schedule"
  | "risk"
  | "decision"
  | "assumption"
  | "timeline_event"
  | "replay_event";

export type TelaWhy = {
  id: string;
  summary: string;
  sources: string[];
  evidence: string[];
  relationships: string[];
  assumptions: string[];
  lastUpdated: string;
};

export type ProductionBrief = {
  production: {
    id: string;
    workspaceId: string;
    title: string;
    phase: "prep" | "shoot" | "wrap";
  };
  summary: string;
  readiness: number;
  risks: Risk[];
  decisions: Decision[];
  assumptions: Assumption[];
  telawhy: TelaWhy;
};

export type SourceSceneLink = {
  artifactId: string;
  sceneId: string;
  sceneNumber: string;
  pageStart?: number;
  excerpt: string;
};

export type Artifact = {
  id: string;
  title: string;
  type: string;
  status: "uploaded" | "processing" | "indexed" | "blocked";
  source: string;
  text?: string;
  updatedAt: string;
};

export type Scene = {
  id: string;
  sceneNumber: string;
  heading: string;
  interiorExterior: "INT" | "EXT" | "INT/EXT" | "I/E" | "UNKNOWN";
  timeOfDay: string;
  location: string;
  characters: string[];
  pages?: string;
  dependencies: string[];
  risks: string[];
  actionCoordination: boolean;
  source: SourceSceneLink;
};

export type Character = {
  id: string;
  name: string;
  appearances: number;
  scenes: string[];
  scriptReferences: SourceSceneLink[];
};

export type Location = {
  id: string;
  name: string;
  address?: string;
  status: "unknown" | "needs_review" | "confirmed";
  photos: string[];
  permits: string[];
  owner?: string;
  parking?: string;
  power?: string;
  notes: string[];
  scenes: string[];
  riskScore: number;
  risks: string[];
  sourceScenes: SourceSceneLink[];
};

export type Risk = {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  owner: string;
  status: "open" | "mitigating" | "resolved";
  impact: string;
  mitigation: string;
};

export type Decision = {
  id: string;
  title: string;
  owner: string;
  date: string;
  reason: string;
  impact: string;
};

export type Assumption = {
  id: string;
  title: string;
  verificationStatus: "unverified" | "in_review" | "verified";
  relatedRisks: string[];
};

export type SearchResult = {
  id: string;
  type: FilmAkbEntityType;
  title: string;
  excerpt: string;
  confidence: number;
  telawhyId: string;
};

export type AskTelaAnswer = {
  answer: string;
  confidence: number;
  sources: string[];
  sourceScenes?: SourceSceneLink[];
  recommendedActions: string[];
  readinessImpact: string;
  telawhy: TelaWhy;
};

export type ProductionAnalysis = {
  sceneCount: number;
  characterCount: number;
  locationCount: number;
  actionSceneCount: number;
  highestRiskLocations: Location[];
  mostAppearingCharacters: Character[];
};

export type FilmAkbSnapshot = {
  artifacts: Artifact[];
  scenes: Scene[];
  characters: Character[];
  locations: Location[];
  productionBrief: ProductionBrief;
  searchIndex: SearchResult[];
  telawhy: TelaWhy[];
  analysis: ProductionAnalysis;
  updatedAt: string;
};

export type ScriptIngestionResult = {
  artifact: Artifact;
  scenes: Scene[];
  characters: Character[];
  locations: Location[];
  productionBrief: ProductionBrief;
  searchIndex: SearchResult[];
  telawhy: TelaWhy[];
  analysis: ProductionAnalysis;
};

export const NOT_FOUND_IN_FILMAKB = "Not found in current FilmAKB.";
