// api/providers.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import pg from 'pg'

const { Pool } = pg

// Vercel Project Settings → Environment Variables: set DATABASE_URL to your Supabase Postgres URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL on Vercel
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // sample query — adjust to your schema/table
    const { rows } = await pool.query('select * from providers limit 50')
    res.status(200).json({ providers: rows })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch providers', detail: String(err?.message || err) })
  }
}
