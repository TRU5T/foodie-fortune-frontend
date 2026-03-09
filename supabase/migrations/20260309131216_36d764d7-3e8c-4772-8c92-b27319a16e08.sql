
DROP POLICY "System can insert notifications" ON public.notifications;

CREATE POLICY "Vendors and admins can insert notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'vendor') OR has_role(auth.uid(), 'admin')
  );
