// api/providers.ts
export const config = { runtime: "nodejs20.x" };
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
    // 👇 return the array itself
    res.status(200).json(rows);
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
