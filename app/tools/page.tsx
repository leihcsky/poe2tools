import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.com";

export const metadata: Metadata = {
  title: "POE2 Tools — Calculators & Planners for Path of Exile 2",
  description:
    "Free POE2 calculators: Rune Combination finder, Runic Ward planner, crafting simulator, and Atlas tree builder for Path of Exile 2.",
  alternates: { canonical: `${BASE_URL}/tools` },
  openGraph: {
    title: "POE2 Tools — Calculators & Planners",
    description:
      "Free POE2 calculators: Rune Combination finder, Runic Ward planner, crafting simulator, and Atlas tree builder.",
    url: `${BASE_URL}/tools`,
    siteName: "POE2Tools",
    type: "website",
  },
};

export default function ToolsIndexPage() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            POE2 Tools
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Free calculators and planners for Path of Exile 2. Pick a tool below to start optimizing your build, gear, or Atlas strategy.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/tools/rune-combinations"
            className="p2-nav-link rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
          >
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Rune Combination Calculator
              <span className="ml-2 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                {patchVersion}
              </span>
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Find high-synergy Runes of Aldur pairings for mapping, loot, and challenge content.
            </div>
          </Link>

          <Link
            href="/tools/runic-ward-calc"
            className="p2-nav-link rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
          >
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Runic Ward Calculator
              <span className="ml-2 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                {patchVersion}
              </span>
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Estimate total Ward, EHP, and recovery time for your Runic Ward build.
            </div>
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 opacity-75">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Verisium Crafting Simulator
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Compare crafting paths, expected currency cost, and best outcomes.
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Coming soon
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 opacity-75">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Atlas Planner
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Visual Atlas tree planning with presets for different farming strategies.
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Coming soon
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

