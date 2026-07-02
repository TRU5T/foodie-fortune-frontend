import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Info, Award, ArrowLeft, Loader2, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRestaurant } from "@/hooks/useRestaurants";

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: restaurant, isLoading } = useRestaurant(id || "");

  const { data: menuItems } = useQuery({
    queryKey: ["menu_items", id],
    enabled: !!restaurant?.id && restaurant?.offers_online_ordering,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurant!.id)
        .eq("is_available", true);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Restaurant Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The restaurant you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/restaurants">Back to Restaurants</Link>
          </Button>
        </div>
      </div>
    );
  }

  const cover =
    restaurant.cover_image_url ||
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2340&auto=format&fit=crop";
  const canonical = `https://redeemr.app/restaurant/${restaurant.id}`;
  const loyaltyLabel =
    restaurant.loyalty_type === "stamps"
      ? `Collect stamps — ${restaurant.stamps_required} for a reward`
      : `Earn ${restaurant.points_per_dollar}x points per $`;

  return (
    <>
      <Helmet>
        <title>{`${restaurant.name} — Loyalty & Rewards on Redeemr`}</title>
        <meta
          name="description"
          content={`${restaurant.description ?? restaurant.name} — earn loyalty rewards on Redeemr.`}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${restaurant.name} on Redeemr`} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={cover} />
        <meta property="og:type" content="restaurant" />
      </Helmet>

      <div className="container pt-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/restaurants" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Restaurants
          </Link>
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
        <div
          className="relative h-[300px] bg-cover bg-center"
          style={{ backgroundImage: `url(${cover})` }}
        />
        <div className="container absolute bottom-0 z-20 text-white pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              {restaurant.cuisine && (
                <p className="text-sm opacity-90 mb-2">{restaurant.cuisine}</p>
              )}
              {(restaurant.address || restaurant.city) && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {[restaurant.address, restaurant.city].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
            <Badge className="bg-primary text-primary-foreground px-3 py-1.5 text-base">
              {loyaltyLabel}
            </Badge>
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="container py-4">
          <div className="flex flex-wrap items-center gap-6">
            {restaurant.description && (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{restaurant.description}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{loyaltyLabel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {restaurant.offers_online_ordering && menuItems && menuItems.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-36 object-cover rounded-t-xl"
                    />
                  )}
                  <CardContent className="p-4">
                    <h3 className="text-base font-semibold">{item.name}</h3>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm font-medium">
                        ${Number(item.price).toFixed(2)}
                      </p>
                      <Badge variant="secondary" className="text-[10px]">
                        Ordering coming soon
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <UtensilsCrossed className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <h3 className="font-semibold mb-1">Visit in person to earn rewards</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {restaurant.name} isn't taking online orders yet. Show your Redeemr QR
                code at the till on your next visit to collect loyalty.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link to="/my-qr-code">Show My QR Code</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default RestaurantDetails;
