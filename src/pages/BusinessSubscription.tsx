
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BusinessPlanCard } from "@/components/BusinessPlanCard";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Award, 
  BarChart3, 
  Users, 
  CreditCard 
} from "lucide-react";

const BusinessSubscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    toast({
      title: "Plan Selected",
      description: `You've selected the ${planName} plan. Continue with payment to activate.`,
    });
  };
  
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
                and loyalty platform. Choose the plan that fits your needs.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Start Free Trial
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Online Ordering</h3>
                <p className="text-sm text-muted-foreground">
                  Seamless online ordering system integrated with your menu.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Loyalty Program</h3>
                <p className="text-sm text-muted-foreground">
                  Digital stamp cards and rewards to keep customers coming back.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed insights about your customers and their ordering habits.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Payment Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Secure payment processing with multiple options.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the plan that best fits your business needs. All plans include our 
              core features with different limits and capabilities.
            </p>
          </div>
          
          <Tabs defaultValue="monthly" className="w-full mb-8">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
                <TabsTrigger value="annual">Annual Billing (Save 20%)</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="monthly">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <BusinessPlanCard
                  name="Starter"
                  price={49}
                  features={[
                    "Digital stamp cards",
                    "Basic online ordering",
                    "Up to 100 orders per month",
                    "Email support",
                    "Basic analytics"
                  ]}
                  isCurrentPlan={selectedPlan === "Starter"}
                  onSelect={() => handleSelectPlan("Starter")}
                />
                
                <BusinessPlanCard
                  name="Growth"
                  price={99}
                  features={[
                    "Everything in Starter",
                    "Custom loyalty program",
                    "Up to 500 orders per month",
                    "Priority support",
                    "Advanced analytics",
                    "Marketing tools"
                  ]}
                  isPopular
                  isCurrentPlan={selectedPlan === "Growth"}
                  onSelect={() => handleSelectPlan("Growth")}
                />
                
                <BusinessPlanCard
                  name="Enterprise"
                  price={199}
                  features={[
                    "Everything in Growth",
                    "Unlimited orders",
                    "Multiple locations",
                    "Dedicated account manager",
                    "API access",
                    "Custom integrations",
                    "White-label option"
                  ]}
                  isCurrentPlan={selectedPlan === "Enterprise"}
                  onSelect={() => handleSelectPlan("Enterprise")}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="annual">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <BusinessPlanCard
                  name="Starter"
                  price={39}
                  features={[
                    "Digital stamp cards",
                    "Basic online ordering",
                    "Up to 100 orders per month",
                    "Email support",
                    "Basic analytics"
                  ]}
                  isCurrentPlan={selectedPlan === "Starter Annual"}
                  onSelect={() => handleSelectPlan("Starter Annual")}
                />
                
                <BusinessPlanCard
                  name="Growth"
                  price={79}
                  features={[
                    "Everything in Starter",
                    "Custom loyalty program",
                    "Up to 500 orders per month",
                    "Priority support",
                    "Advanced analytics",
                    "Marketing tools"
                  ]}
                  isPopular
                  isCurrentPlan={selectedPlan === "Growth Annual"}
                  onSelect={() => handleSelectPlan("Growth Annual")}
                />
                
                <BusinessPlanCard
                  name="Enterprise"
                  price={159}
                  features={[
                    "Everything in Growth",
                    "Unlimited orders",
                    "Multiple locations",
                    "Dedicated account manager",
                    "API access",
                    "Custom integrations",
                    "White-label option"
                  ]}
                  isCurrentPlan={selectedPlan === "Enterprise Annual"}
                  onSelect={() => handleSelectPlan("Enterprise Annual")}
                />
              </div>
            </TabsContent>
          </Tabs>
          
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
