
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessPlanCard } from "@/components/BusinessPlanCard";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Award, BarChart3, CreditCard, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useVendorRewards } from "@/hooks/useVendorRewards";
import { useVendorSubscription } from "@/hooks/useVendorSubscription";

const BusinessSubscription = () => {
  const { user } = useAuth();
  const { restaurants } = useVendorRewards();
  const firstRestaurant = restaurants?.[0];
  const { subscription, isActive, subscribe } = useVendorSubscription(firstRestaurant?.id);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const handleSubscribe = () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be signed in as a vendor to subscribe.", variant: "destructive" });
      return;
    }
    if (!firstRestaurant) {
      toast({ title: "No restaurant found", description: "You need a restaurant set up before subscribing.", variant: "destructive" });
      return;
    }
    subscribe.mutate({ restaurantId: firstRestaurant.id, billingCycle });
  };

  const monthlyPrice = 20;
  const annualPrice = 16; // ~20% savings

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary/10 py-16">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">For Businesses</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join Redeemr and grow your business with our powerful ordering
                and loyalty platform. Simple $20/mo pricing.
              </p>
              {isActive && (
                <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
                  ✓ Your subscription is active
                </div>
              )}
              <div className="flex justify-center gap-4">
                <Button size="lg" className="gap-2" onClick={handleSubscribe} disabled={isActive || subscribe.isPending}>
                  <ShoppingBag className="h-5 w-5" />
                  {isActive ? "Already Subscribed" : subscribe.isPending ? "Activating..." : "Start Free Trial"}
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-5 w-5" />
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-16">
          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: ShoppingBag, title: "Online Ordering", desc: "Seamless online ordering system integrated with your menu." },
              { icon: Award, title: "Loyalty Program", desc: "Digital stamp cards and rewards to keep customers coming back." },
              { icon: BarChart3, title: "Analytics", desc: "Detailed insights about your customers and their ordering habits." },
              { icon: CreditCard, title: "Payment Processing", desc: "Secure payment processing with multiple options." },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              One plan, everything included. No hidden fees.
              Tier 2 vendors pay no monthly fee — we take a small 10% cut of each sale instead.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-border p-1">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === "annual" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setBillingCycle("annual")}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <BusinessPlanCard
              name="Tier 1 — Rewards"
              price={billingCycle === "monthly" ? monthlyPrice : annualPrice}
              features={[
                "Digital stamp & point cards",
                "QR code scanning",
                "Customer loyalty tracking",
                "Basic analytics",
                "Email support",
              ]}
              isCurrentPlan={isActive && !firstRestaurant?.vendor_tier?.includes("tier_2")}
              onSelect={handleSubscribe}
            />
            <BusinessPlanCard
              name="Tier 2 — Ordering"
              price={0}
              features={[
                "Everything in Tier 1",
                "In-app food ordering",
                "Menu management",
                "Customer payments",
                "10% platform fee per sale",
                "Priority support",
              ]}
              isPopular
              isCurrentPlan={isActive && firstRestaurant?.vendor_tier === "tier_2"}
              onSelect={() => toast({ title: "Upgrade available", description: "Request a Tier 2 upgrade from your Vendor Dashboard." })}
            />
          </div>

          <div className="bg-muted rounded-lg p-8 mt-16">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Need a custom solution?</h3>
              <p className="text-muted-foreground mb-6">
                Let us build a tailored plan for your business with custom features
                and integrations specific to your needs.
              </p>
              <Button size="lg">Contact Sales</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessSubscription;
