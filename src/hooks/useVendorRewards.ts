import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Reward } from '@/types/database.types';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useVendorRewards = (restaurantId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch vendor's restaurants
  const restaurantsQuery = useQuery({
    queryKey: ['vendor-restaurants', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch rewards for a specific restaurant
  const rewardsQuery = useQuery({
    queryKey: ['vendor-rewards', restaurantId],
    queryFn: async () => {
      if (!restaurantId) throw new Error('Restaurant ID required');
      
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Reward[];
    },
    enabled: !!restaurantId
  });

  // Create reward
  const createReward = useMutation({
    mutationFn: async (reward: Omit<Reward, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('rewards')
        .insert([reward])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Reward created",
        description: "Your reward has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['vendor-rewards'] });
    },
    onError: (error) => {
      toast({
        title: "Error creating reward",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update reward
  const updateReward = useMutation({
    mutationFn: async ({ id, ...reward }: Partial<Reward> & { id: string }) => {
      const { data, error } = await supabase
        .from('rewards')
        .update(reward)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Reward updated",
        description: "Your reward has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['vendor-rewards'] });
    },
    onError: (error) => {
      toast({
        title: "Error updating reward",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete reward
  const deleteReward = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Reward deleted",
        description: "Your reward has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['vendor-rewards'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting reward",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    restaurants: restaurantsQuery.data,
    isLoadingRestaurants: restaurantsQuery.isLoading,
    rewards: rewardsQuery.data,
    isLoadingRewards: rewardsQuery.isLoading,
    createReward,
    updateReward,
    deleteReward,
  };
};
