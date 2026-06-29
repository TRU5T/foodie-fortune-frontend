import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Trophy, Clock, CreditCard, QrCode, Gift, Store, Rocket, Bell } from "lucide-react";

export const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative h-[600px] bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 flex items-center z-20">
          <div className="max-w-2xl pl-8 sm:pl-16 md:pl-24 pr-6 text-white">
            <div className="h-[3px] w-12 rounded-full bg-[#f97316] mb-6" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.05] text-white">
              Loyalty Made Simple
            </h1>
            <p className="text-base sm:text-lg mb-8 leading-relaxed text-gray-200">
              Redeemr replaces paper punch cards with a digital stamp system. Visit your favourite spots, scan a QR code, collect stamps, and unlock real rewards — all from your phone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full bg-[#f97316] text-[#111827] hover:bg-[#f97316]/90 px-7 font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                <Link to="/auth?tab=register">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full border border-white text-white bg-transparent hover:bg-white/10 hover:text-white px-7 transition-all duration-200">
                <Link to="/business">For Businesses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#111827]">How It Works</h2>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Three simple steps to start earning rewards
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: UtensilsCrossed, title: "1. Visit", body: "Head to any participating café, restaurant, or takeaway near you." },
              { Icon: QrCode, title: "2. Collect Stamps", body: "Show your QR code when ordering to collect stamps and earn points automatically." },
              { Icon: Gift, title: "3. Redeem Rewards", body: "Use your stamps and points for free meals, discounts, and exclusive perks." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-[#f97316]" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3 text-[#111827]">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#fafaf9]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#111827]">Why Choose Redeemr?</h2>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              The smarter way to reward loyal customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { Icon: Trophy, title: "Earn With Every Visit", body: "Collect stamps each time you visit and unlock rewards when your card is full." },
              { Icon: CreditCard, title: "Digital Stamp Cards", body: "No more lost paper cards — your stamps live on your phone, always with you." },
              { Icon: Clock, title: "Quick QR Scan", body: "Show your QR code at the till. One scan, stamp collected — done in seconds." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 mb-4 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#f97316]" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-[#111827]">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon / Launching Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 text-[#f97316] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Launching Soon
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#111827]">Restaurants Are Joining</h2>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              We're onboarding the best local restaurants in your area. Be the first to know when your favourites go live.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { Icon: Store, title: "Local Favourites", body: "Your go-to cafés, restaurants, and takeaways — all with loyalty built in." },
              { Icon: QrCode, title: "Scan & Stamp", body: "One scan per visit. Watch your stamps stack up and rewards unlock." },
              { Icon: Bell, title: "Get Notified", body: "Sign up now and we'll let you know the moment restaurants near you go live." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f97316]/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-[#f97316]" />
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2 text-[#111827]">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" className="rounded-full bg-[#f97316] text-white hover:bg-[#f97316]/90 px-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <Link to="/auth?tab=register">Join the Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Business Owners Section */}
      <section className="py-24 bg-[#fafaf9]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-[3px] w-12 rounded-full bg-[#f97316] mb-6" />
              <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#111827]">Own a Restaurant?</h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-6">
                Redeemr gives you a digital loyalty programme your customers will actually use. No apps to download, no plastic cards — just a simple QR scan.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { Icon: Trophy, text: "Create custom stamp cards & rewards in minutes" },
                  { Icon: CreditCard, text: "Track customer visits and engagement with real analytics" },
                  { Icon: Clock, text: "Get set up in under 5 minutes — free to start" },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded-full bg-[#f97316]/10 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-[#f97316]" />
                    </div>
                    <span className="text-gray-500 leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="rounded-full bg-[#f97316] text-white hover:bg-[#f97316]/90 px-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                <Link to="/business">Learn More</Link>
              </Button>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#fafaf9] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#f97316]/15 flex items-center justify-center">
                    <Store className="h-5 w-5 text-[#f97316]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#111827]">Your Restaurant</p>
                    <p className="text-xs text-gray-500">Stamp card active · 3 rewards</p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center text-lg transition-all duration-200 ${
                        i < 6
                          ? "bg-[#f97316]/15 text-[#f97316]"
                          : "bg-[#fafaf9] text-gray-300"
                      }`}
                    >
                      {i < 6 ? "★" : "☆"}
                    </div>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-500">6 / 10 stamps collected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#111827] text-white">
        <div className="container text-center">
          <div className="h-[3px] w-12 rounded-full bg-[#f97316] mb-6 mx-auto" />
          <h2 className="text-4xl font-bold tracking-tight mb-6 text-white">Ready to Start Earning Rewards?</h2>
          <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto text-gray-300">
            Join our community of food lovers and start collecting rewards with every meal today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-[#f97316] text-white hover:bg-[#f97316]/90 px-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <Link to="/auth?tab=register">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-full border border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white px-7 transition-all duration-200">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
