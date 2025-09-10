// (optional) export const config = { runtime: "nodejs" };

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: any, res: any) {
  try {
    const { rows } = await pool.query(
      "select id::int as id, name, bio, rating from providers order by id desc"
    );
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(rows); // raw array for your UI
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
