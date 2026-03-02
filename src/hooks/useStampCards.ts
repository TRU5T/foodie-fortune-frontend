import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { sanitizeDbError } from '@/lib/sanitizeError';
import { useAuth } from '@/context/AuthContext';

export const useStampCards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['stampCards', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('stamp_cards')
        .select('*, restaurant:restaurants(*)')
        .eq('user_id', user.id);
      if (error) {
        toast({ title: "Error fetching stamp cards", description: sanitizeDbError(error), variant: "destructive" });
        throw error;
      }
      return data;
    },
    enabled: !!user
  });
  
  const addStamp = useMutation({
    mutationFn: async ({ restaurantId, stamps = 1 }: { restaurantId: string; stamps?: number }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: existingCards, error: fetchError } = await supabase
        .from('stamp_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId)
        .eq('is_complete', false);
      if (fetchError) throw fetchError;
      
      if (!existingCards || existingCards.length === 0) {
        const { data: restaurant, error: restaurantError } = await supabase
          .from('restaurants')
          .select('stamps_required')
          .eq('id', restaurantId)
          .single();
        if (restaurantError) throw restaurantError;
        
        const { data, error } = await supabase
          .from('stamp_cards')
          .insert([{
            user_id: user.id,
            restaurant_id: restaurantId,
            current_stamps: stamps,
            total_stamps_required: restaurant.stamps_required,
            is_complete: stamps >= restaurant.stamps_required
          }])
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const card = existingCards[0];
        const newStampCount = card.current_stamps + stamps;
        const isComplete = newStampCount >= card.total_stamps_required;
        
        const { data, error } = await supabase
          .from('stamp_cards')
          .update({ current_stamps: newStampCount, is_complete: isComplete })
          .eq('id', card.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({ title: "Stamp added!", description: "Your stamp card has been updated" });
      queryClient.invalidateQueries({ queryKey: ['stampCards'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error adding stamp", description: sanitizeDbError(error), variant: "destructive" });
    }
  });
  
  return { ...query, addStamp };
};
