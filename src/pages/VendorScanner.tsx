
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useVendorRewards } from "@/hooks/useVendorRewards";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sanitizeDbError } from "@/lib/sanitizeError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScanLine, User, Plus, Minus, Check, AlertCircle, ArrowLeft, Keyboard, Gift } from "lucide-react";

type ScanState = "input" | "customer-found" | "select-reward" | "award" | "success";

interface Reward {
  id: string;
  name: string;
  description: string | null;
  stamps_required: number;
  points_required: number;
  image_url: string | null;
}

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
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
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

  const parseLookupInput = (rawValue: string): { type: 'email' | 'phone'; value: string } | null => {
    const value = rawValue.trim();
    if (!value) return null;

    const emailMatch = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    if (emailMatch) {
      return { type: 'email', value: emailMatch[0].toLowerCase() };
    }

    const phoneCandidate = value.replace(/[^\d+]/g, '');
    const phoneDigits = phoneCandidate.replace(/\D/g, '');
    if (phoneDigits.length >= 8) {
      return { type: 'phone', value: phoneCandidate.startsWith('+') ? phoneCandidate : phoneDigits };
    }

    return null;
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

  const { data: vendorRewards } = useQuery({
    queryKey: ['vendor-rewards', activeRestaurant?.id],
    queryFn: async () => {
      if (!activeRestaurant) return [];
      const { data, error } = await supabase
        .from('rewards')
        .select('id, name, description, stamps_required, points_required, image_url')
        .eq('restaurant_id', activeRestaurant.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Reward[];
    },
    enabled: !!activeRestaurant,
  });

  // Check if a value looks like a signed QR token (userId:timestamp:signature)
  const isSignedToken = (value: string): boolean => {
    const parts = value.split(':');
    return parts.length === 3 && parts[0].length === 36 && !isNaN(parseInt(parts[1], 10));
  };

  const lookupCustomerByToken = async (token: string) => {
    if (!activeRestaurant) return;
    setIsLookingUp(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("qr-token", {
        body: { action: "validate", token },
      });

      if (fnError) throw fnError;

      if (!data?.valid) {
        toast({
          title: "Invalid or expired QR code",
          description: data?.error === "Token expired"
            ? "Ask the customer to refresh their QR code."
            : "QR code could not be verified. Use manual entry instead.",
          variant: "destructive",
        });
        return;
      }

      const profile: CustomerProfile | null = data.profile ?? null;
      if (!profile) {
        toast({ title: "Customer not found", description: "No profile found for this QR code.", variant: "destructive" });
        return;
      }

      const fiveMinAgo = new Date(Date.now() - COOLDOWN_MINUTES * 60 * 1000).toISOString();
      const { data: recentScans } = await supabase
        .from('scan_logs')
        .select('id')
        .eq('customer_user_id', profile.id)
        .eq('restaurant_id', activeRestaurant.id)
        .gte('created_at', fiveMinAgo)
        .limit(1);

      setCooldownError(recentScans !== null && recentScans.length > 0);
      setCustomer(profile);
      setScanState("customer-found");
    } catch (error) {
      toast({ title: "QR verification failed", description: "Please try manual entry.", variant: "destructive" });
      console.error("Token validation failed", error);
    } finally {
      setIsLookingUp(false);
    }
  };

  const lookupCustomer = async (rawValue: string) => {
    if (!activeRestaurant) return;

    // If scanned value is a signed token, validate via edge function
    if (isSignedToken(rawValue)) {
      return lookupCustomerByToken(rawValue);
    }

    const parsedLookup = parseLookupInput(rawValue);
    if (!parsedLookup) {
      toast({ title: "Invalid input", description: "Enter a valid email or mobile number.", variant: "destructive" });
      return;
    }

    setIsLookingUp(true);

    try {
      let profile: CustomerProfile | null = null;

      if (parsedLookup.type === 'email') {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .ilike('email', parsedLookup.value)
          .limit(1);

        if (error) throw error;
        profile = data?.[0] ?? null;
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .eq('phone', parsedLookup.value)
          .limit(1);

        if (error) throw error;
        profile = data?.[0] ?? null;

        if (!profile) {
          const phoneDigits = parsedLookup.value.replace(/\D/g, '');
          if (phoneDigits.length >= 8) {
            const { data: fuzzyData, error: fuzzyError } = await supabase
              .from('profiles')
              .select('id, full_name, email, avatar_url')
              .ilike('phone', `%${phoneDigits}%`)
              .limit(1);

            if (fuzzyError) throw fuzzyError;
            profile = fuzzyData?.[0] ?? null;
          }
        }
      }

      if (!profile) {
        toast({ title: "Customer not found", description: "No customer found with that email or mobile.", variant: "destructive" });
        return;
      }

      const fiveMinAgo = new Date(Date.now() - COOLDOWN_MINUTES * 60 * 1000).toISOString();
      const { data: recentScans } = await supabase
        .from('scan_logs')
        .select('id')
        .eq('customer_user_id', profile.id)
        .eq('restaurant_id', activeRestaurant.id)
        .gte('created_at', fiveMinAgo)
        .limit(1);

      setCooldownError(recentScans !== null && recentScans.length > 0);
      setCustomer(profile);
      setScanState("customer-found");
    } catch (error) {
      toast({ title: "Lookup failed", description: "Please try again.", variant: "destructive" });
      console.error("Customer lookup failed", error);
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
    if (barcodeSupported !== true) {
      toast({
        title: "Camera scanning unavailable on this browser",
        description: "Use manual email or mobile entry below (iPhone browsers do not support BarcodeDetector yet).",
      });
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
      toast({ title: "Camera unavailable", description: "Use manual email or mobile entry instead.", variant: "destructive" });
    }
  }, [barcodeSupported, scanLoop]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const awardLoyalty = useMutation({
    mutationFn: async () => {
      if (!user || !customer || !activeRestaurant) throw new Error('Missing data');
      const { error } = await (supabase as any).rpc('award_loyalty', {
        _customer_user_id: customer.id,
        _restaurant_id: activeRestaurant.id,
        _quantity: stampCount,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setScanState("success");
      queryClient.invalidateQueries({ queryKey: ['customer-balance'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error awarding loyalty", description: sanitizeDbError(error), variant: "destructive" });
    },
  });

  const resetScanner = () => {
    setCustomer(null);
    setCooldownError(false);
    setStampCount(1);
    setManualId("");
    setSelectedReward(null);
    setScanState("input");
  };

  if (isLoadingRestaurants) {
    return (
      <div className="container py-8"><div className="text-center">Loading...</div></div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="container py-8">
        <Card><CardContent className="p-6 text-center text-muted-foreground">No restaurants found.</CardContent></Card>
      </div>
    );
  }

  const isStamps = activeRestaurant?.loyalty_type === 'stamps';

  return (
    <div className="container py-8 max-w-lg mx-auto">
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
                  <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground mb-3">
                    iPhone browsers currently can't scan QR here. Please use manual entry with customer email or mobile.
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
                <Button className="w-full mt-3" variant="outline" onClick={cameraActive ? stopCamera : startCamera} disabled={!cameraActive && barcodeSupported !== true}>
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
                  <Keyboard className="h-5 w-5" /> Manual Entry (Email / Mobile)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter customer email or mobile"
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

        {/* Customer found - show reward tiles */}
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
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-5 w-5" /> Select Reward
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {vendorRewards && vendorRewards.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {vendorRewards.map((reward) => (
                          <button
                            key={reward.id}
                            className="p-4 rounded-lg border-2 text-left transition-all hover:shadow-md border-border hover:border-primary"
                            onClick={() => {
                              setSelectedReward(reward);
                              setStampCount(1);
                              setScanState("award");
                            }}
                          >
                            <Gift className="h-6 w-6 text-primary mb-2" />
                            <p className="font-semibold text-sm">{reward.name}</p>
                            {reward.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reward.description}</p>
                            )}
                            <p className="text-xs font-medium text-primary mt-2">
                              {isStamps
                                ? `${reward.stamps_required} stamps`
                                : `${reward.points_required} points`}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No rewards set up yet. Add rewards in your Vendor Dashboard.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            <Button variant="outline" className="w-full" onClick={resetScanner}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Scan Another Customer
            </Button>
          </div>
        )}

        {/* Award state - selected reward, add stamps/points */}
        {scanState === "award" && customer && selectedReward && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5" /> {selectedReward.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{customer.full_name || 'Customer'}</p>
                    {customerBalance && (
                      <p className="text-xs text-muted-foreground">
                        {customerBalance.type === 'stamps'
                          ? `${customerBalance.stamps} / ${customerBalance.total} stamps`
                          : `${customerBalance.balance} points`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg mb-4 text-sm">
                  <p>Goal: <span className="font-bold">{isStamps ? `${selectedReward.stamps_required} stamps` : `${selectedReward.points_required} points`}</span></p>
                  {selectedReward.description && <p className="text-muted-foreground mt-1">{selectedReward.description}</p>}
                </div>

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

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setScanState("customer-found")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Rewards
              </Button>
              <Button variant="outline" className="flex-1" onClick={resetScanner}>
                New Customer
              </Button>
            </div>
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
              {selectedReward && <p className="text-sm text-muted-foreground mb-1">for {selectedReward.name}</p>}
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
    </div>
  );
};

export default VendorScanner;
