
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { QrCode } from "lucide-react";

const MyQRCode = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email')
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

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(user.id)}`;

  const copyCustomerId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      toast({ title: "Customer ID copied", description: "Paste this into Manual Entry on the scanner if camera scan fails." });
    } catch {
      toast({ title: "Could not copy", description: "Please copy the ID manually.", variant: "destructive" });
    }
  };

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
            <div className="bg-white p-4 rounded-xl shadow-inner">
              <img src={qrUrl} alt="My QR Code" width={220} height={220} />
            </div>
            <div className="w-full rounded-lg border p-3 text-left">
              <p className="text-xs text-muted-foreground mb-1">Fallback Customer ID</p>
              <p className="text-xs font-mono break-all">{user.id}</p>
              <Button type="button" variant="outline" size="sm" className="w-full mt-2" onClick={copyCustomerId}>
                Copy customer ID
              </Button>
            </div>
            <div className="text-sm">
              <p className="font-medium">{profile?.full_name || 'Customer'}</p>
              <p className="text-muted-foreground">{profile?.email || user.email}</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default MyQRCode;
