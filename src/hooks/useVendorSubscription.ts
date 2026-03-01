
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface VendorSubscription {
  id: string;
  restaurant_id: string;
  user_id: string;
  plan: string;
  billing_cycle: string;
  price_cents: number;
  status: string;
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useVendorSubscription = (restaurantId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["vendor-subscription", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;
      const { data, error } = await supabase
        .from("vendor_subscriptions")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .maybeSingle();
      if (error) throw error;
      return data as VendorSubscription | null;
    },
    enabled: !!user && !!restaurantId,
  });

  const subscribe = useMutation({
    mutationFn: async ({
      restaurantId,
      billingCycle,
    }: {
      restaurantId: string;
      billingCycle: "monthly" | "annual";
    }) => {
      if (!user) throw new Error("Not authenticated");
      const priceCents = billingCycle === "monthly" ? 2000 : 1920; // $20/mo or $19.20/mo annual
      const periodEnd = new Date();
      if (billingCycle === "monthly") {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      const { error } = await supabase.from("vendor_subscriptions").insert({
        restaurant_id: restaurantId,
        user_id: user.id,
        plan: "starter",
        billing_cycle: billingCycle,
        price_cents: priceCents,
        status: "active",
        current_period_end: periodEnd.toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-subscription"] });
      toast({
        title: "Subscription activated!",
        description: "Your restaurant subscription is now active. Payment processing will be connected soon.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from("vendor_subscriptions")
        .update({ status: "cancelled" })
        .eq("id", subscriptionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-subscription"] });
      toast({ title: "Subscription cancelled" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isActive = subscription?.status === "active" || subscription?.status === "trialing";

  return {
    subscription,
    isLoading,
    isActive,
    subscribe,
    cancelSubscription,
  };
};
