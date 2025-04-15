
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FoodItemCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  isPopular?: boolean;
  onAddToCart: (id: string) => void;
}

export const FoodItemCard = ({
  id,
  name,
  image,
  description,
  price,
  isPopular = false,
  onAddToCart,
}: FoodItemCardProps) => {
  return (
    <Card className="food-card">
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-36 object-cover"
        />
        {isPopular && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            Popular
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-base font-semibold">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        <p className="text-sm font-medium mt-2">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(id)} 
          size="sm" 
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
