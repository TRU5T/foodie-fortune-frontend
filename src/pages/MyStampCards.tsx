
import { StampCard } from "@/components/StampCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Ticket, Utensils } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const MyStampCards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stampCards = [] } = useQuery({
    queryKey: ["my-stamp-cards", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("stamp_cards")
        .select("*, restaurant:restaurants(name, logo_url, stamps_required)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const restaurantIds = [...new Set(stampCards.map((sc: any) => sc.restaurant_id))];

  const { data: rewards = [] } = useQuery({
    queryKey: ["stamp-card-rewards", restaurantIds],
    queryFn: async () => {
      if (restaurantIds.length === 0) return [];
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .in("restaurant_id", restaurantIds)
        .eq("is_active", true)
        .gt("stamps_required", 0);
      if (error) throw error;
      return data;
    },
    enabled: restaurantIds.length > 0,
  });

  const { data: recommended = [] } = useQuery({
    queryKey: ["recommended-restaurants", restaurantIds],
    queryFn: async () => {
      let query = supabase
        .from("restaurants")
        .select("id, name, logo_url")
        .eq("is_active", true)
        .eq("loyalty_type", "stamps")
        .limit(3);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).filter((r: any) => !restaurantIds.includes(r.id));
    },
    enabled: !!user,
  });

  const activeCards = stampCards.filter((sc: any) => !sc.is_complete);
  const completedCards = stampCards.filter((sc: any) => sc.is_complete);
  const totalStamps = stampCards.reduce((sum: number, sc: any) => sum + sc.current_stamps, 0);
  const readyToRedeem = completedCards.length;

  const getRewardName = (restaurantId: string) => {
    const reward = rewards.find((r: any) => r.restaurant_id === restaurantId);
    return reward?.name || "Reward";
  };

  if (!user) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Please sign in to view your stamp cards.</p>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Stamp Cards</h1>
        <p className="text-muted-foreground mt-1">Track your progress and redeem rewards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/60" />
            <CardHeader><CardTitle className="text-lg">Summary</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{totalStamps}</p>
                  <p className="text-xs text-muted-foreground">stamps collected</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Ticket className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold">{readyToRedeem}</p>
                  <p className="text-xs text-muted-foreground">ready to redeem</p>
                </div>
              </div>
              <Button className="w-full rounded-xl mt-2" onClick={() => navigate("/restaurants")}>
                Find Restaurants
              </Button>
            </CardContent>
          </Card>

          {recommended.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Discover</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {recommended.map((place: any) => (
                  <div key={place.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/restaurant/${place.id}`)}>
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{place.name}</p>
                      <p className="text-[11px] text-muted-foreground">Earn stamps here</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6 w-full sm:w-auto">
              <TabsTrigger value="active" className="flex-1 sm:flex-none">
                Active ({activeCards.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 sm:flex-none">
                Completed ({completedCards.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              {activeCards.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Active Stamp Cards</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">Visit a restaurant and start collecting stamps!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activeCards.map((sc: any) => (
                    <StampCard key={sc.id} restaurantName={sc.restaurant?.name || "Restaurant"} restaurantId={sc.restaurant_id} totalStamps={sc.total_stamps_required} currentStamps={sc.current_stamps} rewardName={getRewardName(sc.restaurant_id)} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {completedCards.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Completed Cards Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">Complete a stamp card to see it here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {completedCards.map((sc: any) => (
                    <StampCard key={sc.id} restaurantName={sc.restaurant?.name || "Restaurant"} restaurantId={sc.restaurant_id} totalStamps={sc.total_stamps_required} currentStamps={sc.current_stamps} rewardName={getRewardName(sc.restaurant_id)} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyStampCards;
