import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const providers = pgTable("providers", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  rating: integer("rating"),
});

export const reviews = pgTable("reviews", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  providerId: bigint("provider_id", { mode: "number" }).references(() => providers.id).notNull(),
  customerName: text("customer_name").notNull(),
  customerInitials: text("customer_initials").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  providerId: bigint("provider_id", { mode: "number" }).references(() => providers.id).notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

export const insertProviderSchema = createInsertSchema(providers).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providers.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
