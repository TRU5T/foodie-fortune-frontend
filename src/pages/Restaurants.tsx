import { useState, useMemo, useRef } from "react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useRestaurants } from "@/hooks/useRestaurants";
import { usePlacesAutocomplete } from "@/hooks/usePlacesAutocomplete";

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [addressQuery, setAddressQuery] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressWrapperRef = useRef<HTMLDivElement>(null);
  
  const { data: restaurants, isLoading } = useRestaurants();
  const { predictions, isLoading: placesLoading } = usePlacesAutocomplete(addressInput);
  
  const filteredRestaurants = useMemo(() => {
    if (!restaurants) return [];
    return restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCuisine = cuisineFilter === "all" || (restaurant.cuisine?.toLowerCase().includes(cuisineFilter.toLowerCase()) ?? false);
      const matchesAddress = !addressQuery || 
        (restaurant.city?.toLowerCase().includes(addressQuery.toLowerCase()) ?? false) ||
        (restaurant.address?.toLowerCase().includes(addressQuery.toLowerCase()) ?? false);
      return matchesSearch && matchesCuisine && matchesAddress;
    });
  }, [restaurants, searchQuery, cuisineFilter, addressQuery]);
  
  const cuisines = useMemo(() => {
    if (!restaurants) return [];
    const allCuisines = restaurants
      .flatMap(r => r.cuisine?.split(",").map(c => c.trim()) ?? [])
      .filter(Boolean);
    return [...new Set(allCuisines)];
  }, [restaurants]);

  const handleSelectAddress = (description: string) => {
    setAddressInput(description);
    setAddressQuery(description);
    setShowSuggestions(false);
  };

  return (
    <>
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Find Restaurants</h1>
          <Card className="w-full bg-background shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                <div className="relative md:col-span-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative md:col-span-3" ref={addressWrapperRef}>
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    placeholder="Search by address..."
                    value={addressInput}
                    onChange={(e) => {
                      setAddressInput(e.target.value);
                      setShowSuggestions(true);
                      if (!e.target.value) setAddressQuery("");
                    }}
                    onFocus={() => predictions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10"
                  />
                  {showSuggestions && predictions.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {predictions.map((prediction) => (
                        <button
                          key={prediction.place_id}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                          onMouseDown={() => handleSelectAddress(prediction.description)}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span>{prediction.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {placesLoading && showSuggestions && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg p-3 flex justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cuisines</SelectItem>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1">
                  <Button className="w-full">Search</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Restaurants ({filteredRestaurants.length})</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="recommended">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="points">Most Points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                image={restaurant.cover_image_url || "/placeholder.svg"}
                cuisine={restaurant.cuisine || ""}
                rating={0}
                deliveryTime=""
                pointsPerDollar={restaurant.points_per_dollar}
                stampsAvailable={restaurant.loyalty_type === "stamps"}
                offersOnlineOrdering={restaurant.offers_online_ordering}
              />
              />
            ))}
          </div>
        )}
        
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No restaurants found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setCuisineFilter("all");
                setAddressQuery("");
                setAddressInput("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Restaurants;
