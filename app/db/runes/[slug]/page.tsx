import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 60 * 60;
export const dynamicParams = false;

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

function toSlug(rune: RuneRecord): string | null {
  const s = typeof rune.slug === "string" ? rune.slug : null;
  if (s && s.trim()) return s.trim();
  const id = typeof rune.id === "string" ? rune.id : null;
  if (id && id.trim()) return id.trim();
  return null;
}

function difficultySummary(
  rating: number | undefined,
): { label: string; detail: string; badgeClass: string } {
  const r = typeof rating === "number" ? rating : 1;

  if (r <= 1) {
    return {
      label: "Easier",
      detail:
        "Below-baseline difficulty. Good for learning the mechanic or stabilizing early runs.",
      badgeClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200",
    };
  }

  if (r <= 2) {
    return {
      label: "Mild",
      detail:
        "Small difficulty increase. Usually safe for most builds unless the effect targets your weakness.",
      badgeClass:
        "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200",
    };
  }

  if (r <= 3) {
    return {
      label: "Moderate",
      detail:
        "Noticeable difficulty increase. Pair with stability runes or only stack if your build is comfortable.",
      badgeClass:
        "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200",
    };
  }

  if (r <= 4) {
    return {
      label: "Hard",
      detail:
        "High-risk profile. Avoid stacking with other hard runes unless you’re intentionally pushing challenge.",
      badgeClass:
        "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200",
    };
  }

  return {
    label: "Extreme",
    detail:
      "Extreme difficulty scaling. Recommended only for geared builds or dedicated challenge setups.",
    badgeClass:
      "border-red-600 bg-red-600/10 text-red-600 dark:border-red-500 dark:bg-red-500/10 dark:text-red-400",
  };
}

function runeIconLabel(name: string | undefined, slug: string): string {
  const base = (name ?? slug).trim();
  for (const ch of base) {
    const upper = ch.toUpperCase();
    if (upper >= "A" && upper <= "Z") return upper;
  }
  return "R";
}

function toTier(tier: number | undefined): number | null {
  return typeof tier === "number" && Number.isFinite(tier) ? tier : null;
}

function uniqueTags(tags: string[] | undefined): string[] {
  const arr = Array.isArray(tags) ? tags.filter((t) => typeof t === "string") : [];
  const cleaned = arr.map((t) => t.trim()).filter(Boolean);
  return Array.from(new Set(cleaned));
}

function scoreRelated(a: RuneRecord, b: RuneRecord): { score: number; shared: string[] } {
  const at = new Set(uniqueTags(a.tags));
  const bt = new Set(uniqueTags(b.tags));
  const shared = Array.from(at).filter((t) => bt.has(t));

  const rewardish = new Set(["loot", "currency", "drops", "economy", "crafting"]);
  const mappingish = new Set(["mapping", "density", "speed", "consistency"]);
  const challengeish = new Set(["challenge", "boss", "endgame", "risk"]);
  const defenseish = new Set(["defense", "ward", "control"]);

  let score = shared.length * 10;

  // Synergies boost score
  if (a.synergies.includes(b.id) || b.synergies.includes(a.id)) score += 25;
  if (a.anti_synergies.includes(b.id) || b.anti_synergies.includes(a.id)) score -= 20;

  const hasAny = (tags: Set<string>, group: Set<string>) => {
    for (const x of group) if (tags.has(x)) return true;
    return false;
  };

  const aReward = hasAny(at, rewardish);
  const aMap = hasAny(at, mappingish);
  const aChal = hasAny(at, challengeish);
  const aDef = hasAny(at, defenseish);

  const bReward = hasAny(bt, rewardish);
  const bMap = hasAny(bt, mappingish);
  const bChal = hasAny(bt, challengeish);
  const bDef = hasAny(bt, defenseish);

  if ((aMap && bReward) || (aReward && bMap)) score += 4;
  if ((aChal && bReward) || (aReward && bChal)) score += 3;
  if ((aChal && bDef) || (aDef && bChal)) score += 2;
  if ((aMap && bDef) || (aDef && bMap)) score += 2;

  const ar = a.monster_modifier.difficulty_rating;
  const br = b.monster_modifier.difficulty_rating;
  const diffGap = Math.abs(ar - br);
  score += Math.max(0, 5 - diffGap);

  return { score, shared };
}

