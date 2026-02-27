
-- Scan logs for audit trail and cooldown enforcement
CREATE TABLE public.scan_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_user_id UUID NOT NULL,
  customer_user_id UUID NOT NULL,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  action_type TEXT NOT NULL CHECK (action_type IN ('stamp', 'points')),
  points_awarded INTEGER NOT NULL DEFAULT 0,
  stamps_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- Vendors can view and create scan logs for their own restaurants
CREATE POLICY "Vendors can create scan logs"
ON public.scan_logs
FOR INSERT
WITH CHECK (
  vendor_user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = scan_logs.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

CREATE POLICY "Vendors can view their scan logs"
ON public.scan_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.restaurants
    WHERE restaurants.id = scan_logs.restaurant_id
    AND restaurants.owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all scan logs"
ON public.scan_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Customers can view their own scan logs
CREATE POLICY "Customers can view their own scan logs"
ON public.scan_logs
FOR SELECT
USING (customer_user_id = auth.uid());

-- Index for cooldown check
CREATE INDEX idx_scan_logs_cooldown 
ON public.scan_logs (customer_user_id, restaurant_id, created_at DESC);
