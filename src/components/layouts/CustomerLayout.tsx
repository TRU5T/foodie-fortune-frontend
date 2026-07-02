import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { User, Menu, Stamp, QrCode, Home, Award, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
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
          { to: "/refer", label: "Invite", icon: Gift },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E7E5E4]">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-lg bg-[#E8521A] flex items-center justify-center">
            <Star className="h-4 w-4 text-white fill-white" strokeWidth={2} />
          </span>
          <span className="font-bold text-xl text-[#1C1917] tracking-tight">Redeemr</span>
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
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-[#44403C] hover:bg-[#FAFAF7] transition-all duration-200"
                      activeClassName="bg-[#F97316]/10 text-[#F97316] font-semibold"
                      onClick={() => setSheetOpen(false)}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </NavLink>
                  ))}
                  <div className="border-t border-[#E7E5E4] pt-4 mt-2">
                    {user ? (
                      <Button asChild className="w-full rounded-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 transition-all duration-200" onClick={() => setSheetOpen(false)}>
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full rounded-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 transition-all duration-200" onClick={() => setSheetOpen(false)}>
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
                  className="group relative flex items-center gap-1.5 px-3 py-2 text-sm text-[#78716C] transition-all duration-200 hover:text-[#1C1917] after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[2px] after:bg-[#F97316] after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100"
                  activeClassName="text-[#F97316] font-semibold after:scale-x-100"
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
                <Button asChild className="h-[34px] rounded-lg bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 px-4 text-[13px] transition-all duration-200">
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              ) : (
                <Button asChild className="h-[34px] rounded-lg bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 px-4 text-[13px] transition-all duration-200">
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
