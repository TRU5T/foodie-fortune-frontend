
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

// Layouts
import { CustomerLayout } from "@/components/layouts/CustomerLayout";
import { VendorLayout } from "@/components/layouts/VendorLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";

// Pages
import Index from "./pages/Index";
import Rewards from "./pages/Rewards";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import BusinessSubscription from "./pages/BusinessSubscription";
import MyStampCards from "./pages/MyStampCards";
import Auth from "./pages/Auth";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLanding from "./pages/AdminLanding";
const MyQRCode = lazy(() => import("./pages/MyQRCode"));
const VendorScanner = lazy(() => import("./pages/VendorScanner"));

const queryClient = new QueryClient();

const SuspenseFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Customer layout routes */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-stamp-cards" element={<MyStampCards />} />
                <Route path="/my-qr-code" element={<Suspense fallback={<SuspenseFallback />}><MyQRCode /></Suspense>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/business" element={<BusinessSubscription />} />
              </Route>

              {/* Vendor layout routes */}
              <Route element={<VendorLayout />}>
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/vendor-scanner" element={<Suspense fallback={<SuspenseFallback />}><VendorScanner /></Suspense>} />
              </Route>

              {/* Admin layout routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminLanding />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
