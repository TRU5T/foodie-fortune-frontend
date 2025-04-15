
import { useState } from "react";
import { RewardCard } from "@/components/RewardCard";
import { PointsSummary } from "@/components/PointsSummary";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Rewards = () => {
  const [activeTab, setActiveTab] = useState("available");
  
  // Mock data
  const availableRewards = [
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
    {
      title: "10% Off Next Order",
      pointsRequired: 250,
      currentPoints: 350,
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2215&auto=format&fit=crop",
      expiryDate: "June 15, 2025",
      isUnlocked: true,
    },
    {
      title: "Free Dessert",
      pointsRequired: 300,
      currentPoints: 350,
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2340&auto=format&fit=crop",
      expiryDate: "May 20, 2025",
      isUnlocked: true,
    },
    {
      title: "Free Large Drink",
      pointsRequired: 150,
      currentPoints: 350,
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=2340&auto=format&fit=crop",
      expiryDate: "June 1, 2025",
      isUnlocked: true,
    },
    {
      title: "Premium Membership",
      pointsRequired: 1000,
      currentPoints: 350,
      image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2340&auto=format&fit=crop",
      expiryDate: "December 31, 2025",
      isUnlocked: false,
    },
  ];
  
  const redeemedRewards = [
    {
      title: "Free Coffee",
      pointsRequired: 100,
      currentPoints: 350,
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2338&auto=format&fit=crop",
      expiryDate: "Used on April 10, 2025",
      isUnlocked: true,
    },
    {
      title: "Free Appetizer",
      pointsRequired: 200,
      currentPoints: 350,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop",
      expiryDate: "Used on March 5, 2025",
      isUnlocked: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">My Rewards</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <PointsSummary 
                points={350} 
                level="Silver" 
                nextLevelPoints={500} 
                lifetimePoints={1250}
              />
              
              <div className="mt-8 bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Membership Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs text-primary font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Silver Member</p>
                      <p className="text-xs text-muted-foreground">2x points on orders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                      <span className="text-xs text-muted-foreground">+</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gold Member</p>
                      <p className="text-xs text-muted-foreground">3x points on orders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                      <span className="text-xs text-muted-foreground">+</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Platinum Member</p>
                      <p className="text-xs text-muted-foreground">4x points on orders</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">View All Benefits</Button>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="available">Available Rewards</TabsTrigger>
                  <TabsTrigger value="redeemed">Redeemed Rewards</TabsTrigger>
                </TabsList>
                
                <TabsContent value="available" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableRewards.map((reward, index) => (
                      <RewardCard key={index} {...reward} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="redeemed" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {redeemedRewards.map((reward, index) => (
                      <RewardCard key={index} {...reward} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rewards;
