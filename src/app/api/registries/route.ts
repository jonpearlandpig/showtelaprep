import { getRegistries } from "@/lib/services/filmakb-service";

export async function GET() {
  const registries = await getRegistries();

  if (!registries) {
    return Response.json({ error: "Not found in current FilmAKB." }, { status: 404 });
  }

  return Response.json(registries);
}
