import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamicParams = false;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.top";

type GemRecord = {
  id: string;
  slug: string;
  name: string;
  gem_type: "active" | "support";
  tags: string[];
  primary_attribute: string;
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

type GemsFile = { meta?: { patch_version?: string }; gems?: unknown[] };

async function loadGems(): Promise<GemRecord[]> {
  const filePath = path.join(process.cwd(), "data", "gems.json");
  const raw = await readFile(filePath, "utf8").catch(() => "");
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw.trim()) as GemsFile;
    return Array.isArray(parsed.gems) ? (parsed.gems as GemRecord[]) : [];
  } catch {
    return [];
  }
}

function toSlug(gem: GemRecord): string | null {
  return gem.slug?.trim() || gem.id?.trim() || null;
}

async function getGemBySlug(slug: string) {
  const gems = await loadGems();
  const gem = gems.find((g) => toSlug(g) === slug) ?? gems.find((g) => g.id === slug) ?? null;
  return { gem, gems };
}

export async function generateStaticParams() {
  const gems = await loadGems();
  return Array.from(new Set(gems.map(toSlug).filter(Boolean))).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { gem } = await getGemBySlug(slug);
  if (!gem) return {};
  const name = gem.name ?? slug;
  const title = `${name} — Best Supports, Tips & Tier Rating`;
  const desc = `${name} guide: optimal support gem setup, usage tips, alternatives comparison, and meta tier rating for Path of Exile 2.`.slice(0, 160);
  return {
    title,
    description: desc,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE_URL}/db/gems/${slug}` },
    openGraph: { title, description: desc, url: `${BASE_URL}/db/gems/${slug}`, siteName: "POE2Tools", type: "article" },
    twitter: { title, description: desc, card: "summary_large_image" },
  };
}

/* ── Helpers ── */

function gemTypeBadgeClass(type: string) {
  return type === "active"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border-blue-500/30 bg-blue-500/10 text-blue-300";
}

type SupportRec = { slug: string; name: string; tier: "S" | "A" | "B"; reason: string };

function getGemTags(gem: GemRecord): string[] {
  const tags = gem.tags.map((t) => t.toLowerCase());
  const text = `${gem.description} ${gem.stat_text}`.toLowerCase();
  const extra: string[] = [];
  if (text.includes("minion") && !tags.includes("minion")) extra.push("minion");
  if (text.includes("totem") && !tags.includes("totem")) extra.push("totem");
  if (text.includes("channel") && !tags.includes("channelling")) extra.push("channelling");
  if (text.includes("curse") && !tags.includes("curse")) extra.push("curse");
  if (text.includes("aura") && !tags.includes("aura")) extra.push("aura");
  return [...tags, ...extra];
}

function rankSupports(gem: GemRecord, allGems: GemRecord[]): SupportRec[] {
  if (gem.gem_type !== "active") return [];
  const myTags = getGemTags(gem);
  const mySlug = toSlug(gem);
  if (myTags.length === 0) return [];

  const scored: { gem: GemRecord; score: number; shared: string[] }[] = [];

  for (const g of allGems) {
    if (g.gem_type !== "support" || toSlug(g) === mySlug) continue;
    const gTags = getGemTags(g);
    const shared = myTags.filter((t) => t !== "support" && gTags.includes(t));
    if (shared.length >= 1) scored.push({ gem: g, score: shared.length, shared });
  }

  scored.sort((a, b) => b.score - a.score);
  const result: SupportRec[] = [];
  const maxScore = scored[0]?.score ?? 1;

  for (const s of scored.slice(0, 6)) {
    let tier: "S" | "A" | "B";
    if (s.score >= maxScore * 0.8) tier = "S";
    else if (s.score >= maxScore * 0.5) tier = "A";
    else tier = "B";
    result.push({
      slug: toSlug(s.gem)!,
      name: s.gem.name,
      tier,
      reason: s.shared.slice(0, 3).join(", "),
    });
  }
  return result;
}

type UsageTip = { icon: string; title: string; text: string };

function generateUsageTips(gem: GemRecord): UsageTip[] {
  const tips: UsageTip[] = [];
  const text = `${gem.description} ${gem.stat_text}`.toLowerCase();
  const tags = getGemTags(gem);

  if (gem.gem_type === "support") {
    if (text.includes("more")) tips.push({ icon: "📈", title: "More Multiplier", text: "This support provides a 'More' multiplier — multiplicative with other damage sources. One of the highest priority supports for DPS." });
    if (tags.includes("attack") && tags.includes("melee")) tips.push({ icon: "⚔️", title: "Melee Attack Support", text: "Optimized for melee builds. Pair with Strike or Slam skills for best results. Ensure your weapon base has good physical damage." });
    else if (tags.includes("attack")) tips.push({ icon: "🏹", title: "Attack Support", text: "Best paired with attack-based skills. Your weapon's base damage directly scales the benefit of this support." });
    else if (tags.includes("spell")) tips.push({ icon: "🔮", title: "Spell Support", text: "Designed for spellcasters. The damage bonus scales with gem level — prioritize leveling this support." });
    if (tags.includes("fire") || tags.includes("cold") || tags.includes("lightning")) tips.push({ icon: "🌈", title: "Elemental Specialization", text: `Only benefits ${tags.filter(t => ["fire","cold","lightning"].includes(t)).join("/")} skills. Worthless for other elements — make sure your main skill matches.` });
    if (tags.includes("physical")) tips.push({ icon: "💪", title: "Physical Focus", text: "Boosts physical damage specifically. Best for bleed builds, impale setups, or raw physical hit builds." });
    if (text.includes("duration")) tips.push({ icon: "⏳", title: "Duration Scaling", text: "Invest in Duration nodes on the passive tree to amplify this support's effect significantly." });
    if (text.includes("charge")) tips.push({ icon: "🔋", title: "Charge Dependency", text: "Requires reliable charge generation. Build Frenzy/Power/Endurance charge sustain through gear or ascendancy." });
    tips.push({ icon: "📊", title: "Gem Level Priority", text: "Support gem level often provides bigger DPS gains than you'd expect. +1 gem level gear is excellent value." });
    return tips.slice(0, 4);
  }

  if (tags.includes("aoe") || tags.includes("slam"))
    tips.push({ icon: "🌊", title: "AoE Clearing", text: "Invest in Area of Effect to cover more ground. Excellent for map clearing and handling packs efficiently." });
  if (tags.includes("projectile"))
    tips.push({ icon: "🏹", title: "Projectile Scaling", text: "Extra projectiles (GMP) and Pierce/Chain/Fork dramatically multiply your clear. Choose based on mob density." });
  if (tags.includes("chaining"))
    tips.push({ icon: "⚡", title: "Chain Scaling", text: "Each chain hit deals full damage — more chains = exponentially better clearing. Stacking chain sources is top priority." });
  if (tags.includes("fire"))
    tips.push({ icon: "🔥", title: "Ignite Potential", text: "Fire skills can inflict Ignite for sustained DoT. Invest in Ignite Duration and Fire DoT multiplier for maximum burn damage." });
  if (tags.includes("cold"))
    tips.push({ icon: "❄️", title: "Freeze Defense", text: "Cold damage can Freeze enemies, providing excellent defensive utility. Higher hits = longer freeze duration." });
  if (tags.includes("lightning"))
    tips.push({ icon: "⚡", title: "Shock Amplification", text: "Lightning Shock increases damage taken by enemies. High hit damage = stronger Shock effect. Synergizes with crit builds." });
  if (gem.critical_chance !== null && gem.critical_chance >= 6)
    tips.push({ icon: "💥", title: "Crit Viable", text: `Base ${gem.critical_chance}% crit — strong crit scaling potential. Invest in crit chance + multiplier from gear and passive tree.` });
  if (gem.critical_chance !== null && gem.critical_chance >= 9)
    tips.push({ icon: "🎯", title: "Crit Priority", text: `${gem.critical_chance}% base crit is exceptional. This skill is designed for crit builds — stack crit multiplier for huge damage spikes.` });
  if (tags.includes("totem"))
    tips.push({ icon: "🗿", title: "Totem Strategy", text: "Totems use your offensive stats but act independently. You can dodge boss mechanics while your totems deal damage." });
  if (tags.includes("minion"))
    tips.push({ icon: "👻", title: "Minion Scaling", text: "Minions scale from specific gem/gear sources, not your own damage. Stack minion damage, life, and speed." });
  if (gem.cooldown !== null && gem.cooldown > 0)
    tips.push({ icon: "⏱️", title: "Cooldown Management", text: `${gem.cooldown}s cooldown — weave with other skills. Cooldown Recovery Speed gear reduces the downtime significantly.` });
  if (tags.includes("warcry"))
    tips.push({ icon: "📣", title: "Glory Mechanic", text: "Generate Glory by meeting specific conditions, then transform with devastating power. Maximise Glory gain per activation." });
  if (gem.cost.resource === "spirit")
    tips.push({ icon: "🛡️", title: "Spirit Reservation", text: `Reserves ${gem.cost.base_value} Spirit permanently. Stack Reservation Efficiency to fit more auras/buffs.` });
  if (tags.includes("duration"))
    tips.push({ icon: "⏳", title: "Duration Matters", text: "Duration scaling extends effect uptime. Less recasting = more time dealing damage. Invest in skill duration passives." });
  if (tags.includes("trigger"))
    tips.push({ icon: "⚙️", title: "Trigger Conditions", text: "Activates automatically when conditions are met. Focus on reliably meeting the trigger requirement." });
  if (text.includes("combo"))
    tips.push({ icon: "🔄", title: "Combo System", text: "Build Combo stacks with basic Strikes, then unleash for empowered finisher. Maintain stack count between encounters." });

  if (tips.length === 0)
    tips.push({ icon: "💡", title: "Gem Level Priority", text: "Level this gem to 20 ASAP — base damage scales significantly with gem level. Every level matters." });

  if (gem.max_level > 1 && gem.attribute_requirements.int + gem.attribute_requirements.str + gem.attribute_requirements.dex > 0) {
    const attr = gem.attribute_requirements;
    const highest = attr.int >= attr.str && attr.int >= attr.dex ? `${attr.int} Int` : attr.str >= attr.dex ? `${attr.str} Str` : `${attr.dex} Dex`;
    tips.push({ icon: "📋", title: "Attribute Planning", text: `Requires ${highest} at max level. Plan your passive tree and gear to meet this — don't get stuck unable to level your main skill.` });
  }

  return tips.slice(0, 4);
}

