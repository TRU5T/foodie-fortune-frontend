
-- Fix user_roles self-insert privilege escalation
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can select all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix vendor_subscriptions: remove client write access; only service_role writes
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Users can create their own subscription" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Users can modify their own subscription" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Vendors can insert their subscription" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Vendors can update their subscription" ON public.vendor_subscriptions;

-- Fix point_balances: remove vendor direct UPDATE (all writes go through award_loyalty RPC)
DROP POLICY IF EXISTS "Vendors can update customer point balances" ON public.point_balances;
DROP POLICY IF EXISTS "Vendors can insert customer point balances" ON public.point_balances;

-- Fix stamp_cards: remove vendor direct UPDATE
DROP POLICY IF EXISTS "Vendors can update customer stamp cards" ON public.stamp_cards;
DROP POLICY IF EXISTS "Vendors can insert customer stamp cards" ON public.stamp_cards;

-- Fix scan_logs: restrict all policies to authenticated role only
DROP POLICY IF EXISTS "Admins can view all scan logs" ON public.scan_logs;
DROP POLICY IF EXISTS "Customers can view their own scan logs" ON public.scan_logs;
DROP POLICY IF EXISTS "Vendors can view their scan logs" ON public.scan_logs;

CREATE POLICY "Admins can view all scan logs" ON public.scan_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can view their own scan logs" ON public.scan_logs
  FOR SELECT TO authenticated USING (customer_user_id = auth.uid());
CREATE POLICY "Vendors can view their scan logs" ON public.scan_logs
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = scan_logs.restaurant_id AND r.owner_id = auth.uid()
    )
  );
