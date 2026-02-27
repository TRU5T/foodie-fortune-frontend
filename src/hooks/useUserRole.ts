import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export const useUserRole = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch ALL roles assigned to this user
  const allRolesQuery = useQuery({
    queryKey: ['userRoles', user?.id],
    queryFn: async (): Promise<AppRole[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching user roles:', error);
        return ['customer'];
      }
      
      if (!data || data.length === 0) return ['customer'];
      return data.map(d => d.role);
    },
    enabled: !!user
  });

  // Fetch the active (most recent) role
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
        const { data: updated, error: updateError } = await supabase
          .from('user_roles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', existingRole.id)
          .select()
          .single();
        if (updateError) throw updateError;
        return updated;
      }
      
      // Should not reach here if UI only shows assigned roles
      throw new Error('You do not have this role assigned');
    },
    onSuccess: (data) => {
      toast({ title: "Role switched", description: `Successfully switched to ${data.role} mode` });
      queryClient.setQueryData(['userRole', user?.id], data.role);
    }
  });
  
  const role = query.data;
  const availableRoles = allRolesQuery.data ?? [];
  
  return {
    ...query,
    role,
    availableRoles,
    isCustomer: role === 'customer',
    isVendor: role === 'vendor',
    isAdmin: role === 'admin',
    switchRole
  };
};
