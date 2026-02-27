import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

export const useUser = () => {
  const { user: authUser, session } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['user', authUser?.id],
    queryFn: async (): Promise<Profile> => {
      if (!authUser || !session) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        toast({ title: "Error fetching user data", description: error.message, variant: "destructive" });
        throw error;
      }
      
      return data;
    },
    enabled: !!authUser && !!session
  });
  
  const updateUser = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!authUser || !session) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authUser.id)
        .select()
        .single();
      
      if (error) {
        toast({ title: "Error updating profile", description: error.message, variant: "destructive" });
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      toast({ title: "Profile updated", description: "Your profile has been successfully updated" });
      queryClient.setQueryData(['user', data.id], data);
    }
  });
  
  return { ...query, updateUser };
};
