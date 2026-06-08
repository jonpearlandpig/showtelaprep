import { z } from "zod";
import { createArtifactIntake, ingestScriptArtifact } from "@/lib/services/filmakb-service";

const artifactSchema = z.object({
  productionId: z.string().optional(),
  filename: z.string().min(1),
  artifactType: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Missing screenplay file." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await ingestScriptArtifact({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      buffer,
      productionId: formData.get("productionId")?.toString(),
    });

    return Response.json(result, { status: 201 });
  }

  const payload = artifactSchema.safeParse(await request.json());

  if (!payload.success) {
    return Response.json({ error: "Invalid artifact intake request." }, { status: 400 });
  }

  const result = await createArtifactIntake(payload.data);
  return Response.json(result, { status: 201 });
}
