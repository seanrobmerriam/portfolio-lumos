import { attachDatabasePool } from "@neon/functions";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!.replace("sslmode=require", "sslmode=verify-full"),
  max: 5,
});
attachDatabasePool(pool);

const files = new Files({ adapter: neon({ bucket: "assets" }) });

const allowedOrigins = new Set(
  (process.env.CONTACT_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const LIMITS = { first_name: 100, last_name: 100, email: 254, message: 5000 } as const;
type Field = keyof typeof LIMITS;
type Submission = Record<Field, string>;

function cors(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins.has(origin)) return { Vary: "Origin" };
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, Content-Type",
    Vary: "Origin",
  };
}

function json(request: Request, status: number, body: unknown): Response {
  return Response.json(body, { status, headers: cors(request) });
}

async function readSubmission(request: Request): Promise<Submission | string> {
  const type = request.headers.get("content-type") ?? "";
  let read: (field: Field) => unknown;

  if (type.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    read = (field) => body?.[field];
  } else if (type.includes("multipart/form-data") || type.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    read = (field) => form.get(field);
  } else {
    return "Unsupported content type";
  }

  const submission = {} as Submission;
  for (const field of Object.keys(LIMITS) as Field[]) {
    const value = read(field);
    if (typeof value !== "string" || !value.trim()) return `${field} is required`;
    if (value.length > LIMITS[field]) return `${field} is too long`;
    submission[field] = value.trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) return "email is invalid";
  return submission;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(request) });
    }
    if (request.method !== "POST") return json(request, 405, { error: "Method not allowed" });

    const origin = request.headers.get("origin");
    if (origin && !allowedOrigins.has(origin)) return json(request, 403, { error: "Origin not allowed" });
    if (Number(request.headers.get("content-length") ?? 0) > 64_000) {
      return json(request, 413, { error: "Submission too large" });
    }

    let submission: Submission | string;
    try {
      submission = await readSubmission(request);
    } catch {
      return json(request, 400, { error: "Malformed body" });
    }
    if (typeof submission === "string") return json(request, 400, { error: submission });

    const id = crypto.randomUUID();
    const createdAt = new Date();

    // Archive the raw submission first; the row still lands if storage is down.
    let archiveKey: string | null = `contact-submissions/${id}.json`;
    try {
      await files.upload(archiveKey, JSON.stringify({ id, ...submission, created_at: createdAt }), {
        contentType: "application/json",
      });
    } catch (error) {
      console.error("[contact] archive failed", error);
      archiveKey = null;
    }

    try {
      await pool.query(
        `INSERT INTO contact_submissions (id, first_name, last_name, email, message, archive_key, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, submission.first_name, submission.last_name, submission.email, submission.message, archiveKey, createdAt],
      );
    } catch (error) {
      console.error("[contact] insert failed", error);
      return json(request, 500, { error: "Could not save submission" });
    }

    return json(request, 201, { id });
  },
};
