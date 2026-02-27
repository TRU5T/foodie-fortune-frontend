import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export const useUserRole = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async (): Promise<AppRole | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return 'customer';
        console.error('Error fetching user role:', error);
        return 'customer';
      }
      
      return data.role;
    },
    enabled: !!user
  });
  
  const switchRole = useMutation({
    mutationFn: async (newRole: AppRole) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', newRole)
        .single();
      
      if (existingRole) {
        // Update updated_at so this role becomes the "active" one
        const { data: updated, error: updateError } = await supabase
          .from('user_roles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', existingRole.id)
          .select()
          .single();
        if (updateError) throw updateError;
        return updated;
      }
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{ user_id: user.id, role: newRole }])
        .select()
        .single();
      
      if (error) {
        toast({ title: "Error switching role", description: error.message, variant: "destructive" });
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      toast({ title: "Role switched", description: `Successfully switched to ${data.role} mode` });
      queryClient.setQueryData(['userRole', user?.id], data.role);
    }
  });
  
  const role = query.data;
  
  return {
    ...query,
    role,
    isCustomer: role === 'customer',
    isVendor: role === 'vendor',
    isAdmin: role === 'admin',
    switchRole
  };
};
