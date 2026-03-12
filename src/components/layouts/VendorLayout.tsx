import { Outlet, Link } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ScanLine, CreditCard, LogOut, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

const vendorLinks = [
  { title: "Dashboard", url: "/vendor-dashboard", icon: LayoutDashboard },
  { title: "Scan Customer", url: "/vendor-scanner", icon: ScanLine },
  { title: "Subscription", url: "/business", icon: CreditCard },
];

function VendorSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link to="/vendor-dashboard" className="flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              {!collapsed && <span className="font-bold">Redeemr Vendor</span>}
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {vendorLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-2 hover:bg-sidebar-accent/50 rounded-md px-2 py-1.5 text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      onClick={handleNavClick}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-2">
        {!collapsed && <RoleSwitcher />}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export const VendorLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <VendorSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 bg-background">
            <SidebarTrigger className="mr-4" />
            <span className="text-sm text-muted-foreground">Vendor Portal</span>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
