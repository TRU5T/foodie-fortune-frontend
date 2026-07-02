
-- Referral code on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_code text;
  done boolean := false;
BEGIN
  WHILE NOT done LOOP
    new_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_code) THEN
      done := true;
    END IF;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Backfill codes for existing profiles
UPDATE public.profiles
SET referral_code = public.generate_referral_code()
WHERE referral_code IS NULL;

-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_email text,
  referred_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','joined','rewarded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS referrals_referred_user_idx ON public.referrals(referred_user_id);

GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Referrers can view their own referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert their own referral invites"
  ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins manage referrals"
  ON public.referrals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Update handle_new_user to assign a referral code and link referrer
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleaned_name TEXT;
  ref_code TEXT;
  referrer_profile_id uuid;
BEGIN
  cleaned_name := TRIM(SUBSTRING(NEW.raw_user_meta_data->>'full_name', 1, 100));
  ref_code := public.generate_referral_code();

  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (NEW.id, NEW.email, NULLIF(cleaned_name, ''), ref_code);

  -- If signup metadata carries a referred_by code, mark that referral joined
  IF NEW.raw_user_meta_data ? 'referred_by' THEN
    SELECT id INTO referrer_profile_id
    FROM public.profiles
    WHERE referral_code = upper(NEW.raw_user_meta_data->>'referred_by')
    LIMIT 1;

    IF referrer_profile_id IS NOT NULL AND referrer_profile_id <> NEW.id THEN
      INSERT INTO public.referrals (referrer_id, referred_email, referred_user_id, status, completed_at)
      VALUES (referrer_profile_id, NEW.email, NEW.id, 'joined', now());
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
