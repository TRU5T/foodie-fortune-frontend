import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is Redeemr?",
        a: "Redeemr is a loyalty and rewards platform that connects you with your favourite restaurants. Earn stamps or points every time you visit, and redeem them for free meals, discounts, and exclusive perks.",
      },
      {
        q: "How do I create an account?",
        a: "Tap 'Sign In' and choose to sign up with your email address. Once verified, you can start collecting rewards straight away.",
      },
      {
        q: "Is Redeemr free to use?",
        a: "Yes — Redeemr is completely free for customers. Simply sign up, visit participating restaurants, and start earning rewards.",
      },
    ],
  },
  {
    category: "Earning & Redeeming",
    items: [
      {
        q: "How do I earn stamps or points?",
        a: "When you visit a participating restaurant, show your personal QR code to the staff. They'll scan it with their device and stamps or points are added to your account instantly.",
      },
      {
        q: "What's the difference between stamps and points?",
        a: "Stamps work like a traditional punch card — collect enough stamps and earn a reward. Points accumulate based on your spending and can be redeemed for various rewards at different thresholds.",
      },
      {
        q: "How do I redeem a reward?",
        a: "Head to the Rewards page, choose an available reward, and present it to the restaurant staff at your next visit. They'll verify and apply it to your order.",
      },
      {
        q: "Do my points or stamps expire?",
        a: "Expiry policies vary by restaurant. Check each restaurant's page for details on their specific loyalty programme terms.",
      },
    ],
  },
  {
    category: "QR Code & Scanning",
    items: [
      {
        q: "Where do I find my QR code?",
        a: "Once signed in, tap 'QR Code' in the navigation menu. Your unique QR code will be displayed for restaurant staff to scan.",
      },
      {
        q: "My QR code isn't scanning — what should I do?",
        a: "Make sure your screen brightness is turned up and there's no glare. If the problem persists, try refreshing the page or contact support.",
      },
    ],
  },
  {
    category: "For Restaurants",
    items: [
      {
        q: "How can my restaurant join Redeemr?",
        a: "Sign up for a vendor account, set up your restaurant profile, choose a loyalty type (stamps or points), and create your rewards. Visit the Business page for subscription plans.",
      },
      {
        q: "What vendor tiers are available?",
        a: "We offer two tiers: Tier 1 (basic loyalty features) and Tier 2 (advanced analytics, promotions, and priority support). You can request a tier upgrade from the Vendor Dashboard.",
      },
      {
        q: "How do I scan customer QR codes?",
        a: "Use the Vendor Scanner in your dashboard. Point your device camera at the customer's QR code and the system will automatically award the appropriate stamps or points.",
      },
    ],
  },
  {
    category: "Account & Support",
    items: [
      {
        q: "How do I update my profile?",
        a: "Go to your Profile page where you can update your name, email, phone number, and avatar.",
      },
      {
        q: "I'm having an issue not listed here. How do I get help?",
        a: "Contact our support team at support@redeemr.app and we'll get back to you within 24 hours.",
      },
    ],
  },
];

const FAQ = () => {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((section) =>
      section.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    ),
  };

  return (
    <div className="container py-10 max-w-3xl">
      <Helmet>
        <title>FAQ — Redeemr Loyalty & Rewards</title>
        <meta name="description" content="Answers to common questions about earning stamps, redeeming rewards, QR scanning, and using Redeemr at participating restaurants." />
        <link rel="canonical" href="https://redeemr.app/faq" />
        <meta property="og:title" content="Redeemr FAQ" />
        <meta property="og:url" content="https://redeemr.app/faq" />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Find answers to common questions about using Redeemr.
      </p>

      {faqs.map((section) => (
        <div key={section.category} className="mb-8">
          <h2 className="text-xl font-semibold mb-3">{section.category}</h2>
          <Accordion type="single" collapsible className="w-full">
            {section.items.map((item, i) => (
              <AccordionItem key={i} value={`${section.category}-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
