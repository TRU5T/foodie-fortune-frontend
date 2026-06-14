
-- 1. vendor_subscriptions: scope all policies to authenticated
DROP POLICY IF EXISTS "Admins can update all subscriptions" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Vendors can insert own subscriptions" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Vendors can update own subscriptions" ON public.vendor_subscriptions;
DROP POLICY IF EXISTS "Vendors can view own subscriptions" ON public.vendor_subscriptions;

CREATE POLICY "Admins can update all subscriptions" ON public.vendor_subscriptions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all subscriptions" ON public.vendor_subscriptions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Vendors can insert own subscriptions" ON public.vendor_subscriptions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Vendors can update own subscriptions" ON public.vendor_subscriptions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Vendors can view own subscriptions" ON public.vendor_subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. user_rewards: remove client INSERT/UPDATE, add safe redeem RPC
DROP POLICY IF EXISTS "Users can create reward entries" ON public.user_rewards;
DROP POLICY IF EXISTS "Users can update their own rewards" ON public.user_rewards;

CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_id uuid)
RETURNS public.user_rewards
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _reward record;
  _balance integer;
  _card record;
  _row public.user_rewards;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT * INTO _reward FROM public.rewards
   WHERE id = _reward_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reward not available';
  END IF;

  IF COALESCE(_reward.points_required, 0) > 0 THEN
    SELECT balance INTO _balance FROM public.point_balances
     WHERE user_id = _user_id AND restaurant_id = _reward.restaurant_id;
    IF COALESCE(_balance, 0) < _reward.points_required THEN
      RAISE EXCEPTION 'Insufficient points';
    END IF;
    UPDATE public.point_balances
       SET balance = balance - _reward.points_required,
           total_redeemed = total_redeemed + _reward.points_required,
           updated_at = now()
     WHERE user_id = _user_id AND restaurant_id = _reward.restaurant_id;
  ELSIF COALESCE(_reward.stamps_required, 0) > 0 THEN
    SELECT * INTO _card FROM public.stamp_cards
     WHERE user_id = _user_id AND restaurant_id = _reward.restaurant_id
       AND is_complete = true AND current_stamps >= _reward.stamps_required
     ORDER BY updated_at ASC LIMIT 1;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No completed stamp card available';
    END IF;
    UPDATE public.stamp_cards
       SET current_stamps = 0, is_complete = false, updated_at = now()
     WHERE id = _card.id;
  ELSE
    RAISE EXCEPTION 'Reward has no redemption cost configured';
  END IF;

  INSERT INTO public.user_rewards (user_id, reward_id, is_redeemed, redeemed_at)
  VALUES (_user_id, _reward_id, true, now())
  RETURNING * INTO _row;

  RETURN _row;
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_reward(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_reward(uuid) TO authenticated;

-- 3. notifications: allow users to delete their own
CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE TO authenticated USING (user_id = auth.uid());
