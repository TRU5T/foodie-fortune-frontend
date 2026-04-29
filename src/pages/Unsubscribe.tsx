import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MailX, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://enxgmlixweivsjlodfaa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVueGdtbGl4d2VpdnNqbG9kZmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzE3NzAsImV4cCI6MjA4Nzc0Nzc3MH0.oBcmxKuVhODrJhfuPbpyztbTHm97AEpHFPs_4uRu4T4";

type State = "loading" | "ready" | "already" | "invalid" | "submitting" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState("invalid");
          setErrorMsg(data?.error ?? "This unsubscribe link is invalid or has expired.");
          return;
        }
        if (data?.alreadyUnsubscribed) {
          setEmail(data?.email ?? null);
          setState("already");
        } else {
          setEmail(data?.email ?? null);
          setState("ready");
        }
      } catch {
        setState("invalid");
        setErrorMsg("We couldn't verify this link. Please try again later.");
      }
    })();
  }, [token]);

  const confirm = async () => {
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error || (data && data.error)) {
      setState("error");
      setErrorMsg(error?.message ?? data?.error ?? "Something went wrong.");
      return;
    }
    setState("done");
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {state === "done" || state === "already" ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : state === "invalid" || state === "error" ? (
              <XCircle className="h-6 w-6 text-destructive" />
            ) : (
              <MailX className="h-6 w-6 text-primary" />
            )}
          </div>
          <CardTitle>
            {state === "loading" && "Checking your link…"}
            {state === "ready" && "Unsubscribe from emails"}
            {state === "already" && "You're already unsubscribed"}
            {state === "submitting" && "Unsubscribing…"}
            {state === "done" && "You're unsubscribed"}
            {state === "invalid" && "Link not valid"}
            {state === "error" && "Something went wrong"}
          </CardTitle>
          <CardDescription>
            {state === "ready" && (
              <>We'll stop sending marketing & notification emails to {email ? <strong>{email}</strong> : "this address"}. You'll still receive critical account emails (like password resets).</>
            )}
            {state === "already" && (email ? <>{email} is no longer receiving emails from Redeemr.</> : "This address is no longer receiving emails from Redeemr.")}
            {state === "done" && (email ? <>{email} won't receive further emails from Redeemr.</> : "You won't receive further emails from Redeemr.")}
            {(state === "invalid" || state === "error") && (errorMsg || "This unsubscribe link is invalid or has expired.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {state === "loading" && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
          {state === "ready" && (
            <Button onClick={confirm} className="w-full">Confirm unsubscribe</Button>
          )}
          {state === "submitting" && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
          {(state === "done" || state === "already") && (
            <Button asChild variant="outline" className="w-full">
              <a href="/">Back to Redeemr</a>
            </Button>
          )}
          {(state === "invalid" || state === "error") && (
            <Button asChild variant="outline" className="w-full">
              <a href="/contact">Contact support</a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
