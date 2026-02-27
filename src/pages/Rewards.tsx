
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Coffee } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StampCircles = ({ current, total }: { current: number; total: number }) => (
  <div className="flex flex-wrap gap-2 justify-center py-2">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
          i < current
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/30 text-muted-foreground/30"
        }`}
      >
        <Coffee className="h-4 w-4" />
      </div>
    ))}
  </div>
);

const Rewards = () => {
  const { user } = useAuth();

  // Fetch stamp cards with restaurant + reward info
  const { data: stampCards = [] } = useQuery({
    queryKey: ["my-stamp-cards", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("stamp_cards")
        .select("*, restaurant:restaurants(name, logo_url, loyalty_type, stamps_required)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch point balances with restaurant info
  const { data: pointBalances = [] } = useQuery({
    queryKey: ["my-point-balances", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("point_balances")
        .select("*, restaurant:restaurants(name, logo_url, loyalty_type)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch rewards for restaurants the user has stamp cards or point balances at
  const restaurantIds = [
    ...new Set([
      ...stampCards.map((sc: any) => sc.restaurant_id),
      ...pointBalances.map((pb: any) => pb.restaurant_id),
    ]),
  ];

  const { data: rewards = [] } = useQuery({
    queryKey: ["my-available-rewards", restaurantIds],
    queryFn: async () => {
      if (restaurantIds.length === 0) return [];
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .in("restaurant_id", restaurantIds)
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
    enabled: restaurantIds.length > 0,
  });

  // Fetch redeemed rewards
  const { data: userRewards = [] } = useQuery({
    queryKey: ["my-user-rewards", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_rewards")
        .select("*, reward:rewards(name, description, restaurant_id, stamps_required, points_required)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <p className="text-muted-foreground">Please sign in to view your rewards.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const redeemedRewards = userRewards.filter((ur: any) => ur.is_redeemed);
  const activeRewards = userRewards.filter((ur: any) => !ur.is_redeemed);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">My Rewards</h1>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="redeemed">Redeemed ({redeemedRewards.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            {stampCards.length === 0 && pointBalances.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Rewards Yet</h3>
                  <p className="text-muted-foreground">
                    Visit a restaurant and start earning stamps or points!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stamp-based cards */}
                {stampCards.map((sc: any) => {
                  const restaurantRewards = rewards.filter(
                    (r: any) => r.restaurant_id === sc.restaurant_id && r.stamps_required > 0
                  );
                  return (
                    <Card key={sc.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{sc.restaurant?.name || "Restaurant"}</CardTitle>
                          <Badge variant="secondary">Stamps</Badge>
                        </div>
                        {restaurantRewards.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Working towards: {restaurantRewards.map((r: any) => r.name).join(", ")}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <StampCircles current={sc.current_stamps} total={sc.total_stamps_required} />
                        <p className="text-center text-sm text-muted-foreground mt-2">
                          {sc.current_stamps} / {sc.total_stamps_required} stamps
                          {sc.is_complete && (
                            <Badge className="ml-2" variant="default">Complete!</Badge>
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Points-based cards */}
                {pointBalances.map((pb: any) => {
                  const restaurantRewards = rewards.filter(
                    (r: any) => r.restaurant_id === pb.restaurant_id && r.points_required > 0
                  );
                  const nextReward = restaurantRewards.sort(
                    (a: any, b: any) => a.points_required - b.points_required
                  )[0];
                  const progressPercent = nextReward
                    ? Math.min((pb.balance / nextReward.points_required) * 100, 100)
                    : 0;

                  return (
                    <Card key={pb.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{pb.restaurant?.name || "Restaurant"}</CardTitle>
                          <Badge variant="secondary">Points</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-primary">{pb.balance}</span>
                          <span className="text-muted-foreground ml-1">points</span>
                        </div>
                        {nextReward ? (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Next: {nextReward.name}</span>
                              <span className="font-medium">{pb.balance}/{nextReward.points_required}</span>
                            </div>
                            <Progress value={progressPercent} className="h-3" />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center">No rewards available yet</p>
                        )}
                        {restaurantRewards.length > 1 && (
                          <p className="text-xs text-muted-foreground text-center">
                            {restaurantRewards.length} rewards available
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="redeemed">
            {redeemedRewards.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Redeemed Rewards</h3>
                  <p className="text-muted-foreground">Rewards you redeem will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {redeemedRewards.map((ur: any) => (
                  <Card key={ur.id} className="opacity-75">
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{ur.reward?.name || "Reward"}</h3>
                      <p className="text-sm text-muted-foreground">{ur.reward?.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Redeemed: {ur.redeemed_at ? new Date(ur.redeemed_at).toLocaleDateString() : "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Rewards;
