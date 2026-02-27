
import { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useVendorRewards } from "@/hooks/useVendorRewards";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScanLine, User, Plus, Minus, Check, AlertCircle, ArrowLeft, Keyboard } from "lucide-react";

type ScanState = "input" | "customer-found" | "success";

interface CustomerProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

const COOLDOWN_MINUTES = 5;

const VendorScanner = () => {
  const { user } = useAuth();
  const { restaurants, isLoadingRestaurants } = useVendorRewards();
  const queryClient = useQueryClient();
  const [scanState, setScanState] = useState<ScanState>("input");
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [stampCount, setStampCount] = useState(1);
  const [cooldownError, setCooldownError] = useState(false);
  const [manualId, setManualId] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [barcodeSupported, setBarcodeSupported] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);
  const scanAttemptsRef = useRef(0);
  const detectorRef = useRef<any>(null);

  // Check BarcodeDetector support on mount
  useEffect(() => {
    const supported = 'BarcodeDetector' in window;
    setBarcodeSupported(supported);
    if (supported) {
      // @ts-ignore
      detectorRef.current = new BarcodeDetector({ formats: ['qr_code'] });
    }
  }, []);

  const activeRestaurant = restaurants?.find(r => r.id === (selectedRestaurant || restaurants?.[0]?.id)) || restaurants?.[0];

  const extractUserId = (rawValue: string) => {
    const value = rawValue.trim();
    const uuidMatch = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
    return uuidMatch ? uuidMatch[0] : value;
  };

  const { data: customerBalance } = useQuery({
    queryKey: ['customer-balance', customer?.id, activeRestaurant?.id, activeRestaurant?.loyalty_type],
    queryFn: async () => {
      if (!customer || !activeRestaurant) return null;
      if (activeRestaurant.loyalty_type === 'stamps') {
        const { data } = await supabase
          .from('stamp_cards')
          .select('*')
          .eq('user_id', customer.id)
          .eq('restaurant_id', activeRestaurant.id)
          .eq('is_complete', false)
          .maybeSingle();
        return { type: 'stamps' as const, stamps: data?.current_stamps ?? 0, total: data?.total_stamps_required ?? activeRestaurant.stamps_required };
      } else {
        const { data } = await supabase
          .from('point_balances')
          .select('*')
          .eq('user_id', customer.id)
          .eq('restaurant_id', activeRestaurant.id)
          .maybeSingle();
        return { type: 'points' as const, balance: data?.balance ?? 0 };
      }
    },
    enabled: !!customer && !!activeRestaurant,
  });

  const lookupCustomer = async (rawValue: string) => {
    if (!activeRestaurant) return;

    const normalizedUserId = extractUserId(rawValue);
    if (!normalizedUserId) return;

    setIsLookingUp(true);

    try {
      // Check cooldown
      const fiveMinAgo = new Date(Date.now() - COOLDOWN_MINUTES * 60 * 1000).toISOString();
      const { data: recentScans } = await supabase
        .from('scan_logs')
        .select('id')
        .eq('customer_user_id', normalizedUserId)
        .eq('restaurant_id', activeRestaurant.id)
        .gte('created_at', fiveMinAgo)
        .limit(1);

      setCooldownError(recentScans !== null && recentScans.length > 0);

      // Fetch customer profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .eq('id', normalizedUserId)
        .single();

      if (error || !profile) {
        toast({ title: "Customer not found", description: "No customer found with that ID.", variant: "destructive" });
        return;
      }

      setCustomer(profile);
      setScanState("customer-found");
    } finally {
      setIsLookingUp(false);
    }
  };

  // Camera-based QR scanning using BarcodeDetector API
  const stopCamera = useCallback(() => {
    scanningRef.current = false;
    setCameraActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const scanLoop = useCallback(() => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current || !detectorRef.current) return;

    const tick = async () => {
      if (!scanningRef.current || !videoRef.current || !canvasRef.current || !detectorRef.current) return;

      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
          if (scanningRef.current) setTimeout(tick, 250);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          if (scanningRef.current) setTimeout(tick, 250);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const barcodes = await detectorRef.current.detect(canvas);

        if (barcodes.length > 0) {
          const value = barcodes[0].rawValue;
          stopCamera();
          lookupCustomer(value);
          return;
        }

        scanAttemptsRef.current += 1;
        if (scanAttemptsRef.current >= 60) {
          stopCamera();
          toast({ title: "QR not detected", description: "Try increasing screen brightness and distance, or use manual entry below.", variant: "destructive" });
          return;
        }
      } catch {
        scanAttemptsRef.current += 1;
      }

      if (scanningRef.current) {
        setTimeout(tick, 250);
      }
    };

    tick();
  }, [lookupCustomer, stopCamera]);

  const startCamera = useCallback(async () => {
    if (!barcodeSupported) {
      toast({ title: "QR scanning not supported", description: "Your browser doesn't support BarcodeDetector. Use manual ID entry or try Chrome on Android.", variant: "destructive" });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        scanAttemptsRef.current = 0;
        scanningRef.current = true;
        setCameraActive(true);
        scanLoop();
      }
    } catch {
      toast({ title: "Camera unavailable", description: "Use manual ID entry instead.", variant: "destructive" });
    }
  }, [barcodeSupported, scanLoop]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const awardLoyalty = useMutation({
    mutationFn: async () => {
      if (!user || !customer || !activeRestaurant) throw new Error('Missing data');
      const isStamps = activeRestaurant.loyalty_type === 'stamps';

      if (isStamps) {
        const { data: existingCards } = await supabase
          .from('stamp_cards')
          .select('*')
          .eq('user_id', customer.id)
          .eq('restaurant_id', activeRestaurant.id)
          .eq('is_complete', false);

        if (!existingCards || existingCards.length === 0) {
          const isComplete = stampCount >= activeRestaurant.stamps_required;
          await supabase.from('stamp_cards').insert([{
            user_id: customer.id,
            restaurant_id: activeRestaurant.id,
            current_stamps: stampCount,
            total_stamps_required: activeRestaurant.stamps_required,
            is_complete: isComplete,
          }]);
        } else {
          const card = existingCards[0];
          const newCount = card.current_stamps + stampCount;
          const isComplete = newCount >= card.total_stamps_required;
          await supabase.from('stamp_cards')
            .update({ current_stamps: newCount, is_complete: isComplete })
            .eq('id', card.id);
        }
      } else {
        const pointsToAward = Math.floor(stampCount * activeRestaurant.points_per_dollar);
        const { data: existing } = await supabase
          .from('point_balances')
          .select('*')
          .eq('user_id', customer.id)
          .eq('restaurant_id', activeRestaurant.id)
          .maybeSingle();

        if (existing) {
          await supabase.from('point_balances').update({
            balance: existing.balance + pointsToAward,
            total_earned: existing.total_earned + pointsToAward,
          }).eq('id', existing.id);
        } else {
          await supabase.from('point_balances').insert([{
            user_id: customer.id,
            restaurant_id: activeRestaurant.id,
            balance: pointsToAward,
            total_earned: pointsToAward,
          }]);
        }
      }

      await supabase.from('scan_logs').insert([{
        vendor_user_id: user.id,
        customer_user_id: customer.id,
        restaurant_id: activeRestaurant.id,
        action_type: isStamps ? 'stamp' : 'points',
        stamps_awarded: isStamps ? stampCount : 0,
        points_awarded: isStamps ? 0 : Math.floor(stampCount * activeRestaurant.points_per_dollar),
      }]);
    },
    onSuccess: () => {
      setScanState("success");
      queryClient.invalidateQueries({ queryKey: ['customer-balance'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error awarding loyalty", description: error.message, variant: "destructive" });
    },
  });

  const resetScanner = () => {
    setCustomer(null);
    setCooldownError(false);
    setStampCount(1);
    setManualId("");
    setScanState("input");
  };

  if (isLoadingRestaurants) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8"><div className="text-center">Loading...</div></main>
        <Footer />
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8">
          <Card><CardContent className="p-6 text-center text-muted-foreground">No restaurants found.</CardContent></Card>
        </main>
        <Footer />
      </div>
    );
  }

  const isStamps = activeRestaurant?.loyalty_type === 'stamps';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <ScanLine className="h-6 w-6" /> Scan Customer
        </h1>
        <p className="text-muted-foreground mb-6">
          {activeRestaurant?.name} — {isStamps ? '🎟️ Stamps' : '⭐ Points'}
        </p>

        {restaurants.length > 1 && scanState === "input" && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {restaurants.map(r => (
              <Button
                key={r.id}
                variant={r.id === activeRestaurant?.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRestaurant(r.id)}
              >
                {r.name}
              </Button>
            ))}
          </div>
        )}

        {/* Input state - camera + manual entry */}
        {scanState === "input" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ScanLine className="h-5 w-5" /> Camera Scanner
                </CardTitle>
              </CardHeader>
              <CardContent>
                {barcodeSupported === false && (
                  <div className="p-3 bg-destructive/10 rounded-lg text-sm text-destructive mb-3">
                    ⚠️ Your browser doesn't support QR scanning. Use <strong>Chrome on Android</strong> or try <strong>manual entry</strong> below.
                  </div>
                )}
                <div className="relative rounded-lg overflow-hidden bg-muted aspect-square max-h-64 mx-auto">
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  {cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-primary rounded-lg animate-pulse" />
                    </div>
                  )}
                </div>
                <Button className="w-full mt-3" variant="outline" onClick={cameraActive ? stopCamera : startCamera} disabled={barcodeSupported === false}>
                  <ScanLine className="h-4 w-4 mr-2" /> {cameraActive ? 'Stop Camera' : 'Start Camera'}
                </Button>
                {cameraActive && (
                  <p className="text-xs text-primary text-center mt-2 animate-pulse">
                    📷 Scanning... Hold QR code steady in front of camera
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Keyboard className="h-5 w-5" /> Manual Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter customer ID"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && lookupCustomer(manualId)}
                  />
                  <Button onClick={() => lookupCustomer(manualId)} disabled={isLookingUp || !manualId.trim()}>
                    {isLookingUp ? "Looking up..." : "Look Up"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customer found */}
        {scanState === "customer-found" && customer && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" /> Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{customer.full_name || 'Customer'}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                {customerBalance && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    {customerBalance.type === 'stamps' ? (
                      <p className="text-sm">Current stamps: <span className="font-bold">{customerBalance.stamps}</span> / {customerBalance.total}</p>
                    ) : (
                      <p className="text-sm">Point balance: <span className="font-bold">{customerBalance.balance}</span></p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {cooldownError ? (
              <Card className="border-destructive">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <div>
                    <p className="font-medium text-destructive">Cooldown active</p>
                    <p className="text-sm text-muted-foreground">
                      This customer was scanned within the last {COOLDOWN_MINUTES} minutes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {isStamps ? 'Add Stamps' : 'Add Points'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Button variant="outline" size="icon" onClick={() => setStampCount(Math.max(1, stampCount - 1))} disabled={stampCount <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                      <span className="text-4xl font-bold">{stampCount}</span>
                      <p className="text-sm text-muted-foreground">
                        {isStamps ? (stampCount === 1 ? 'stamp' : 'stamps') : `$${stampCount} = ${Math.floor(stampCount * (activeRestaurant?.points_per_dollar || 1))} pts`}
                      </p>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setStampCount(stampCount + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="w-full" size="lg" onClick={() => awardLoyalty.mutate()} disabled={awardLoyalty.isPending}>
                    <Check className="h-4 w-4 mr-2" />
                    {awardLoyalty.isPending ? 'Awarding...' : isStamps ? `Award ${stampCount} Stamp${stampCount > 1 ? 's' : ''}` : `Award ${Math.floor(stampCount * (activeRestaurant?.points_per_dollar || 1))} Points`}
                  </Button>
                </CardContent>
              </Card>
            )}

            <Button variant="outline" className="w-full" onClick={resetScanner}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Scan Another Customer
            </Button>
          </div>
        )}

        {/* Success state */}
        {scanState === "success" && (
          <Card className="border-primary">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Loyalty Awarded!</h2>
              <p className="text-muted-foreground mb-1">{customer?.full_name || 'Customer'} received</p>
              <p className="text-2xl font-bold text-primary">
                {isStamps
                  ? `${stampCount} stamp${stampCount > 1 ? 's' : ''}`
                  : `${Math.floor(stampCount * (activeRestaurant?.points_per_dollar || 1))} points`}
              </p>
              <Button className="mt-6 w-full" onClick={resetScanner}>
                Scan Next Customer
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VendorScanner;
