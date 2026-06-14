import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { sanitizeDbError } from '@/lib/sanitizeError';
import { useAuth } from '@/context/AuthContext';

export const useRewards = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['rewards', { restaurantId }],
    queryFn: async () => {
      let query = supabase.from('rewards').select('*');
      if (restaurantId) query = query.eq('restaurant_id', restaurantId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: restaurantId ? !!restaurantId : true
  });
};

export const useUserRewards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['userRewards', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('user_rewards')
        .select('*, reward:rewards(*)')
        .eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  
  const redeemReward = useMutation({
    mutationFn: async (rewardId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('redeem_reward', { _reward_id: rewardId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Reward redeemed!", description: "The reward has been added to your account" });
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error redeeming reward", description: sanitizeDbError(error), variant: "destructive" });
    }
  });
  
  return { ...query, redeemReward };
};
