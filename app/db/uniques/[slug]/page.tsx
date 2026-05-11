import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamicParams = false;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.top";

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
  lore: string;
  drop_sources: { type: string; name: string }[];
  use_cases: string[];
  tags: string[];
  image_url: string;
  patch_added: string;
};

type UniquesFile = {
  meta?: { patch_version?: string; status?: string };
  items?: unknown[];
};

async function loadUniques(): Promise<UniqueItem[]> {
  const filePath = path.join(process.cwd(), "data", "uniques.json");
  const raw = await readFile(filePath, "utf8").catch(() => "");
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw.trim()) as UniquesFile;
    return Array.isArray(parsed.items) ? (parsed.items as UniqueItem[]) : [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const items = await loadUniques();
  return Array.from(new Set(items.map((i) => i.slug).filter(Boolean))).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const items = await loadUniques();
  const item = items.find((i) => i.slug === slug);
  if (!item) return {};

  const title = `${item.name} (${item.base_item}) — POE2 Unique Item Stats & Drop Info`;
  const desc =
    `${item.name} — ${item.item_class} unique in Path of Exile 2. Full mod list, drop sources, and build tips.`.slice(
      0,
      160,
    );

  return {
    title,
    description: desc,
    robots: { index: false, follow: true },
    alternates: { canonical: `${BASE_URL}/db/uniques/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${BASE_URL}/db/uniques/${slug}`,
      siteName: "POE2Tools",
      type: "article",
    },
    twitter: { title, description: desc, card: "summary_large_image" },
  };
}

/* ── helpers ── */

