import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RewardCard } from "@/components/RewardCard";
import { PointsSummary } from "@/components/PointsSummary";
import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { ArrowRight, UtensilsCrossed, Trophy, Clock } from "lucide-react";

const Index = () => {
  const { user, isLoading } = useAuth();
  const { role, isLoading: isLoadingRole } = useUserRole();

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

  // Mock data
  const featuredRestaurants = [
    {
      id: "1",
      name: "Burger King",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop",
      cuisine: "American, Burgers",
      rating: 4.5,
      deliveryTime: "15-25 min",
      pointsPerDollar: 2,
    },
    {
      id: "2",
      name: "Pizza Palace",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2340&auto=format&fit=crop",
      cuisine: "Italian, Pizza",
      rating: 4.7,
      deliveryTime: "20-30 min",
      pointsPerDollar: 3,
    },
    {
      id: "3",
      name: "Sushi Spot",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2340&auto=format&fit=crop",
      cuisine: "Japanese, Sushi",
      rating: 4.8,
      deliveryTime: "25-35 min",
      pointsPerDollar: 4,
    },
  ];
  
  const featuredRewards = [
    {
      title: "Free Burger",
      pointsRequired: 500,
      currentPoints: 350,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2304&auto=format&fit=crop",
      expiryDate: "May 30, 2025",
      isUnlocked: false,
    },
    {
      title: "Free Delivery",
      pointsRequired: 200,
      currentPoints: 350,
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=2671&auto=format&fit=crop",
      expiryDate: "May 15, 2025",
      isUnlocked: true,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 z-10" />
        <div className="relative h-[500px] bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container absolute inset-0 flex items-center z-20">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Delicious Food, Amazing Rewards
            </h1>
            <p className="text-lg mb-6">
              Order from your favorite restaurants and earn points with every purchase. 
              Redeem your points for free meals, discounts, and more!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/restaurants">Explore Restaurants</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/my-stamp-cards">My Stamp Cards</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Restaurants</h3>
              <p className="text-muted-foreground">
                Browse and visit restaurants in your area to collect stamps.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collect Stamps</h3>
              <p className="text-muted-foreground">
                Collect stamps with every visit. The more you visit, the more rewards you earn!
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
              <p className="text-muted-foreground">
                Complete your stamp card to get free items and other exclusive rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Summary Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <PointsSummary 
                points={350} 
                level="Silver" 
                nextLevelPoints={500} 
                lifetimePoints={1250}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Rewards</h2>
                <Button asChild variant="ghost" className="gap-1">
                  <Link to="/rewards">
                    View All <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredRewards.map((reward, index) => (
                  <RewardCard key={index} {...reward} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
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
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Download our app to start ordering, earning points, and redeeming rewards on the go!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <a href="#" className="gap-2">App Store</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#" className="gap-2">Google Play</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
