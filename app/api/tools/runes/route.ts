import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

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

type Goal = "mapping" | "loot" | "challenge";

type Suggestion = {
  ids: string[];
  score: number;
  reason: string | null;
  kind?: "best" | "improve" | "pair";
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

function normalizeIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const cleaned = ids
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
  return Array.from(new Set(cleaned));
}

function normalizeGoal(goal: unknown): Goal {
  if (goal === "loot" || goal === "challenge" || goal === "mapping") return goal;
  return "mapping";
}

function num(v: unknown, fallback: number): number {
  if (typeof v !== "number" || !Number.isFinite(v)) return fallback;
  return v;
}

function intersectCount(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  let count = 0;
  for (const t of b) {
    if (setA.has(t)) count += 1;
  }
  return count;
}

function runeBaseScore(r: RuneRecord, goal: Goal): number {
  const tier = r.tier;
  const rating = r.monster_modifier.difficulty_rating;
  const tags = new Set(r.tags.map((t) => t.toLowerCase()));

  const rewardHints =
    (tagSetHasAny(tags, ["loot", "currency", "drops", "economy", "crafting"]) ? 1.5 : 0) +
    (r.reward.reward_type === "currency" ? 1 : 0);

  if (goal === "mapping") {
    // Mapping: Balance tier and low difficulty rating.
    return tier * 2 - rating * 1.5 + rewardHints * 0.5;
  }
  if (goal === "loot") {
    // Loot: Prioritize reward hints and tier, accept moderate rating.
    return tier * 1.5 - rating * 0.8 + rewardHints * 3.0;
  }
  // Challenge: Prioritize high difficulty rating and tier.
  return tier * 1.0 + rating * 3.0 + rewardHints * 0.2;
}

function tagSetHasAny(set: Set<string>, tags: string[]): boolean {
  for (const t of tags) if (set.has(t)) return true;
  return false;
}

function calculateComboScore(
  selectedRunes: RuneRecord[],
  candidate: RuneRecord,
  goal: Goal
): { score: number; reason: string } {
  let score = runeBaseScore(candidate, goal);
  const reasons: string[] = [];

  // 1. Explicit Synergies
  for (const s of selectedRunes) {
    if (candidate.synergies.includes(s.id) || s.synergies.includes(candidate.id)) {
      score += 15;
      reasons.push(`Direct synergy with ${s.name}`);
    }
    if (candidate.anti_synergies.includes(s.id) || s.anti_synergies.includes(candidate.id)) {
      score -= 20;
      reasons.push(`Risk: Negative interaction with ${s.name}`);
    }
  }

  // 2. Tag Overlap
  const cTags = new Set(candidate.tags);
  let sharedTags = 0;
  for (const s of selectedRunes) {
    for (const st of s.tags) {
      if (cTags.has(st)) sharedTags++;
    }
  }
  if (sharedTags > 0) {
    score += sharedTags * 2;
    if (sharedTags >= 2) reasons.push("Strong tag overlap");
  }

  // 3. Category/Sub-type alignment
  for (const s of selectedRunes) {
    if (s.category === candidate.category) score += 3;
    if (s.sub_type === candidate.sub_type) score += 5;
  }

  return {
    score,
    reason: reasons.length > 0 ? reasons[0] : "Good overall fit",
  };
}

function pickBestSetup(
  allRunes: RuneRecord[],
  currentIds: string[],
  goal: Goal
): Suggestion[] {
  const currentRunes = currentIds
    .map((id) => allRunes.find((r) => r.id === id))
    .filter((r): r is RuneRecord => !!r);

  const maxSlots = 8;
  const currentSlots = currentRunes.reduce((sum, r) => sum + r.slot_cost, 0);

  // If we have room, suggest single runes to add
  if (currentSlots < maxSlots) {
    const candidates = allRunes
      .filter((r) => !currentIds.includes(r.id) && r.slot_cost <= maxSlots - currentSlots)
      .map((r) => ({
        rune: r,
        ...calculateComboScore(currentRunes, r, goal),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return candidates.map((c) => ({
      ids: [...currentIds, c.rune.id],
      score: c.score,
      reason: c.reason,
      kind: "pair",
    }));
  }

  // If full, suggest improvements (swap one)
  if (currentIds.length > 0) {
    const suggestions: Suggestion[] = [];
    for (let i = 0; i < currentRunes.length; i++) {
      const withoutOne = [...currentRunes.slice(0, i), ...currentRunes.slice(i + 1)];
      const withoutOneIds = withoutOne.map((r) => r.id);
      const freedSlots = currentRunes[i].slot_cost;
      const currentSlotsWithoutOne = currentSlots - freedSlots;

      const bestReplacement = allRunes
        .filter((r) => !currentIds.includes(r.id) && r.slot_cost <= maxSlots - currentSlotsWithoutOne)
        .map((r) => ({
          rune: r,
          ...calculateComboScore(withoutOne, r, goal),
        }))
        .sort((a, b) => b.score - a.score)[0];

      if (bestReplacement && bestReplacement.score > runeBaseScore(currentRunes[i], goal)) {
        suggestions.push({
          ids: [...withoutOneIds, bestReplacement.rune.id],
          score: bestReplacement.score,
          reason: `Swap ${currentRunes[i].name} for ${bestReplacement.rune.name}: ${bestReplacement.reason}`,
          kind: "improve",
        });
      }
    }
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  // If empty, suggest best starters
  const starters = allRunes
    .map((r) => ({
      rune: r,
      score: runeBaseScore(r, goal),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return starters.map((s) => ({
    ids: [s.rune.id],
    score: s.score,
    reason: `Strong starter for ${goal} goals`,
    kind: "best",
  }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputIds = normalizeIds(body.ids);
    const goal = normalizeGoal(body.goal);

    const allRunes = await loadRunes();
    const suggestions = pickBestSetup(allRunes, inputIds, goal);

    return Response.json({
      inputIds,
      suggestions,
    });
  } catch (e) {
    return new Response(e instanceof Error ? e.message : "Internal Server Error", {
      status: 500,
    });
  }
}