const classColor: Record<string, string> = {
  Belt: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Body Armour": "border-red-500/30 bg-red-500/10 text-red-300",
  Shield: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Amulet: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  Ring: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  Helmet: "border-green-500/30 bg-green-500/10 text-green-300",
  Boots: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Gloves: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  Weapon: "border-red-500/30 bg-red-500/10 text-red-300",
  Jewel: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

function badgeClass(cls: string) {
  return classColor[cls] ?? "border-white/20 bg-white/5 text-white/70";
}

function dropIcon(type: string) {
  switch (type) {
    case "boss":
      return "⚔️";
    case "div_card":
      return "🃏";
    default:
      return "🎲";
  }
}

function dropLabel(type: string) {
  switch (type) {
    case "boss":
      return "Boss Drop";
    case "div_card":
      return "Divination Card";
    default:
      return "World Drop";
  }
}

function modRangeStr(mod: Mod): string {
  if (mod.min !== null && mod.max !== null && mod.min !== mod.max) {
    return `[${mod.min}–${mod.max}]`;
  }
  return "";
}

function getRelated(current: UniqueItem, all: UniqueItem[]) {
  return all
    .filter((i) => i.slug !== current.slug)
    .map((i) => {
      let score = 0;
      if (i.item_class === current.item_class) score += 3;
      const shared = i.tags.filter((t) => current.tags.includes(t));
      score += shared.length;
      return { item: i, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.item);
}

/* ── page ── */

export default async function UniqueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const items = await loadUniques();
  const item = items.find((i) => i.slug === slug);
  if (!item) notFound();

  const related = getRelated(item, items);
  const hasImplicits = item.implicit_mods.length > 0;
  const hasExplicits = item.explicit_mods.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: item.name,
    headline: `${item.name} — POE2 Unique ${item.item_class}`,
    description: `${item.name} unique ${item.item_class.toLowerCase()} in Path of Exile 2.`,
    keywords: [item.name, "POE2", "Unique", item.item_class, "Path of Exile 2"].join(", "),
  };

  return (
    <div className="flex flex-col flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="w-full max-w-4xl mx-auto flex-1 px-6 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-white/50">
          <Link href="/" className="p2-link">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/db/uniques" className="p2-link">Unique Items</Link>
          <span aria-hidden>/</span>
          <span className="truncate text-white/80">{item.name}</span>
        </nav>

        {/* ── Header ── */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                  <span>Unique {item.item_class}</span>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${badgeClass(item.item_class)}`}>
                    {item.item_class}
                  </span>
                </div>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#F2BF43] sm:text-4xl">
                  {item.name}
                </h1>
                <p className="mt-1 text-sm text-white/50">{item.base_item} · Requires Level {item.required_level}</p>
              </div>
            </div>

            {item.flavour_text && (
              <blockquote className="mt-6 border-l-2 border-[#F2BF43]/30 pl-4 italic text-sm leading-relaxed text-white/50">
                {item.flavour_text}
              </blockquote>
            )}
          </div>
        </section>

        {/* ── Modifiers ── */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-base font-semibold text-white/95">Modifiers</h2>

          {hasImplicits && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Implicit</h3>
              <div className="mt-2 rounded-xl border border-white/8 bg-black/20 p-4 space-y-1.5">
                {item.implicit_mods.map((mod, i) => (
                  <div key={i} className="flex items-baseline gap-2 text-sm">
                    <span className="text-blue-300 font-mono">{mod.text}</span>
                    {modRangeStr(mod) && (
                      <span className="text-[10px] text-white/30">{modRangeStr(mod)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasExplicits && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">Explicit</h3>
              <div className="mt-2 rounded-xl border border-white/8 bg-black/20 p-4 space-y-1.5">
                {item.explicit_mods.map((mod, i) => (
                  <div key={i} className="flex items-baseline gap-2 text-sm">
                    <span className="text-[#F2BF43] font-mono">{mod.text}</span>
                    {modRangeStr(mod) && (
                      <span className="text-[10px] text-white/30">{modRangeStr(mod)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasImplicits && !hasExplicits && (
            <p className="mt-4 text-sm text-white/50">Modifier data will be available once Patch 0.5 goes live.</p>
          )}
        </section>

        {/* ── Quick Stats ── */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Item Class</div>
            <div className="mt-1 text-sm font-medium text-white/90">{item.item_class}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Base Type</div>
            <div className="mt-1 text-sm font-medium text-white/90">{item.base_item}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Required Level</div>
            <div className="mt-1 text-sm font-medium text-white/90">{item.required_level}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Total Mods</div>
            <div className="mt-1 text-sm font-medium text-white/90">{item.implicit_mods.length + item.explicit_mods.length}</div>
          </div>
        </section>

        {/* ── Use Cases / Build Recommendations ── */}
        {item.use_cases && item.use_cases.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-base font-semibold text-white/95">Use Cases & Build Recommendations</h2>
            <p className="mt-1 text-xs text-white/40">When and why to use {item.name} in your build</p>
            <ul className="mt-4 space-y-3">
              {item.use_cases.map((uc, i) => (
                <li key={i} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
                  <span className="mt-0.5 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#F2BF43]/15 text-[10px] font-bold text-[#F2BF43]">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-white/70">{uc}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Drop Sources / Acquisition ── */}
        {item.drop_sources && item.drop_sources.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-base font-semibold text-white/95">How to Obtain</h2>
            <p className="mt-1 text-xs text-white/40">Known drop sources and acquisition methods</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {item.drop_sources.map((ds, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
                  <span className="text-lg" aria-hidden>{dropIcon(ds.type)}</span>
                  <div>
                    <div className="text-sm font-semibold text-white/90">{ds.name}</div>
                    <div className="mt-0.5 text-xs text-white/50">{dropLabel(ds.type)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Modifier Analysis ── */}
        {hasExplicits && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-base font-semibold text-white/95">Modifier Breakdown</h2>
            <p className="mt-1 text-xs text-white/40">Roll ranges and mod types at a glance</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-[10px] font-bold uppercase tracking-wider text-white/40">
                    <th className="pb-2 pr-4">Modifier</th>
                    <th className="pb-2 pr-4 text-center">Min</th>
                    <th className="pb-2 pr-4 text-center">Max</th>
                    <th className="pb-2 text-center">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[...item.implicit_mods, ...item.explicit_mods].map((mod, i) => (
                    <tr key={i} className="text-white/70">
                      <td className="py-2 pr-4 font-mono text-xs">{mod.text}</td>
                      <td className="py-2 pr-4 text-center text-xs">{mod.min ?? "—"}</td>
                      <td className="py-2 pr-4 text-center text-xs">{mod.max ?? "—"}</td>
                      <td className="py-2 text-center">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/50">
                          {mod.type.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Tags ── */}
        {item.tags.length > 0 && (
          <section className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Tags:</span>
            {item.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-white/60">
                {t}
              </span>
            ))}
          </section>
        )}

        {/* ── Related Uniques ── */}
        {related.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-base font-semibold text-white/95">Related Uniques</h2>
            <p className="mt-1 text-xs text-white/40">Similar items by slot or tags</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/db/uniques/${r.slug}`}
                  className="p2-nav-link flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05] hover:border-[#F2BF43]/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#F2BF43]">{r.name}</span>
                      <span className={`shrink-0 inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${badgeClass(r.item_class)}`}>
                        {r.item_class}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-white/40">{r.base_item} · Lv.{r.required_level}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Cross-promote ── */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/db/uniques"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-[#F2BF43]/40 hover:text-[#F2BF43]"
          >
            ← Back to Uniques Database
          </Link>
          <Link
            href="/db/gems"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-[#F2BF43]/40 hover:text-[#F2BF43]"
          >
            Skill Gems Database →
          </Link>
        </div>
      </main>
    </div>
  );
}
