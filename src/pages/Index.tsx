
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RewardCard } from "@/components/RewardCard";
import { PointsSummary } from "@/components/PointsSummary";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, UtensilsCrossed, Trophy, Clock } from "lucide-react";

const Index = () => {
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
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
                  <Link to="/restaurants">Order Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/rewards">View Rewards</Link>
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
                <h3 className="text-xl font-semibold mb-2">Order Food</h3>
                <p className="text-muted-foreground">
                  Browse and order from a variety of restaurants in your area.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Points</h3>
                <p className="text-muted-foreground">
                  Earn points with every purchase. The more you order, the more you earn!
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
                <p className="text-muted-foreground">
                  Use your points to get free meals, discounts, and other exclusive rewards.
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
        <section className="py-16 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Download our app to start ordering, earning points, and redeeming rewards on the go!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <a href="#" className="gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
                  App Store
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="#" className="gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Google Play
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
