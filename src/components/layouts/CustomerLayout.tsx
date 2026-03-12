import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, Stamp, QrCode, Award, UtensilsCrossed, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useAuth } from "@/context/AuthContext";
import { NavLink } from "@/components/NavLink";
import { Footer } from "@/components/Footer";
import { NotificationBell } from "@/components/NotificationBell";

const CustomerNavbar = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
    ...(user
      ? [
          { to: "/rewards", label: "Rewards", icon: Award },
          { to: "/my-stamp-cards", label: "Stamp Cards", icon: Stamp },
          { to: "/my-qr-code", label: "QR Code", icon: QrCode },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-sm">RD</span>
          </span>
          <span className="font-bold text-xl">Redeemr</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-2">
            {user && <RoleSwitcher />}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col mt-8 gap-4">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </NavLink>
                  ))}
                  <div className="border-t pt-4 mt-2">
                    {user ? (
                      <Button asChild className="w-full">
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link to="/auth">Sign In</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <nav className="flex items-center gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  activeClassName="text-primary bg-primary/5 font-medium"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {user && <NotificationBell />}
              {user && <RoleSwitcher />}
              {user ? (
                <Button asChild size="sm">
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              ) : (
                <Button asChild size="sm">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
