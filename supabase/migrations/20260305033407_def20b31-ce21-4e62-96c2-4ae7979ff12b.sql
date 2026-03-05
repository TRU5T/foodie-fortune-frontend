
-- Fix handle_new_user to sanitize client-supplied full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  cleaned_name TEXT;
BEGIN
  cleaned_name := TRIM(SUBSTRING(NEW.raw_user_meta_data->>'full_name', 1, 100));
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NULLIF(cleaned_name, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add length constraint on profiles.full_name
ALTER TABLE public.profiles ADD CONSTRAINT full_name_length CHECK (LENGTH(full_name) <= 100);
