import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sanitizeDbError } from "@/lib/sanitizeError";

export interface Promotion {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  promotion_type: string;
  discount_percent: number;
  applicable_menu_item_id: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function usePromotions(restaurantId?: string) {
  const queryClient = useQueryClient();

  const promotions = useQuery({
    queryKey: ["promotions", restaurantId],
    queryFn: async () => {
      let query = supabase.from("promotions").select("*");
      if (restaurantId) query = query.eq("restaurant_id", restaurantId);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data as Promotion[];
    },
    enabled: !!restaurantId,
  });

  const createPromotion = useMutation({
    mutationFn: async (promo: Omit<Promotion, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("promotions").insert([promo]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions", restaurantId] });
      toast({ title: "Promotion created" });
    },
    onError: (e: Error) => toast({ title: "Error", description: sanitizeDbError(e), variant: "destructive" }),
  });

  const updatePromotion = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Promotion> & { id: string }) => {
      const { error } = await supabase.from("promotions").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions", restaurantId] });
      toast({ title: "Promotion updated" });
    },
    onError: (e: Error) => toast({ title: "Error", description: sanitizeDbError(e), variant: "destructive" }),
  });

  const deletePromotion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions", restaurantId] });
      toast({ title: "Promotion deleted" });
    },
    onError: (e: Error) => toast({ title: "Error", description: sanitizeDbError(e), variant: "destructive" }),
  });

  return { ...promotions, createPromotion, updatePromotion, deletePromotion };
}

// For customer-facing: fetch active promotions across all restaurants
export function useActivePromotions() {
  return useQuery({
    queryKey: ["active-promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*, restaurants(name, logo_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (Promotion & { restaurants: { name: string; logo_url: string | null } })[];
    },
  });
}
