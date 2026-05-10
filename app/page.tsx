import Link from "next/link";
import type { Metadata } from "next";
import { listGuideSlugs, readGuide } from "@/lib/guides";

export const runtime = "nodejs";
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "POE2 Tools: Rune Combos, Ward Calculator & Guides",
  description:
    "Free POE2 tools for Patch 0.5: rune combination calculator, Runic Ward planner, and a patch-updated rune database with practical guides.",
  alternates: {
    canonical: "/",
  },
};

function categoryLabel(cat: string): string {
  switch (cat) {
    case "patch":
      return "Patch";
    case "beginner":
      return "Beginner";
    case "builds":
      return "Builds";
    case "economy":
      return "Economy";
    case "endgame":
      return "Endgame";
    default:
      return "Guide";
  }
}

function categoryPillClass(cat: string): string {
  switch (cat) {
    case "patch":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200";
    case "beginner":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200";
    case "builds":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/30 dark:text-violet-200";
    case "economy":
      return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/30 dark:text-cyan-200";
    case "endgame":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200";
    default:
      return "border-white/10 bg-white/5 text-white/85";
  }
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(d);
}

export default async function Home() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";
  const patchName = process.env.NEXT_PUBLIC_PATCH_NAME ?? "Return of the Ancients";
  const guideSlugs = await listGuideSlugs();
  const guideDocs = await Promise.all(guideSlugs.map((s) => readGuide(s)));
  const latest = guideDocs
    .filter(Boolean)
    .map((d) => d!)
    .slice()
    .sort((a, b) => {
      const da = new Date(a.frontmatter.date).getTime();
      const db = new Date(b.frontmatter.date).getTime();
      return db - da;
    })
    .slice(0, 3);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <div className="p2-section overflow-hidden">
          <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-6 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            <span>
              Patch {patchVersion} “{patchName}” launches May 29 PDT — data
              updates as patch notes drop.
            </span>
          </div>

          <section className="bg-zinc-50 px-6 py-10 dark:bg-zinc-900/30">
            <div className="text-xs font-medium uppercase tracking-wider text-white/70">
              Path of Exile 2 · Toolkit
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              Find the strongest rune combinations.
              <br className="hidden sm:block" />
              Know exactly what every point of Ward is worth.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Free online tools plus a patch-updated database to help you make
              better decisions every league.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/rune-combinations"
                className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-5 text-sm font-medium text-white transition-colors hover:from-violet-500 hover:to-cyan-400"
              >
                Rune Combination Calculator
              </Link>
              <Link
                href="/guides/poe2-0-5-what-to-prepare"
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900/30"
              >
                Patch {patchVersion} Patch-Day Checklist
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:gap-6">
              <div>Tools: 3 live</div>
              <div>Runes: 100+</div>
              <div>Patch: May 29 PDT</div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/guides/poe2-runes-of-aldur-explained"
                className="p2-card p-5 transition-colors hover:bg-white/5"
              >
                <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                  Start here
                </div>
                <div className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Runes of Aldur, explained
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Learn the mechanic with a safe decision framework.
                </div>
              </Link>
              <Link
                href="/tools/rune-combinations"
                className="p2-card p-5 transition-colors hover:bg-white/5"
              >
                <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                  Start here
                </div>
                <div className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Build a stable rune set
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Pick a goal and test coherent rune combos fast.
                </div>
              </Link>
              <Link
                href="/tools/runic-ward-calc"
                className="p2-card p-5 transition-colors hover:bg-white/5"
              >
                <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                  Start here
                </div>
                <div className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Tune Runic Ward
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Estimate Ward recovery and survivability tradeoffs.
                </div>
              </Link>
            </div>
          </section>

          <section className="px-6 py-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Popular tools
              </h2>
              <Link
                href="/tools"
                className="p2-link text-sm font-medium"
              >
                All tools →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/tools/rune-combinations"
                className="p2-card p-5 transition-colors hover:bg-white/5"
              >
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Rune Combination Calculator
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Pick your rune set and quickly surface high-synergy combos.
                </div>
                <div className="mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                  {patchVersion} feature
                </div>
              </Link>

              <Link
                href="/tools/runic-ward-calc"
                className="p2-card p-5 transition-colors hover:bg-white/5"
              >
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Runic Ward Calculator
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Input stats and estimate Ward recovery and survivability.
                </div>
                <div className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/85">
                  Defensive tuning
                </div>
              </Link>

              <Link
                href="/tools/verisium-craft"
                className="p2-card p-5 transition-colors hover:bg-white/5"
              >
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Verisium Crafting Simulator
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Compare crafting routes and expected cost per outcome.
                </div>
                <div className="mt-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                  Crafting
                </div>
              </Link>

              <div className="p2-card p-5 text-left">
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Atlas Planner
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Visual planning for the endgame Atlas tree.
                </div>
                <div className="mt-3 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                  Coming soon
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800 p2-divider">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Latest guides
              </h2>
              <Link
                href="/guides"
                className="p2-link text-sm font-medium"
              >
                All guides →
              </Link>
            </div>

            <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 p2-divider">
              {latest.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="flex items-center gap-3 py-3 transition-colors hover:bg-white/4"
                >
                  <span
                    className={[
                      "inline-flex w-28 items-center justify-center rounded-full border px-3 py-1 text-xs font-medium",
                      categoryPillClass(g.frontmatter.category),
                    ].join(" ")}
                  >
                    {categoryLabel(g.frontmatter.category)}
                  </span>
                  <span className="flex-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
                    {g.frontmatter.title}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatShortDate(g.frontmatter.date)}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800 p2-divider">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Database
              </h2>
              <Link
                href="/db/runes"
                className="p2-link text-sm font-medium"
              >
                Browse all →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/db/runes"
                className="p2-card p-5 text-center transition-colors hover:bg-white/5"
              >
                <div className="text-2xl font-semibold text-emerald-700 dark:text-emerald-200">
                  100+
                </div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Runes
                </div>
              </Link>
              <Link
                href="/db/gems"
                className="p2-card p-5 text-center transition-colors hover:bg-white/5"
              >
                <div className="text-2xl font-semibold text-indigo-700 dark:text-indigo-200">—</div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Skill gems
                </div>
              </Link>
              <Link
                href="/db/uniques"
                className="p2-card p-5 text-center transition-colors hover:bg-white/5"
              >
                <div className="text-2xl font-semibold text-amber-800 dark:text-amber-200">
                  40+
                </div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  Unique items
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
