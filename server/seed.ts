import { db } from "./database";
import { providers, reviews } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingProviders = await db.select().from(providers).limit(1);
    if (existingProviders.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with initial data...");

    // Insert sample provider
    const [provider] = await db.insert(providers).values({
      name: "Maria Rodriguez",
      bio: "Professional house cleaner with 8+ years experience serving busy families across NYC. Specializing in deep cleaning, eco-friendly products, and maintaining spotless homes. Trusted by 100+ families for reliable, thorough cleaning services. Available weekdays and weekends with flexible scheduling to fit your lifestyle.",
      rating: 5,
      reviewCount: 127,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
      location: "New York, NY",
      verified: 1,
      backgroundChecked: 1,
      insured: 1,
      topRated: 1,
    }).returning();

    // Insert sample reviews
    const reviewsData = [
      {
        providerId: provider.id,
        customerName: "Sarah Johnson",
        customerInitials: "SJ",
        rating: 5,
        comment: "Maria is absolutely fantastic! She transformed my home and the attention to detail is incredible. My family feels so much more relaxed coming home to a spotless house. Highly recommend!",
      },
      {
        providerId: provider.id,
        customerName: "Michael Chen",
        customerInitials: "MC",
        rating: 5,
        comment: "Professional, reliable, and trustworthy. Maria has been cleaning our home for 6 months and we couldn't be happier. Great communication and always on time. 5 stars!",
      },
      {
        providerId: provider.id,
        customerName: "Lisa Thompson",
        customerInitials: "LT",
        rating: 4,
        comment: "Very thorough cleaning service! Maria is detail-oriented and uses quality eco-friendly products. My kids and pets are safe, and the house smells amazing. Will book again!",
      },
    ];

    await db.insert(reviews).values(reviewsData);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}