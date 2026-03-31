import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronUp, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const CARD_THEMES = [
  { bg: "bg-[#1C1C1E]", accent: "bg-primary" },
  { bg: "bg-[#1A1A2E]", accent: "bg-[hsl(224,75%,50%)]" },
  { bg: "bg-[#1E1E1E]", accent: "bg-[hsl(142,70%,45%)]" },
  { bg: "bg-[#2D1B2E]", accent: "bg-[hsl(280,60%,55%)]" },
  { bg: "bg-[#1B2838]", accent: "bg-[hsl(200,70%,50%)]" },
  { bg: "bg-[#2E1B1B]", accent: "bg-[hsl(0,65%,55%)]" },
];

const COLLAPSED_HEIGHT = 72;
const COLLAPSED_GAP = 68;

interface WalletCardData {
  id: string;
  restaurantName: string;
  restaurantId: string;
  totalStamps: number;
  currentStamps: number;
  rewardName: string;
  isComplete: boolean;
}

const StampIndicator = ({ filled, isComplete, accentClass }: { filled: boolean; isComplete: boolean; accentClass: string }) => (
  <div
    className={`aspect-square rounded-full transition-all duration-300 ${
      filled
        ? `${accentClass} shadow-[0_0_8px_rgba(255,255,255,0.15)]`
        : "bg-white/8 border border-white/10"
    }`}
  />
);

const WalletCard = ({
  card,
  index,
  expandedIndex,
  totalCards,
  onTap,
}: {
  card: WalletCardData;
  index: number;
  expandedIndex: number | null;
  totalCards: number;
  onTap: () => void;
}) => {
  const navigate = useNavigate();
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const isExpanded = expandedIndex === index;
  const progress = Math.min(Math.round((card.currentStamps / card.totalStamps) * 100), 100);

  const getY = () => {
    if (expandedIndex === null) return index * COLLAPSED_GAP;
    if (index <= expandedIndex) return index * COLLAPSED_GAP;
    return expandedIndex * COLLAPSED_GAP + 320 + (index - expandedIndex - 1) * COLLAPSED_GAP + 16;
  };

  return (
    <motion.div
      layout
      className="absolute left-0 right-0 px-5"
      style={{ zIndex: isExpanded ? 50 : totalCards - index }}
      animate={{
        y: getY(),
        scale: isExpanded ? 1 : expandedIndex !== null && index < expandedIndex ? 0.97 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={onTap}
    >
      <div
        className={`${theme.bg} rounded-[22px] shadow-2xl cursor-pointer select-none overflow-hidden`}
        style={{ minHeight: isExpanded ? 310 : COLLAPSED_HEIGHT }}
      >
        {/* Header — always visible */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`h-10 w-10 rounded-xl ${theme.accent} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-bold text-sm">
                {card.restaurantName.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-[15px] leading-tight tracking-tight truncate">
                {card.restaurantName}
              </h3>
              {!isExpanded && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-[3px] bg-white/10 rounded-full max-w-[100px] overflow-hidden">
                    <div
                      className={`h-full ${theme.accent} rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-white/40 text-[11px] font-medium tabular-nums">
                    {card.currentStamps}/{card.totalStamps}
                  </span>
                </div>
              )}
            </div>
          </div>
          {card.isComplete && (
            <div className={`h-7 w-7 rounded-full ${theme.accent} flex items-center justify-center flex-shrink-0`}>
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Divider */}
              <div className="mx-5 border-t border-dashed border-white/8" />

              <div className="px-5 pt-4 pb-5">
                {/* Stamp grid */}
                <div className="grid grid-cols-5 gap-2 mb-5">
                  {Array.from({ length: card.totalStamps }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={i < card.currentStamps ? { scale: [0.8, 1.05, 1] } : {}}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                    >
                      <StampIndicator
                        filled={i < card.currentStamps}
                        isComplete={card.isComplete}
                        accentClass={theme.accent}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Progress label */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-white/40 text-xs font-medium">
                    {card.isComplete
                      ? "All stamps collected"
                      : `${card.totalStamps - card.currentStamps} more to go`}
                  </span>
                  <span className="text-white/60 text-xs font-semibold tabular-nums">
                    {progress}%
                  </span>
                </div>

                {/* Reward bar */}
                <div
                  className="rounded-xl bg-white/5 px-4 py-3 flex items-center justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/restaurant/${card.restaurantId}`);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-medium uppercase tracking-[0.1em] ${
                      card.isComplete ? "text-primary" : "text-white/30"
                    }`}>
                      {card.isComplete ? "Ready to redeem" : "Reward"}
                    </p>
                    <p className="text-white font-semibold text-sm truncate mt-0.5">
                      {card.rewardName}
                    </p>
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    card.isComplete ? theme.accent : "bg-white/8"
                  }`}>
                    <ArrowRight className={`h-3.5 w-3.5 ${
                      card.isComplete ? "text-white" : "text-white/40"
                    }`} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const WalletStampCards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const { data: stampCards = [], isLoading } = useQuery({
    queryKey: ["wallet-stamp-cards", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("stamp_cards")
        .select("*, restaurant:restaurants(name)")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const restaurantIds = [...new Set(stampCards.map((sc: any) => sc.restaurant_id))];

  const { data: rewards = [] } = useQuery({
    queryKey: ["wallet-rewards", restaurantIds],
    queryFn: async () => {
      if (restaurantIds.length === 0) return [];
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .in("restaurant_id", restaurantIds)
        .eq("is_active", true)
        .gt("stamps_required", 0);
      if (error) throw error;
      return data;
    },
    enabled: restaurantIds.length > 0,
  });

  const getRewardName = (restaurantId: string) => {
    const reward = rewards.find((r: any) => r.restaurant_id === restaurantId);
    return reward?.name || "Reward";
  };

  const cards: WalletCardData[] = stampCards.map((sc: any) => ({
    id: sc.id,
    restaurantName: sc.restaurant?.name || "Restaurant",
    restaurantId: sc.restaurant_id,
    totalStamps: sc.total_stamps_required,
    currentStamps: sc.current_stamps,
    rewardName: getRewardName(sc.restaurant_id),
    isComplete: sc.is_complete,
  }));

  const totalHeight =
    expandedIndex !== null
      ? (cards.length - 1) * COLLAPSED_GAP + 320 + 16
      : cards.length * COLLAPSED_GAP + 40;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="h-20 w-20 rounded-3xl bg-muted flex items-center justify-center mb-5">
          <Award className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Stamp Cards Yet</h2>
        <p className="text-muted-foreground text-sm mb-8 max-w-xs">
          Visit a restaurant and start collecting stamps to earn rewards.
        </p>
        <Button onClick={() => navigate("/restaurants")} className="rounded-xl px-8">
          Find Restaurants
        </Button>
      </div>
    );
  }

  const completedCount = cards.filter((c) => c.isComplete).length;

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-5">
        <h1 className="text-2xl font-bold tracking-tight">My Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cards.length} card{cards.length !== 1 ? "s" : ""}
          {completedCount > 0 && (
            <span className="text-primary font-medium"> · {completedCount} ready</span>
          )}
        </p>
      </div>

      {/* Stack */}
      <div className="relative" style={{ height: totalHeight }}>
        {cards.map((card, index) => (
          <WalletCard
            key={card.id}
            card={card}
            index={index}
            expandedIndex={expandedIndex}
            totalCards={cards.length}
            onTap={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* Collapse hint */}
      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center mt-4"
          >
            <button
              onClick={() => setExpandedIndex(null)}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors rounded-full px-4 py-2"
            >
              <ChevronUp className="h-3 w-3" />
              Collapse
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
