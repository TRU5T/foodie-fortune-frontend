
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Gift } from "lucide-react";

interface PointsSummaryProps {
  points: number;
  level: string;
  nextLevelPoints: number;
  lifetimePoints: number;
}

export const PointsSummary = ({
  points,
  level,
  nextLevelPoints,
  lifetimePoints,
}: PointsSummaryProps) => {
  const progress = Math.min((points / nextLevelPoints) * 100, 100);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Points Summary</CardTitle>
          <Badge variant="outline" className="font-normal py-1">
            Level: {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold">{points}</span>
          <span className="text-sm text-muted-foreground">available points</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to next level</span>
            <span>{nextLevelPoints - points} more points needed</span>
          </div>
          <div className="reward-progress">
            <div 
              className="reward-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{lifetimePoints}</p>
              <p className="text-xs text-muted-foreground">Lifetime points</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Gift className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">4 Available</p>
              <p className="text-xs text-muted-foreground">Rewards</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
