import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CANONICAL = "https://redeemr.app/blog/paper-vs-digital-loyalty";

const comparison = [
  { feature: "Customer convenience", paper: "Easy to lose or forget at home", digital: "Always in the customer's phone" },
  { feature: "Setup cost", paper: "Printing, stamps, replacement cards", digital: "One flat monthly subscription" },
  { feature: "Data & insights", paper: "None — you can't see who returns", digital: "Visit frequency, top rewards, churn signals" },
  { feature: "Fraud resistance", paper: "Easy to forge stamps", digital: "Signed QR codes and staff-side scans" },
  { feature: "Marketing", paper: "No way to reach past customers", digital: "Push and email to your loyal base" },
  { feature: "Environmental impact", paper: "Ongoing paper and ink waste", digital: "Zero physical waste" },
];

export default function BlogPaperVsDigital() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Paper vs digital loyalty cards: which customer loyalty card program wins in 2026?",
    description:
      "A practical comparison of paper punch cards and digital loyalty card programs — cost, data, customer experience, and which one grows repeat visits faster.",
    author: { "@type": "Organization", name: "Redeemr" },
    publisher: { "@type": "Organization", name: "Redeemr" },
    mainEntityOfPage: CANONICAL,
    datePublished: "2026-07-01",
  };

  return (
    <>
      <Helmet>
        <title>Paper vs Digital Loyalty Cards: Which Wins in 2026? | Redeemr</title>
        <meta
          name="description"
          content="Compare paper punch cards to digital customer loyalty card programs — cost, data insights, fraud, and which drives more repeat visits."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Paper vs Digital Loyalty Cards: Which Wins in 2026?" />
        <meta
          property="og:description"
          content="A side-by-side comparison of paper punch cards and digital loyalty card programs for cafés, restaurants, and small businesses."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={CANONICAL} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="eyebrow mb-4 text-brand-orange">Guide · Loyalty programs</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-charcoal leading-tight">
          Paper vs digital loyalty cards: which customer loyalty card program wins in 2026?
        </h1>
        <p className="mt-6 text-lg text-brand-body leading-relaxed">
          Punch cards built the modern loyalty habit — buy nine coffees, get one free. But the paper card is showing its
          age. Here's an honest comparison of paper punch cards and digital loyalty card programs, and how to decide
          which fits your business.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-brand-charcoal">The quick verdict</h2>
          <p className="mt-4 leading-relaxed text-brand-body">
            Paper still works for a single-location shop that wants zero technology. For everyone else — cafés,
            restaurants, salons, anyone who wants to <em>know</em> their customers — a digital loyalty card program pays
            for itself in retained visits and the data it unlocks.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-brand-charcoal">Side-by-side comparison</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-brand-border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-brand-cream text-left text-brand-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">What matters</th>
                  <th className="px-4 py-3 font-medium">Paper punch card</th>
                  <th className="px-4 py-3 font-medium">Digital loyalty card</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-t border-brand-border align-top">
                    <td className="px-4 py-4 font-medium text-brand-charcoal">{row.feature}</td>
                    <td className="px-4 py-4 text-brand-body">
                      <span className="inline-flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                        {row.paper}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-brand-body">
                      <span className="inline-flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-orange" />
                        {row.digital}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-brand-charcoal">Where paper still makes sense</h2>
          <p className="leading-relaxed text-brand-body">
            If you run a single counter, have a low volume of repeat customers, and don't want to think about phones,
            paper works. It's cheap on day one, staff know how to use it, and there's nothing to log into.
          </p>
          <p className="leading-relaxed text-brand-body">
            The trade-off is invisibility. You can't tell who came back four times last month, who stopped visiting, or
            which reward actually drove behavior.
          </p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-brand-charcoal">
            Where digital loyalty card programs win
          </h2>
          <p className="leading-relaxed text-brand-body">
            A digital loyalty program lives in the customer's phone. They can't lose it, staff scan it in under a
            second, and every stamp becomes a data point you can act on.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-brand-body">
            <li>See exactly which customers are on the edge of a reward and nudge them.</li>
            <li>Send a push when a regular hasn't visited in three weeks.</li>
            <li>Prove which promotions actually brought people back.</li>
            <li>Kill fraud with signed, short-lived QR codes.</li>
          </ul>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-brand-charcoal">What it costs to switch</h2>
          <p className="leading-relaxed text-brand-body">
            Redeemr's loyalty program starts at $20/month per location — less than a single reprint run of paper cards.
            No hardware, no per-stamp fee. Your staff scan a QR code on an iPad; the customer's card updates instantly.
          </p>
        </section>

        <section className="mt-14 rounded-2xl bg-brand-charcoal p-8 text-white">
          <h2 className="text-2xl font-bold tracking-tight">Ready to retire the punch card?</h2>
          <p className="mt-3 text-white/80 leading-relaxed">
            Set up a digital loyalty card program for your business in under 10 minutes. No paper, no punches, no lost
            cards.
          </p>
          <Button asChild className="mt-6 rounded-full bg-brand-orange hover:bg-[#EA6C0A] text-white">
            <Link to="/business">
              Get started free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </article>
    </>
  );
}
