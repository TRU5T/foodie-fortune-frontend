
-- Promotions table for menu item deals
CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  promotion_type text NOT NULL DEFAULT 'discount' CHECK (promotion_type IN ('discount', 'double_stamps', 'double_points', 'welcome_bonus')),
  discount_percent numeric DEFAULT 0,
  applicable_menu_item_id uuid REFERENCES public.menu_items(id) ON DELETE SET NULL,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone NOT NULL DEFAULT (now() + interval '30 days'),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'reward_progress', 'promotion', 'reward_earned')),
  is_read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS for promotions
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active promotions" ON public.promotions
  FOR SELECT TO authenticated
  USING (is_active = true AND now() BETWEEN start_date AND end_date);

CREATE POLICY "Vendors can manage their promotions" ON public.promotions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM restaurants WHERE restaurants.id = promotions.restaurant_id AND restaurants.owner_id = auth.uid()));

CREATE POLICY "Admins can view all promotions" ON public.promotions
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Updated_at trigger for promotions
CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
