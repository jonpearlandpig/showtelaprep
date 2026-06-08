import type {
  Artifact,
  AskTelaAnswer,
  ProductionBrief,
  SearchResult,
  TelaWhy,
} from "./types";
import { NOT_FOUND_IN_FILMAKB } from "./types";

export const activeProductionId = "prod-midian-sample";

const midianTelaWhy: TelaWhy = {
  id: "tw-midian-seed",
  summary:
    "Seeded sample intelligence derived from the founding constitution, pending uploaded production artifacts.",
  sources: ["Founding Constitution & Codex Build Instructions v2.0"],
  evidence: [
    "Target Production: THERE'S A FIRE IN MIDIAN",
    "Sprint 1 success condition: Upload script. Generate production.",
    "Ask TELA example identifies Day 4 blockers as construction site, parking plan, and permit status.",
  ],
  relationships: [
    "Production -> Risks",
    "Risks -> Recommended Actions",
    "Production Brief -> TELAwhy",
  ],
  assumptions: [
    "Midian records are sample FilmAKB until real artifacts are uploaded.",
  ],
  lastUpdated: "2026-06-08",
};

export const sampleBrief: ProductionBrief = {
  production: {
    id: activeProductionId,
    workspaceId: "workspace-showtela-sample",
    title: "THERE'S A FIRE IN MIDIAN",
    phase: "prep",
  },
  summary:
    "Prep intelligence is initialized from the founding constitution. The production is not artifact-complete yet; upload the script to create authoritative scene, character, and location registries.",
  readiness: 38,
  risks: [
    {
      id: "risk-construction-site",
      title: "Construction Site Unconfirmed",
      severity: "high",
      owner: "Producer",
      status: "open",
      impact: "Blocks location confidence for Day 4 planning.",
      mitigation: "Confirm construction site availability and owner approval.",
    },
    {
      id: "risk-parking-plan",
      title: "Parking Plan Missing",
      severity: "medium",
      owner: "AD / Production Coordinator",
      status: "open",
      impact: "Creates crew movement and permit risk.",
      mitigation: "Draft and approve parking plan before schedule lock.",
    },
    {
      id: "risk-permit-status",
      title: "Permit Status Unknown",
      severity: "high",
      owner: "Producer",
      status: "open",
      impact: "Prevents production from treating location access as lawful.",
      mitigation: "Request permit status from location owner or authority.",
    },
  ],
  decisions: [
    {
      id: "decision-build-order",
      title: "Build FilmAKB Foundation Before Demo Features",
      owner: "Jon Hartman",
      date: "2026-06-08",
      reason: "The system must optimize for truth, continuity, traceability, scalability, and trust.",
      impact: "Sprint 1 prioritizes artifact intake, registries, brief, and search.",
    },
  ],
  assumptions: [
    {
      id: "assumption-sample-data",
      title: "Midian sample data can demonstrate workflows until uploads exist.",
      verificationStatus: "unverified",
      relatedRisks: ["risk-construction-site", "risk-parking-plan"],
    },
  ],
  telawhy: midianTelaWhy,
};

export const sampleArtifacts: Artifact[] = [
  {
    id: "artifact-constitution",
    title: "Founding Constitution v2.0",
    type: "MD",
    status: "indexed",
    source: "User-provided constitution",
    updatedAt: "2026-06-08",
  },
];

export const sampleSearchIndex: SearchResult[] = [
  {
    id: "risk-construction-site",
    type: "risk",
    title: "Construction Site Unconfirmed",
    excerpt: "Blocks location confidence for Day 4 planning.",
    confidence: 0.76,
    telawhyId: midianTelaWhy.id,
  },
  {
    id: "risk-parking-plan",
    type: "risk",
    title: "Parking Plan Missing",
    excerpt: "Creates crew movement and permit risk.",
    confidence: 0.74,
    telawhyId: midianTelaWhy.id,
  },
  {
    id: "risk-permit-status",
    type: "risk",
    title: "Permit Status Unknown",
    excerpt: "Prevents location access from being treated as lawful.",
    confidence: 0.74,
    telawhyId: midianTelaWhy.id,
  },
  {
    id: "artifact-constitution",
    type: "artifact",
    title: "Founding Constitution v2.0",
    excerpt: "Defines FilmAKB, TELAwhy, registries, replay, and Sprint 1 success.",
    confidence: 0.93,
    telawhyId: midianTelaWhy.id,
  },
];

export function answerFromSampleFilmAkb(question: string): AskTelaAnswer {
  const normalized = question.toLowerCase();

  if (normalized.includes("day 4") || normalized.includes("blocking")) {
    return {
      answer:
        "Construction Site Unconfirmed, Parking Plan Missing, and Permit Status Unknown.",
      confidence: 0.74,
      sources: midianTelaWhy.sources,
      recommendedActions: [
        "Confirm Construction Site",
        "Request Permit Status",
        "Approve Parking Plan",
      ],
      readinessImpact: "+12% estimated readiness impact after all three blockers are resolved.",
      telawhy: midianTelaWhy,
    };
  }

  if (normalized.includes("what changed") || normalized.includes("today")) {
    return {
      answer:
        "The founding constitution initialized the FilmAKB authority model, required registries, build order, and sample Midian production context.",
      confidence: 0.82,
      sources: midianTelaWhy.sources,
      recommendedActions: ["Upload the script artifact", "Generate scene registry"],
      readinessImpact: "+20% estimated readiness impact after script upload and parsing.",
      telawhy: midianTelaWhy,
    };
  }

  return {
    answer: NOT_FOUND_IN_FILMAKB,
    confidence: 0,
    sources: [],
    recommendedActions: ["Upload or connect the authoritative artifact that contains this information."],
    readinessImpact: "Unknown until FilmAKB contains evidence.",
    telawhy: {
      ...midianTelaWhy,
      summary: "No FilmAKB evidence matched the question.",
      evidence: [],
      relationships: [],
      assumptions: [],
    },
  };
}
