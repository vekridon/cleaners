import { pgTable, text, integer, timestamp, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* ---------- providers ---------- */
export const providers = pgTable("providers", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  rating: integer("rating"), // 1–5
});

/* ---------- bookings ---------- */
export const bookings = pgTable("bookings", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  providerId: bigint("provider_id", { mode: "number" })
    .references(() => providers.id)
    .notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

/* ---------- insert schemas ---------- */
export const insertProviderSchema = createInsertSchema(providers).omit({ id: true });

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  timestamp: true, // omit since defaultNow() fills it
});

/* ---------- exported types ---------- */
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providers.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
