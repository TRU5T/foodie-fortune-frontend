
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FoodItemCard } from "@/components/FoodItemCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Info, Award } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Mock data for menu categories and items
const MOCK_RESTAURANT_DATA = {
  "1": {
    id: "1",
    name: "Burger King",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop",
    cuisine: "American, Burgers",
    rating: 4.5,
    deliveryTime: "15-25 min",
    pointsPerDollar: 2,
    description: "Home of the Whopper and more. Flame-grilled burgers, crispy fries, and refreshing beverages.",
    address: "123 Main St, Anytown, USA",
    menuCategories: [
      {
        id: "burgers",
        name: "Burgers"
      },
      {
        id: "sides",
        name: "Sides"
      },
      {
        id: "drinks",
        name: "Drinks"
      }
    ],
    menuItems: [
      {
        id: "item1",
        name: "Classic Whopper",
        description: "Flame-grilled beef topped with juicy tomatoes, fresh lettuce, creamy mayonnaise, ketchup, crunchy pickles, and sliced white onions on a soft sesame seed bun.",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2304&auto=format&fit=crop",
        category: "burgers",
        isPopular: true
      },
      {
        id: "item2",
        name: "Cheeseburger",
        description: "Flame-grilled beef patty topped with a simple layer of melted American cheese, crinkle cut pickles, yellow mustard, and ketchup on a toasted sesame seed bun.",
        price: 5.99,
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2308&auto=format&fit=crop",
        category: "burgers"
      },
      {
        id: "item3",
        name: "Bacon King",
        description: "Two savory flame-grilled beef patties topped with thick-cut smoked bacon, melted American cheese, ketchup and creamy mayonnaise on a soft sesame seed bun.",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1599115939018-a1427cc2bb16?q=80&w=2340&auto=format&fit=crop",
        category: "burgers",
        isPopular: true
      },
      {
        id: "item4",
        name: "Chicken Fries",
        description: "Made with white meat chicken, our Chicken Fries are coated in a light crispy breading seasoned with savory spices and herbs.",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1619881590738-a127cd4d4044?q=80&w=2433&auto=format&fit=crop",
        category: "sides"
      },
      {
        id: "item5",
        name: "French Fries",
        description: "Golden, crispy, and piping hot French fries perfect for dipping.",
        price: 3.49,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=2374&auto=format&fit=crop",
        category: "sides",
        isPopular: true
      },
      {
        id: "item6",
        name: "Soft Drink",
        description: "Your choice of refreshing soft drink.",
        price: 2.49,
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=2340&auto=format&fit=crop",
        category: "drinks"
      }
    ]
  },
  // Add more restaurants as needed with their menus
};

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("");
  
  // Fetch restaurant data (mock implementation)
  const restaurant = MOCK_RESTAURANT_DATA[id as keyof typeof MOCK_RESTAURANT_DATA];
  
  useEffect(() => {
    if (restaurant?.menuCategories.length > 0) {
      setActiveCategory(restaurant.menuCategories[0].id);
    }
  }, [restaurant]);
  
  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Restaurant Not Found</h2>
            <p className="text-muted-foreground mb-6">The restaurant you're looking for doesn't exist.</p>
            <Button asChild>
              <a href="/restaurants">Back to Restaurants</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = (itemId: string) => {
    const item = restaurant.menuItems.find(item => item.id === itemId);
    if (item) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    }
  };
  
  const filteredItems = activeCategory 
    ? restaurant.menuItems.filter(item => item.category === activeCategory)
    : restaurant.menuItems;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Restaurant Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
          <div 
            className="relative h-[300px] bg-cover bg-center"
            style={{ backgroundImage: `url(${restaurant.image})` }}
          />
          <div className="container absolute bottom-0 z-20 text-white pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
              <div>
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <p className="text-sm opacity-90 mb-2">{restaurant.cuisine}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{restaurant.rating}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/50" />
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{restaurant.deliveryTime}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/50" />
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">1.2 miles away</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-primary text-white px-3 py-1.5 text-base">
                {restaurant.pointsPerDollar}x Points
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Restaurant Info */}
        <div className="border-b">
          <div className="container py-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{restaurant.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Earn {restaurant.pointsPerDollar}x points on all orders
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Menu */}
        <div className="container py-8">
          <h2 className="text-2xl font-bold mb-6">Menu</h2>
          
          <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="mb-6 w-full justify-start overflow-x-auto">
              {restaurant.menuCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {restaurant.menuCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurant.menuItems
                    .filter(item => item.category === category.id)
                    .map((item) => (
                      <FoodItemCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        description={item.description}
                        price={item.price}
                        isPopular={item.isPopular}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantDetails;
