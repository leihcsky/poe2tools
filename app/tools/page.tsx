import Link from "next/link";

export const dynamic = "force-static";

export default function ToolsIndexPage() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Tools
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Quick calculators and planners for Path of Exile 2. Most pages are
            statically rendered, with interactive widgets running as client-side
            islands.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/tools/rune-combinations"
            className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
          >
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Rune Combination Calculator
              <span className="ml-2 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                {patchVersion}
              </span>
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Explore high-synergy rune pairings and shortlists.
            </div>
          </Link>

          <Link
            href="/tools/runic-ward-calc"
            className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
          >
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Runic Ward Calculator
              <span className="ml-2 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                {patchVersion}
              </span>
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Estimate total Ward, recovery, and survivability.
            </div>
          </Link>

          <Link
            href="/tools/verisium-craft"
            className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
          >
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Verisium Crafting Simulator
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Compare crafting paths and expected cost.
            </div>
          </Link>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Atlas Planner
            </div>
            <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Visual Atlas tree planning with presets.
            </div>
            <div className="mt-3 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
              Coming soon
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