async function getRuneBySlug(slug: string): Promise<{
  rune: RuneRecord | null;
  runes: RuneRecord[];
}> {
  const runes = await loadRunes();
  const rune =
    runes.find((r) => toSlug(r) === slug) ??
    runes.find((r) => (r.id ?? "").toString() === slug) ??
    null;
  return { rune, runes };
}

export async function generateStaticParams() {
  const runes = await loadRunes();
  const slugs = runes.map(toSlug).filter((v): v is string => Boolean(v));
  const unique = Array.from(new Set(slugs));
  return unique.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { rune } = await getRuneBySlug(slug);
  if (!rune) return {};

  const name = rune.name ?? slug;
  const title = `${name} — POE2 Rune Effect, Reward & Synergies`;
  const descriptionParts = [
    `${name} in Path of Exile 2:`,
    rune.monster_modifier.description ? `Effect — ${rune.monster_modifier.description}.` : null,
    rune.reward.description ? `Reward — ${rune.reward.description}.` : null,
    `Difficulty ${rune.monster_modifier.difficulty_rating}/5, ${rune.slot_cost} slot${rune.slot_cost > 1 ? "s" : ""}.`,
  ].filter(Boolean);
  const description = descriptionParts.join(" ").slice(0, 160);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.com";

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: `${BASE_URL}/db/runes/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/db/runes/${slug}`,
      siteName: "POE2Tools",
      images: [
        {
          url: "/images/guides/poe2-runes-of-aldur-explained.svg",
          width: 1200,
          height: 630,
          alt: `${name} — POE2 Rune`,
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

export default async function RunePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { rune, runes } = await getRuneBySlug(slug);
  if (!rune) notFound();

  const title = rune.name ?? slug;
  const tags = uniqueTags(rune.tags);
  const tier = toTier(rune.tier);
  const diff = rune.monster_modifier.difficulty_rating;
  const diffInfo = difficultySummary(diff);
  const iconLabel = runeIconLabel(rune.name, slug);

  const related = runes
    .filter((r) => toSlug(r) && toSlug(r) !== slug)
    .map((r) => {
      const s = scoreRelated(rune, r);
      return { rune: r, score: s.score, shared: s.shared };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((x) => ({
      slug: toSlug(x.rune)!,
      name: x.rune.name ?? toSlug(x.rune)!,
      tier: toTier(x.rune.tier),
      shared: x.shared,
    }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: title,
    headline: `${title} — POE2 Rune of Aldur`,
    description: rune.monster_modifier.description,
    keywords: [title, "POE2", "Rune of Aldur", ...tags].join(", "),
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="w-full max-w-4xl mx-auto flex-1 px-6 py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <Link href="/" className="p2-link">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/db" className="p2-link">
            Database
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/db/runes" className="p2-link">
            Runes
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-zinc-700 dark:text-zinc-300">{title}</span>
        </nav>

        <section className="p2-section overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold text-white/90">
                  <span className="sr-only">Rune icon</span>
                  {iconLabel}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                    <span>Rune</span>
                    {rune.masterwork && (
                      <span className="rounded bg-violet-600/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                        Masterwork
                      </span>
                    )}
                  </div>
                  <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                    {title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {tier !== null ? (
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-medium text-white/80">
                        Tier {tier}
                      </span>
                    ) : null}
                    <span
                      className={[
                        "inline-flex items-center rounded-full border px-2.5 py-1 font-medium",
                        diffInfo.badgeClass,
                      ].join(" ")}
                    >
                      Difficulty Rating {diff}/5 · {diffInfo.label}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-medium text-white/80">
                      {rune.slot_cost} Slot{rune.slot_cost > 1 ? "s" : ""}
                    </span>
                    <Link href="/tools/rune-combinations" className="p2-link">
                      Open combinations tool →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {rune.notes ? (
              <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
                {rune.notes}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="p2-chip bg-zinc-800 text-zinc-200">
                {rune.category} / {rune.sub_type}
              </span>
              {tags.map((t) => (
                <span key={t} className="p2-chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="p2-section p-6 lg:col-span-2">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Monster Modifier & Reward
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="p2-card p-4">
                <div className="text-xs font-medium text-white/70 uppercase tracking-wider">Monster Modifier</div>
                <div className="mt-2 text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                  {rune.monster_modifier.description}
                </div>
              </div>
              <div className="p2-card p-4">
                <div className="text-xs font-medium text-white/70 uppercase tracking-wider">Reward</div>
                <div className="mt-2 text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                  {rune.reward.description}
                </div>
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Type: {rune.reward.reward_type}
                </div>
              </div>
            </div>
          </div>

          <div className="p2-section p-6">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Difficulty impact
            </h2>
            <div className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {diffInfo.detail}
            </div>
            <div className="mt-4 p2-card p-4">
              <div className="text-xs font-medium text-white/70">Tip</div>
              <div className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                If runs feel spiky, remove the highest-difficulty rune first, then
                re-add reward-focused runes one at a time.
              </div>
            </div>
          </div>
        </section>

        {/* Synergies & Anti-synergies */}
        {(rune.synergies.length > 0 || rune.anti_synergies.length > 0) && (
          <section className="mt-8 p2-section p-6">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Synergies & Conflicts
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rune.synergies.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-emerald-500">
                    Synergizes with
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rune.synergies.map((synId) => {
                      const synRune = runes.find((r) => r.id === synId);
                      const synSlug = synRune ? toSlug(synRune) : null;
                      const synName = synRune?.name ?? synId.replace(/_/g, " ");
                      return synSlug ? (
                        <Link
                          key={synId}
                          href={`/db/runes/${synSlug}`}
                          className="p2-chip transition-colors hover:bg-emerald-500/10"
                        >
                          {synName}
                        </Link>
                      ) : (
                        <span key={synId} className="p2-chip">{synName}</span>
                      );
                    })}
                  </div>
                </div>
              )}
              {rune.anti_synergies.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-red-400">
                    Conflicts with
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {rune.anti_synergies.map((antiId) => {
                      const antiRune = runes.find((r) => r.id === antiId);
                      const antiSlug = antiRune ? toSlug(antiRune) : null;
                      const antiName = antiRune?.name ?? antiId.replace(/_/g, " ");
                      return antiSlug ? (
                        <Link
                          key={antiId}
                          href={`/db/runes/${antiSlug}`}
                          className="p2-chip transition-colors hover:bg-red-500/10"
                        >
                          {antiName}
                        </Link>
                      ) : (
                        <span key={antiId} className="p2-chip">{antiName}</span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="p2-section p-6">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Recommended pairings
            </h2>
            <div className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              These are suggested based on shared tags, synergies, and compatible difficulty.
            </div>

            {related.length === 0 ? (
              <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                No related runes found yet.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {related.slice(0, 4).map((r) => (
                  <Link
                    key={r.slug}
                    href={`/db/runes/${r.slug}`}
                    className="p2-card p-4 transition-colors hover:bg-white/6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {r.name}
                      </div>
                      {typeof r.tier === "number" ? (
                        <span className="text-xs text-white/70">Tier {r.tier}</span>
                      ) : null}
                    </div>
                    {r.shared.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.shared.slice(0, 3).map((t) => (
                          <span key={t} className="p2-chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-white/70">Related</div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="p2-section p-6">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Acquisition & Specs
            </h2>
            <div className="mt-4 p2-card p-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-white/40">Source</dt>
                  <dd className="mt-0.5 font-medium">{rune.source.replace(/_/g, " ")}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-white/40">Min Area Level</dt>
                  <dd className="mt-0.5 font-medium">{rune.area_level_min}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-white/40">Usage Tips</dt>
                  <dd className="mt-1 space-y-1">
                    <p>• Costs {rune.slot_cost} slot{rune.slot_cost > 1 ? "s" : ""} on Remnants.</p>
                    {rune.masterwork && <p>• Masterwork category (unique endgame scaling).</p>}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {related.length > 4 ? (
          <section className="mt-8 p2-section p-6">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Related runes
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {related.slice(4).map((r) => (
                <Link
                  key={r.slug}
                  href={`/db/runes/${r.slug}`}
                  className="p2-card p-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white/6 dark:text-zinc-50"
                >
                  {r.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
