import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Coffee, ChevronUp, Award, Sparkles, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const CARD_COLORS = [
  { gradient: "from-orange-500 via-amber-500 to-yellow-500", stamp: "bg-orange-300/40", ring: "ring-orange-200" },
  { gradient: "from-blue-600 via-indigo-600 to-violet-600", stamp: "bg-blue-300/40", ring: "ring-blue-200" },
  { gradient: "from-emerald-500 via-teal-500 to-cyan-500", stamp: "bg-emerald-300/40", ring: "ring-emerald-200" },
  { gradient: "from-purple-500 via-fuchsia-500 to-pink-500", stamp: "bg-purple-300/40", ring: "ring-purple-200" },
  { gradient: "from-rose-500 via-red-500 to-orange-500", stamp: "bg-rose-300/40", ring: "ring-rose-200" },
  { gradient: "from-cyan-500 via-sky-500 to-blue-500", stamp: "bg-cyan-300/40", ring: "ring-cyan-200" },
];

const COLLAPSED_GAP = 62;
const EXPANDED_GAP = 20;

interface WalletCardData {
  id: string;
  restaurantName: string;
  restaurantId: string;
  totalStamps: number;
  currentStamps: number;
  rewardName: string;
  isComplete: boolean;
}

const StampDot = ({ filled, index, total }: { filled: boolean; index: number; total: number }) => {
  const isLastNeeded = !filled && index === total;
  return (
    <motion.div
      initial={false}
      animate={filled ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className={`aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${
        filled
          ? "bg-white/35 border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          : isLastNeeded
          ? "border-2 border-dashed border-white/40 bg-white/5"
          : "border-2 border-white/15 bg-white/5"
      }`}
    >
      {filled ? (
        <Check className="h-3.5 w-3.5 text-white drop-shadow-sm" />
      ) : (
        <Coffee className={`h-3 w-3 ${isLastNeeded ? "text-white/40" : "text-white/20"}`} />
      )}
    </motion.div>
  );
};

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
  const colors = CARD_COLORS[index % CARD_COLORS.length];
  const isThisExpanded = expandedIndex === index;
  const progress = Math.round((card.currentStamps / card.totalStamps) * 100);

  const getY = () => {
    if (expandedIndex === null) return index * COLLAPSED_GAP;
    if (index <= expandedIndex) return index * COLLAPSED_GAP;
    return expandedIndex * COLLAPSED_GAP + 300 + (index - expandedIndex - 1) * COLLAPSED_GAP + EXPANDED_GAP;
  };

  return (
    <motion.div
      layout
      className="absolute left-0 right-0 px-4"
      style={{ zIndex: isThisExpanded ? 50 : totalCards - index }}
      animate={{
        y: getY(),
        scale: isThisExpanded ? 1 : expandedIndex !== null && index < expandedIndex ? 0.97 : 1,
      }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      onClick={onTap}
    >
      <div
        className={`rounded-3xl bg-gradient-to-br ${colors.gradient} p-5 shadow-2xl cursor-pointer select-none overflow-hidden relative`}
        style={{ minHeight: isThisExpanded ? 280 : 78 }}
      >
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }} />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-[15px] leading-tight tracking-tight">
                {card.restaurantName}
              </h3>
              {!isThisExpanded && (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex-1 h-1.5 bg-white/15 rounded-full w-20 overflow-hidden">
                    <div
                      className="h-full bg-white/70 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-white/70 text-[11px] font-medium">
                    {card.currentStamps}/{card.totalStamps}
                  </span>
                </div>
              )}
            </div>
          </div>
          {card.isComplete && (
            <Badge className="bg-white/25 text-white border-0 backdrop-blur-md text-[11px] font-semibold gap-1 px-2.5 py-1 shadow-sm">
              <Sparkles className="h-3 w-3" />
              Ready!
            </Badge>
          )}
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isThisExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-5 relative z-10"
            >
              {/* Reward label */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2.5 mb-4">
                <p className="text-white/60 text-[11px] font-medium uppercase tracking-wider">Reward</p>
                <p className="text-white font-semibold text-sm">{card.rewardName}</p>
              </div>

              {/* Stamp grid */}
              <div className="grid grid-cols-5 gap-2.5 mb-4">
                {Array.from({ length: card.totalStamps }).map((_, i) => (
                  <StampDot
                    key={i}
                    filled={i < card.currentStamps}
                    index={i}
                    total={card.currentStamps}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-2">
                <div>
                  <span className="text-white/80 text-sm font-medium">
                    {card.isComplete
                      ? "🎉 All stamps collected!"
                      : `${card.totalStamps - card.currentStamps} more to go`}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="bg-white/25 text-white hover:bg-white/35 border-0 text-xs h-9 px-4 rounded-xl backdrop-blur-md font-semibold shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/restaurant/${card.restaurantId}`);
                  }}
                >
                  {card.isComplete ? "Redeem →" : "Visit →"}
                </Button>
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
      ? (cards.length - 1) * COLLAPSED_GAP + 300 + EXPANDED_GAP
      : cards.length * COLLAPSED_GAP + 60;

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
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-5">
          <Award className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Stamp Cards Yet</h2>
        <p className="text-muted-foreground mb-8 max-w-xs">
          Visit a restaurant and start collecting stamps to earn rewards!
        </p>
        <Button onClick={() => navigate("/restaurants")} size="lg" className="rounded-xl px-8">
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
          {cards.length} stamp card{cards.length !== 1 ? "s" : ""}
          {completedCount > 0 && (
            <span className="text-primary font-medium"> · {completedCount} ready to redeem</span>
          )}
        </p>
      </div>

      {/* Wallet stack */}
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={() => setExpandedIndex(null)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-muted/50 rounded-full px-4 py-2"
            >
              <ChevronUp className="h-3 w-3" />
              Tap to collapse
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
