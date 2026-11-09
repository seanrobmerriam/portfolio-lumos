import type { APIRoute } from "astro";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";
import { getAdmin } from "@/lib/auth.ts";

export const prerender = false;

const files = new Files({ adapter: neon({ bucket: "assets" }) });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Redirects an admin to a short-lived presigned URL for the archived submission. */
export const GET: APIRoute = async ({ params }) => {
  const { status } = await getAdmin();
  if (status !== 200) {
    return Response.json({ error: status === 401 ? "Unauthorized" : "Forbidden" }, { status });
  }
  if (!params.id || !UUID.test(params.id)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const key = `contact-submissions/${params.id}.json`;
  if (!(await files.exists(key))) return Response.json({ error: "Not found" }, { status: 404 });

  const url = await files.url(key, { expiresIn: 300 });
  return new Response(null, { status: 302, headers: { Location: url, "Cache-Control": "no-store" } });
};
