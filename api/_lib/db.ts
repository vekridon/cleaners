// api/_lib/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../shared/schema";

let _pool: Pool | undefined;
let _db: ReturnType<typeof drizzle> | undefined;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

export function getDb() {
  if (!_pool) {
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  if (!_db) {
    _db = drizzle(_pool, { schema });
  }
  return _db;
}
