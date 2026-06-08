import { z } from "zod";
import { askTela } from "@/lib/services/filmakb-service";

const askTelaSchema = z.object({
  question: z.string().min(1),
  productionId: z.string().optional(),
});

export async function POST(request: Request) {
  const payload = askTelaSchema.safeParse(await request.json());

  if (!payload.success) {
    return Response.json({ error: "Invalid Ask TELA request." }, { status: 400 });
  }

  const answer = await askTela(payload.data.question);
  return Response.json(answer);
}
