import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RouteGuardProps {
  allow: AppRole[];
  children: ReactNode;
}

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

export const RouteGuard = ({ allow, children }: RouteGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { availableRoles, isLoading } = useUserRole();

  if (authLoading || (user && isLoading)) return <Loading />;
  if (!user) return <Navigate to="/auth" replace />;

  const permitted = availableRoles.some((r) => allow.includes(r));
  if (!permitted) return <Navigate to="/" replace />;

  return <>{children}</>;
};
