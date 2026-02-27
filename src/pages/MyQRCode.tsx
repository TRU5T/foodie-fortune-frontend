
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QrCode } from "lucide-react";

const MyQRCode = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('profiles')
        .select('email, phone')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8 flex items-center justify-center">
          <p className="text-muted-foreground">Please sign in to view your QR code.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const qrLookupValue = profile?.phone?.trim() || profile?.email?.trim() || user.email?.trim() || "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrLookupValue)}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8 flex items-center justify-center">
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
            {qrLookupValue ? (
              <div className="bg-white p-4 rounded-xl shadow-inner">
                <img src={qrUrl} alt="My QR Code" width={220} height={220} />
              </div>
            ) : (
              <div className="w-full rounded-lg border p-4 text-sm text-muted-foreground">
                Add an email or mobile in your profile to generate your loyalty QR code.
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">
              If camera scan fails, cashier can use your email or mobile in Manual Entry.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default MyQRCode;
