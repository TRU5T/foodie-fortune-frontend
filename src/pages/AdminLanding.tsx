import { Link, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldCheck,
  Users,
  Store,
  TrendingUp,
  ArrowRight,
  ArrowUpCircle,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";

const AdminLanding = () => {
  const { user } = useAuth();
  const { role, isLoading: isLoadingRole } = useUserRole();

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, restaurants, orders, pendingRequests] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("restaurants").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase
          .from("tier_upgrade_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);
      return {
        users: profiles.count ?? 0,
        restaurants: restaurants.count ?? 0,
        orders: orders.count ?? 0,
        pendingUpgrades: pendingRequests.count ?? 0,
      };
    },
  });

  if (isLoadingRole)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  if (role !== "admin") return <Navigate to="/" replace />;

  const quickLinks = [
    {
      title: "User Management",
      description: "View and manage all registered users",
      icon: Users,
      href: "/admin/dashboard",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Vendor Management",
      description: "Oversee restaurants and vendor tiers",
      icon: Store,
      href: "/admin/dashboard",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Tier Requests",
      description: "Review pending upgrade requests",
      icon: ArrowUpCircle,
      href: "/admin/dashboard",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      badge: stats?.pendingUpgrades,
    },
    {
      title: "Analytics",
      description: "Platform performance and metrics",
      icon: BarChart3,
      href: "/admin/dashboard",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE1YTMgMyAwIDEgMSA2IDAgMyAzIDAgMCAxLTYgMHptMCAzMGEzIDMgMCAxIDEgNiAwIDMgMyAwIDAgMS02IDB6bS0zMC0xNWEzIDMgMCAxIDEgNiAwIDMgMyAwIDAgMS02IDB6bTMwIDBhMyAzIDAgMSAxIDYgMCAzIDMgMCAwIDEtNiAwem0tMTUtMTVhMyAzIDAgMSAxIDYgMCAzIDMgMCAwIDEtNiAwem0wIDMwYTMgMyAwIDEgMSA2IDAgMyAzIDAgMCAxLTYgMHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
          <div className="container relative py-16 md:py-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <ShieldCheck className="h-8 w-8 text-primary-foreground" />
              </div>
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-0 text-sm">
                Administrator
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Welcome back, Admin
            </h1>
            <p className="text-lg text-secondary-foreground/80 max-w-xl mb-8">
              Monitor your platform, manage users and vendors, and keep everything running smoothly from one place.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link to="/admin/dashboard">
                Open Full Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section className="container -mt-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: stats?.users, icon: Users },
              { label: "Restaurants", value: stats?.restaurants, icon: Store },
              { label: "Total Orders", value: stats?.orders, icon: TrendingUp },
              { label: "Pending Requests", value: stats?.pendingUpgrades, icon: Bell },
            ].map((stat) => (
              <Card key={stat.label} className="shadow-lg border-0">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value ?? "..."}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="container py-16">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.title} to={link.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className={`p-3 rounded-lg ${link.bg}`}>
                      <link.icon className={`h-6 w-6 ${link.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{link.title}</CardTitle>
                        {link.badge ? (
                          <Badge variant="destructive" className="text-xs">
                            {link.badge}
                          </Badge>
                        ) : null}
                      </div>
                      <CardDescription className="mt-1">{link.description}</CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors mt-1" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLanding;
