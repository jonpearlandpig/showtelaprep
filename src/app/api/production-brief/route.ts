import { getProductionBrief } from "@/lib/services/filmakb-service";

export async function GET() {
  const brief = await getProductionBrief();
  return Response.json(brief);
}
