import { searchFilmAkb } from "@/lib/services/filmakb-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const results = await searchFilmAkb(q);

  return Response.json(results);
}
