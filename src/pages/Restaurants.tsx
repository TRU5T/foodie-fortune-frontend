import { useState, useMemo } from "react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Loader2 } from "lucide-react";
import { useRestaurants } from "@/hooks/useRestaurants";

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  const [addressQuery, setAddressQuery] = useState("");
  
  const { data: restaurants, isLoading } = useRestaurants();
  
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
                <div className="relative md:col-span-3">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Delivery address"
                    className="pl-10"
                  />
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
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="time">Fastest Delivery</SelectItem>
                <SelectItem value="points">Most Points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
        
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No restaurants found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setCuisineFilter("all");
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
