import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, UtensilsCrossed, Star, Sparkles, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sanitizeDbError } from "@/lib/sanitizeError";

interface Template {
  id: string;
  icon: typeof Coffee;
  title: string;
  subtitle: string;
  loyaltyType: "stamps" | "points";
  stampsRequired: number;
  pointsPerDollar: number;
  rewardName: string;
  rewardDescription: string;
  rewardStamps: number;
  rewardPoints: number;
}

const TEMPLATES: Template[] = [
  {
    id: "coffee",
    icon: Coffee,
    title: "Coffee Card",
    subtitle: "Buy 9 coffees, get 1 free",
    loyaltyType: "stamps",
    stampsRequired: 10,
    pointsPerDollar: 1,
    rewardName: "Free Coffee",
    rewardDescription: "Enjoy a complimentary coffee on us. Any size, any style.",
    rewardStamps: 10,
    rewardPoints: 0,
  },
  {
    id: "lunch",
    icon: UtensilsCrossed,
    title: "Lunch Loyalty",
    subtitle: "Buy 7 lunches, get 1 free",
    loyaltyType: "stamps",
    stampsRequired: 8,
    pointsPerDollar: 1,
    rewardName: "Free Lunch",
    rewardDescription: "One free lunch main after 7 visits.",
    rewardStamps: 8,
    rewardPoints: 0,
  },
  {
    id: "points",
    icon: Star,
    title: "Points Program",
    subtitle: "Earn 10 points per $1 spent",
    loyaltyType: "points",
    stampsRequired: 10,
    pointsPerDollar: 10,
    rewardName: "$5 off",
    rewardDescription: "Redeem 500 points for $5 off your next order.",
    rewardStamps: 0,
    rewardPoints: 500,
  },
];

interface Props {
  restaurantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VendorOnboardingWizard = ({ restaurantId, open, onOpenChange }: Props) => {
  const [selectedId, setSelectedId] = useState<string>("coffee");
  const queryClient = useQueryClient();

  const applyTemplate = useMutation({
    mutationFn: async (template: Template) => {
      const { error: rErr } = await supabase
        .from("restaurants")
        .update({
          loyalty_type: template.loyaltyType,
          stamps_required: template.stampsRequired,
          points_per_dollar: template.pointsPerDollar,
        })
        .eq("id", restaurantId);
      if (rErr) throw rErr;

      const { error: wErr } = await supabase.from("rewards").insert([
        {
          restaurant_id: restaurantId,
          name: template.rewardName,
          description: template.rewardDescription,
          stamps_required: template.rewardStamps,
          points_required: template.rewardPoints,
          is_active: true,
        },
      ]);
      if (wErr) throw wErr;
    },
    onSuccess: () => {
      toast({ title: "You're all set!", description: "Your first reward is live. Print your QR poster next." });
      queryClient.invalidateQueries({ queryKey: ["vendor-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-rewards"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({ title: "Couldn't set up rewards", description: sanitizeDbError(error), variant: "destructive" });
    },
  });

  const selected = TEMPLATES.find((t) => t.id === selectedId)!;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Welcome — let's set up your first reward
          </DialogTitle>
          <DialogDescription>
            Pick a template to launch in seconds. You can edit or add more rewards anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3 mt-2">
          {TEMPLATES.map((t) => {
            const Icon = t.icon;
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className="text-left focus:outline-none"
              >
                <Card className={`h-full transition-all ${active ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {active && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg bg-muted/50 p-4 space-y-1 text-sm">
          <p className="font-medium">Preview</p>
          <p className="text-muted-foreground">
            Loyalty: <span className="font-medium text-foreground capitalize">{selected.loyaltyType}</span>
            {selected.loyaltyType === "stamps"
              ? ` · ${selected.stampsRequired} stamps to reward`
              : ` · ${selected.pointsPerDollar} pts per $1`}
          </p>
          <p className="text-muted-foreground">
            First reward: <span className="font-medium text-foreground">{selected.rewardName}</span>
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={applyTemplate.isPending}>
            I'll do this manually
          </Button>
          <Button onClick={() => applyTemplate.mutate(selected)} disabled={applyTemplate.isPending}>
            {applyTemplate.isPending ? "Setting up..." : "Use this template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
