import { type Provider, type InsertProvider, type Review, type InsertReview, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";
import { DatabaseStorage } from "./database";

export interface IStorage {
  // Provider methods
  getProvider(id: string): Promise<Provider | undefined>;
  getAllProviders(): Promise<Provider[]>;
  createProvider(provider: InsertProvider): Promise<Provider>;
  
  // Review methods
  getReviewsByProviderId(providerId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByProviderId(providerId: string): Promise<Booking[]>;
}

export class MemStorage implements IStorage {
  private providers: Map<string, Provider>;
  private reviews: Map<string, Review>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.providers = new Map();
    this.reviews = new Map();
    this.bookings = new Map();
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add sample provider
    const providerId = randomUUID();
    const provider: Provider = {
      id: providerId,
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
    };
    this.providers.set(providerId, provider);

    // Add sample reviews
    const reviews = [
      {
        id: randomUUID(),
        providerId,
        customerName: "Sarah Johnson",
        customerInitials: "SJ",
        rating: 5,
        comment: "Maria is absolutely fantastic! She transformed my home and the attention to detail is incredible. My family feels so much more relaxed coming home to a spotless house. Highly recommend!",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      },
      {
        id: randomUUID(),
        providerId,
        customerName: "Michael Chen",
        customerInitials: "MC",
        rating: 5,
        comment: "Professional, reliable, and trustworthy. Maria has been cleaning our home for 6 months and we couldn't be happier. Great communication and always on time. 5 stars!",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      },
      {
        id: randomUUID(),
        providerId,
        customerName: "Lisa Thompson",
        customerInitials: "LT",
        rating: 4,
        comment: "Very thorough cleaning service! Maria is detail-oriented and uses quality eco-friendly products. My kids and pets are safe, and the house smells amazing. Will book again!",
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
      },
    ];

    reviews.forEach(review => {
      this.reviews.set(review.id, review);
    });
  }

  async getProvider(id: string): Promise<Provider | undefined> {
    return this.providers.get(id);
  }

  async getAllProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values());
  }

  async createProvider(insertProvider: InsertProvider): Promise<Provider> {
    const id = randomUUID();
    const provider: Provider = { 
      ...insertProvider, 
      id,
      reviewCount: insertProvider.reviewCount ?? 0,
      imageUrl: insertProvider.imageUrl ?? null,
      verified: insertProvider.verified ?? 1,
      backgroundChecked: insertProvider.backgroundChecked ?? 1,
      insured: insertProvider.insured ?? 1,
      topRated: insertProvider.topRated ?? 0,
    };
    this.providers.set(id, provider);
    return provider;
  }

  async getReviewsByProviderId(providerId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.providerId === providerId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id,
      createdAt: new Date()
    };
    this.reviews.set(id, review);
    return review;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      customerName: insertBooking.customerName ?? null,
      customerEmail: insertBooking.customerEmail ?? null,
      customerPhone: insertBooking.customerPhone ?? null,
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByProviderId(providerId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.providerId === providerId
    );
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
