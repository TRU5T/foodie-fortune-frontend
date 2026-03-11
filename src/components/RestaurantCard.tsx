
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, Star, Award, ShoppingBag } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  pointsPerDollar: number;
  stampsAvailable?: boolean;
  offersOnlineOrdering?: boolean;
}

export const RestaurantCard = ({
  id,
  name,
  image,
  cuisine,
  rating,
  deliveryTime,
  pointsPerDollar,
  stampsAvailable = false,
  offersOnlineOrdering = false,
}: RestaurantCardProps) => {
  return (
    <Card className="food-card">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge className="bg-primary text-primary-foreground">
            {pointsPerDollar}x Points
          </Badge>
          {stampsAvailable && (
            <Badge className="bg-accent text-accent-foreground flex gap-1 items-center">
              <Award className="h-3 w-3" />
              Stamps
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{cuisine}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm ml-1">{rating}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm ml-1">{deliveryTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/restaurant/${id}`}>Order Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
