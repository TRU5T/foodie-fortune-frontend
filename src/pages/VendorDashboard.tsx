import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Store } from "lucide-react";
import { useVendorRewards } from "@/hooks/useVendorRewards";
import { RewardManagement } from "@/components/vendor/RewardManagement";
import { CreateRewardDialog } from "@/components/vendor/CreateRewardDialog";

const VendorDashboard = () => {
  const { restaurants, isLoadingRestaurants } = useVendorRewards();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoadingRestaurants) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8">
          <Card>
            <CardHeader>
              <CardTitle>No Restaurants Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You haven't set up any restaurants yet. Contact support to get started.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const activeRestaurant = selectedRestaurant || restaurants[0].id;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Manage your stamp card rewards</p>
        </div>

        {restaurants.length > 1 && (
          <Tabs value={activeRestaurant} onValueChange={setSelectedRestaurant} className="mb-6">
            <TabsList>
              {restaurants.map((restaurant) => (
                <TabsTrigger key={restaurant.id} value={restaurant.id}>
                  <Store className="h-4 w-4 mr-2" />
                  {restaurant.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="mb-6">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Reward
          </Button>
        </div>

        <RewardManagement restaurantId={activeRestaurant} />

        <CreateRewardDialog
          restaurantId={activeRestaurant}
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </main>
      <Footer />
    </div>
  );
};

export default VendorDashboard;
