
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StampCard } from "@/components/StampCard";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Ticket, Coffee, Pizza, Utensils } from "lucide-react";

const MyStampCards = () => {
  const [activeTab, setActiveTab] = useState("active");
  
  // Mock data for stamp cards
  const activeStampCards = [
    {
      restaurantName: "Coffee Express",
      restaurantId: "coffee-express",
      totalStamps: 10,
      currentStamps: 4,
      rewardName: "Free Large Coffee",
      expiryDate: "May 30, 2025",
      icon: <Coffee className="h-10 w-10 text-primary" />,
    },
    {
      restaurantName: "Pizza Palace",
      restaurantId: "2",
      totalStamps: 8,
      currentStamps: 8,
      rewardName: "Free Medium Pizza",
      expiryDate: "June 15, 2025",
      icon: <Pizza className="h-10 w-10 text-primary" />,
    },
    {
      restaurantName: "Taco Time",
      restaurantId: "4",
      totalStamps: 6,
      currentStamps: 2,
      rewardName: "Free Side Dish",
      expiryDate: "July 1, 2025",
      icon: <Utensils className="h-10 w-10 text-primary" />,
    }
  ];
  
  const completedStampCards = [
    {
      restaurantName: "Noodle House",
      restaurantId: "5",
      totalStamps: 5,
      currentStamps: 5,
      rewardName: "Free Appetizer",
      redeemDate: "March 15, 2025",
      icon: <Utensils className="h-10 w-10 text-primary" />,
    },
    {
      restaurantName: "Coffee Express",
      restaurantId: "coffee-express",
      totalStamps: 10,
      currentStamps: 10,
      rewardName: "Free Large Coffee",
      redeemDate: "February 20, 2025",
      icon: <Coffee className="h-10 w-10 text-primary" />,
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">My Stamp Cards</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Stamp Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">14 stamps</p>
                      <p className="text-sm text-muted-foreground">collected this month</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">1 reward</p>
                      <p className="text-sm text-muted-foreground">ready to redeem</p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">Find New Restaurants</Button>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">Recommended Places</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Burger King", id: "1", icon: <Utensils className="h-6 w-6 text-muted-foreground" /> },
                    { name: "Salad Bar", id: "6", icon: <Utensils className="h-6 w-6 text-muted-foreground" /> },
                    { name: "Sushi Spot", id: "3", icon: <Utensils className="h-6 w-6 text-muted-foreground" /> },
                  ].map((place, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {place.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{place.name}</p>
                        <p className="text-xs text-muted-foreground">Earn stamps with every order</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/restaurant/${place.id}`}>Visit</a>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="active">Active Stamp Cards</TabsTrigger>
                  <TabsTrigger value="completed">Completed Stamp Cards</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {activeStampCards.map((stampCard, index) => (
                      <StampCard 
                        key={index}
                        restaurantName={stampCard.restaurantName}
                        restaurantId={stampCard.restaurantId}
                        totalStamps={stampCard.totalStamps}
                        currentStamps={stampCard.currentStamps}
                        rewardName={stampCard.rewardName}
                        expiryDate={stampCard.expiryDate}
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {completedStampCards.map((stampCard, index) => (
                      <StampCard 
                        key={index}
                        restaurantName={stampCard.restaurantName}
                        restaurantId={stampCard.restaurantId}
                        totalStamps={stampCard.totalStamps}
                        currentStamps={stampCard.currentStamps}
                        rewardName={stampCard.rewardName}
                        expiryDate={`Redeemed on ${stampCard.redeemDate}`}
                      />
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

export default MyStampCards;
