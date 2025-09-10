import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { type Provider } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  Shield,
  Award,
  Clock,
  Leaf,
  Home as HomeIcon,
  Users,
  Check,
  MapPin,
  Crown,
  Calendar,
  LoaderPinwheel,
} from "lucide-react";

export default function Home() {
  const [isReviewsSorted, setIsReviewsSorted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { toast } = useToast();

  // Fetch providers (we'll use the first one for this single-provider view)
  const {
    data: providers = [],
    isLoading: providersLoading,
    error: providersError,
  } = useQuery<Provider[]>({
    // bump key to avoid stale cached shape
    queryKey: ["/api/providers?v=2"],
    // tolerate both shapes: array OR { providers: [...] }
    select: (data: any) =>
      (Array.isArray(data) ? data : data?.providers ?? []).map((p: any) => ({
        ...p,
        id: Number(p.id), // ensure numeric id for UI logic
      })),
  });

  const provider = providers?.[0];

  // Use hardcoded reviews since the reviews table might not exist yet
  const reviews = provider
    ? [
        {
          id: 1,
          providerId: provider.id,
          customerName: "Sarah Johnson",
          customerInitials: "SJ",
          rating: 5,
          comment: `${provider.name} is absolutely fantastic! Professional, reliable, and always on time. The attention to detail is incredible and my home feels spotless after every visit.`,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          id: 2,
          providerId: provider.id,
          customerName: "Michael Chen",
          customerInitials: "MC",
          rating: 5,
          comment:
            "Excellent service! Very thorough cleaning and uses eco-friendly products. Great communication and flexible scheduling. Highly recommend!",
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          id: 3,
          providerId: provider.id,
          customerName: "Lisa Thompson",
          customerInitials: "LT",
          rating: 4,
          comment:
            "Professional and trustworthy cleaner. Always leaves my home spotless and smelling fresh. Will definitely book again!",
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        },
      ]
    : [];

  const reviewsLoading = false;

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (providerId: string) => {
      const response = await apiRequest("POST", "/api/bookings", {
        providerId: parseInt(providerId, 10),
      });
      return response.json();
    },
    onSuccess: () => {
      setShowSuccessModal(true);
      toast({
        title: "Booking Saved!",
        description: "Your booking request has been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description:
          "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSortReviews = () => {
    setIsReviewsSorted(!isReviewsSorted);
  };

  const handleBookNow = () => {
    if (provider) {
      bookingMutation.mutate(provider.id.toString());
    }
  };

  const sortedReviews = reviews
    ? [...reviews].sort((a, b) => {
        if (isReviewsSorted) {
          return b.rating - a.rating;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
    : [];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return "1 week ago";
    if (diffInDays < 21) return "2 weeks ago";
    if (diffInDays < 28) return "3 weeks ago";
    if (diffInDays < 60) return "1 month ago";

    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (providersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (providersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p className="text-muted-foreground">
            Failed to load providers: {String(providersError)}
          </p>
        </Card>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p className="text-muted-foreground">No providers available wahhahahaha</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background font-lato text-foreground min-h-screen">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-poppins font-bold text-xl" data-testid="header-title">
              CleanConnect
            </h1>
            <div className="flex items-center space-x-2 text-sm" data-testid="service-area">
              <MapPin className="h-4 w-4" />
              <span>NY, NJ, PA</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Provider Profile */}
        <Card className="bg-card rounded-lg shadow-lg overflow-hidden mb-6" data-testid="provider-profile">
          {/* Provider Header */}
          <div className="bg-primary text-primary-foreground p-6">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg" data-testid="provider-avatar">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                    alt={`${provider.name} profile`}
                  />
                  <AvatarFallback>
                    {provider.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="text-white h-3 w-3" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-poppins font-bold text-xl mb-1" data-testid="provider-name">
                  {provider.name}
                </h2>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-300 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-medium" data-testid="provider-rating">
                    {provider.rating ? `${provider.rating.toFixed(1)}` : "No rating"} (3 reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="bg-white/20 px-2 py-1 rounded-full flex items-center" data-testid="badge-background-checked">
                    <Shield className="h-3 w-3 mr-1" />
                    Background Checked
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded-full flex items-center" data-testid="badge-insured">
                    <Award className="h-3 w-3 mr-1" />
                    Insured
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-Rated Badge */}
          <div className="px-6 py-3 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b">
            <Badge variant="secondary" className="golden-beige inline-flex items-center" data-testid="badge-top-rated">
              <Crown className="h-4 w-4 mr-2 text-yellow-600" />
              Top-Rated Provider
            </Badge>
          </div>

          {/* Provider Bio */}
          <div className="p-6">
            <h3 className="font-poppins font-semibold text-lg mb-3 soft-teal">
              About {provider.name.split(" ")[0]}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4" data-testid="provider-bio">
              {provider.bio ||
                "Professional house cleaner with years of experience providing quality cleaning services."}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="text-primary mr-2 h-4 w-4" />
                <span>Flexible Hours</span>
              </div>
              <div className="flex items-center">
                <Leaf className="text-green-500 mr-2 h-4 w-4" />
                <span>Eco-Friendly</span>
              </div>
              <div className="flex items-center">
                <HomeIcon className="text-primary mr-2 h-4 w-4" />
                <span>Residential Expert</span>
              </div>
              <div className="flex items-center">
                <Users className="text-primary mr-2 h-4 w-4" />
                <span>Family-Focused</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        <Card className="bg-card rounded-lg shadow-lg p-6 mb-6" data-testid="reviews-section">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-poppins font-semibold text-lg soft-teal">Customer Reviews</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSortReviews}
              className="text-muted-foreground"
              data-testid="button-sort-reviews"
            >
              <Star className="h-4 w-4 mr-2" />
              {isReviewsSorted ? "Sort by Date" : "Sort by Highest Rating"}
            </Button>
          </div>

          {reviewsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4" data-testid="reviews-container">
              {sortedReviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`border-b border-border pb-4 ${index === sortedReviews.length - 1 ? "border-b-0" : ""}`}
                  data-testid={`review-${review.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium text-sm">
                        {review.customerInitials}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm" data-testid={`review-customer-${review.id}`}>
                          {review.customerName}
                        </span>
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-current" : ""}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed" data-testid={`review-comment-${review.id}`}>
                        {review.comment}
                      </p>
                      <span className="text-xs text-muted-foreground mt-2 block" data-testid={`review-date-${review.id}`}>
                        {formatTimeAgo(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Booking Section */}
        <Card className="bg-card rounded-lg shadow-lg p-6" data-testid="booking-section">
          <div className="text-center">
            <h3 className="font-poppins font-semibold text-lg mb-2">
              Ready to Book {provider.name.split(" ")[0]}?
            </h3>
            <p className="text-muted-foreground mb-4">
              Join our satisfied customers with professional cleaning services
            </p>

            <div className="bg-muted rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Check className="text-green-500 mr-2 h-4 w-4" />
                  <span>Instant Booking</span>
                </div>
                <div className="flex items-center">
                  <Shield className="text-primary mr-2 h-4 w-4" />
                  <span>Insured & Bonded</span>
                </div>
                <div className="flex items-center">
                  <Award className="text-red-400 mr-2 h-4 w-4" />
                  <span>Satisfaction Guarantee</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full warm-coral text-white font-semibold py-4 px-6 text-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg transform hover:scale-[1.02] mb-3"
              onClick={handleBookNow}
              disabled={bookingMutation.isPending}
              data-testid="button-book-now"
            >
              {bookingMutation.isPending ? (
                <>
                  <LoaderPinwheel className="mr-2 h-5 w-5 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book {provider.name.split(" ")[0]} Now
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Free cancellation • Secure payment • Background-checked professionals
            </p>
          </div>
        </Card>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" data-testid="success-modal">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-500 h-8 w-8" />
              </div>
              <h3 className="font-poppins font-semibold text-lg mb-2">Booking Saved!</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Your booking request has been submitted. {provider.name.split(" ")[0]} will contact you within 24 hours to confirm your appointment.
              </p>
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full"
                data-testid="button-close-success"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
