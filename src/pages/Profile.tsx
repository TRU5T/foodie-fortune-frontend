
import { useState, useEffect } from "react";
import { PointsSummary } from "@/components/PointsSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Receipt, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { sanitizeDbError } from "@/lib/sanitizeError";

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*, restaurant:restaurants(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone: phone || null })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Profile updated", description: "Your changes have been saved." });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => {
      toast({ title: "Error saving profile", description: sanitizeDbError(error), variant: "destructive" });
    },
  });

  if (!user) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
                <p className="text-muted-foreground">{profile?.email || user.email}</p>
                
                <Separator className="my-4" />
                
                <PointsSummary 
                  points={profile?.total_points || 0} 
                  level={profile?.loyalty_level || 'Bronze'} 
                  nextLevelPoints={500} 
                  lifetimePoints={profile?.total_points || 0}
                />
                
                <Separator className="my-6" />
                
                <Button variant="outline" className="w-full justify-start mt-2 text-destructive" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="account">
            <TabsList className="mb-6">
              <TabsTrigger value="account">Account Details</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); updateProfile.mutate(); }}>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile?.email || user.email || ''} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
                    </div>
                    <Button type="submit" disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="mr-2 h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <Card key={order.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between mb-2">
                              <div>
                                <h3 className="font-medium">{order.restaurant?.name || 'Restaurant'}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
                                <span className="text-xs px-2 py-1 bg-muted rounded capitalize">{order.status}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
