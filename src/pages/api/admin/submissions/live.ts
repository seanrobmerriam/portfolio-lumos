import type { APIRoute } from "astro";
import { getAdmin } from "@/lib/auth.ts";
import { latestSubmissions, realtime } from "@/lib/realtime.ts";

export const prerender = false;

export const POST: APIRoute = async () => {
  const { status } = await getAdmin();
  if (status !== 200) {
    return Response.json({ error: status === 401 ? "Unauthorized" : "Forbidden" }, { status });
  }
  const sealed = await realtime.seal({ query: latestSubmissions() });
  return Response.json(sealed, { headers: { "Cache-Control": "no-store" } });
};
