import {
  activeProductionId,
  answerFromSampleFilmAkb,
  sampleBrief,
  sampleSearchIndex,
} from "@/lib/filmakb/sample-data";
import type { Artifact, AskTelaAnswer, ProductionBrief, SearchResult } from "@/lib/filmakb/types";

export async function getProductionBrief(): Promise<ProductionBrief> {
  return sampleBrief;
}

export async function searchFilmAkb(query: string): Promise<{
  query: string;
  route: "search" | "ask_tela";
  results: SearchResult[];
}> {
  const trimmed = query.trim();
  const isQuestion = /\?$|^(what|why|who|when|where|how|should|is|are|do)\b/i.test(trimmed);

  if (!trimmed) {
    return { query: trimmed, route: "search", results: [] };
  }

  const terms = trimmed.toLowerCase().split(/\s+/);
  const results = sampleSearchIndex.filter((result) => {
    const haystack = `${result.title} ${result.excerpt} ${result.type}`.toLowerCase();
    return terms.some((term) => haystack.includes(term));
  });

  return {
    query: trimmed,
    route: isQuestion ? "ask_tela" : "search",
    results,
  };
}

export async function askTela(question: string): Promise<AskTelaAnswer> {
  return answerFromSampleFilmAkb(question);
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
