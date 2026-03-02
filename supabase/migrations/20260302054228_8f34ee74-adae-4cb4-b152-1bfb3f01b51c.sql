
-- Drop the overly permissive vendor policy
DROP POLICY "Vendors can view customer profiles for scanning" ON public.profiles;

-- Create a restricted policy: vendors can only see profiles of customers who have interacted with their restaurant
CREATE POLICY "Vendors can view customer profiles for scanning"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'vendor'::app_role)
  AND (
    EXISTS (
      SELECT 1 FROM public.scan_logs sl
      JOIN public.restaurants r ON r.id = sl.restaurant_id
      WHERE sl.customer_user_id = profiles.id AND r.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.restaurants r ON r.id = o.restaurant_id
      WHERE o.user_id = profiles.id AND r.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.stamp_cards sc
      JOIN public.restaurants r ON r.id = sc.restaurant_id
      WHERE sc.user_id = profiles.id AND r.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.point_balances pb
      JOIN public.restaurants r ON r.id = pb.restaurant_id
      WHERE pb.user_id = profiles.id AND r.owner_id = auth.uid()
    )
  )
);