function getMetaTier(gem: GemRecord): { tier: string; color: string; reasoning: string } {
  const text = `${gem.description} ${gem.stat_text}`.toLowerCase();
  const tags = getGemTags(gem);
  let score = 50;

  // Mechanics that indicate strong gems
  if (text.includes("more damage") || text.includes("more ")) score += 10;
  if (tags.includes("aoe") && tags.includes("projectile")) score += 8;
  if (tags.includes("chaining")) score += 6;
  if (gem.critical_chance !== null && gem.critical_chance >= 7) score += 5;
  if (gem.critical_chance !== null && gem.critical_chance >= 9) score += 3;
  if (text.includes("penetrat")) score += 5;
  if (gem.cost.resource === "spirit") score += 5;
  if (tags.includes("aura") || tags.includes("buff")) score += 4;
  if (tags.includes("minion") || tags.includes("totem")) score += 4;
  if (tags.includes("curse")) score += 3;
  if (tags.includes("trigger")) score += 3;
  if (gem.cast_time !== null && gem.cast_time <= 0.5 && gem.cast_time > 0) score += 4;
  if (tags.length >= 4) score += 2;

  // Downsides
  if (gem.cooldown !== null && gem.cooldown > 3) score -= 4;
  if (gem.cast_time !== null && gem.cast_time > 1.5) score -= 3;
  if (text.includes("less damage")) score -= 5;
  if (text.includes("cannot")) score -= 2;

  if (score >= 68) return { tier: "S", color: "text-[#F2BF43]", reasoning: "Top-tier — strong mechanics, versatile, and highly efficient in the current meta." };
  if (score >= 58) return { tier: "A", color: "text-emerald-400", reasoning: "Very solid choice with strong damage or utility for most builds." };
  if (score >= 48) return { tier: "B", color: "text-blue-400", reasoning: "Good option that performs well in the right setup or as a levelling skill." };
  return { tier: "C", color: "text-white/60", reasoning: "Niche pick — shines in specific builds but needs targeted investment to perform." };
}

