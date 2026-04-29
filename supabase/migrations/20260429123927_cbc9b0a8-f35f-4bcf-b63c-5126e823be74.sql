CREATE OR REPLACE FUNCTION public.award_loyalty(
  _customer_user_id uuid,
  _restaurant_id uuid,
  _quantity integer DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _vendor_user_id uuid := auth.uid();
  _restaurant record;
  _points_awarded integer := 0;
  _stamps_awarded integer := 0;
  _active_card record;
BEGIN
  IF _vendor_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF _quantity IS NULL OR _quantity < 1 OR _quantity > 25 THEN
    RAISE EXCEPTION 'Invalid loyalty quantity';
  END IF;

  SELECT id, owner_id, loyalty_type, points_per_dollar, stamps_required
  INTO _restaurant
  FROM public.restaurants
  WHERE id = _restaurant_id
    AND owner_id = _vendor_user_id
    AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Restaurant not found or not owned by current vendor';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.scan_logs
    WHERE customer_user_id = _customer_user_id
      AND restaurant_id = _restaurant_id
      AND created_at >= now() - interval '5 minutes'
  ) THEN
    RAISE EXCEPTION 'Please wait 5 minutes before awarding this customer again';
  END IF;

  IF _restaurant.loyalty_type = 'stamps' THEN
    _stamps_awarded := _quantity;

    SELECT *
    INTO _active_card
    FROM public.stamp_cards
    WHERE user_id = _customer_user_id
      AND restaurant_id = _restaurant_id
      AND is_complete = false
    ORDER BY created_at ASC
    LIMIT 1;

    IF FOUND THEN
      UPDATE public.stamp_cards
      SET current_stamps = _active_card.current_stamps + _stamps_awarded,
          is_complete = (_active_card.current_stamps + _stamps_awarded) >= _active_card.total_stamps_required,
          updated_at = now()
      WHERE id = _active_card.id;
    ELSE
      INSERT INTO public.stamp_cards (
        user_id,
        restaurant_id,
        current_stamps,
        total_stamps_required,
        is_complete
      ) VALUES (
        _customer_user_id,
        _restaurant_id,
        _stamps_awarded,
        _restaurant.stamps_required,
        _stamps_awarded >= _restaurant.stamps_required
      );
    END IF;
  ELSE
    _points_awarded := floor(_quantity * _restaurant.points_per_dollar)::integer;

    INSERT INTO public.point_balances (
      user_id,
      restaurant_id,
      balance,
      total_earned
    ) VALUES (
      _customer_user_id,
      _restaurant_id,
      _points_awarded,
      _points_awarded
    )
    ON CONFLICT (user_id, restaurant_id)
    DO UPDATE SET
      balance = public.point_balances.balance + EXCLUDED.balance,
      total_earned = public.point_balances.total_earned + EXCLUDED.total_earned,
      updated_at = now();
  END IF;

  INSERT INTO public.scan_logs (
    vendor_user_id,
    customer_user_id,
    restaurant_id,
    action_type,
    stamps_awarded,
    points_awarded
  ) VALUES (
    _vendor_user_id,
    _customer_user_id,
    _restaurant_id,
    CASE WHEN _restaurant.loyalty_type = 'stamps' THEN 'stamp' ELSE 'points' END,
    _stamps_awarded,
    _points_awarded
  );

  RETURN jsonb_build_object(
    'success', true,
    'actionType', CASE WHEN _restaurant.loyalty_type = 'stamps' THEN 'stamp' ELSE 'points' END,
    'stampsAwarded', _stamps_awarded,
    'pointsAwarded', _points_awarded
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.award_loyalty(uuid, uuid, integer) TO authenticated;

DROP POLICY IF EXISTS "System can update point balances" ON public.point_balances;
DROP POLICY IF EXISTS "Users can create point balances" ON public.point_balances;
DROP POLICY IF EXISTS "System can update stamp cards" ON public.stamp_cards;
DROP POLICY IF EXISTS "Users can create stamp cards" ON public.stamp_cards;

DROP POLICY IF EXISTS "Vendors can insert customer point balances" ON public.point_balances;
DROP POLICY IF EXISTS "Vendors can update customer point balances" ON public.point_balances;
DROP POLICY IF EXISTS "Vendors can insert customer stamp cards" ON public.stamp_cards;
DROP POLICY IF EXISTS "Vendors can update customer stamp cards" ON public.stamp_cards;

CREATE POLICY "Vendors can insert customer point balances"
ON public.point_balances
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.restaurants
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
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = point_balances.restaurant_id
      AND restaurants.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = point_balances.restaurant_id
      AND restaurants.owner_id = auth.uid()
  )
);

CREATE POLICY "Vendors can insert customer stamp cards"
ON public.stamp_cards
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.restaurants
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
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = stamp_cards.restaurant_id
      AND restaurants.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = stamp_cards.restaurant_id
      AND restaurants.owner_id = auth.uid()
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS point_balances_user_restaurant_unique
ON public.point_balances (user_id, restaurant_id);