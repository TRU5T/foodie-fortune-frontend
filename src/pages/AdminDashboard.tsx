import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Users, Store, TrendingUp, ShieldCheck, Search } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { role, isLoading: isLoadingRole } = useUserRole();
  const queryClient = useQueryClient();
  const [searchUsers, setSearchUsers] = useState("");
  const [searchVendors, setSearchVendors] = useState("");

  const { data: profileCount } = useQuery({
    queryKey: ['admin-profile-count'],
    queryFn: async () => {
      const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: restaurantCount } = useQuery({
    queryKey: ['admin-restaurant-count'],
    queryFn: async () => {
      const { count, error } = await supabase.from('restaurants').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: rewardCount } = useQuery({
    queryKey: ['admin-reward-count'],
    queryFn: async () => {
      const { count, error } = await supabase.from('rewards').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: orderCount } = useQuery({
    queryKey: ['admin-order-count'],
    queryFn: async () => {
      const { count, error } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    }
  });

  const { data: restaurants } = useQuery({
    queryKey: ['admin-restaurants'],
    queryFn: async () => {
      const { data, error } = await supabase.from('restaurants').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: upgradeRequests } = useQuery({
    queryKey: ['admin-upgrade-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tier_upgrade_requests')
        .select('*, restaurant:restaurants(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const handleUpgradeRequest = useMutation({
    mutationFn: async ({ requestId, status, restaurantId }: { requestId: string; status: 'approved' | 'rejected'; restaurantId: string }) => {
      const { error: reqError } = await supabase.from('tier_upgrade_requests').update({ status }).eq('id', requestId);
      if (reqError) throw reqError;
      if (status === 'approved') {
        const { error: restError } = await supabase.from('restaurants').update({ vendor_tier: 'tier_2' as const }).eq('id', restaurantId);
        if (restError) throw restError;
      }
    },
    onSuccess: (_, variables) => {
      toast({ title: `Request ${variables.status}`, description: `The tier upgrade request has been ${variables.status}.` });
      queryClient.invalidateQueries({ queryKey: ['admin-upgrade-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" })
  });

  if (isLoadingRole) return <div className="flex items-center justify-center min-h-[50vh]"><p>Loading...</p></div>;
  if (role !== 'admin') return <Navigate to="/" replace />;

  const filteredProfiles = profiles?.filter(p =>
    !searchUsers || p.full_name?.toLowerCase().includes(searchUsers.toLowerCase()) || p.email?.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredRestaurants = restaurants?.filter(r =>
    !searchVendors || r.name.toLowerCase().includes(searchVendors.toLowerCase())
  );

  const pendingRequests = upgradeRequests?.filter(r => r.status === 'pending') || [];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />Admin Dashboard
        </h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{profileCount ?? '...'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Restaurants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{restaurantCount ?? '...'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rewards Created</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{rewardCount ?? '...'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{orderCount ?? '...'}</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="upgrades" className="relative">
            Tier Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={searchUsers} onChange={(e) => setSearchUsers(e.target.value)} className="pl-10" />
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Level</TableHead><TableHead>Points</TableHead><TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles?.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.full_name || 'N/A'}</TableCell>
                    <TableCell>{profile.email || 'N/A'}</TableCell>
                    <TableCell><Badge variant="outline">{profile.loyalty_level}</Badge></TableCell>
                    <TableCell>{profile.total_points}</TableCell>
                    <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {(!filteredProfiles || filteredProfiles.length === 0) && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No users found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="mt-6">
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors..." value={searchVendors} onChange={(e) => setSearchVendors(e.target.value)} className="pl-10" />
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead><TableHead>Cuisine</TableHead><TableHead>Tier</TableHead><TableHead>Loyalty</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.cuisine || 'N/A'}</TableCell>
                    <TableCell><Badge variant={r.vendor_tier === 'tier_2' ? "default" : "secondary"}>{r.vendor_tier === 'tier_2' ? 'Tier 2' : 'Tier 1'}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{r.loyalty_type}</Badge></TableCell>
                    <TableCell><Badge variant={r.is_active ? "default" : "destructive"}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {(!filteredRestaurants || filteredRestaurants.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No vendors found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="upgrades" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead><TableHead>Current Tier</TableHead><TableHead>Requested Tier</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upgradeRequests?.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{(req as any).restaurant?.name || 'Unknown'}</TableCell>
                    <TableCell><Badge variant="secondary">Tier 1</Badge></TableCell>
                    <TableCell><Badge>Tier 2</Badge></TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpgradeRequest.mutate({ requestId: req.id, status: 'approved', restaurantId: req.restaurant_id })}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUpgradeRequest.mutate({ requestId: req.id, status: 'rejected', restaurantId: req.restaurant_id })}>Reject</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(!upgradeRequests || upgradeRequests.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No upgrade requests</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
