import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import GemListClient from "@/components/db/GemListClient";

export const runtime = "nodejs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.top";

export const metadata: Metadata = {
  title: "POE2 Skill Gems Database — All Active & Support Gems",
  description:
    "Browse every POE2 skill gem: active and support gems with stats, tags, costs, and scaling info. Updated for the latest patch.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE_URL}/db/gems` },
  openGraph: {
    title: "POE2 Skill Gems Database — All Active & Support Gems",
    description:
      "Complete Path of Exile 2 skill gem reference with stats, costs, tags, and per-level scaling.",
    url: `${BASE_URL}/db/gems`,
    siteName: "POE2Tools",
    type: "website",
  },
};

export type GemRecord = {
  id: string;
  slug: string;
  name: string;
  gem_type: "active" | "support";
  tags: string[];
  description: string;
  cost: { resource: "mana" | "spirit"; base_value: number };
  cooldown: number | null;
  cast_time: number | null;
  critical_chance: number | null;
  weapon_requirements: string[];
  attribute_requirements: { int: number; str: number; dex: number };
  max_level: number;
  per_level: { damage_multiplier: number; mana_cost_multiplier: number };
  stat_text: string;
  is_kalguuran: boolean;
  consumes_ward: boolean;
  patch_added: string;
};

type GemsFile = {
  meta?: { patch_version?: string };
  gems?: unknown[];
};

async function loadGems(): Promise<{ gems: GemRecord[]; patchVersion: string }> {
  const filePath = path.join(process.cwd(), "data", "gems.json");
  const raw = await readFile(filePath, "utf8").catch(() => "");
  const trimmed = raw.trim();
  if (!trimmed) return { gems: [], patchVersion: "0.4" };

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      const file = parsed as GemsFile;
      const gems = Array.isArray(file.gems) ? (file.gems as GemRecord[]) : [];
      const patchVersion = file.meta?.patch_version ?? "0.4";
      return { gems, patchVersion };
    }
    return { gems: [], patchVersion: "0.4" };
  } catch {
    return { gems: [], patchVersion: "0.4" };
  }
}

export default async function GemsIndexPage() {
  const { gems, patchVersion } = await loadGems();

  const allTags = Array.from(
    new Set(gems.flatMap((g) => g.tags).filter(Boolean)),
  ).sort();

  return (
    <div className="flex flex-col flex-1">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-white/50"
        >
          <Link href="/" className="p2-link">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/db/runes" className="p2-link">Database</Link>
          <span aria-hidden="true">/</span>
          <span className="text-white/80">Gems</span>
        </nav>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-3xl font-bold tracking-tight text-white/95 sm:text-4xl text-center">
            POE2 Skill Gems Database
          </h1>
          <p className="mt-2 text-sm text-white/50 text-center">
            Path of Exile 2 · Active & Support Gem Reference
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-white/60 text-center">
            Browse all skill gems with their stats, costs, tags, and per-level scaling info.
            Click any gem for full details including stat text and attribute requirements.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-emerald-900/40 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-200">
              Patch {patchVersion} · {gems.length} gems
            </span>
          </div>
        </section>

        {/* Preview notice */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/40 bg-amber-950/30 px-4 py-1.5 text-xs font-medium text-amber-300">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Patch 0.5 new skill gems will be added once the update goes live
          </div>
        </div>

        <section className="mt-8">
          {gems.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-white/60">
                Gem data will appear here once available. Check back soon.
              </p>
            </div>
          ) : (
            <GemListClient gems={gems} tags={allTags} />
          )}
        </section>
      </main>
    </div>
  );
}
