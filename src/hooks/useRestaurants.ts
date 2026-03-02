import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { sanitizeDbError } from '@/lib/sanitizeError';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('restaurants').select('*');
      if (error) {
        toast({ title: "Error fetching restaurants", description: sanitizeDbError(error), variant: "destructive" });
        throw error;
      }
      return data;
    }
  });
};

export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('restaurants').select('*').eq('id', id).single();
      if (error) {
        toast({ title: "Error fetching restaurant", description: sanitizeDbError(error), variant: "destructive" });
        throw error;
      }
      return data;
    },
    enabled: !!id
  });
};
