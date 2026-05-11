import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import UniqueListClient from "@/components/db/UniqueListClient";

export const runtime = "nodejs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.top";

export const metadata: Metadata = {
  title: "POE2 Unique Items Database — Browse All Unique Equipment",
  description:
    "Complete Path of Exile 2 unique item reference: mods, use cases, drop sources, and build tips for every unique in the game.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${BASE_URL}/db/uniques` },
  openGraph: {
    title: "POE2 Unique Items Database — Browse All Unique Equipment",
    description:
      "Every POE2 unique item with full mod list, acquisition info, and recommended builds.",
    url: `${BASE_URL}/db/uniques`,
    siteName: "POE2Tools",
    type: "website",
  },
};

type Mod = { text: string; min: number | null; max: number | null; type: string };

type UniqueItem = {
  id: string;
  slug: string;
  name: string;
  base_item: string;
  item_class: string;
  required_level: number;
  implicit_mods: Mod[];
  explicit_mods: Mod[];
  flavour_text: string;
  tags: string[];
  use_cases: string[];
  drop_sources: { type: string; name: string }[];
  image_url: string;
  patch_added: string;
};

type UniquesFile = {
  meta?: { patch_version?: string; status?: string };
  items?: unknown[];
};

async function loadUniques(): Promise<{ items: UniqueItem[]; patchVersion: string; status: string }> {
  const filePath = path.join(process.cwd(), "data", "uniques.json");
  const raw = await readFile(filePath, "utf8").catch(() => "");
  if (!raw.trim()) return { items: [], patchVersion: "0.5", status: "placeholder" };
  try {
    const parsed = JSON.parse(raw.trim()) as UniquesFile;
    return {
      items: Array.isArray(parsed.items) ? (parsed.items as UniqueItem[]) : [],
      patchVersion: parsed.meta?.patch_version ?? "0.5",
      status: parsed.meta?.status ?? "placeholder",
    };
  } catch {
    return { items: [], patchVersion: "0.5", status: "placeholder" };
  }
}

export default async function UniquesIndexPage() {
  const { items, patchVersion, status } = await loadUniques();
  const isPlaceholder = status === "placeholder";

  return (
    <div className="flex flex-col flex-1">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-white/50">
          <Link href="/" className="p2-link">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/db/gems" className="p2-link">Database</Link>
          <span aria-hidden>/</span>
          <span className="text-white/80">Unique Items</span>
        </nav>

        {/* Hero */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-3xl font-bold tracking-tight text-white/95 sm:text-4xl text-center">
            POE2 Unique Items Database
          </h1>
          <p className="mt-2 text-sm text-white/50 text-center">
            Path of Exile 2 · Unique Equipment Reference
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-white/60 text-center">
            Browse unique items with full mod lists, drop sources, and build recommendations.
            Click any item for detailed stats, use cases, and acquisition info.
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-emerald-900/40 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-200">
              Patch {patchVersion} · {items.length} uniques
            </span>
          </div>
        </section>

        {/* Placeholder notice */}
        {isPlaceholder && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/40 bg-amber-950/30 px-4 py-1.5 text-xs font-medium text-amber-300">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Sample data — full unique item database will be populated once Patch 0.5 launches
            </div>
          </div>
        )}

        {/* Item list */}
        <section className="mt-8">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-sm text-white/60">
                Unique item data will appear here once available. Check back after Patch 0.5 launches.
              </p>
            </div>
          ) : (
            <UniqueListClient items={items} />
          )}
        </section>
      </main>
    </div>
  );
}
