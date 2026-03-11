import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RestaurantCard } from "@/components/RestaurantCard";
import { UtensilsCrossed, Trophy, Clock, CreditCard, QrCode, Gift } from "lucide-react";

export const LandingPage = () => {
  const featuredRestaurants = [
  {
    id: "1",
    name: "Burger King",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop",
    cuisine: "American, Burgers",
    rating: 4.5,
    deliveryTime: "15-25 min",
    pointsPerDollar: 2
  },
  {
    id: "2",
    name: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2340&auto=format&fit=crop",
    cuisine: "Italian, Pizza",
    rating: 4.7,
    deliveryTime: "20-30 min",
    pointsPerDollar: 3
  },
  {
    id: "3",
    name: "Sushi Spot",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2340&auto=format&fit=crop",
    cuisine: "Japanese, Sushi",
    rating: 4.8,
    deliveryTime: "25-35 min",
    pointsPerDollar: 4
  }];


  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 z-10" />
        <div className="relative h-[600px] bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container absolute inset-0 flex items-center z-20">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Eat, Earn, Enjoy Rewards
            </h1>
            <p className="text-xl mb-8 leading-relaxed">
              Your favorite restaurants, all in one place. Order food, collect stamps, earn points with every purchase, and unlock exclusive rewards. Join thousands of food lovers today!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 backdrop-blur-sm">
                <Link to="/restaurants">Browse Restaurants</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start earning rewards with every meal
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl border shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">1. Order Food</h3>
              <p className="text-muted-foreground">
                Browse and order from your favorite local restaurants or visit them in person.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <QrCode className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">2. Collect Stamps</h3>
              <p className="text-muted-foreground">
                Show your QR code when ordering to collect stamps and earn points automatically.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl border shadow-sm text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
                <Gift className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">3. Redeem Rewards</h3>
              <p className="text-muted-foreground">
                Use your stamps and points for free meals, discounts, and exclusive perks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              More than just a food ordering platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <Trophy className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Points on Every Order</h3>
              <p className="text-muted-foreground">
                Earn points with every purchase that you can redeem for amazing rewards.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <CreditCard className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Digital Stamp Cards</h3>
              <p className="text-muted-foreground">
                No more physical cards - collect digital stamps for your favorite spots.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast & Convenient</h3>
              <p className="text-muted-foreground">
                Order ahead or show your QR code in-store for quick and easy service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Restaurants</h2>
            <p className="text-xl text-muted-foreground">
              Discover amazing places near you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredRestaurants.map((restaurant) =>
            <RestaurantCard key={restaurant.id} {...restaurant} />
            )}
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/restaurants">View All Restaurants</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Earning Rewards?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of food lovers and start collecting rewards with every meal today!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/auth">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 backdrop-blur-sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </>);

};