import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Trophy, Clock, CreditCard, QrCode, Gift, Store, Rocket, Bell } from "lucide-react";

export const LandingPage = () => {


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
              <Button asChild size="lg">
                <Link to="/auth?tab=register">Get Started Free</Link>
              </Button>
              <Button asChild size="lg">
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

      {/* Coming Soon / Launching Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Launching Soon
            </div>
            <h2 className="text-4xl font-bold mb-4">Restaurants Are Joining</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're onboarding the best local restaurants in your area. Be the first to know when your favorites go live.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Local Favourites</h3>
              <p className="text-muted-foreground text-sm">
                Your go-to cafés, restaurants, and takeaways — all with loyalty built in.
              </p>
            </div>
            <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <QrCode className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Scan & Stamp</h3>
              <p className="text-muted-foreground text-sm">
                One scan per visit. Watch your stamps stack up and rewards unlock.
              </p>
            </div>
            <div className="bg-muted/50 border border-dashed border-border rounded-xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <Bell className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Notified</h3>
              <p className="text-muted-foreground text-sm">
                Sign up now and we'll let you know the moment restaurants near you go live.
              </p>
            </div>
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/auth?tab=register">Join the Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Business Owners Section */}
      <section className="py-20 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Own a Restaurant?</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Redeemr gives you a digital loyalty programme your customers will actually use. No apps to download, no plastic cards — just a simple QR scan.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Trophy className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Create custom stamp cards & rewards in minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Track customer visits and engagement with real analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Get set up in under 5 minutes — free to start</span>
                </li>
              </ul>
              <Button asChild size="lg">
                <Link to="/business">Learn More</Link>
              </Button>
            </div>
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Your Restaurant</p>
                    <p className="text-xs text-muted-foreground">Stamp card active · 3 rewards</p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center text-lg ${
                        i < 6
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground/30"
                      }`}
                    >
                      {i < 6 ? "★" : "☆"}
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground">6 / 10 stamps collected</p>
              </div>
            </div>
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
            <Button asChild size="lg">
              <Link to="/auth?tab=register">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </>);

};