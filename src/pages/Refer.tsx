import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Gift, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Refer = () => {
  const { user, profile, isLoading } = useAuth();
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!profile?.referral_code) return "";
    return `https://redeemr.app/auth?tab=register&ref=${profile.referral_code}`;
  }, [profile]);

  const { data: referrals } = useQuery({
    queryKey: ["my-referrals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals")
        .select("id, referred_email, status, created_at, completed_at")
        .eq("referrer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <div className="container py-12 text-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied", description: "Share it with a friend." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Redeemr",
          text: "Collect stamps and earn rewards at your favourite restaurants.",
          url: shareUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopy();
    }
  };

  const joinedCount = referrals?.filter((r) => r.status !== "pending").length ?? 0;

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <Helmet>
        <title>Invite friends · Redeemr</title>
        <meta name="description" content="Invite friends to Redeemr and both earn bonus stamps at participating restaurants." />
        <link rel="canonical" href="https://redeemr.app/refer" />
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invite friends</h1>
        <p className="text-muted-foreground mt-1">
          Share Redeemr with a friend — you'll both get a bonus stamp on your next visit to a participating venue.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Your invite link
          </CardTitle>
          <CardDescription>Anyone who signs up through this link is added to your referrals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy link">
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleShare} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" asChild>
              <Link to="/my-qr-code">Show my QR</Link>
            </Button>
          </div>
          {profile?.referral_code && (
            <p className="text-xs text-muted-foreground">
              Your code: <span className="font-mono font-semibold text-foreground">{profile.referral_code}</span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your referrals</CardTitle>
          <CardDescription>
            {joinedCount === 0
              ? "No signups yet — share your link to get started."
              : `${joinedCount} friend${joinedCount === 1 ? "" : "s"} joined so far.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!referrals || referrals.length === 0 ? (
            <p className="text-sm text-muted-foreground">Referrals will appear here once friends sign up.</p>
          ) : (
            <ul className="divide-y divide-border">
              {referrals.map((r) => (
                <li key={r.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.referred_email ?? "New signup"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={r.status === "pending" ? "secondary" : "default"} className="capitalize">
                    {r.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Refer;
