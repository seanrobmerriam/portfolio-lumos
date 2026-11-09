import { DATABASE_URL, NEON_REALTIME_SECRET } from "astro:env/server";
import { createRealtime, rawSql } from "@neon/realtime/server";

export type ContactSubmission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  archive_key: string | null;
  created_at: Date;
};

export const realtime = createRealtime({
  secret: NEON_REALTIME_SECRET,
  db: new URL(DATABASE_URL).pathname.slice(1),
});

/** Newest submissions first. Only sealed for admins, see `/api/admin/submissions/live`. */
export const latestSubmissions = () =>
  rawSql<ContactSubmission>(
    `SELECT id, first_name, last_name, email, message, archive_key, created_at
     FROM contact_submissions ORDER BY created_at DESC LIMIT 100`,
  );
