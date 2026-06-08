import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  answerFromSampleFilmAkb,
  sampleBrief,
  sampleSearchIndex,
} from "./sample-data";
import type {
  AskTelaAnswer,
  FilmAkbSnapshot,
  Location,
  Scene,
  SearchResult,
  SourceSceneLink,
} from "./types";
import { NOT_FOUND_IN_FILMAKB } from "./types";

const storeDirectory = path.join(process.cwd(), ".filmakb");
const storePath = path.join(storeDirectory, "current.json");

let memorySnapshot: FilmAkbSnapshot | null = null;

export async function saveFilmAkbSnapshot(snapshot: FilmAkbSnapshot): Promise<FilmAkbSnapshot> {
  memorySnapshot = snapshot;
  await mkdir(storeDirectory, { recursive: true });
  await writeFile(storePath, JSON.stringify(snapshot, null, 2), "utf8");

  return snapshot;
}

export async function getFilmAkbSnapshot(): Promise<FilmAkbSnapshot | null> {
  if (memorySnapshot) {
    return memorySnapshot;
  }

  try {
    const raw = await readFile(storePath, "utf8");
    memorySnapshot = JSON.parse(raw) as FilmAkbSnapshot;
    return memorySnapshot;
  } catch {
    return null;
  }
}

export async function getCurrentProductionBrief() {
  const snapshot = await getFilmAkbSnapshot();
  return snapshot?.productionBrief ?? sampleBrief;
}

