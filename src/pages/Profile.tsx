
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PointsSummary } from "@/components/PointsSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, MapPin, Receipt, CreditCard, User, Lock, LogOut } from "lucide-react";

const Profile = () => {
  // Mock data
  const recentOrders = [
    {
      id: "ORD12345",
      date: "April 10, 2025",
      restaurant: "Burger King",
      items: "Whopper, Fries, Drink",
      total: 15.99,
      status: "Delivered",
    },
    {
      id: "ORD12344",
      date: "April 5, 2025",
      restaurant: "Pizza Palace",
      items: "Large Pepperoni Pizza, Garlic Knots",
      total: 22.99,
      status: "Delivered",
    },
    {
      id: "ORD12343",
      date: "March 30, 2025",
      restaurant: "Sushi Spot",
      items: "California Roll, Miso Soup",
      total: 18.50,
      status: "Delivered",
    },
  ];
  
  const paymentMethods = [
    {
      id: "card1",
      type: "Visa",
      last4: "4242",
      expiry: "05/28",
      isDefault: true,
    },
    {
      id: "card2",
      type: "Mastercard",
      last4: "5555",
      expiry: "09/26",
      isDefault: false,
    },
  ];
  
  const addresses = [
    {
      id: "addr1",
      name: "Home",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      isDefault: true,
    },
    {
      id: "addr2",
      name: "Work",
      street: "456 Office Blvd",
      city: "Workville",
      state: "CA",
      zip: "67890",
      isDefault: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">John Doe</h2>
                  <p className="text-muted-foreground">john.doe@example.com</p>
                  
                  <Separator className="my-4" />
                  
                  <PointsSummary 
                    points={350} 
                    level="Silver" 
                    nextLevelPoints={500} 
                    lifetimePoints={1250}
                  />
                  
                  <Separator className="my-6" />
                  
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start mt-2">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start mt-2 text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList className="mb-6">
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="account">Account Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Receipt className="mr-2 h-5 w-5" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <Card key={order.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between mb-2">
                                <div>
                                  <h3 className="font-medium">{order.restaurant}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{order.date}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm text-muted-foreground">Order #{order.id}</span>
                                  <p className="font-medium">${order.total.toFixed(2)}</p>
                                </div>
                              </div>
                              <p className="text-sm mb-2">{order.items}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm px-2 py-1 bg-accent/10 text-accent rounded">
                                  {order.status}
                                </span>
                                <Button variant="ghost" size="sm">View Details</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {method.type} •••• {method.last4}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Expires {method.expiry}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && (
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-4">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Delivery Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.street}, {address.city}, {address.state} {address.zip}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {address.isDefault && (
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="mt-4">
                      <MapPin className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="(123) 456-7890" />
                      </div>
                      <Button>Save Changes</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
