-- Assign admin role to sam2911@live.com.au
INSERT INTO public.user_roles (user_id, role)
VALUES ('47910fd9-7c69-478a-a764-f17c477f320a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;