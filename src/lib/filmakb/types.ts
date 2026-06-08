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

export type Artifact = {
  id: string;
  title: string;
  type: string;
  status: "uploaded" | "processing" | "indexed" | "blocked";
  source: string;
  updatedAt: string;
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
  recommendedActions: string[];
  readinessImpact: string;
  telawhy: TelaWhy;
};

export const NOT_FOUND_IN_FILMAKB = "Not found in current FilmAKB.";
