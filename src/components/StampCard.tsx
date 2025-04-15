
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, Check } from "lucide-react";

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

  return (
    <Card className={`border ${isComplete ? 'border-primary' : 'border-border'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{restaurantName}</CardTitle>
          {isComplete && (
            <Badge className="bg-primary">Ready to Redeem!</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-3">
          Collect {totalStamps} stamps to earn: {rewardName}
        </p>
        
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalStamps }).map((_, index) => (
            <div 
              key={index} 
              className={`aspect-square rounded-full border flex items-center justify-center
                ${index < currentStamps 
                  ? 'bg-primary/10 border-primary text-primary' 
                  : 'bg-muted border-muted-foreground/20'}`}
            >
              {index < currentStamps ? (
                <Check className="h-4 w-4" />
              ) : (
                <Coffee className="h-4 w-4 opacity-30" />
              )}
            </div>
          ))}
        </div>
        
        {expiryDate && (
          <p className="text-xs text-muted-foreground mt-3">
            Expires: {expiryDate}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant={isComplete ? "default" : "outline"} 
          className="w-full"
          disabled={!isComplete}
          asChild
        >
          <a href={`/restaurant/${restaurantId}`}>
            {isComplete ? "Redeem Reward" : `${totalStamps - currentStamps} more stamps needed`}
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
