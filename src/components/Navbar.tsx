
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, Stamp, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const NavLinks = () => (
    <>
      <Link to="/" className="font-medium hover:text-primary transition-colors">
        Home
      </Link>
      <Link to="/rewards" className="font-medium hover:text-primary transition-colors">
        Rewards
      </Link>
      <Link to="/stamps" className="font-medium hover:text-primary transition-colors">
        Stamp Cards
      </Link>
      <Link to="/restaurants" className="font-medium hover:text-primary transition-colors">
        Restaurants
      </Link>
      <Link to="/business" className="font-medium hover:text-primary transition-colors flex items-center gap-1">
        <Store className="h-4 w-4" />
        For Business
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-white">RD</span>
            </span>
            <span className="font-bold text-xl">Redeemr</span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col mt-8 gap-6">
                  <NavLinks />
                  <Button asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <nav className="flex items-center gap-6">
            <NavLinks />
          </nav>
        )}

        {!isMobile && (
          <div className="flex items-center gap-4">
            {user && <RoleSwitcher />}
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Button asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
