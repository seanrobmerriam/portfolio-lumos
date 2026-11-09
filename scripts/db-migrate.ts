import { readdir, readFile } from "node:fs/promises";
import pg from "pg";

const dir = new URL("../db/migrations/", import.meta.url);
const url = process.env.DATABASE_URL_UNPOOLED;
if (!url) throw new Error("DATABASE_URL_UNPOOLED is not set. Run `neon env pull`.");

const client = new pg.Client({
  connectionString: url.replace("sslmode=require", "sslmode=verify-full"),
});
await client.connect();

try {
  for (const file of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
    await client.query(await readFile(new URL(file, dir), "utf8"));
    console.log(`applied ${file}`);
  }
} finally {
  await client.end();
}
