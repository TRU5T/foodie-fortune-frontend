
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Restaurant } from '@/types/database.types';
import { toast } from '@/components/ui/use-toast';

export const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async (): Promise<Restaurant[]> => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');
      
      if (error) {
        toast({
          title: "Error fetching restaurants",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Restaurant[];
    }
  });
};

export const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: async (): Promise<Restaurant> => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        toast({
          title: "Error fetching restaurant",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Restaurant;
    },
    enabled: !!id
  });
};
