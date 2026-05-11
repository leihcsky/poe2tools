import WardCalculatorWidget from "@/components/tools/WardCalculatorWidget";
import Link from "next/link";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const title = "POE2 Runic Ward Calculator";
  const description =
    "Free POE2 Runic Ward Calculator — enter base Ward, recovery rate, and mitigation to see total EHP, recovery time, and if your Ward is endgame-ready.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
    alternates: { canonical: "/tools/runic-ward-calc" },
    openGraph: {
      title,
      description,
      url: "/tools/runic-ward-calc",
      siteName: "POE2Tools",
    },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default function RunicWardCalcPage() {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "POE2 Runic Ward Calculator",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://poe2tools.top/tools/runic-ward-calc",
    description:
      "A calculator for Path of Exile 2 that estimates total Runic Ward value, effective HP, and recovery timing from your gear stats.",
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: "POE2Tools",
      url: "https://poe2tools.top",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much Ward do I need for endgame POE2?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For comfortable T16 mapping, aim for 2000–3000 total Ward with at least 60% recovery rate. For pinnacle bosses, 4000+ Ward with layered mitigation is recommended. Use this calculator to check your effective HP.",
        },
      },
      {
        "@type": "Question",
        name: "How does Runic Ward recovery work in Path of Exile 2?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Runic Ward recovers to full after a short delay when you stop taking damage. The delay and speed depend on your recovery rate stat. Higher recovery rate means faster refill, making Ward builds more forgiving.",
        },
      },
      {
        "@type": "Question",
        name: "Is Ward better than Life or Energy Shield in POE2?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ward is not strictly better—it excels against frequent small-to-medium hits because it recovers quickly. Against rare one-shots, raw Life or ES may be safer. The key is layering Ward with other mitigation.",
        },
      },
      {
        "@type": "Question",
        name: "What affects total Ward value?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Base Ward from gear, percent increased Ward modifiers, flat Ward bonuses from passives or buffs, and Runic Ward bonuses from inscribed runes all contribute to your total Ward pool.",
        },
      },
      {
        "@type": "Question",
        name: "Does mitigation apply before or after Ward?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mitigation (armour, resistances) reduces incoming damage before it hits your Ward pool. This means each point of Ward is worth more when you have good mitigation—effectively multiplying your survivability.",
        },
      },
    ],
  };

  const jsonLd = [softwareJsonLd, faqJsonLd];

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-8 sm:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <Link href="/" className="p2-link">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/tools" className="p2-link">Tools</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-zinc-700 dark:text-zinc-300">
            POE2 Runic Ward Calculator
          </span>
        </nav>

        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            POE2 Runic Ward Calculator
          </h1>
          <p className="mx-auto mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Path of Exile 2 · Runic Ward EHP & Recovery Planner
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
            Enter your base Ward, recovery rate, and damage mitigation to instantly see your effective HP, Ward recovery
            time, and how your build stacks up against endgame content. Find out exactly how much Runic Ward you need
            for mapping, bossing, or challenge content in Path of Exile 2.
          </p>

          <nav aria-label="Page sections" className="mt-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm">
            <a href="#calculator" className="p2-link">Calculator</a>
            <span aria-hidden className="text-zinc-400 dark:text-zinc-600">·</span>
            <a href="#ward-thresholds" className="p2-link">Thresholds</a>
            <span aria-hidden className="text-zinc-400 dark:text-zinc-600">·</span>
            <a href="#ward-mechanics" className="p2-link">Mechanics</a>
            <span aria-hidden className="text-zinc-400 dark:text-zinc-600">·</span>
            <a href="#faq" className="p2-link">FAQ</a>
          </nav>

          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs text-amber-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Preview coefficients — values will be tuned to match live Patch 0.5 data.
          </p>
        </header>

        <section id="calculator" className="scroll-mt-28">
          <WardCalculatorWidget />
        </section>

        <section id="ward-mechanics" className="mt-10 scroll-mt-28 p2-section p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            How Runic Ward works in Path of Exile 2
          </h2>
          <div className="mt-4 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300 space-y-4">
            <p>
              Runic Ward is a defensive layer introduced alongside the Runes of Aldur system. Unlike Energy Shield, Ward
              recovers to full after a brief delay when you are not taking damage — making it exceptionally strong
              against content with gaps between hits.
            </p>
            <p>
              Your <span className="font-medium text-zinc-900 dark:text-zinc-100">total Ward</span> is determined by
              base Ward on gear, percent increased modifiers, flat bonuses, and any Runic Ward granted by inscribed
              runes. The POE2 Runic Ward Calculator above factors all of these together.
            </p>
            <p>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">Recovery rate</span> controls how quickly
              Ward refills once the recovery delay expires. At 100% recovery rate with zero modifiers, Ward takes roughly
              2 seconds to fully restore. Stacking recovery speed brings this under 1 second — critical for mapping.
            </p>
            <p>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">Effective HP (EHP)</span> combines your
              Ward pool with mitigation. Because armour and resistances reduce damage before it hits Ward, each point of
              mitigation makes your Ward pool worth more. The calculator outputs EHP so you can compare Ward builds to
              Life or ES alternatives directly.
            </p>
          </div>
        </section>

        <section id="faq" className="mt-8 scroll-mt-28 p2-section p-8">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            FAQ — POE2 Runic Ward Calculator
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                How much Ward do I need for endgame POE2?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                For comfortable T16 mapping, aim for 2000–3000 total Ward with at least 60% recovery rate. For pinnacle
                bosses, 4000+ Ward with layered mitigation is recommended. Use the calculator above to check your
                effective HP against specific content tiers.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                How does Runic Ward recovery work?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Ward recovers to full after a short delay when you stop taking damage. The delay and speed depend on your
                recovery rate stat. Higher recovery rate means faster refill, making Ward builds more forgiving in
                content with gaps between hits.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Is Ward better than Life or Energy Shield?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Ward excels against frequent small-to-medium hits because it recovers quickly. Against rare one-shots,
                raw Life or ES may be safer. The key is layering Ward with armour and resistances — the calculator shows
                you exactly how much EHP each approach gives.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                What affects total Ward value?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Base Ward from gear, percent increased Ward modifiers, flat Ward bonuses from passives or buffs, and
                Runic Ward bonuses from inscribed runes all contribute to your total Ward pool. Enter each value in the
                calculator to see the final number.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Does mitigation apply before or after Ward?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Mitigation (armour, resistances) reduces incoming damage before it hits your Ward pool. This means each
                point of Ward is effectively worth more when you have good mitigation — the EHP readout accounts for
                this.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
