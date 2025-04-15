
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Reward, UserReward } from '@/types/database.types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useRewards = (restaurantId?: string) => {
  return useQuery({
    queryKey: ['rewards', { restaurantId }],
    queryFn: async (): Promise<Reward[]> => {
      let query = supabase
        .from('rewards')
        .select('*');
        
      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Error fetching rewards",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Reward[];
    },
    enabled: restaurantId ? !!restaurantId : true
  });
};

export const useUserRewards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['userRewards', user?.id],
    queryFn: async (): Promise<(UserReward & { reward: Reward })[]> => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          reward:rewards(*)
        `)
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          title: "Error fetching user rewards",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as (UserReward & { reward: Reward })[];
    },
    enabled: !!user
  });
  
  const redeemReward = useMutation({
    mutationFn: async (rewardId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      // Get the reward to check points required
      const { data: reward, error: rewardError } = await supabase
        .from('rewards')
        .select('*')
        .eq('id', rewardId)
        .single();
        
      if (rewardError) throw rewardError;
      
      // Check if user has enough points
      if (user.total_points < reward.points_required) {
        throw new Error('Not enough points to redeem this reward');
      }
      
      // Begin transaction
      // 1. Create user_reward record
      const { data, error } = await supabase
        .from('user_rewards')
        .insert([
          { 
            user_id: user.id, 
            reward_id: rewardId,
            is_redeemed: false
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      // 2. Deduct points from user
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          total_points: user.total_points - reward.points_required 
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Reward redeemed!",
        description: "The reward has been added to your account",
      });
      
      // Refresh user rewards and user data
      queryClient.invalidateQueries({ queryKey: ['userRewards'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast({
        title: "Error redeeming reward",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  return {
    ...query,
    redeemReward
  };
};
