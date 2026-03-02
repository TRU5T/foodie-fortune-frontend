
-- Make scan_logs immutable: explicitly deny UPDATE and DELETE
CREATE POLICY "Scan logs are immutable"
ON public.scan_logs
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Scan logs cannot be deleted"
ON public.scan_logs
FOR DELETE
TO authenticated
USING (false);
