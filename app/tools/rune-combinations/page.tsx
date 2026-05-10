import RuneCalculatorWidget from "@/components/tools/RuneCalculatorWidget";
import { DataStatusCallout } from "@/components/ui/DataStatus";
import { readDataMeta } from "@/lib/data-meta";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 60 * 60;

type RuneRecord = {
  id: string;
  slug: string;
  name: string;
  category: string;
  sub_type: string;
  tier: number;
  monster_modifier: {
    description: string;
    difficulty_rating: number;
  };
  reward: {
    description: string;
    reward_type: string;
  };
  slot_cost: number;
  tags: string[];
  synergies: string[];
  anti_synergies: string[];
  source: string;
  area_level_min: number;
  masterwork: boolean;
  notes: string;
};

async function loadRunes(): Promise<RuneRecord[]> {
  const filePath = path.join(process.cwd(), "data", "runes.json");
  const raw = await readFile(filePath, "utf8").catch(() => "");
  const trimmed = raw.trim();
  if (!trimmed) return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed as RuneRecord[];

    if (parsed && typeof parsed === "object") {
      const maybeRunes = (parsed as { runes?: unknown }).runes;
      if (Array.isArray(maybeRunes)) return maybeRunes as RuneRecord[];
    }

    return [];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  // Short segment for <title>: root layout appends " — POE2Tools" (keep total ~≤60 chars).
  const title = "Rune Combinations";
  const description =
    "Plan Runes of Aldur combos: slot runes, review modifiers, difficulty, and rewards. Uses preview data until Patch 0.5—replace data/runes.json when official stats ship.";

  return {
    title,
    description,
    // noindex until runes.json is live Patch data; set index: true and drop sitemap exclude then.
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    alternates: {
      canonical: "/tools/rune-combinations",
    },
    openGraph: {
      title,
      description,
      url: "/tools/rune-combinations",
      siteName: "POE2Tools",
      images: [
        {
          url: "/images/guides/poe2-runes-of-aldur-explained.svg",
          width: 1200,
          height: 630,
          alt: "POE2 Rune Synergy Calculator",
        },
      ],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: ["/images/guides/poe2-runes-of-aldur-explained.svg"],
    },
  };
}

