import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

interface StampCardProps {
  restaurantName: string;
  restaurantId: string;
  totalStamps: number;
  currentStamps: number;
  rewardName: string;
  expiryDate?: string;
}

export const StampCard = ({
  restaurantName,
  restaurantId,
  totalStamps,
  currentStamps,
  rewardName,
  expiryDate,
}: StampCardProps) => {
  const isComplete = currentStamps >= totalStamps;
  const progress = Math.min((currentStamps / totalStamps) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <a
        href={`/restaurant/${restaurantId}`}
        className="block group"
      >
        <div
          className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
            isComplete
              ? "bg-foreground text-background border-foreground shadow-xl shadow-foreground/10"
              : "bg-card text-card-foreground border-border hover:border-foreground/20 hover:shadow-lg"
          }`}
        >
          {/* Top section */}
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-medium uppercase tracking-[0.1em] mb-1 ${
                  isComplete ? "text-background/50" : "text-muted-foreground"
                }`}>
                  Loyalty Card
                </p>
                <h3 className="font-semibold text-lg leading-tight tracking-tight truncate">
                  {restaurantName}
                </h3>
              </div>
              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-3"
                >
                  <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative mx-5">
            <div className={`border-t border-dashed ${
              isComplete ? "border-background/15" : "border-border"
            }`} />
          </div>

          {/* Stamps section */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-[6px]">
              {Array.from({ length: totalStamps }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={index < currentStamps ? { scale: [0.8, 1.1, 1] } : {}}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="flex-1"
                >
                  <div
                    className={`aspect-square rounded-full transition-all duration-300 ${
                      index < currentStamps
                        ? isComplete
                          ? "bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                          : "bg-foreground"
                        : isComplete
                          ? "bg-background/10 border border-background/20"
                          : "bg-muted border border-border"
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Progress text */}
            <div className="flex items-center justify-between mt-3">
              <span className={`text-xs font-medium ${
                isComplete ? "text-background/60" : "text-muted-foreground"
              }`}>
                {isComplete
                  ? "All stamps collected"
                  : `${currentStamps} of ${totalStamps}`}
              </span>
              <span className={`text-xs tabular-nums font-semibold ${
                isComplete ? "text-primary" : "text-foreground"
              }`}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Reward section */}
          <div className={`px-5 pb-5 ${isComplete ? "" : ""}`}>
            <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${
              isComplete
                ? "bg-primary/15"
                : "bg-muted/60"
            }`}>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-medium uppercase tracking-[0.1em] ${
                  isComplete ? "text-primary" : "text-muted-foreground"
                }`}>
                  {isComplete ? "Ready to redeem" : "Reward"}
                </p>
                <p className={`text-sm font-semibold truncate mt-0.5 ${
                  isComplete ? "text-background" : "text-foreground"
                }`}>
                  {rewardName}
                </p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                isComplete
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/5 text-muted-foreground group-hover:bg-foreground/10"
              }`}>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {expiryDate && (
              <p className={`text-[11px] mt-2.5 ${
                isComplete ? "text-background/40" : "text-muted-foreground/60"
              }`}>
                Expires {expiryDate}
              </p>
            )}
          </div>
        </div>
      </a>
    </motion.div>
  );
};
