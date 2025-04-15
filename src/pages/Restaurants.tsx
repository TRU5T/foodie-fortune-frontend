
import { useState } from "react";
import { RestaurantCard } from "@/components/RestaurantCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Search, MapPin } from "lucide-react";

const Restaurants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("all");
  
  // Mock data
  const restaurants = [
    {
      id: "1",
      name: "Burger King",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop",
      cuisine: "American, Burgers",
      rating: 4.5,
      deliveryTime: "15-25 min",
      pointsPerDollar: 2,
      stampsAvailable: true,
    },
    {
      id: "2",
      name: "Pizza Palace",
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=2340&auto=format&fit=crop",
      cuisine: "Italian, Pizza",
      rating: 4.7,
      deliveryTime: "20-30 min",
      pointsPerDollar: 3,
      stampsAvailable: true,
    },
    {
      id: "3",
      name: "Sushi Spot",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2340&auto=format&fit=crop",
      cuisine: "Japanese, Sushi",
      rating: 4.8,
      deliveryTime: "25-35 min",
      pointsPerDollar: 4,
    },
    {
      id: "4",
      name: "Taco Time",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=2340&auto=format&fit=crop",
      cuisine: "Mexican, Tacos",
      rating: 4.3,
      deliveryTime: "15-25 min",
      pointsPerDollar: 2,
      stampsAvailable: true,
    },
    {
      id: "5",
      name: "Noodle House",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=2080&auto=format&fit=crop",
      cuisine: "Asian, Noodles",
      rating: 4.6,
      deliveryTime: "20-30 min",
      pointsPerDollar: 3,
    },
    {
      id: "6",
      name: "Salad Bar",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2340&auto=format&fit=crop",
      cuisine: "Healthy, Salads",
      rating: 4.4,
      deliveryTime: "15-25 min",
      pointsPerDollar: 2,
    },
  ];
  
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = cuisineFilter === "all" || restaurant.cuisine.toLowerCase().includes(cuisineFilter.toLowerCase());
    return matchesSearch && matchesCuisine;
  });
  
  const cuisines = ["American", "Italian", "Japanese", "Mexican", "Asian", "Healthy"];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary text-white py-12">
          <div className="container">
            <h1 className="text-3xl font-bold mb-6">Find Restaurants</h1>
            <Card className="w-full bg-white shadow-lg">
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
      </main>
      <Footer />
    </div>
  );
};

export default Restaurants;