export async function searchCurrentFilmAkb(query: string): Promise<{
  query: string;
  route: "search" | "ask_tela";
  results: SearchResult[];
}> {
  const trimmed = query.trim();
  const isQuestion = /\?$|^(what|why|who|when|where|how|should|is|are|do|which)\b/i.test(trimmed);

  if (!trimmed) {
    return { query: trimmed, route: "search", results: [] };
  }

  const snapshot = await getFilmAkbSnapshot();
  const index = snapshot?.searchIndex ?? sampleSearchIndex;
  const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const results = index.filter((result) => {
    const haystack = `${result.title} ${result.excerpt} ${result.type}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });

  return {
    query: trimmed,
    route: isQuestion ? "ask_tela" : "search",
    results,
  };
}

export async function askCurrentFilmAkb(question: string): Promise<AskTelaAnswer> {
  const snapshot = await getFilmAkbSnapshot();

  if (!snapshot) {
    return answerFromSampleFilmAkb(question);
  }

  const normalized = question.toLowerCase();

  if (normalized.includes("construction site") || normalized.includes("construction")) {
    const scenes = snapshot.scenes.filter((scene) => scene.location.toLowerCase().includes("construction"));
    return answerWithScenes({
      scenes,
      snapshot,
      answer: scenes.length
        ? `${scenes.length} scene(s) use the construction site: ${formatSceneList(scenes)}.`
        : NOT_FOUND_IN_FILMAKB,
      recommendedActions: scenes.length
        ? ["Verify construction site permit status", "Confirm parking and access plan", "Review action and safety dependencies"]
        : ["Upload the screenplay or location artifact that identifies the construction site."],
    });
  }

  if (normalized.includes("highest risk") || normalized.includes("locations") && normalized.includes("risk")) {
    const locations = snapshot.analysis.highestRiskLocations;
    return answerWithLocations({
      locations,
      snapshot,
      answer: locations.length
        ? `Highest risk locations: ${locations.map((location) => `${location.name} (${location.riskScore}/10)`).join(", ")}.`
        : NOT_FOUND_IN_FILMAKB,
      recommendedActions: ["Upload permits", "Upload scout reports", "Confirm owner, parking, and power for highest-risk locations"],
    });
  }

  if (normalized.includes("characters appear most") || normalized.includes("characters") && normalized.includes("most")) {
    const characters = snapshot.analysis.mostAppearingCharacters;

    return {
      answer: characters.length
        ? `Most appearing characters: ${characters.map((character) => `${character.name} (${character.appearances})`).join(", ")}.`
        : NOT_FOUND_IN_FILMAKB,
      confidence: characters.length ? 0.78 : 0,
      sources: snapshot.artifacts.map((artifact) => artifact.title),
      sourceScenes: characters.flatMap((character) => character.scriptReferences.slice(0, 3)),
      recommendedActions: characters.length
        ? ["Review cast availability for most frequent characters", "Cross-check against schedule once shoot dates are uploaded"]
        : ["Upload screenplay text with character dialogue cues."],
      readinessImpact: "Character frequency improves cast and schedule planning once verified.",
      telawhy: {
        ...snapshot.telawhy[0],
        summary: "Answer derived from screenplay dialogue cue frequency in FilmAKB.",
        evidence: characters.map((character) => `${character.name}: ${character.appearances} scene appearance(s)`),
      },
    };
  }

  if (normalized.includes("action coordination") || normalized.includes("require action")) {
    const scenes = snapshot.scenes.filter((scene) => scene.actionCoordination);
    return answerWithScenes({
      scenes,
      snapshot,
      answer: scenes.length
        ? `Scenes requiring action coordination: ${formatSceneList(scenes)}.`
        : NOT_FOUND_IN_FILMAKB,
      recommendedActions: scenes.length
        ? ["Review scenes with stunt/action coordinator", "Confirm safety dependencies", "Flag schedule impacts"]
        : ["Upload screenplay pages that include action or stunt requirements."],
    });
  }

  return {
    answer: NOT_FOUND_IN_FILMAKB,
    confidence: 0,
    sources: [],
    sourceScenes: [],
    recommendedActions: ["Upload an authoritative artifact containing this information."],
    readinessImpact: "Unknown until FilmAKB contains evidence.",
    telawhy: {
      id: `tw-not-found-${Date.now()}`,
      summary: "No current FilmAKB evidence matched the question.",
      sources: [],
      evidence: [],
      relationships: [],
      assumptions: [],
      lastUpdated: snapshot.updatedAt,
    },
  };
}

function answerWithScenes(input: {
  scenes: Scene[];
  snapshot: FilmAkbSnapshot;
  answer: string;
  recommendedActions: string[];
}): AskTelaAnswer {
  return {
    answer: input.answer,
    confidence: input.scenes.length ? 0.84 : 0,
    sources: input.snapshot.artifacts.map((artifact) => artifact.title),
    sourceScenes: input.scenes.map((scene) => scene.source),
    recommendedActions: input.recommendedActions,
    readinessImpact: input.scenes.length
      ? "Resolving source-scene dependencies improves production readiness."
      : "Unknown until FilmAKB contains evidence.",
    telawhy: {
      ...input.snapshot.telawhy[0],
      summary: "Answer derived from screenplay scene registry records in FilmAKB.",
      evidence: input.scenes.map((scene) => `${scene.sceneNumber}: ${scene.heading}`),
      relationships: ["Artifact -> Scene Registry", "Scene Registry -> Ask TELA"],
    },
  };
}

function answerWithLocations(input: {
  locations: Location[];
  snapshot: FilmAkbSnapshot;
  answer: string;
  recommendedActions: string[];
}): AskTelaAnswer {
  const sourceScenes: SourceSceneLink[] = input.locations.flatMap((location) => location.sourceScenes);

  return {
    answer: input.answer,
    confidence: input.locations.length ? 0.82 : 0,
    sources: input.snapshot.artifacts.map((artifact) => artifact.title),
    sourceScenes,
    recommendedActions: input.recommendedActions,
    readinessImpact: input.locations.length
      ? "Location verification reduces permit, access, and logistics risk."
      : "Unknown until FilmAKB contains evidence.",
    telawhy: {
      ...input.snapshot.telawhy[0],
      summary: "Answer derived from screenplay location registry and risk heuristics in FilmAKB.",
      evidence: input.locations.map((location) => `${location.name}: risk score ${location.riskScore}`),
      relationships: ["Artifact -> Scene Registry", "Scene Registry -> Location Registry", "Location Registry -> Risk Registry"],
    },
  };
}

function formatSceneList(scenes: Scene[]): string {
  return scenes.map((scene) => `Scene ${scene.sceneNumber} (${scene.heading})`).join("; ");
}
