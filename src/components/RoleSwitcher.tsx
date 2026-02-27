import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, User, Store, Shield } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database['public']['Enums']['app_role'];

const roleConfig: Record<AppRole, { label: string; icon: typeof User; description: string; variant: "default" | "secondary" | "destructive" }> = {
  customer: {
    label: "Customer",
    icon: User,
    description: "Browse restaurants & earn rewards",
    variant: "default",
  },
  vendor: {
    label: "Vendor",
    icon: Store,
    description: "Manage your restaurant",
    variant: "secondary",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    description: "System administration",
    variant: "destructive",
  },
};

export const RoleSwitcher = () => {
  const { role, isLoading, switchRole } = useUserRole();
  const navigate = useNavigate();

  if (isLoading || !role) return null;

  const currentRole = roleConfig[role];
  const CurrentIcon = currentRole.icon;

  const handleRoleSwitch = (newRole: AppRole) => {
    if (newRole !== role) {
      switchRole.mutate(newRole, {
        onSuccess: () => {
          if (newRole === 'vendor') navigate('/vendor-dashboard');
          else if (newRole === 'admin') navigate('/admin');
          else navigate('/');
        }
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          <Badge variant={currentRole.variant}>{currentRole.label}</Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {(Object.entries(roleConfig) as [AppRole, typeof roleConfig[AppRole]][]).map(([roleKey, config]) => {
          const Icon = config.icon;
          const isActive = role === roleKey;
          return (
            <DropdownMenuItem
              key={roleKey}
              onClick={() => handleRoleSwitch(roleKey)}
              disabled={isActive || switchRole.isPending}
              className="flex flex-col items-start gap-1 p-3"
            >
              <div className="flex items-center gap-2 w-full">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{config.label}</span>
                {isActive && <Badge variant={config.variant} className="ml-auto text-xs">Active</Badge>}
              </div>
              <span className="text-xs text-muted-foreground">{config.description}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
