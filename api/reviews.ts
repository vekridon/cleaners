// api/reviews.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getDb } from "./_lib/db";
import { reviews } from "../shared/schema";
import { eq, desc } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = getDb();
  try {
    if (req.method === "GET") {
      const providerId = req.query.providerId as string | undefined;
      if (providerId) {
        const list = await db.select().from(reviews).where(eq(reviews.providerId, Number(providerId))).orderBy(desc(reviews.id));
        return res.status(200).json(list);
      }
      const list = await db.select().from(reviews).orderBy(desc(reviews.id));
      return res.status(200).json(list);
    }
    if (req.method === "POST") {
      const body = req.body;
      const inserted = await db.insert(reviews).values(body).returning();
      return res.status(201).json(inserted[0]);
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error", detail: String(e?.message || e) });
  }
}
