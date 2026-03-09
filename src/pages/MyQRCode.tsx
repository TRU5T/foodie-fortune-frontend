
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000;

const MyQRCode = () => {
  const { user } = useAuth();
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateToken = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("qr-token", {
        body: { action: "generate" },
      });
      if (fnError) throw fnError;
      if (data?.token) {
        setQrToken(data.token);
      } else {
        throw new Error("No token returned");
      }
    } catch (e) {
      console.error("QR token generation failed", e);
      setError("Could not generate QR code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      generateToken();
      const interval = setInterval(generateToken, TOKEN_REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [user, generateToken]);

  if (!user) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Please sign in to view your QR code.</p>
      </div>
    );
  }

  const qrUrl = qrToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrToken)}`
    : null;

  return (
    <div className="container py-8 flex items-center justify-center">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <QrCode className="h-5 w-5" />
            My Loyalty QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Show this to the cashier to earn stamps or points
          </p>
          {isLoading && !qrToken && (
            <div className="w-[220px] h-[220px] flex items-center justify-center bg-muted rounded-xl">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && (
            <div className="w-full rounded-lg border border-destructive p-4 text-sm text-destructive">
              {error}
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={generateToken}>Retry</Button>
            </div>
          )}
          {qrUrl && !error && (
            <div className="bg-white p-4 rounded-xl shadow-inner">
              <img src={qrUrl} alt="My QR Code" width={220} height={220} />
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center">
            QR code refreshes automatically every few minutes for security.
            <br />
            If camera scan fails, cashier can use your email or mobile in Manual Entry.
          </p>
          <Button variant="ghost" size="sm" onClick={generateToken} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh QR
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyQRCode;