function getAlternatives(gem: GemRecord, allGems: GemRecord[]) {
  const text = `${gem.description} ${gem.stat_text}`.toLowerCase();
  const mySlug = toSlug(gem);
  const myTags = getGemTags(gem).filter((t) => t !== "support");
  if (myTags.length === 0) return [];

  return allGems
    .filter((g) => g.gem_type === gem.gem_type && toSlug(g) !== mySlug)
    .map((g) => {
      const gTags = getGemTags(g).filter((t) => t !== "support");
      const shared = myTags.filter((t) => gTags.includes(t)).length;
      return { gem: g, shared };
    })
    .filter((x) => x.shared >= 2)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 4)
    .map((x) => {
      const gt = `${x.gem.description} ${x.gem.stat_text}`.toLowerCase();
      const xTags = getGemTags(x.gem);
      let diff = "";
      if (xTags.includes("aoe") && !myTags.includes("aoe")) diff = "More AoE focused";
      else if ((x.gem.cast_time ?? 99) < (gem.cast_time ?? 99)) diff = "Faster cast speed";
      else if (xTags.includes("projectile") && !myTags.includes("projectile")) diff = "Projectile variant";
      else if (xTags.includes("duration") && !myTags.includes("duration")) diff = "Duration-based";
      else if (gt.includes("more")) diff = "More multiplier";
      else diff = "Similar mechanic, different scaling";
      return { slug: toSlug(x.gem)!, name: x.gem.name, diff, description: x.gem.description.slice(0, 80) };
    });
}

