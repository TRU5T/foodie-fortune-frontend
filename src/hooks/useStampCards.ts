
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { StampCard, Restaurant } from '@/types/database.types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useStampCards = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['stampCards', user?.id],
    queryFn: async (): Promise<(StampCard & { restaurant: Restaurant })[]> => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('stamp_cards')
        .select(`
          *,
          restaurant:restaurants(*)
        `)
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          title: "Error fetching stamp cards",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as (StampCard & { restaurant: Restaurant })[];
    },
    enabled: !!user
  });
  
  const addStamp = useMutation({
    mutationFn: async ({ 
      restaurantId, 
      stamps = 1 
    }: { 
      restaurantId: string; 
      stamps?: number 
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Check if stamp card exists
      const { data: existingCards, error: fetchError } = await supabase
        .from('stamp_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId)
        .eq('is_complete', false);
      
      if (fetchError) throw fetchError;
      
      let stampCard: StampCard;
      
      // If no active stamp card, create one
      if (!existingCards || existingCards.length === 0) {
        // Get restaurant data to know stamps required
        const { data: restaurant, error: restaurantError } = await supabase
          .from('restaurants')
          .select('stamps_required')
          .eq('id', restaurantId)
          .single();
          
        if (restaurantError) throw restaurantError;
        
        // Create new stamp card
        const { data, error } = await supabase
          .from('stamp_cards')
          .insert([
            { 
              user_id: user.id, 
              restaurant_id: restaurantId,
              current_stamps: stamps,
              total_stamps_required: restaurant.stamps_required,
              is_complete: stamps >= restaurant.stamps_required
            }
          ])
          .select()
          .single();
          
        if (error) throw error;
        
        stampCard = data as StampCard;
      } else {
        // Update existing card
        const card = existingCards[0] as StampCard;
        const newStampCount = card.current_stamps + stamps;
        const isComplete = newStampCount >= card.total_stamps_required;
        
        const { data, error } = await supabase
          .from('stamp_cards')
          .update({ 
            current_stamps: newStampCount,
            is_complete: isComplete,
            updated_at: new Date().toISOString()
          })
          .eq('id', card.id)
          .select()
          .single();
          
        if (error) throw error;
        
        stampCard = data as StampCard;
      }
      
      return stampCard;
    },
    onSuccess: () => {
      toast({
        title: "Stamp added!",
        description: "Your stamp card has been updated",
      });
      
      // Refresh stamp cards data
      queryClient.invalidateQueries({ queryKey: ['stampCards'] });
    },
    onError: (error) => {
      toast({
        title: "Error adding stamp",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  return {
    ...query,
    addStamp
  };
};
