import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, Stamp, QrCode, Award, UtensilsCrossed, Home, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
    ...(user
      ? [
          { to: "/rewards", label: "Rewards", icon: Award },
          { to: "/my-stamp-cards", label: "Stamp Cards", icon: Stamp },
          { to: "/my-qr-code", label: "QR Code", icon: QrCode },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-[#f97316]/10 flex items-center justify-center">
            <Flame className="h-5 w-5 text-[#f97316]" />
          </span>
          <span className="font-bold text-xl text-[#111827]">Redeemr</span>
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
                <VisuallyHidden>
                  <SheetTitle>Navigation menu</SheetTitle>
                  <SheetDescription>Browse the app's main sections</SheetDescription>
                </VisuallyHidden>
                <div className="flex flex-col mt-8 gap-4">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground hover:bg-muted transition-colors"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                      onClick={() => setSheetOpen(false)}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </NavLink>
                  ))}
                  <div className="border-t pt-4 mt-2">
                    {user ? (
                      <Button asChild className="w-full" onClick={() => setSheetOpen(false)}>
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full" onClick={() => setSheetOpen(false)}>
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
                  className="group relative flex items-center gap-1.5 px-3 py-2 text-sm text-[#111827] transition-colors after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[2px] after:bg-[#f97316] after:scale-x-0 after:origin-left after:transition-transform hover:after:scale-x-100"
                  activeClassName="text-[#f97316] font-semibold after:scale-x-100"
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
                <Button asChild size="sm" className="rounded-full bg-[#f97316] text-white hover:bg-[#f97316]/90 px-5">
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              ) : (
                <Button asChild size="sm" className="rounded-full bg-[#f97316] text-white hover:bg-[#f97316]/90 px-5">
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
