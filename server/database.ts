import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  providers,
  bookings,
  type Provider,
  type Booking,
  type InsertProvider,
  type InsertBooking,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import type { IStorage } from "./storage";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool);

export class DatabaseStorage implements IStorage {
  async getProvider(id: string): Promise<Provider | undefined> {
    const result = await db
      .select()
      .from(providers)
      .where(eq(providers.id, parseInt(id)))
      .limit(1);
    return result[0];
  }

  async getAllProviders(): Promise<Provider[]> {
    return await db.select().from(providers);
  }

  async createProvider(insertProvider: InsertProvider): Promise<Provider> {
    const result = await db.insert(providers).values(insertProvider).returning();
    return result[0];
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(insertBooking).returning();
    return result[0];
  }

  async getBookingsByProviderId(providerId: string): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.providerId, parseInt(providerId)));
  }
}

export { db };
