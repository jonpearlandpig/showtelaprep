import { z } from "zod";
import { createArtifactIntake } from "@/lib/services/filmakb-service";

const artifactSchema = z.object({
  productionId: z.string().optional(),
  filename: z.string().min(1),
  artifactType: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(request: Request) {
  const payload = artifactSchema.safeParse(await request.json());

  if (!payload.success) {
    return Response.json({ error: "Invalid artifact intake request." }, { status: 400 });
  }

  const result = await createArtifactIntake(payload.data);
  return Response.json(result, { status: 201 });
}
