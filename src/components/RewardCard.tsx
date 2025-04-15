
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RewardCardProps {
  title: string;
  pointsRequired: number;
  currentPoints: number;
  image: string;
  expiryDate?: string;
  isUnlocked?: boolean;
}

export const RewardCard = ({
  title,
  pointsRequired,
  currentPoints,
  image,
  expiryDate,
  isUnlocked = false,
}: RewardCardProps) => {
  const progress = Math.min((currentPoints / pointsRequired) * 100, 100);
  
  return (
    <Card className="food-card">
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        {isUnlocked && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            Unlocked
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>{currentPoints} points</span>
            <span>{pointsRequired} points</span>
          </div>
          <div className="reward-progress">
            <div 
              className="reward-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {expiryDate && (
          <p className="text-xs text-muted-foreground mt-2">
            Expires: {expiryDate}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          disabled={!isUnlocked}
          variant={isUnlocked ? "default" : "outline"}
        >
          {isUnlocked ? "Redeem Reward" : `${pointsRequired - currentPoints} more points needed`}
        </Button>
      </CardFooter>
    </Card>
  );
};
