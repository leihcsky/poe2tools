import RuneCalculatorWidget from "@/components/tools/RuneCalculatorWidget";
import { DataStatusCallout } from "@/components/ui/DataStatus";
import { readDataMeta } from "@/lib/data-meta";

export default async function RuneCombinationsPage() {
  const meta = await readDataMeta("runes.json");

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            POE2 Rune Combinations Calculator — Path of Exile 2 Runes of Aldur
            Guide
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Build better rune setups faster. This tool helps you explore rune
            synergy, compare options, and find strong combinations for your
            goals (mapping speed, loot value, or pushing harder content). The
            page is statically rendered for SEO, while the interactive
            calculator runs as a client-side island and fetches results from a
            lightweight API.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Step 1
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Paste the rune IDs you own (or want to test).
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Step 2
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Generate suggestions and scan the top-scoring pairings.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Step 3
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Iterate: swap a rune, re-run, and lock in your best combo.
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Runes of Aldur can change both what you fight and what you get. In
            practice, “best combinations” are rarely universal — they depend on
            the tags and mechanics your runes amplify, the difficulty modifiers
            you can comfortably handle, and the rewards you care about. This
            calculator focuses on repeatable signals (like shared tags and
            overlapping themes) to surface promising pairings quickly. It’s a
            starting point you can refine with your own build knowledge.
          </div>
        </section>

        {meta ? (
          <div className="mt-6">
            <DataStatusCallout meta={meta} title="Rune dataset" />
          </div>
        ) : null}

        <RuneCalculatorWidget />

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            FAQ
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                How are suggestions calculated?
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Right now we use local JSON data (e.g. tags) to score
                pairings. More shared tags generally means more synergy
                potential, so those combos bubble up first. You can replace the
                scoring logic with a richer rule engine later.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Why does it say there are no suggestions?
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                The tool reads from data/runes.json. If the file is empty, not
                valid JSON, or missing tags/fields needed for scoring, the API
                will return an empty result set.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Is this page static (SSG)?
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Yes. The explanatory content is pre-rendered, and only the
                calculator widget runs on the client and fetches results on
                demand.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                What input format should I use?
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Paste rune IDs separated by commas, spaces, or newlines. Unknown
                IDs will be listed as missing so you can quickly fix typos.
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                Does a higher score always mean “best”?
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Not always. A higher score means stronger tag overlap in the
                current heuristic. You should still sanity-check difficulty and
                rewards for your build and content target.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

