
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/database.types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useUser = () => {
  const { user: authUser, session } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['user', authUser?.id],
    queryFn: async (): Promise<User> => {
      if (!authUser || !session) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        toast({
          title: "Error fetching user data",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as User;
    },
    initialData: authUser,
    enabled: !!authUser && !!session
  });
  
  const updateUser = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!authUser || !session) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authUser.id)
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as User;
    },
    onSuccess: (data) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      queryClient.setQueryData(['user', data.id], data);
    }
  });
  
  return {
    ...query,
    updateUser
  };
};
