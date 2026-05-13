import RuneCalculatorWidget from "@/components/tools/RuneCalculatorWidget";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

export const runtime = "nodejs";

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
  const title = "POE2 Rune Combinations Calculator";
  const description =
    "Free POE2 Rune Combinations Calculator — plan Runes of Aldur on Remnants, balance difficulty vs rewards, and get combo suggestions for mapping or loot.";

  return {
    title,
    description,
    // noindex while preview data; flip to indexable when live patch data ships.
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
          alt: "POE2 Rune Combinations Calculator — Runes of Aldur",
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

function firstQueryParam(
  v: string | string[] | undefined,
): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default async function RuneCombinationsPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const runes = await loadRunes();
  const raw =
    props.searchParams != null ? await props.searchParams : {};
  const initialUrlIds = firstQueryParam(raw.ids);
  const initialUrlGoal = firstQueryParam(raw.goal);

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "POE2 Rune Combinations Calculator",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://poe2tools.top/tools/rune-combinations",
    description:
      "POE2 Rune Combinations Calculator for Path of Exile 2: plan Runes of Aldur on Remnants, read difficulty and rewards together, and explore goal-based combo ideas for mapping, loot, or harder content.",
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
          text: "The POE2 Rune Combinations Calculator supports up to eight Runes of Aldur, matching the usual endgame Remnant layout. If your character has fewer slots, treat it as a planning sandbox.",
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
          text: "Recommendations use the rune list in this tool. Right after a big patch, suggestions may be thin or empty for a short time while we refresh everything.",
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
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-8 sm:py-10">
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
            POE2 Rune Combinations Calculator
          </span>
        </nav>

        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
            POE2 Rune Combinations Calculator
          </h1>
          <p className="mx-auto mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Path of Exile 2 · Runes of Aldur on Ezomyte Remnants
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
            Plan up to eight Runes of Aldur on a Remnant, compare monster difficulty against rewards, and get
            goal-based combo suggestions for mapping, loot, or challenge content — your free POE2 rune combinations
            guide and remnant planner.
          </p>

          <nav aria-label="Page sections" className="mt-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm">
            <a href="#calculator" className="p2-link">
              Calculator
            </a>
            <span aria-hidden className="text-zinc-400 dark:text-zinc-600">·</span>
            <a href="#rune-calculator-how-to" className="p2-link">
              How to use
            </a>
            <span aria-hidden className="text-zinc-400 dark:text-zinc-600">·</span>
            <a href="#mechanics" className="p2-link">
              Mechanics
            </a>
            <span aria-hidden className="text-zinc-400 dark:text-zinc-600">·</span>
            <a href="#faq" className="p2-link">
              FAQ
            </a>
            <span aria-hidden className="mx-2 hidden h-4 w-px bg-zinc-300 sm:inline-block dark:bg-zinc-600" />
            <Link href="/guides/poe2-runes-of-aldur-explained" className="p2-link">
              Runes explained
            </Link>
            <span aria-hidden className="text-zinc-400 dark:text-zinc-600">·</span>
            <Link href="/db/runes" className="p2-link">
              Rune database
            </Link>
          </nav>

          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs text-amber-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Preview data — rune stats will match the live game once Patch 0.5 ships.
          </p>
        </header>

        <section id="calculator" aria-label="POE2 Rune Combinations Calculator" className="scroll-mt-28">
          <Suspense
            fallback={
              <div className="p2-section flex h-64 items-center justify-center">
                <div className="text-zinc-500 dark:text-zinc-400">Loading calculator…</div>
              </div>
            }
          >
            <RuneCalculatorWidget
              runes={runes}
              initialUrlIds={initialUrlIds}
              initialUrlGoal={initialUrlGoal}
            />
          </Suspense>
        </section>

        <section
          id="rune-calculator-how-to"
          aria-labelledby="rune-calculator-how-to-heading"
          className="mt-10 scroll-mt-28 p2-section p-6 sm:p-8"
        >
          <h2
            id="rune-calculator-how-to-heading"
            className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
          >
            How to use this POE2 Rune Combinations Calculator
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Three quick habits: set your goal, build or clear your Remnant loadout, then request suggestions from
            either button. You can skip straight to the tool anytime — this section is here when you want the full
            walkthrough.
          </p>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-zinc-700 marker:font-medium dark:text-zinc-300 sm:pl-6">
            <li>Pick a goal (Mapping / Loot / Challenge). It only changes how suggestions are ranked.</li>
            <li>
              Add or remove runes in the Rune Library (up to 8). Empty is fine if you want ideas from scratch.
            </li>
            <li>
              Ask for suggestions from the button beside your goal, or from{" "}
              <span className="font-medium text-zinc-950 dark:text-zinc-50">Get recommendations</span> under Current
              setup — both do the same thing, so use whichever is closer. The top label changes with your loadout:{" "}
              <span className="font-medium text-zinc-950 dark:text-zinc-50">Recommend best setup</span> when nothing is
              selected, and <span className="font-medium text-zinc-950 dark:text-zinc-50">Improve my setup</span> when
              you already have runes.
            </li>
            <li>
              In the Recommendations list, <span className="font-medium text-zinc-950 dark:text-zinc-50">Apply</span>{" "}
              replaces your current selection with that row&apos;s runes (still capped at 8).
            </li>
          </ol>
        </section>

        <section id="mechanics" className="mt-8 scroll-mt-28 p2-section p-8">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Runes of Aldur synergy — behind the POE2 Rune Combinations Calculator
          </h2>
          <div className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            Strong Path of Exile 2 combinations are not only about loot text on each rune — tier pressure, tag
            overlap, and explicit synergies all change how a Remnant feels. The planner weighs those signals together so
            the POE2 Rune Combinations Calculator can surface setups that stay fun to run, not just high numbers on
            paper:
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                1) Explicit Synergies & Anti-synergies
              </h3>
              <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                Certain runes are designed to work together (e.g., Searing Runes and Ember rewards). The planner favors
                those direct links in recommendations and flags mixes where difficulty spikes without a matching payoff.
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
                Difficulty ratings (1–5) stack. Stacking too many high-rating runes will &quot;brick&quot; your encounter. A
                good strategy is to start with a stable setup (avg rating &lt; 2), then swap in high-value runes one by
                one — the same pacing many players follow when reading a POE2 rune tier list before pushing into harder
                combinations.
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

        <section id="faq" className="mt-8 scroll-mt-28 p2-section p-8">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            FAQ
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="p2-card px-4 py-3">
              <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                How many rune slots can I use?
              </h3>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                The POE2 Rune Combinations Calculator supports up to eight Runes of Aldur, matching the usual endgame
                Remnant layout. If your character has fewer slots, treat it as a planning sandbox.
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
                Suggestions are built from the rune list in this tool. Right after a big patch, you may see fewer or
                no rows for a short time while we refresh the list.
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

