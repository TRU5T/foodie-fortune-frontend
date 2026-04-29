import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { RestaurantCard } from "@/components/RestaurantCard";
import { PointsSummary } from "@/components/PointsSummary";
import { LandingPage } from "@/components/LandingPage";
import { WalletStampCards } from "@/components/WalletStampCards";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRestaurants } from "@/hooks/useRestaurants";
import { ArrowRight, UtensilsCrossed, Trophy, Clock, Stamp } from "lucide-react";

const Index = () => {
  const { user, profile, isLoading } = useAuth();
  const { role, isLoading: isLoadingRole } = useUserRole();
  const isMobile = useIsMobile();
  const { data: restaurants = [] } = useRestaurants();

  // Show landing page for non-authenticated users
  if (!isLoading && !user) {
    return <LandingPage />;
  }

  // Show loading state
  if (isLoading || isLoadingRole) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect vendors/admins to their dashboards
  if (role === 'vendor') {
    return <Navigate to="/vendor-dashboard" replace />;
  }
  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Show wallet-style stamp cards on mobile for customers
  if (isMobile && role === 'customer') {
    return <WalletStampCards />;
  }

  const featuredRestaurants = (restaurants ?? []).slice(0, 3);
  const totalPoints = profile?.total_points ?? 0;
  const loyaltyLevel = profile?.loyalty_level || 'Bronze';

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 z-10" />
        <div className="relative h-[420px] bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container absolute inset-0 flex items-center z-20">
          <div className="max-w-xl text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-lg mb-6">
              Visit your favourite spots, scan your QR code, and watch your stamps stack up.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/my-stamp-cards">
                  <Stamp className="mr-2 h-5 w-5" />
                  My Stamp Cards
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/restaurants">Explore Restaurants</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg text-center border">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Restaurants</h3>
              <p className="text-muted-foreground">Browse and visit restaurants in your area to collect stamps.</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center border">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collect Stamps</h3>
              <p className="text-muted-foreground">Collect stamps with every visit. The more you visit, the more rewards you earn!</p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center border">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
              <p className="text-muted-foreground">Complete your stamp card to get free items and other exclusive rewards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Points / Stamp Cards Summary */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PointsSummary
                points={totalPoints}
                level={loyaltyLevel}
                nextLevelPoints={500}
                lifetimePoints={totalPoints}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Stamp Cards</h2>
                <Button asChild variant="ghost" className="gap-1">
                  <Link to="/my-stamp-cards">
                    View All <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="bg-card border rounded-xl p-8 text-center">
                <Stamp className="h-10 w-10 text-primary mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  Track your progress at every restaurant in one place.
                </p>
                <Button asChild>
                  <Link to="/my-stamp-cards">Open My Cards</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Restaurants</h2>
              <Button asChild variant="ghost" className="gap-1">
                <Link to="/restaurants">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRestaurants.map((r: any) => (
                <RestaurantCard
                  key={r.id}
                  id={r.id}
                  name={r.name}
                  image={r.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2340&auto=format&fit=crop"}
                  cuisine={r.cuisine || "Restaurant"}
                  rating={r.rating ?? 4.5}
                  deliveryTime={r.delivery_time || "—"}
                  pointsPerDollar={r.points_per_dollar ?? 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Index;
