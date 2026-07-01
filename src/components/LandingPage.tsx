import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UtensilsCrossed, Trophy, Clock, CreditCard, QrCode, Gift, Store, Rocket, Bell, Check, ArrowRight } from "lucide-react";

const StampCardMockup = () => {
  const filled = 6;
  const total = 10;
  return (
    <div className="rounded-[14px] p-4 bg-[#292524] border border-[#44403C] shadow-2xl w-full max-w-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white text-[13px] font-bold tracking-tight">Corner Café</p>
          <p className="text-[#A8A29E] text-[10px] uppercase tracking-[0.08em] mt-0.5">Downtown · Loyalty</p>
        </div>
        <div className="text-[#F97316] text-[13px] font-bold tabular-nums">{filled}/{total}</div>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 ${
              i < filled
                ? "bg-[#F97316]"
                : "border border-[#57534E] bg-transparent"
            }`}
          >
            {i < filled && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
          </div>
        ))}
      </div>
      <p className="text-[#A8A29E] text-[11px] tracking-[0.03em]">
        {total - filled} stamps until your next reward
      </p>
    </div>
  );
};

export const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-[#1C1917]">
        <div className="container py-12 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <span className="eyebrow mb-4 lg:mb-6">Digital Loyalty, Reimagined</span>
              <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-bold mt-4 lg:mt-6 mb-4 lg:mb-6">
                Loyalty Made <span className="text-[#F97316]">Simple</span>
              </h1>
              <p className="text-[#A8A29E] text-sm sm:text-lg mb-6 lg:mb-8 max-w-xl" style={{ lineHeight: 1.7 }}>
                Redeemr replaces paper punch cards with a digital stamp system. Visit your favourite spots, scan a QR code, collect stamps, and unlock real rewards — all from your phone.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button asChild className="h-10 rounded-[10px] bg-[#F97316] text-white hover:bg-[#EA6C0A] px-5 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  <Link to="/auth?tab=register">
                    Get Started Free
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Link to="/business" className="text-sm font-normal text-[#A8A29E] hover:text-white hover:underline underline-offset-4 transition-all duration-200">
                  For Businesses
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <StampCardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Stat Bar */}
      <section className="bg-white border-b border-[#E7E5E4]">
        <div className="container py-8 lg:py-10">
          <div className="grid grid-cols-3 divide-x divide-[#E7E5E4]">
            {[
              { num: "12k", suffix: "+", label: "Customers" },
              { num: "340", suffix: "+", label: "Restaurants" },
              { num: "94", suffix: "%", label: "Return rate" },
            ].map((s) => (
              <div key={s.label} className="text-center px-2 sm:px-4">
                <div className="text-2xl sm:text-4xl font-bold text-[#1C1917] tracking-tight">
                  {s.num}<span className="text-[#F97316]">{s.suffix}</span>
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.08em] text-[#78716C] mt-2 font-medium whitespace-nowrap">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-[#FAFAF7]">
        <div className="container">
          <div className="text-center mb-10 lg:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 lg:mb-4 text-[#1C1917]">How It Works</h2>
            <p className="text-sm sm:text-base text-[#78716C] max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
              Three simple steps to start earning rewards
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: UtensilsCrossed, title: "1. Visit", body: "Head to any participating café, restaurant, or takeaway near you." },
              { Icon: QrCode, title: "2. Collect Stamps", body: "Show your QR code when ordering to collect stamps and earn points automatically." },
              { Icon: Gift, title: "3. Redeem Rewards", body: "Use your stamps and points for free meals, discounts, and exclusive perks." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white p-5 rounded-xl border border-[#E7E5E4] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-8 h-8 mb-4 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#F97316]" />
                </div>
                <h3 className="text-sm font-medium text-[#1C1917] mb-2">{title}</h3>
                <p className="text-xs text-[#78716C]" style={{ lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1C1917]">Why Choose Redeemr?</h2>
            <p className="text-[#78716C] max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
              The smarter way to reward loyal customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { Icon: Trophy, title: "Earn With Every Visit", body: "Collect stamps each time you visit and unlock rewards when your card is full." },
              { Icon: CreditCard, title: "Digital Stamp Cards", body: "No more lost paper cards — your stamps live on your phone, always with you." },
              { Icon: Clock, title: "Quick QR Scan", body: "Show your QR code at the till. One scan, stamp collected — done in seconds." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white p-5 rounded-xl border border-[#E7E5E4] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-8 h-8 mb-4 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#F97316]" />
                </div>
                <h3 className="text-sm font-medium text-[#1C1917] mb-2">{title}</h3>
                <p className="text-xs text-[#78716C]" style={{ lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon / Launching Section */}
      <section className="py-24 bg-[#FAFAF7]">
        <div className="container">
          <div className="text-center mb-12">
            <span className="eyebrow mb-6">
              <Rocket className="h-3 w-3" />
              Launching Soon
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-6 mb-4 text-[#1C1917]">Restaurants Are Joining</h2>
            <p className="text-[#78716C] max-w-2xl mx-auto" style={{ lineHeight: 1.7 }}>
              We're onboarding the best local restaurants in your area. Be the first to know when your favourites go live.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { Icon: Store, title: "Local Favourites", body: "Your go-to cafés, restaurants, and takeaways — all with loyalty built in." },
              { Icon: QrCode, title: "Scan & Stamp", body: "One scan per visit. Watch your stamps stack up and rewards unlock." },
              { Icon: Bell, title: "Get Notified", body: "Sign up now and we'll let you know the moment restaurants near you go live." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="bg-white p-5 rounded-xl border border-[#E7E5E4] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="w-8 h-8 mb-4 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
                  <Icon className="h-4 w-4 text-[#F97316]" />
                </div>
                <h3 className="text-sm font-medium text-[#1C1917] mb-2">{title}</h3>
                <p className="text-xs text-[#78716C]" style={{ lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" className="rounded-full bg-[#F97316] text-white hover:bg-[#EA6C0A] px-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <Link to="/auth?tab=register">Join the Waitlist</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Business Owners Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="h-[3px] w-12 rounded-full bg-[#F97316] mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#1C1917]">Own a Restaurant?</h2>
              <p className="text-[#44403C] mb-6" style={{ lineHeight: 1.7 }}>
                Redeemr gives you a digital loyalty programme your customers will actually use. No apps to download, no plastic cards — just a simple QR scan.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { Icon: Trophy, text: "Create custom stamp cards & rewards in minutes" },
                  { Icon: CreditCard, text: "Track customer visits and engagement with real analytics" },
                  { Icon: Clock, text: "Get set up in under 5 minutes — free to start" },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-[#F97316]" />
                    </div>
                    <span className="text-sm text-[#44403C]" style={{ lineHeight: 1.7 }}>{text}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="rounded-full bg-[#F97316] text-white hover:bg-[#EA6C0A] px-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                <Link to="/business">Learn More</Link>
              </Button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <StampCardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1C1917]">
        <div className="container text-center">
          <span className="eyebrow mb-6">Get Started</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-6 mb-6 text-white">Ready to Start Earning Rewards?</h2>
          <p className="mb-8 max-w-2xl mx-auto text-[#A8A29E]" style={{ lineHeight: 1.7 }}>
            Join our community of food lovers and start collecting rewards with every meal today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-[#F97316] text-white hover:bg-[#EA6C0A] px-7 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
              <Link to="/auth?tab=register">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="rounded-full border border-[#44403C] text-[#E7E5E4] bg-transparent hover:bg-white/5 hover:text-white px-7 transition-all duration-200">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
