import { clientHomeData } from "@/app/client/home-data";

export function GET() {
  return Response.json(clientHomeData);
}