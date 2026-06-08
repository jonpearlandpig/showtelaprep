import {
  activeProductionId,
} from "@/lib/filmakb/sample-data";
import { extractPdfText, normalizeExtractedText } from "@/lib/filmakb/pdf";
import { buildFilmAkbFromScript } from "@/lib/filmakb/script-parser";
import {
  askCurrentFilmAkb,
  getCurrentProductionBrief,
  getFilmAkbSnapshot,
  saveFilmAkbSnapshot,
  searchCurrentFilmAkb,
} from "@/lib/filmakb/store";
import type {
  Artifact,
  AskTelaAnswer,
  FilmAkbSnapshot,
  ProductionBrief,
  ScriptIngestionResult,
  SearchResult,
} from "@/lib/filmakb/types";

export async function getProductionBrief(): Promise<ProductionBrief> {
  return getCurrentProductionBrief();
}

export async function searchFilmAkb(query: string): Promise<{
  query: string;
  route: "search" | "ask_tela";
  results: SearchResult[];
}> {
  return searchCurrentFilmAkb(query);
}

export async function askTela(question: string): Promise<AskTelaAnswer> {
  return askCurrentFilmAkb(question);
}

export async function createArtifactIntake(input: {
  filename: string;
  artifactType: string;
  contentType: string;
  productionId?: string;
}): Promise<{ artifact: Artifact; nextEvent: string }> {
  return {
    artifact: {
      id: `artifact-${crypto.randomUUID()}`,
      title: input.filename,
      type: input.artifactType,
      status: "uploaded",
      source: input.contentType,
      updatedAt: new Date().toISOString(),
    },
    nextEvent: `artifact_uploaded:${input.productionId ?? activeProductionId}`,
  };
}

export async function ingestScriptArtifact(input: {
  filename: string;
  contentType: string;
  buffer: Buffer;
  productionId?: string;
}): Promise<ScriptIngestionResult> {
  const artifact: Artifact = {
    id: `artifact-${crypto.randomUUID()}`,
    title: input.filename,
    type: input.contentType.includes("pdf") || input.filename.toLowerCase().endsWith(".pdf") ? "Script" : "TXT",
    status: "processing",
    source: "Uploaded screenplay artifact",
    updatedAt: new Date().toISOString(),
  };

  const text = await extractArtifactText(input.buffer, input.contentType, input.filename);
  const snapshot = buildFilmAkbFromScript({
    artifact,
    text,
    productionTitle: input.filename,
  });

  await saveFilmAkbSnapshot(snapshot);

  return {
    artifact: snapshot.artifacts[0],
    scenes: snapshot.scenes,
    characters: snapshot.characters,
    locations: snapshot.locations,
    productionBrief: snapshot.productionBrief,
    searchIndex: snapshot.searchIndex,
    telawhy: snapshot.telawhy,
    analysis: snapshot.analysis,
  };
}

export async function getRegistries(): Promise<Pick<FilmAkbSnapshot, "scenes" | "characters" | "locations" | "analysis" | "telawhy"> | null> {
  const snapshot = await getFilmAkbSnapshot();

  if (!snapshot) {
    return null;
  }

  return {
    scenes: snapshot.scenes,
    characters: snapshot.characters,
    locations: snapshot.locations,
    analysis: snapshot.analysis,
    telawhy: snapshot.telawhy,
  };
}

async function extractArtifactText(buffer: Buffer, contentType: string, filename: string): Promise<string> {
  const lowerName = filename.toLowerCase();

  if (contentType.includes("pdf") || lowerName.endsWith(".pdf")) {
    return extractPdfText(buffer);
  }

  if (
    contentType.includes("text") ||
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".md")
  ) {
    return normalizeExtractedText(buffer.toString("utf8"));
  }

  throw new Error("Unsupported script artifact type. Upload a PDF, TXT, or MD screenplay.");
}
