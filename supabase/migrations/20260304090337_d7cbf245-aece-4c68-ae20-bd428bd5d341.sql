
-- Fix profiles RLS: Convert legitimate access policies to PERMISSIVE
-- and scope the anonymous deny policy to the anon role

-- Drop all existing SELECT policies on profiles
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Vendors can view customer profiles for scanning" ON public.profiles;

-- Recreate as PERMISSIVE (default) so they OR together
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Vendors can view customer profiles for scanning"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'vendor'::app_role)
    AND (
      EXISTS (SELECT 1 FROM scan_logs sl JOIN restaurants r ON r.id = sl.restaurant_id WHERE sl.customer_user_id = profiles.id AND r.owner_id = auth.uid())
      OR EXISTS (SELECT 1 FROM orders o JOIN restaurants r ON r.id = o.restaurant_id WHERE o.user_id = profiles.id AND r.owner_id = auth.uid())
      OR EXISTS (SELECT 1 FROM stamp_cards sc JOIN restaurants r ON r.id = sc.restaurant_id WHERE sc.user_id = profiles.id AND r.owner_id = auth.uid())
      OR EXISTS (SELECT 1 FROM point_balances pb JOIN restaurants r ON r.id = pb.restaurant_id WHERE pb.user_id = profiles.id AND r.owner_id = auth.uid())
    )
  );

-- Block anonymous access explicitly for the anon role
CREATE POLICY "Deny anonymous access to profiles"
  ON public.profiles FOR SELECT TO anon
  USING (false);
