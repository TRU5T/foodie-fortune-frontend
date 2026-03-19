import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, Check, Sparkles, Store } from "lucide-react";

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
  const progress = Math.round((currentStamps / totalStamps) * 100);

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
      isComplete ? "ring-2 ring-primary/30 shadow-primary/10" : ""
    }`}>
      {/* Colored header bar */}
      <div className={`h-2 w-full ${isComplete ? "bg-primary" : "bg-gradient-to-r from-primary/40 to-primary/20"}`} />
      
      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{restaurantName}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isComplete ? "Reward earned!" : `${currentStamps} of ${totalStamps} stamps`}
              </p>
            </div>
          </div>
          {isComplete && (
            <Badge className="bg-primary text-primary-foreground gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              Ready!
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {/* Reward info */}
        <div className="bg-muted/50 rounded-xl px-3 py-2.5 mb-4">
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Collect {totalStamps} stamps to earn</p>
          <p className="text-sm font-semibold mt-0.5">{rewardName}</p>
        </div>

        {/* Stamp grid */}
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalStamps }).map((_, index) => (
            <div
              key={index}
              className={`aspect-square rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                index < currentStamps
                  ? "bg-primary/15 border-primary text-primary shadow-sm"
                  : "bg-muted/30 border-border"
              }`}
            >
              {index < currentStamps ? (
                <Check className="h-4 w-4" />
              ) : (
                <Coffee className="h-3.5 w-3.5 text-muted-foreground/30" />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">{progress}%</span>
        </div>

        {expiryDate && (
          <p className="text-xs text-muted-foreground mt-3">
            Expires: {expiryDate}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button
          variant={isComplete ? "default" : "outline"}
          className="w-full rounded-xl"
          disabled={!isComplete}
          asChild
        >
          <a href={`/restaurant/${restaurantId}`}>
            {isComplete ? "Redeem Reward →" : `${totalStamps - currentStamps} more stamps needed`}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
