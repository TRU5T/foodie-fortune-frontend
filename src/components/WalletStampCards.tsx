import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check, Coffee, ChevronUp, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const CARD_COLORS = [
  "from-orange-500 to-amber-600",
  "from-blue-600 to-indigo-700",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-violet-700",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
];

const COLLAPSED_GAP = 56;
const EXPANDED_GAP = 16;

interface WalletCardData {
  id: string;
  restaurantName: string;
  restaurantId: string;
  totalStamps: number;
  currentStamps: number;
  rewardName: string;
  isComplete: boolean;
}

const WalletCard = ({
  card,
  index,
  isExpanded,
  expandedIndex,
  totalCards,
  onTap,
}: {
  card: WalletCardData;
  index: number;
  isExpanded: boolean;
  expandedIndex: number | null;
  totalCards: number;
  onTap: () => void;
}) => {
  const navigate = useNavigate();
  const colorClass = CARD_COLORS[index % CARD_COLORS.length];
  const isThisExpanded = expandedIndex === index;

  const getY = () => {
    if (expandedIndex === null) {
      return index * COLLAPSED_GAP;
    }
    if (index <= expandedIndex) {
      return index * COLLAPSED_GAP;
    }
    return expandedIndex * COLLAPSED_GAP + 280 + (index - expandedIndex - 1) * COLLAPSED_GAP + EXPANDED_GAP;
  };

  return (
    <motion.div
      layout
      className="absolute left-0 right-0 px-4"
      style={{
        zIndex: isThisExpanded ? 50 : totalCards - index,
      }}
      animate={{
        y: getY(),
        scale: isThisExpanded ? 1 : expandedIndex !== null && index < expandedIndex ? 0.97 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={onTap}
    >
      <div
        className={`rounded-2xl bg-gradient-to-br ${colorClass} p-5 shadow-xl cursor-pointer select-none`}
        style={{ minHeight: isThisExpanded ? 260 : 72 }}
      >
        {/* Header - always visible */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base leading-tight">
                {card.restaurantName}
              </h3>
              {!isThisExpanded && (
                <p className="text-white/70 text-xs">
                  {card.isComplete
                    ? "Ready to redeem!"
                    : `${card.currentStamps}/${card.totalStamps} stamps`}
                </p>
              )}
            </div>
          </div>
          {card.isComplete && (
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
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
              transition={{ duration: 0.2 }}
              className="mt-5"
            >
              <p className="text-white/80 text-sm mb-4">
                Collect {card.totalStamps} stamps to earn: {card.rewardName}
              </p>

              {/* Stamp grid */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Array.from({ length: card.totalStamps }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all ${
                      i < card.currentStamps
                        ? "bg-white/30 border-white text-white"
                        : "bg-white/5 border-white/20"
                    }`}
                  >
                    {i < card.currentStamps ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Coffee className="h-3 w-3 text-white/30" />
                    )}
                  </div>
                ))}
              </div>

              {/* Progress text */}
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">
                  {card.isComplete
                    ? "All stamps collected!"
                    : `${card.totalStamps - card.currentStamps} more stamps needed`}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 text-white hover:bg-white/30 border-0 text-xs h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/restaurant/${card.restaurantId}`);
                  }}
                >
                  {card.isComplete ? "Redeem" : "Visit"}
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
      ? (cards.length - 1) * COLLAPSED_GAP + 280 + EXPANDED_GAP
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
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Award className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Stamp Cards Yet</h2>
        <p className="text-muted-foreground mb-6">
          Visit a restaurant and start collecting stamps to earn rewards!
        </p>
        <Button onClick={() => navigate("/restaurants")}>
          Find Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {cards.length} stamp card{cards.length !== 1 ? "s" : ""}
          {cards.filter((c) => c.isComplete).length > 0 &&
            ` · ${cards.filter((c) => c.isComplete).length} ready to redeem`}
        </p>
      </div>

      {/* Wallet stack */}
      <div className="relative" style={{ height: totalHeight }}>
        {cards.map((card, index) => (
          <WalletCard
            key={card.id}
            card={card}
            index={index}
            isExpanded={expandedIndex !== null}
            expandedIndex={expandedIndex}
            totalCards={cards.length}
            onTap={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
          />
        ))}
      </div>

      {/* Collapse hint */}
      {expandedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-4"
        >
          <button
            onClick={() => setExpandedIndex(null)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronUp className="h-3 w-3" />
            Tap card to collapse
          </button>
        </motion.div>
      )}
    </div>
  );
};
