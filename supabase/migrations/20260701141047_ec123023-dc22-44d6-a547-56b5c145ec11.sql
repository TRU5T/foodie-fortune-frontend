
-- notifications: restrict vendor inserts to users with prior interaction; admins unrestricted
DROP POLICY IF EXISTS "Vendors and admins can insert notifications" ON public.notifications;

CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Vendors can insert notifications for their customers"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'vendor'::app_role)
  AND EXISTS (
    SELECT 1 FROM public.scan_logs sl
    JOIN public.restaurants r ON r.id = sl.restaurant_id
    WHERE r.owner_id = auth.uid()
      AND sl.customer_user_id = notifications.user_id
  )
);

-- scan_logs: scope INSERT policy to authenticated role
DROP POLICY IF EXISTS "Vendors can create scan logs" ON public.scan_logs;
CREATE POLICY "Vendors can create scan logs"
ON public.scan_logs FOR INSERT TO authenticated
WITH CHECK (
  (vendor_user_id = auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = scan_logs.restaurant_id
      AND restaurants.owner_id = auth.uid()
  )
);

-- tier_upgrade_requests: require vendor role
DROP POLICY IF EXISTS "Vendors can create requests" ON public.tier_upgrade_requests;
CREATE POLICY "Vendors can create requests"
ON public.tier_upgrade_requests FOR INSERT TO authenticated
WITH CHECK (
  requested_by = auth.uid()
  AND has_role(auth.uid(), 'vendor'::app_role)
);

-- vendor_subscriptions: remove client-side insert/update
DROP POLICY IF EXISTS "Vendors can insert own subscriptions" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Vendors can update own subscriptions" ON public.vendor_subscriptions;