export default async function RuneCombinationsPage() {
  const meta = await readDataMeta("runes.json");
  const runes = await loadRunes();

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "POE2 Rune Combinations Calculator",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://poe2tools.top/tools/rune-combinations",
    description:
      "A calculator for planning Runes of Aldur combinations in Path of Exile 2. Pick runes, review difficulty and rewards, and get recommendations by goal.",
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
        name: "How many rune slots can I use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The calculator supports up to 8 runes, matching the typical endgame slot count. If your character has fewer slots, treat the tool as a planning sandbox.",
        },
      },
      {
        "@type": "Question",
        name: "What does “goal” change?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Goal changes how recommendations are ranked. “Mapping” favors smoother difficulty, “Loot” favors reward-oriented patterns, and “Challenge” leans into harder setups.",
        },
      },
      {
        "@type": "Question",
        name: "Do rune difficulty modifiers stack?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Generally yes—stacking multiple “harder” runes can quickly push content into risky territory. Use the difficulty summary as a quick sanity check before committing.",
        },
      },
      {
        "@type": "Question",
        name: "Why do I see “No recommendations” sometimes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recommendations depend on the rune dataset. If the site is still updating for a patch, some pages may temporarily show limited or no results until the data is refreshed.",
        },
      },
      {
        "@type": "Question",
        name: "Is the highest score always the best choice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not always. Scores are a shortcut for comparing options, but your build and content target matter. If a setup feels too spiky, switch to a safer goal or lower the difficulty profile.",
        },
      },
    ],
  };

  const jsonLd = [softwareJsonLd, faqJsonLd];

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <Link href="/" className="p2-link">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/tools"
            className="p2-link"
          >
            Tools
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-zinc-700 dark:text-zinc-300">
            Rune combinations
          </span>
        </nav>

        <section className="p2-section overflow-hidden">
          <div className="px-8 py-8">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100 mb-6">
              <span className="font-semibold">⚠️ Data Update Pending:</span> This tool currently uses placeholder data from early previews. Full Patch 0.5 rune data will be imported immediately after the official release. Stay tuned!
            </div>
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
              Runes of Aldur · Combo planner
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              Rune Combinations Calculator
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Pick up to 8 runes and instantly see how your setup might affect
              difficulty and rewards. Then ask for recommendations based on your
              goal: mapping speed, high-value drops, or pushing harder content.
            </p>

            <div className="mt-5 p2-card px-4 py-3 text-sm">
              <span className="font-medium">On this page:</span>{" "}
              <a
                href="#calculator"
                className="p2-link"
              >
                Calculator
              </a>
              {" · "}
              <a
                href="#mechanics"
                className="p2-link"
              >
                Mechanics
              </a>
              {" · "}
              <a
                href="#faq"
                className="p2-link"
              >
                FAQ
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/guides/poe2-runes-of-aldur-explained"
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900/30"
              >
                Read: Runes explained →
              </Link>
              <Link
                href="/db/runes"
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900/30"
              >
                Browse rune database →
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="p2-card px-4 py-3">
                <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  1) Choose runes
                </div>
                <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Search, filter, and build a loadout (up to 8 slots).
                </div>
              </div>
              <div className="p2-card px-4 py-3">
                <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  2) Review impact
                </div>
                <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  See effects, rewards, and an estimated difficulty profile.
                </div>
              </div>
              <div className="p2-card px-4 py-3">
                <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  3) Get recommendations
                </div>
                <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  Ask for “best setup” or “improvements” for your goal.
                </div>
              </div>
            </div>
          </div>
        </section>

        {meta ? (
          <div className="mt-6">
            <DataStatusCallout meta={meta} title="Rune dataset" />
          </div>
        ) : null}

        <section id="calculator" aria-label="Rune combinations calculator">
          <Suspense fallback={
            <div className="p2-section flex h-64 items-center justify-center">
              <div className="text-zinc-500">Loading calculator...</div>
            </div>
          }>
            <RuneCalculatorWidget runes={runes} />
          </Suspense>
        </section>

        <section id="mechanics" className="mt-8 p2-section p-8">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Advanced Rune Synergy Logic
          </h2>
          <div className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            Our tool uses a multi-factor algorithm to help you build the best Ezomyte Remnants. It doesn&apos;t just look at reward text; it analyzes how runes interact based on several hidden and explicit factors:
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                1) Explicit Synergies & Anti-synergies
              </h3>
              <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                Certain runes are designed to work together (e.g., Searing Runes and Ember rewards). Our algorithm identifies these direct links and prioritizes them in recommendations. Conversely, it warns against combinations that increase difficulty without complementary rewards.
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                2) Slot Cost Management
              </h3>
              <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                Most runes cost 1 slot, but powerful Masterwork runes may cost more. The calculator tracks your total consumption to ensure your planned setup fits within the standard 8-slot limit of high-tier Remnants.
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                3) Tag Focus & Synergy Themes
              </h3>
              <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                When runes share tags (e.g., Loot + Currency), they point toward a coherent farming strategy. This tool highlights your &quot;Tag focus&quot; so you can spot themes quickly instead of picking modifiers randomly.
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                4) Difficulty Rating vs. Greed
              </h3>
              <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                Difficulty ratings (1-5) stack. Stacking too many high-rating runes will &quot;brick&quot; your encounter. A good strategy is to start with a stable setup (avg rating &lt; 2), then swap in high-value runes one by one.
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              5) A simple way to build better combos
            </h3>
            <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              Use this three-step loop to optimize your Ezomyte Remnants:
              <ol className="mt-2 list-decimal pl-6">
                <li>Pick a goal (Mapping / Loot / Challenge).</li>
                <li>Select a baseline set of runes you can clear reliably.</li>
                <li>Use &quot;Improve my setup&quot; to find higher-value alternatives for your current build.</li>
              </ol>
            </div>
          </div>
          <div className="mt-6 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            Want a deeper breakdown? Read{" "}
            <Link
              href="/guides/poe2-runes-of-aldur-explained"
              className="p2-link"
            >
              Runes of Aldur explained
            </Link>
            .
          </div>
        </section>

        <section id="faq" className="mt-8 p2-section p-8">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            FAQ
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                How many rune slots can I use?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                The calculator supports up to 8 runes, matching the typical
                endgame slot count. If your character has fewer slots, treat the
                tool as a planning sandbox.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                What does “goal” change?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Goal changes how recommendations are ranked. “Mapping” favors
                smoother difficulty, “Loot” favors reward-oriented patterns, and
                “Challenge” leans into harder setups.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Do rune difficulty modifiers stack?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Generally yes—stacking multiple “harder” runes can quickly push
                content into risky territory. Use the difficulty summary as a
                quick sanity check before committing.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Why do I see “No recommendations” sometimes?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Recommendations depend on the rune dataset. If the site is still
                updating for a patch, some pages may temporarily show limited or
                no results until the data is refreshed.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                Is the highest score always the best choice?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Not always. Scores are a shortcut for comparing options, but
                your build and content target matter. If a setup feels too
                spiky, switch to a safer goal or lower the difficulty profile.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

