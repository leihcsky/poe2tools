import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import RuneListClient from "@/components/db/RuneListClient";

export const runtime = "nodejs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.top";

export const metadata: Metadata = {
  title: "POE2 Rune Database — All Runes of Aldur Effects & Stats",
  description:
    "Complete POE2 rune reference: browse every Rune of Aldur with difficulty ratings, rewards, slot costs, tags, and synergies. Updated for Patch 0.5.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE_URL}/db/runes` },
  openGraph: {
    title: "POE2 Rune Database — All Runes of Aldur",
    description:
      "Browse every Rune of Aldur with difficulty, rewards, and synergies. Free reference for Path of Exile 2.",
    url: `${BASE_URL}/db/runes`,
    siteName: "POE2Tools",
    type: "website",
  },
};

export type RuneRecord = {
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

export default async function RunesIndexPage() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";
  const runes = await loadRunes();

  const categories = Array.from(new Set(runes.map((r) => r.category).filter(Boolean))).sort();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <Link href="/" className="p2-link">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/db/runes" className="p2-link">Database</Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-700 dark:text-zinc-300">Runes</span>
        </nav>

        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl text-center">
            POE2 Rune Database
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            Path of Exile 2 · Runes of Aldur Reference
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-zinc-600 dark:text-zinc-400 text-center">
            Browse all Runes of Aldur with their monster modifiers, rewards, difficulty ratings,
            and recommended pairings. Click any rune for full details and synergy analysis.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
              Patch {patchVersion} · {runes.length} runes
            </span>
          </div>
        </section>

        {/* Preview notice */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-50/80 px-4 py-1.5 text-xs font-medium text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Preview data — rune stats will be updated with official values once Patch 0.5 launches
          </div>
        </div>

        <section className="mt-8">
          {runes.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Rune data will appear here once available. Check back after Patch 0.5 launches.
              </p>
            </div>
          ) : (
            <RuneListClient runes={runes} categories={categories} />
          )}
        </section>
      </main>
    </div>
  );
}
