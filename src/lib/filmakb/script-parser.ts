import type {
  Artifact,
  Character,
  FilmAkbSnapshot,
  Location,
  ProductionAnalysis,
  ProductionBrief,
  Scene,
  SearchResult,
  SourceSceneLink,
  TelaWhy,
} from "./types";

const sceneHeadingPattern =
  /^\s*(?:(\d+[A-Z]?)\s+)?(INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s+(.+)$/i;

const timeMarkers = [
  "DAY",
  "NIGHT",
  "DAWN",
  "DUSK",
  "MORNING",
  "AFTERNOON",
  "EVENING",
  "LATER",
  "CONTINUOUS",
  "SAME",
];

const excludedCharacterCues = new Set([
  "CUT TO",
  "FADE IN",
  "FADE OUT",
  "DISSOLVE TO",
  "SMASH CUT",
  "MATCH CUT",
  "BACK TO",
  "TITLE",
  "THE END",
]);

const actionKeywords = [
  "action",
  "chase",
  "fight",
  "fire",
  "flame",
  "gun",
  "weapon",
  "fall",
  "stunt",
  "explosion",
  "crash",
  "run",
  "construction",
  "vehicle",
  "blood",
];

const highRiskLocationKeywords = [
  "construction",
  "fire",
  "roof",
  "street",
  "highway",
  "vehicle",
  "water",
  "night",
  "crowd",
  "school",
  "hospital",
];

export function buildFilmAkbFromScript(input: {
  artifact: Artifact;
  text: string;
  productionTitle?: string;
}): FilmAkbSnapshot {
  const scenes = extractScenes(input.text, input.artifact.id);
  const characters = extractCharacters(scenes);
  const locations = extractLocations(scenes);
  const telawhy = buildTelaWhy(input.artifact, scenes, characters, locations);
  const analysis = analyzeProduction(scenes, characters, locations);
  const productionBrief = buildProductionBrief({
    productionTitle: input.productionTitle ?? inferTitle(input.artifact.title),
    scenes,
    characters,
    locations,
    analysis,
    telawhy: telawhy[0],
  });
  const searchIndex = buildSearchIndex(scenes, characters, locations, input.artifact, telawhy);

  return {
    artifacts: [{ ...input.artifact, text: input.text, status: "indexed" }],
    scenes,
    characters,
    locations,
    productionBrief,
    searchIndex,
    telawhy,
    analysis,
    updatedAt: new Date().toISOString(),
  };
}

function extractScenes(text: string, artifactId: string): Scene[] {
  const lines = text.split("\n");
  const headings: Array<{ index: number; heading: string; number?: string; prefix: string; body: string }> = [];

  lines.forEach((line, index) => {
    const match = line.match(sceneHeadingPattern);
    if (!match) {
      return;
    }

    headings.push({
      index,
      heading: normalizeWhitespace(line),
      number: match[1],
      prefix: match[2].toUpperCase().replace(".", ""),
      body: normalizeWhitespace(match[3]),
    });
  });

  return headings.map((heading, index) => {
    const next = headings[index + 1]?.index ?? lines.length;
    const block = lines.slice(heading.index + 1, next).join("\n").trim();
    const sceneNumber = heading.number ?? String(index + 1);
    const { location, timeOfDay } = parseHeadingBody(heading.body);
    const source: SourceSceneLink = {
      artifactId,
      sceneId: `scene-${slugify(sceneNumber)}`,
      sceneNumber,
      excerpt: excerptFor(block || heading.heading),
    };
    const actionCoordination = containsAny(block, actionKeywords);
    const risks = deriveSceneRisks(location, block, actionCoordination);

    return {
      id: source.sceneId,
      sceneNumber,
      heading: heading.heading,
      interiorExterior: mapPrefix(heading.prefix),
      timeOfDay,
      location,
      characters: extractCharacterCues(block),
      dependencies: deriveDependencies(block, actionCoordination),
      risks,
      actionCoordination,
      source,
    };
  });
}

function extractCharacters(scenes: Scene[]): Character[] {
  const byName = new Map<string, Character>();

  for (const scene of scenes) {
    for (const name of scene.characters) {
      const existing = byName.get(name) ?? {
        id: `character-${slugify(name)}`,
        name,
        appearances: 0,
        scenes: [],
        scriptReferences: [],
      };

      existing.appearances += 1;
      existing.scenes.push(scene.id);
      existing.scriptReferences.push(scene.source);
      byName.set(name, existing);
    }
  }

  return [...byName.values()].sort((a, b) => b.appearances - a.appearances || a.name.localeCompare(b.name));
}

function extractLocations(scenes: Scene[]): Location[] {
  const byLocation = new Map<string, Location>();

  for (const scene of scenes) {
    const existing = byLocation.get(scene.location) ?? {
      id: `location-${slugify(scene.location)}`,
      name: scene.location,
      status: "needs_review",
      photos: [],
      permits: [],
      notes: [],
      scenes: [],
      riskScore: 0,
      risks: [],
      sourceScenes: [],
    };

    existing.scenes.push(scene.id);
    existing.sourceScenes.push(scene.source);
    existing.risks = [...new Set([...existing.risks, ...scene.risks])];
    existing.riskScore = scoreLocationRisk(existing.name, existing.risks, existing.scenes.length);
    existing.notes = [
      `${existing.scenes.length} scene(s) currently reference this location.`,
      "Address, permits, parking, power, and owner require production verification.",
    ];

    byLocation.set(scene.location, existing);
  }

  return [...byLocation.values()].sort((a, b) => b.riskScore - a.riskScore || a.name.localeCompare(b.name));
}

function buildTelaWhy(
  artifact: Artifact,
  scenes: Scene[],
  characters: Character[],
  locations: Location[],
): TelaWhy[] {
  return [
    {
      id: `tw-${artifact.id}`,
      summary: `${artifact.title} is the current screenplay authority source for generated scene, character, location, search, and production brief records.`,
      sources: [artifact.title],
      evidence: [
        `${scenes.length} scene heading(s) extracted from screenplay text.`,
        `${characters.length} character cue(s) consolidated into character registry records.`,
        `${locations.length} location heading(s) consolidated into location registry records.`,
      ],
      relationships: [
        "Artifact -> Scenes",
        "Scenes -> Characters",
        "Scenes -> Locations",
        "Scenes -> Risks",
        "Scenes -> Search Index",
      ],
      assumptions: [
        "Scene extraction is based on screenplay heading conventions.",
        "Character extraction is based on uppercase dialogue cue conventions.",
        "Location risk is a production-prep heuristic until permits, scouts, and schedules are uploaded.",
      ],
      lastUpdated: new Date().toISOString(),
    },
  ];
}

function analyzeProduction(
  scenes: Scene[],
  characters: Character[],
  locations: Location[],
): ProductionAnalysis {
  return {
    sceneCount: scenes.length,
    characterCount: characters.length,
    locationCount: locations.length,
    actionSceneCount: scenes.filter((scene) => scene.actionCoordination).length,
    highestRiskLocations: locations.slice(0, 5),
    mostAppearingCharacters: characters.slice(0, 5),
  };
}

function buildProductionBrief(input: {
  productionTitle: string;
  scenes: Scene[];
  characters: Character[];
  locations: Location[];
  analysis: ProductionAnalysis;
  telawhy: TelaWhy;
}): ProductionBrief {
  const readiness = input.scenes.length > 0 ? 58 : 38;

  return {
    production: {
      id: "prod-midian-sample",
      workspaceId: "workspace-showtela-sample",
      title: input.productionTitle,
      phase: "prep",
    },
    summary: `${input.productionTitle} now has screenplay-derived FilmAKB intelligence: ${input.scenes.length} scenes, ${input.characters.length} characters, and ${input.locations.length} locations. Location verification, permits, parking, power, and action coordination remain prep risks until supporting artifacts are uploaded.`,
    readiness,
    risks: input.analysis.highestRiskLocations.map((location) => ({
      id: `risk-${location.id}`,
      title: `${location.name} Requires Production Verification`,
      severity: location.riskScore >= 8 ? "high" : location.riskScore >= 5 ? "medium" : "low",
      owner: "Producer",
      status: "open",
      impact: `${location.scenes.length} scene(s) depend on this location.`,
      mitigation: "Upload scout report, permit, parking plan, power notes, and owner confirmation.",
    })),
    decisions: [],
    assumptions: [
      {
        id: "assumption-script-heading-parse",
        title: "Screenplay headings and dialogue cues can seed FilmAKB registries.",
        verificationStatus: "in_review",
        relatedRisks: input.analysis.highestRiskLocations.map((location) => `risk-${location.id}`),
      },
    ],
    telawhy: input.telawhy,
  };
}

function buildSearchIndex(
  scenes: Scene[],
  characters: Character[],
  locations: Location[],
  artifact: Artifact,
  telawhy: TelaWhy[],
): SearchResult[] {
  const telawhyId = telawhy[0]?.id ?? `tw-${artifact.id}`;

  return [
    {
      id: artifact.id,
      type: "artifact",
      title: artifact.title,
      excerpt: "Screenplay authority source for FilmAKB registries.",
      confidence: 0.95,
      telawhyId,
    },
    ...scenes.map((scene) => ({
      id: scene.id,
      type: "scene" as const,
      title: `Scene ${scene.sceneNumber}: ${scene.heading}`,
      excerpt: `${scene.location}. Characters: ${scene.characters.slice(0, 6).join(", ") || "None found"}.`,
      confidence: 0.86,
      telawhyId,
    })),
    ...characters.map((character) => ({
      id: character.id,
      type: "character" as const,
      title: character.name,
      excerpt: `${character.appearances} scene appearance(s).`,
      confidence: 0.78,
      telawhyId,
    })),
    ...locations.map((location) => ({
      id: location.id,
      type: "location" as const,
      title: location.name,
      excerpt: `${location.scenes.length} scene(s), risk score ${location.riskScore}.`,
      confidence: 0.82,
      telawhyId,
    })),
  ];
}

function parseHeadingBody(body: string): { location: string; timeOfDay: string } {
  const parts = body.split(/\s+-\s+|\s+–\s+/).map((part) => normalizeWhitespace(part));
  const maybeTime = parts.at(-1)?.toUpperCase() ?? "UNKNOWN";
  const hasKnownTime = timeMarkers.some((marker) => maybeTime.includes(marker));

  return {
    location: (hasKnownTime ? parts.slice(0, -1).join(" - ") : parts.join(" - ")) || "UNKNOWN LOCATION",
    timeOfDay: hasKnownTime ? maybeTime : "UNKNOWN",
  };
}

function extractCharacterCues(block: string): string[] {
  const cues = new Set<string>();
  const lines = block.split("\n").map((line) => line.trim());

  for (const line of lines) {
    const normalized = normalizeWhitespace(line.replace(/\s*\(.*\)\s*$/, ""));

    if (!isLikelyCharacterCue(normalized)) {
      continue;
    }

    cues.add(normalized);
  }

  return [...cues].sort();
}

function isLikelyCharacterCue(line: string): boolean {
  if (!line || line.length < 2 || line.length > 34) {
    return false;
  }

  if (excludedCharacterCues.has(line) || line.endsWith(":")) {
    return false;
  }

  if (sceneHeadingPattern.test(line) || /\d/.test(line)) {
    return false;
  }

  return /^[A-Z][A-Z '’.-]+$/.test(line);
}

function deriveDependencies(block: string, actionCoordination: boolean): string[] {
  const dependencies = new Set<string>();
  const normalized = block.toLowerCase();

  if (actionCoordination) dependencies.add("Action coordination review");
  if (normalized.includes("car") || normalized.includes("vehicle")) dependencies.add("Vehicle coordination");
  if (normalized.includes("fire") || normalized.includes("flame")) dependencies.add("Fire safety review");
  if (normalized.includes("gun") || normalized.includes("weapon")) dependencies.add("Weapons safety review");
  if (normalized.includes("crowd")) dependencies.add("Background coordination");
  if (normalized.includes("night")) dependencies.add("Night shoot logistics");

  return [...dependencies];
}

function deriveSceneRisks(location: string, block: string, actionCoordination: boolean): string[] {
  const risks = new Set<string>();
  const haystack = `${location} ${block}`.toLowerCase();

  if (actionCoordination) risks.add("Action coordination required");
  if (containsAny(haystack, highRiskLocationKeywords)) risks.add("Location logistics require verification");
  if (haystack.includes("fire") || haystack.includes("flame")) risks.add("Fire safety risk");
  if (haystack.includes("gun") || haystack.includes("weapon")) risks.add("Weapons safety risk");
  if (haystack.includes("night")) risks.add("Night work risk");

  return [...risks];
}

function scoreLocationRisk(name: string, risks: string[], sceneCount: number): number {
  let score = Math.min(4, sceneCount);
  const normalized = name.toLowerCase();

  score += risks.length * 2;
  if (containsAny(normalized, highRiskLocationKeywords)) score += 3;

  return Math.min(10, score);
}

function containsAny(value: string, terms: string[]): boolean {
  const normalized = value.toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function mapPrefix(prefix: string): Scene["interiorExterior"] {
  if (prefix.startsWith("INT/EXT")) return "INT/EXT";
  if (prefix.startsWith("I/E")) return "I/E";
  if (prefix.startsWith("INT")) return "INT";
  if (prefix.startsWith("EXT")) return "EXT";
  return "UNKNOWN";
}

function inferTitle(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function excerptFor(value: string): string {
  return normalizeWhitespace(value).slice(0, 280);
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
