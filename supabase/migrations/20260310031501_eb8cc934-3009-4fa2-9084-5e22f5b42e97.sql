
CREATE TABLE public.device_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL,
  platform text NOT NULL DEFAULT 'android',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, token)
);

ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Users can insert their own tokens
CREATE POLICY "Users can insert own tokens"
  ON public.device_tokens FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can view their own tokens
CREATE POLICY "Users can view own tokens"
  ON public.device_tokens FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own tokens
CREATE POLICY "Users can update own tokens"
  ON public.device_tokens FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Users can delete their own tokens
CREATE POLICY "Users can delete own tokens"
  ON public.device_tokens FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Service role / edge functions need to read all tokens for a user_id
-- This is handled via service_role key in the edge function

CREATE TRIGGER update_device_tokens_updated_at
  BEFORE UPDATE ON public.device_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
