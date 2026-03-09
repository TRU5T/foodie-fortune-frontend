
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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Stamp Cards</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-xl">Stamp Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{totalStamps} stamps</p>
                  <p className="text-sm text-muted-foreground">collected total</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-semibold">{readyToRedeem} reward{readyToRedeem !== 1 ? "s" : ""}</p>
                  <p className="text-sm text-muted-foreground">ready to redeem</p>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" onClick={() => navigate("/restaurants")}>
                Find New Restaurants
              </Button>
            </CardContent>
          </Card>

          {recommended.length > 0 && (
            <Card className="mt-6">
              <CardHeader><CardTitle className="text-xl">Recommended Places</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {recommended.map((place: any) => (
                  <div key={place.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Utensils className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{place.name}</p>
                      <p className="text-xs text-muted-foreground">Earn stamps with every order</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/restaurant/${place.id}`)}>Visit</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Active Stamp Cards</TabsTrigger>
              <TabsTrigger value="completed">Completed Stamp Cards</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              {activeCards.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Active Stamp Cards</h3>
                    <p className="text-muted-foreground">Visit a restaurant and start collecting stamps!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeCards.map((sc: any) => (
                    <StampCard key={sc.id} restaurantName={sc.restaurant?.name || "Restaurant"} restaurantId={sc.restaurant_id} totalStamps={sc.total_stamps_required} currentStamps={sc.current_stamps} rewardName={getRewardName(sc.restaurant_id)} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              {completedCards.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Completed Cards Yet</h3>
                    <p className="text-muted-foreground">Complete a stamp card to see it here.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
