
-- Allow vendors to look up customer profiles when scanning
CREATE POLICY "Vendors can view customer profiles for scanning"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'vendor'));

-- Vendors also need to read/write stamp_cards and point_balances for customers
CREATE POLICY "Vendors can view customer stamp cards"
ON public.stamp_cards
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = stamp_cards.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

CREATE POLICY "Vendors can insert customer stamp cards"
ON public.stamp_cards
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = stamp_cards.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

CREATE POLICY "Vendors can update customer stamp cards"
ON public.stamp_cards
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = stamp_cards.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

CREATE POLICY "Vendors can view customer point balances"
ON public.point_balances
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = point_balances.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

CREATE POLICY "Vendors can insert customer point balances"
ON public.point_balances
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = point_balances.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

CREATE POLICY "Vendors can update customer point balances"
ON public.point_balances
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM restaurants
    WHERE restaurants.id = point_balances.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);
