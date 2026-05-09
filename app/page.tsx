import Link from "next/link";

export default function Home() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";
  const patchName = process.env.NEXT_PUBLIC_PATCH_NAME ?? "Return of the Ancients";

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-6 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              Patch {patchVersion} “{patchName}” data is ready.
            </span>
          </div>

          <section className="bg-zinc-50 px-6 py-10 dark:bg-zinc-900/30">
            <div className="text-xs font-medium uppercase tracking-wider text-blue-700 dark:text-blue-300">
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
                className="inline-flex h-10 items-center justify-center rounded-full bg-blue-700 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-800"
              >
                Rune Combination Calculator
              </Link>
              <Link
                href="/guides"
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900/30"
              >
                Patch {patchVersion} Beginner Guide
              </Link>
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row sm:gap-6">
              <div>Tools: 4</div>
              <div>Runes: 100+</div>
              <div>Updated every patch</div>
            </div>
          </section>

          <section className="px-6 py-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Popular tools
              </h2>
              <Link
                href="/tools"
                className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300"
              >
                All tools →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/tools/rune-combinations"
                className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
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
                className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
              >
                <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Runic Ward Calculator
                </div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Input stats and estimate Ward recovery and survivability.
                </div>
                <div className="mt-3 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                  Defensive tuning
                </div>
              </Link>

              <Link
                href="/tools/verisium-craft"
                className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
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

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-left dark:border-zinc-800 dark:bg-zinc-950">
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

          <section className="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Latest guides
              </h2>
              <Link
                href="/guides"
                className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300"
              >
                All guides →
              </Link>
            </div>

            <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
              <Link
                href="/guides"
                className="flex items-center gap-3 py-3 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <span className="inline-flex w-28 items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
                  Patch notes
                </span>
                <span className="flex-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  Patch {patchVersion} overview: what changed in {patchName}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  May 21
                </span>
              </Link>
              <Link
                href="/guides"
                className="flex items-center gap-3 py-3 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <span className="inline-flex w-28 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                  Beginner
                </span>
                <span className="flex-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  A complete {patchVersion} starter guide: from character to
                  endgame
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  May 10
                </span>
              </Link>
              <Link
                href="/guides"
                className="flex items-center gap-3 py-3 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <span className="inline-flex w-28 items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                  Builds
                </span>
                <span className="flex-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  League-start build picks for {patchVersion}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  May 22
                </span>
              </Link>
            </div>
          </section>

          <section className="border-t border-zinc-200 px-6 py-8 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Database
              </h2>
              <Link
                href="/db/runes"
                className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300"
              >
                Browse all →
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/db/runes"
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-center transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
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
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-center transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
              >
                <div className="text-2xl font-semibold text-indigo-700 dark:text-indigo-200">
                  17+
                </div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  New gems
                </div>
              </Link>
              <Link
                href="/db/uniques"
                className="rounded-2xl border border-zinc-200 bg-white p-5 text-center transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/30"
              >
                <div className="text-2xl font-semibold text-amber-800 dark:text-amber-200">
                  30+
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
