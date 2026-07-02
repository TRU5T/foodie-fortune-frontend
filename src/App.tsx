
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { PushNotificationInit } from "@/components/PushNotificationInit";

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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLanding from "./pages/AdminLanding";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Unsubscribe from "./pages/Unsubscribe";
import BlogPaperVsDigital from "./pages/BlogPaperVsDigital";
import Refer from "./pages/Refer";
import { RouteGuard } from "@/components/RouteGuard";
const MyQRCode = lazy(() => import("./pages/MyQRCode"));
const VendorScanner = lazy(() => import("./pages/VendorScanner"));
const VendorPoster = lazy(() => import("./pages/VendorPoster"));

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
            <PushNotificationInit />
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
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/business" element={<BusinessSubscription />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/blog/paper-vs-digital-loyalty" element={<BlogPaperVsDigital />} />
                <Route path="/refer" element={<Refer />} />
              </Route>

              {/* Vendor layout routes */}
              <Route element={<RouteGuard allow={["vendor", "admin"]}><VendorLayout /></RouteGuard>}>
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/vendor-scanner" element={<Suspense fallback={<SuspenseFallback />}><VendorScanner /></Suspense>} />
                <Route path="/vendor-poster/:restaurantId" element={<Suspense fallback={<SuspenseFallback />}><VendorPoster /></Suspense>} />
              </Route>

              {/* Admin layout routes */}
              <Route element={<RouteGuard allow={["admin"]}><AdminLayout /></RouteGuard>}>
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
