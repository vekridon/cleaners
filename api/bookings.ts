// (optional) export const config = { runtime: "nodejs" };

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "POST") {
      const { providerId } = req.body ?? {};
      if (!providerId) return res.status(400).json({ error: "providerId required" });

      const { rows } = await pool.query(
        "insert into bookings (provider_id) values ($1) returning id::int as id, provider_id::int as providerId, timestamp",
        [providerId]
      );
      return res.status(201).json(rows[0]);
    }

    if (req.method === "GET") {
      const { rows } = await pool.query(
        "select id::int as id, provider_id::int as providerId, timestamp from bookings order by id desc limit 50"
      );
      return res.status(200).json(rows);
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).end("Method Not Allowed");
  } catch (e: any) {
    res.status(500).json({ error: String(e?.message || e) });
  }
}
