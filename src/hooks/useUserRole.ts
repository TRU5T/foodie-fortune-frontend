import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserRole, UserRoles } from '@/types/database.types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export const useUserRole = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async (): Promise<UserRole | null> => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No role found, return customer as default
          return 'customer';
        }
        console.error('Error fetching user role:', error);
        return 'customer';
      }
      
      return data.role;
    },
    enabled: !!user
  });
  
  const assignRole = useMutation({
    mutationFn: async (role: UserRole) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: user.id, 
          role 
        }])
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Error assigning role",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as UserRoles;
    },
    onSuccess: (data) => {
      toast({
        title: "Role assigned",
        description: `Role ${data.role} has been assigned successfully`,
      });
      
      queryClient.setQueryData(['userRole', user?.id], data.role);
    }
  });
  
  const switchRole = useMutation({
    mutationFn: async (newRole: UserRole) => {
      if (!user) throw new Error('User not authenticated');
      
      // Check if user already has this role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', newRole)
        .single();
      
      if (existingRole) {
        return existingRole as UserRoles;
      }
      
      // Create new role entry
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: user.id, 
          role: newRole 
        }])
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Error switching role",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as UserRoles;
    },
    onSuccess: (data) => {
      toast({
        title: "Role switched",
        description: `Successfully switched to ${data.role} mode`,
      });
      
      queryClient.setQueryData(['userRole', user?.id], data.role);
    }
  });
  
  // Helper functions
  const isCustomer = query.data === 'customer';
  const isVendor = query.data === 'vendor';
  const isAdmin = query.data === 'admin';
  
  return {
    ...query,
    role: query.data,
    isCustomer,
    isVendor,
    isAdmin,
    assignRole,
    switchRole
  };
};