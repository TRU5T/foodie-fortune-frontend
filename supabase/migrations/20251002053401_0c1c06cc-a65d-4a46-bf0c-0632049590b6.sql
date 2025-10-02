-- Create restaurants table
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  cuisine TEXT,
  description TEXT,
  logo_url TEXT,
  points_per_dollar INTEGER NOT NULL DEFAULT 1,
  stamps_required INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL DEFAULT 0,
  stamps_required INTEGER NOT NULL DEFAULT 10,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for restaurants table

-- Everyone can view restaurants
CREATE POLICY "Everyone can view restaurants"
ON public.restaurants
FOR SELECT
TO authenticated
USING (true);

-- Vendors can create their own restaurants
CREATE POLICY "Vendors can create restaurants"
ON public.restaurants
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'vendor') AND owner_id = auth.uid());

-- Vendors can update their own restaurants
CREATE POLICY "Vendors can update their restaurants"
ON public.restaurants
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid() AND has_role(auth.uid(), 'vendor'));

-- Vendors can delete their own restaurants
CREATE POLICY "Vendors can delete their restaurants"
ON public.restaurants
FOR DELETE
TO authenticated
USING (owner_id = auth.uid() AND has_role(auth.uid(), 'vendor'));

-- RLS Policies for rewards table

-- Customers can view all active rewards
CREATE POLICY "Customers can view all active rewards"
ON public.rewards
FOR SELECT
TO authenticated
USING (is_active = true);

-- Vendors can view their restaurant's rewards (all)
CREATE POLICY "Vendors can view their restaurant rewards"
ON public.rewards
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'vendor')
  AND EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = rewards.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

-- Vendors can create rewards for their restaurants
CREATE POLICY "Vendors can create rewards"
ON public.rewards
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'vendor')
  AND EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = rewards.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

-- Vendors can update their restaurant's rewards
CREATE POLICY "Vendors can update their rewards"
ON public.rewards
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'vendor')
  AND EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = rewards.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

-- Vendors can delete their restaurant's rewards
CREATE POLICY "Vendors can delete their rewards"
ON public.rewards
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'vendor')
  AND EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = rewards.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_rewards_restaurant_id ON public.rewards(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_rewards_is_active ON public.rewards(is_active);

-- Create triggers for updated_at
CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();