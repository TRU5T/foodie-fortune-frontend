
-- Deny anonymous access to order_items
CREATE POLICY "Deny anonymous access to order_items"
ON public.order_items
FOR SELECT
TO anon
USING (false);