function getBestActiveGems(gem: GemRecord, allGems: GemRecord[]) {
  if (gem.gem_type !== "support") return [];
  const myTags = getGemTags(gem).filter((t) => t !== "support");
  const mySlug = toSlug(gem);
  if (myTags.length === 0) return [];

  return allGems
    .filter((g) => g.gem_type === "active" && toSlug(g) !== mySlug)
    .map((g) => {
      const gTags = getGemTags(g);
      const shared = myTags.filter((t) => gTags.includes(t));
      return { gem: g, score: shared.length, shared };
    })
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => ({ slug: toSlug(x.gem)!, name: x.gem.name, reason: x.shared.slice(0, 3).join(", ") }));
}

function attrColor(attr: string) {
  if (attr === "str") return "text-red-400";
  if (attr === "dex") return "text-green-400";
  return "text-blue-400";
}

function attrLabel(attr: string) {
  if (attr === "str") return "Strength";
  if (attr === "dex") return "Dexterity";
  return "Intelligence";
}

/* ── Page ── */

export default async function GemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { gem, gems } = await getGemBySlug(slug);
  if (!gem) notFound();

  const name = gem.name ?? slug;
  const statLines = gem.stat_text ? gem.stat_text.split("\n").filter(Boolean) : [];
  const nonZeroAttrs = (["str", "dex", "int"] as const).filter((a) => gem.attribute_requirements[a] > 0);
  const supportRecs = rankSupports(gem, gems);
  const bestActives = getBestActiveGems(gem, gems);
  const usageTips = generateUsageTips(gem);
  const meta = getMetaTier(gem);
  const alternatives = getAlternatives(gem, gems);

  const tierColors: Record<string, string> = { S: "text-[#F2BF43] border-[#F2BF43]/40 bg-[#F2BF43]/10", A: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10", B: "text-blue-300 border-blue-500/40 bg-blue-500/10" };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name,
    headline: `${name} — Best Supports & Build Guide`,
    description: gem.description,
    keywords: [name, "POE2", "best support gems", "build guide", gem.gem_type].join(", "),
  };

  return (
    <div className="flex flex-col flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="w-full max-w-4xl mx-auto flex-1 px-6 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-white/50">
          <Link href="/" className="p2-link">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/db/gems" className="p2-link">Skill Gems</Link>
          <span aria-hidden>/</span>
          <span className="truncate text-white/80">{name}</span>
        </nav>

        {/* ── Header + Meta Tier ── */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${gemTypeBadgeClass(gem.gem_type)}`}>
                  {gem.gem_type}
                </span>
                {gem.is_kalguuran && (
                  <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-300">Kalguuran</span>
                )}
                {gem.consumes_ward && (
                  <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">Consumes Ward</span>
                )}
              </div>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white/95 sm:text-4xl">{name}</h1>
              {gem.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">{gem.description}</p>}
              {gem.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {gem.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/60">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Tier</div>
              <div className={`mt-0.5 text-3xl font-black ${meta.color}`}>{meta.tier}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/40 italic">{meta.reasoning}</p>
        </section>

        {/* ── Core Stats Grid (always visible) ── */}
        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Cost</div>
            <div className="mt-1 text-sm font-medium text-white/90">{gem.cost.base_value > 0 ? `${gem.cost.base_value} ${gem.cost.resource}` : gem.cost.resource}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Cast Time</div>
            <div className="mt-1 text-sm font-medium text-white/90">{gem.cast_time !== null ? `${gem.cast_time}s` : "Instant"}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Crit Chance</div>
            <div className="mt-1 text-sm font-medium text-white/90">{gem.critical_chance !== null ? `${gem.critical_chance}%` : "—"}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Max Level</div>
            <div className="mt-1 text-sm font-medium text-white/90">{gem.max_level}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Cooldown</div>
            <div className="mt-1 text-sm font-medium text-white/90">{gem.cooldown !== null ? `${gem.cooldown}s` : "None"}</div>
          </div>
        </section>

        {/* ── Gem Effects (stat text — always visible) ── */}
        {statLines.length > 0 && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-base font-semibold text-white/95">Gem Effects</h2>
            <div className="mt-3 rounded-xl border border-white/8 bg-black/20 p-4">
              <div className="space-y-1.5 text-sm leading-6 text-white/80 font-mono">
                {statLines.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          </section>
        )}

        {/* ── Requirements (weapons + attributes) ── */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-base font-semibold text-white/95">Requirements</h2>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {gem.primary_attribute && gem.primary_attribute !== "none" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Primary:</span>
                <span className={`text-sm font-bold capitalize ${gem.primary_attribute === "intelligence" ? "text-blue-300" : gem.primary_attribute === "strength" ? "text-red-300" : "text-green-300"}`}>
                  {gem.primary_attribute}
                </span>
              </div>
            )}
            {gem.weapon_requirements.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Weapons:</span>
                {gem.weapon_requirements.map((w) => (
                  <span key={w} className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">{w}</span>
                ))}
              </div>
            )}
            {nonZeroAttrs.length > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40">At Level {gem.max_level}:</span>
                {nonZeroAttrs.map((attr) => (
                  <span key={attr} className={`text-sm font-bold ${attrColor(attr)}`}>
                    {gem.attribute_requirements[attr]} {attrLabel(attr)}
                  </span>
                ))}
              </div>
            ) : gem.primary_attribute && gem.primary_attribute !== "none" ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">Attribute scaling:</span>
                <span className="text-xs text-white/60 capitalize">{gem.primary_attribute}-based (scales with gem level)</span>
              </div>
            ) : null}
          </div>
        </section>

        {/* ═══ BEST SUPPORT GEMS (active gems only) ═══ */}
        {supportRecs.length > 0 && (
          <section className="mt-8 rounded-2xl border border-[#F2BF43]/20 bg-[#F2BF43]/[0.03] p-6">
            <h2 className="text-lg font-bold text-white/95">Best Support Gems for {name}</h2>
            <p className="mt-1 text-xs text-white/40">Ranked by synergy — the game won&apos;t tell you which combo deals the most damage</p>
            <div className="mt-4 space-y-2">
              {supportRecs.map((s, i) => (
                <Link
                  key={s.slug}
                  href={`/db/gems/${s.slug}`}
                  className="p2-nav-link flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.05] hover:border-[#F2BF43]/30"
                >
                  <span className="shrink-0 w-6 text-center text-xs font-bold text-white/30">#{i + 1}</span>
                  <span className={`shrink-0 inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-[11px] font-black ${tierColors[s.tier]}`}>
                    {s.tier}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-white/90">{s.name}</span>
                    <span className="ml-2 text-xs text-white/40">— {s.reason}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ BEST ACTIVE SKILLS TO USE WITH (support gems only) ═══ */}
        {bestActives.length > 0 && (
          <section className="mt-8 rounded-2xl border border-[#F2BF43]/20 bg-[#F2BF43]/[0.03] p-6">
            <h2 className="text-lg font-bold text-white/95">Best Active Skills for {name}</h2>
            <p className="mt-1 text-xs text-white/40">Active gems that benefit most from this support</p>
            <div className="mt-4 space-y-2">
              {bestActives.map((a, i) => (
                <Link
                  key={a.slug}
                  href={`/db/gems/${a.slug}`}
                  className="p2-nav-link flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.05] hover:border-[#F2BF43]/30"
                >
                  <span className="shrink-0 w-6 text-center text-xs font-bold text-white/30">#{i + 1}</span>
                  <span className="shrink-0 inline-flex items-center justify-center rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-black text-emerald-300">
                    active
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-white/90">{a.name}</span>
                    <span className="ml-2 text-xs text-white/40">— {a.reason}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ USAGE TIPS & STRATEGY ═══ */}
        {usageTips.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-bold text-white/95">How to Use {name} Effectively</h2>
            <p className="mt-1 text-xs text-white/40">Practical tips you won&apos;t find on the tooltip</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {usageTips.map((tip) => (
                <div key={tip.title} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tip.icon}</span>
                    <h3 className="text-sm font-semibold text-white/90">{tip.title}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">{tip.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══ ALTERNATIVES COMPARISON ═══ */}
        {alternatives.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-bold text-white/95">Alternatives to {name}</h2>
            <p className="mt-1 text-xs text-white/40">Similar skills — which one fits your build better?</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {alternatives.map((alt) => (
                <Link
                  key={alt.slug}
                  href={`/db/gems/${alt.slug}`}
                  className="p2-nav-link flex flex-col rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05] hover:border-[#F2BF43]/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/90">{alt.name}</span>
                    <span className="text-[10px] font-medium text-[#F2BF43]/80">{alt.diff}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/40 line-clamp-1">{alt.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ ACQUISITION ═══ */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-bold text-white/95">How to Get {name}</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Source</div>
              <div className="mt-1 text-sm text-white/70">
                {gem.gem_type === "active" ? "Uncut Skill Gem" : "Uncut Support Gem"}
              </div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Vendor</div>
              <div className="mt-1 text-sm text-white/70">Gem vendor after quest</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Max Level</div>
              <div className="mt-1 text-sm text-white/70">{gem.max_level}</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Resource</div>
              <div className="mt-1 text-sm text-white/70 capitalize">{gem.cost.resource}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/50">
            Use an {gem.gem_type === "active" ? "Uncut Skill Gem" : "Uncut Support Gem"} to obtain {name}. These drop from enemies or can be purchased from the gem vendor once unlocked through the campaign.
          </p>
        </section>

        {/* Cross-promote */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/db/gems" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-[#F2BF43]/40 hover:text-[#F2BF43]">
            ← All Gems
          </Link>
          <Link href="/tools/rune-combinations" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:border-[#F2BF43]/40 hover:text-[#F2BF43]">
            Rune Combinations Tool →
          </Link>
        </div>
      </main>
    </div>
  );
}
