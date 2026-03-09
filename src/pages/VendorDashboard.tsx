import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Store, ArrowUpCircle, ScanLine } from "lucide-react";
import { useVendorRewards } from "@/hooks/useVendorRewards";
import { RewardManagement } from "@/components/vendor/RewardManagement";
import { CreateRewardDialog } from "@/components/vendor/CreateRewardDialog";
import { MenuItemManagement } from "@/components/vendor/MenuItemManagement";
import { PromotionManagement } from "@/components/vendor/PromotionManagement";
import { VendorAnalytics } from "@/components/vendor/VendorAnalytics";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sanitizeDbError } from "@/lib/sanitizeError";
import { useVendorSubscription } from "@/hooks/useVendorSubscription";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const VendorDashboard = () => {
  const { user } = useAuth();
  const { restaurants, isLoadingRestaurants } = useVendorRewards();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("rewards");
  const queryClient = useQueryClient();

  const activeRestaurantId = selectedRestaurant || restaurants?.[0]?.id;
  const { subscription, isActive: hasActiveSubscription } = useVendorSubscription(activeRestaurantId);

  const requestUpgrade = useMutation({
    mutationFn: async (restaurantId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase.from('tier_upgrade_requests').insert([{
        restaurant_id: restaurantId,
        requested_by: user.id,
        current_tier: 'tier_1' as const,
        requested_tier: 'tier_2' as const,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Upgrade requested", description: "Your tier upgrade request has been submitted for admin review." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: sanitizeDbError(error), variant: "destructive" });
    }
  });

  if (isLoadingRestaurants) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader><CardTitle>No Restaurants Yet</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You haven't set up any restaurants yet. Contact an admin to get started.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeRestaurant = restaurants.find(r => r.id === (selectedRestaurant || restaurants[0].id)) || restaurants[0];
  const isTier2 = activeRestaurant.vendor_tier === 'tier_2';

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Manage your store & rewards</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild>
            <Link to="/vendor-scanner">
              <ScanLine className="h-4 w-4 mr-2" />Scan Customer
            </Link>
          </Button>
          <Badge variant={isTier2 ? "default" : "secondary"}>
            {isTier2 ? "Tier 2 — Rewards + Ordering" : "Tier 1 — Rewards Only"}
          </Badge>
          <Badge variant="outline">
            {activeRestaurant.loyalty_type === 'stamps' ? '🎟️ Stamps' : '⭐ Points'}
          </Badge>
          <Badge variant={hasActiveSubscription ? "default" : "destructive"}>
            {hasActiveSubscription ? '✓ Subscribed' : '⚠ No Subscription'}
          </Badge>
        </div>
      </div>

      {restaurants.length > 1 && (
        <Tabs value={activeRestaurant.id} onValueChange={setSelectedRestaurant} className="mb-6">
          <TabsList>
            {restaurants.map((r) => (
              <TabsTrigger key={r.id} value={r.id}>
                <Store className="h-4 w-4 mr-2" />{r.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {isTier2 && <TabsTrigger value="menu">Menu Items</TabsTrigger>}
          <TabsTrigger value="settings">Store Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="mt-6">
          <div className="mb-6">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />Create New Reward
            </Button>
          </div>
          <RewardManagement restaurantId={activeRestaurant.id} loyaltyType={activeRestaurant.loyalty_type} />
        </TabsContent>

        <TabsContent value="promotions" className="mt-6">
          <PromotionManagement restaurantId={activeRestaurant.id} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <VendorAnalytics restaurantId={activeRestaurant.id} />
        </TabsContent>

        {isTier2 && (
          <TabsContent value="menu" className="mt-6">
            <MenuItemManagement restaurantId={activeRestaurant.id} />
          </TabsContent>
        )}

        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6 max-w-2xl">
            <Card>
              <CardHeader><CardTitle>Store Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="font-medium">{activeRestaurant.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Cuisine:</span><span className="font-medium">{activeRestaurant.cuisine || 'Not set'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Loyalty Type:</span><span className="font-medium capitalize">{activeRestaurant.loyalty_type}</span></div>
                {activeRestaurant.loyalty_type === 'stamps' && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Stamps Required:</span><span className="font-medium">{activeRestaurant.stamps_required}</span></div>
                )}
                {activeRestaurant.loyalty_type === 'points' && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Points per Dollar:</span><span className="font-medium">{activeRestaurant.points_per_dollar}</span></div>
                )}
              </CardContent>
            </Card>

            {!hasActiveSubscription && (
              <Card className="border-destructive">
                <CardHeader><CardTitle>Subscription Required</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Your restaurant needs an active subscription ($20/mo) to remain visible to customers.</p>
                  <Button asChild><Link to="/business">Subscribe Now</Link></Button>
                </CardContent>
              </Card>
            )}

            {!isTier2 && (
              <Card>
                <CardHeader><CardTitle>Upgrade to Tier 2</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Upgrade to Tier 2 to enable in-app food ordering and link rewards to menu items.</p>
                  <Button onClick={() => requestUpgrade.mutate(activeRestaurant.id)} disabled={requestUpgrade.isPending}>
                    <ArrowUpCircle className="h-4 w-4 mr-2" />{requestUpgrade.isPending ? "Requesting..." : "Request Tier 2 Upgrade"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CreateRewardDialog
        restaurantId={activeRestaurant.id}
        loyaltyType={activeRestaurant.loyalty_type}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default VendorDashboard;
