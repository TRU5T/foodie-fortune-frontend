import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";

const VendorPoster = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["vendor-poster-restaurant", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name, cuisine, loyalty_type, stamps_required")
        .eq("id", restaurantId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!restaurantId,
  });

  const url = useMemo(
    () => (restaurantId ? `https://redeemr.app/restaurant/${restaurantId}` : ""),
    [restaurantId]
  );

  const qrSrc = useMemo(
    () =>
      url
        ? `https://api.qrserver.com/v1/create-qr-code/?size=640x640&margin=8&data=${encodeURIComponent(url)}`
        : "",
    [url]
  );

  useEffect(() => {
    document.body.classList.add("poster-print-body");
    return () => document.body.classList.remove("poster-print-body");
  }, []);

  if (isLoading) {
    return <div className="container py-12 text-center text-muted-foreground">Loading poster…</div>;
  }

  if (!restaurant) {
    return <div className="container py-12 text-center text-muted-foreground">Restaurant not found.</div>;
  }

  const reward =
    restaurant.loyalty_type === "stamps"
      ? `Buy ${Math.max(1, (restaurant.stamps_required ?? 10) - 1)}, get 1 free`
      : "Earn points on every visit";

  return (
    <div className="min-h-screen bg-[#FAFAF7] py-8">
      <Helmet>
        <title>QR Poster · {restaurant.name} · Redeemr</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body.poster-print-body { background: white !important; }
          .no-print { display: none !important; }
          .poster-sheet { box-shadow: none !important; margin: 0 !important; page-break-inside: avoid; }
        }
      `}</style>

      <div className="container max-w-3xl">
        <div className="no-print flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/vendor-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to dashboard
            </Link>
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print poster
          </Button>
        </div>

        <div
          className="poster-sheet mx-auto bg-white shadow-lg"
          style={{ width: "210mm", minHeight: "297mm", padding: "24mm" }}
        >
          <div className="flex items-center gap-3 mb-10">
            <span className="h-10 w-10 rounded-lg bg-[#E8521A] flex items-center justify-center text-white text-lg font-bold">
              ★
            </span>
            <span className="text-2xl font-bold tracking-tight text-[#1C1917]">Redeemr</span>
          </div>

          <p className="text-sm uppercase tracking-[0.2em] text-[#E8521A] font-semibold mb-4">
            Loyalty rewards
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-[#1C1917] leading-tight mb-4">
            Earn rewards at {restaurant.name}
          </h1>
          <p className="text-xl text-[#57534E] mb-10 leading-relaxed">{reward}</p>

          <div className="flex flex-col items-center py-8 border-y border-[#E7E5E4]">
            {qrSrc && (
              <img src={qrSrc} alt="Scan to join loyalty" width={320} height={320} className="mb-4" />
            )}
            <p className="text-lg font-semibold text-[#1C1917]">Scan to join</p>
            <p className="text-sm text-[#78716C]">Or visit {url.replace("https://", "")}</p>
          </div>

          <ol className="mt-10 space-y-4 text-[#1C1917]">
            <li className="flex gap-4">
              <span className="h-8 w-8 rounded-full bg-[#F97316]/10 text-[#E8521A] font-bold flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold">Scan the QR code</p>
                <p className="text-sm text-[#57534E]">Opens in your browser — no app download needed.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="h-8 w-8 rounded-full bg-[#F97316]/10 text-[#E8521A] font-bold flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div>
                <p className="font-semibold">Sign up in 20 seconds</p>
                <p className="text-sm text-[#57534E]">Just your email — your loyalty card is created instantly.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="h-8 w-8 rounded-full bg-[#F97316]/10 text-[#E8521A] font-bold flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div>
                <p className="font-semibold">Show your QR at checkout</p>
                <p className="text-sm text-[#57534E]">We'll scan you in and add your stamp or points.</p>
              </div>
            </li>
          </ol>

          <p className="mt-12 pt-6 border-t border-[#E7E5E4] text-xs text-[#A8A29E] text-center">
            Powered by Redeemr · redeemr.app
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorPoster;
