
-- Create subscriptions table for vendor billing
CREATE TABLE public.vendor_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  price_cents INTEGER NOT NULL DEFAULT 2000,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 month'),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'past_due', 'cancelled', 'trialing')),
  CONSTRAINT valid_plan CHECK (plan IN ('starter')),
  CONSTRAINT valid_billing_cycle CHECK (billing_cycle IN ('monthly', 'annual'))
);

ALTER TABLE public.vendor_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view own subscriptions"
ON public.vendor_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Vendors can insert own subscriptions"
ON public.vendor_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vendors can update own subscriptions"
ON public.vendor_subscriptions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
ON public.vendor_subscriptions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all subscriptions"
ON public.vendor_subscriptions FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE UNIQUE INDEX idx_vendor_subscriptions_restaurant ON public.vendor_subscriptions(restaurant_id);

CREATE TRIGGER update_vendor_subscriptions_updated_at
BEFORE UPDATE ON public.vendor_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
