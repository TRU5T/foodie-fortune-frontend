import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVendorAnalytics(restaurantId?: string) {
  const scanStats = useQuery({
    queryKey: ["vendor-analytics-scans", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scan_logs")
        .select("created_at, stamps_awarded, points_awarded, action_type")
        .eq("restaurant_id", restaurantId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId,
  });

  const stampCardStats = useQuery({
    queryKey: ["vendor-analytics-stamps", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stamp_cards")
        .select("user_id, current_stamps, is_complete, created_at")
        .eq("restaurant_id", restaurantId!);
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId,
  });

  const rewardStats = useQuery({
    queryKey: ["vendor-analytics-rewards", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rewards")
        .select("id, name, stamps_required, points_required")
        .eq("restaurant_id", restaurantId!);
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId,
  });

  // Aggregate scans by day for chart
  const scansByDay = (scanStats.data ?? []).reduce<Record<string, number>>((acc, s) => {
    const day = new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(scansByDay).map(([date, scans]) => ({ date, scans }));

  const totalScans = scanStats.data?.length ?? 0;
  const uniqueCustomers = new Set(stampCardStats.data?.map((s) => s.user_id)).size;
  const completedCards = stampCardStats.data?.filter((s) => s.is_complete).length ?? 0;
  const totalStampsAwarded = (scanStats.data ?? []).reduce((sum, s) => sum + s.stamps_awarded, 0);
  const totalPointsAwarded = (scanStats.data ?? []).reduce((sum, s) => sum + s.points_awarded, 0);

  return {
    isLoading: scanStats.isLoading || stampCardStats.isLoading || rewardStats.isLoading,
    chartData,
    totalScans,
    uniqueCustomers,
    completedCards,
    totalStampsAwarded,
    totalPointsAwarded,
    rewards: rewardStats.data ?? [],
  };
}
