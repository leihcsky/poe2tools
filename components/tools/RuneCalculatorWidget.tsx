"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

const MAX_SLOTS = 8;

type Goal = "mapping" | "loot" | "challenge";

type Rune = {
  id: string;
  name: string;
  effect: string;
  reward: string;
  tier: number;
  difficultyRating: number;
  tags: string[];
  slotCost: number;
  masterwork: boolean;
};

type Suggestion = {
  ids: string[];
  score: number;
  reason: string | null;
  kind?: "best" | "improve" | "pair";
};

type ApiResponse = {
  inputIds: string[];
  suggestions: Suggestion[];
  normalizedIds?: string[];
  missingIds?: string[];
};

type Props = {
  runes: Array<{
    id: string;
    name: string;
    monster_modifier: {
      description: string;
      difficulty_rating: number;
    };
    reward: {
      description: string;
    };
    tier: number;
    tags: string[];
    slot_cost: number;
    masterwork: boolean;
  }>;
};

type RuneRecordInput = Props["runes"][number];

function toRune(input: RuneRecordInput): Rune | null {
  const id = typeof input?.id === "string" ? input.id.trim() : "";
  if (!id) return null;
  return {
    id,
    name: input.name ?? id,
    effect: input.monster_modifier?.description ?? "No effect description.",
    reward: input.reward?.description ?? "No reward description.",
    tier: typeof input.tier === "number" ? input.tier : 1,
    difficultyRating:
      typeof input.monster_modifier?.difficulty_rating === "number"
        ? input.monster_modifier.difficulty_rating
        : 1,
    tags: Array.isArray(input.tags) ? input.tags : [],
    slotCost: typeof input.slot_cost === "number" ? input.slot_cost : 1,
    masterwork: !!input.masterwork,
  };
}

function parseIds(input: string): string[] {
  return input
    .split(/[\s,，;；\n]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function clampSelection(ids: string[], max: number): string[] {
  return ids.slice(0, max);
}

function goalLabel(goal: Goal): string {
  if (goal === "loot") return "High-value drops";
  if (goal === "challenge") return "Pushing difficulty";
  return "Mapping speed";
}

function goalHelp(goal: Goal): string {
  if (goal === "loot") return "Favors reward-oriented patterns and safer tradeoffs.";
  if (goal === "challenge") return "Leans into harder setups and progression pressure.";
  return "Favors smoother runs and manageable difficulty.";
}

type LoadoutSummary = {
  avgDifficulty: number;
  slotTotal: number;
  topTags: string[];
  count: number;
};

function loadoutSummary(ids: string[], byId: Map<string, Rune>): LoadoutSummary | null {
  const list = ids.map((id) => byId.get(id)).filter((x): x is Rune => !!x);
  if (list.length === 0) return null;
  const slotTotal = list.reduce((a, r) => a + r.slotCost, 0);
  const avgDifficulty = list.reduce((a, r) => a + r.difficultyRating, 0) / list.length;
  const tagCounts = new Map<string, number>();
  for (const r of list) {
    for (const t of r.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  }
  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([t]) => t);
  return { avgDifficulty, slotTotal, topTags, count: list.length };
}

function diffLoadout(suggestedIds: string[], baseIds: string[]) {
  const base = new Set(baseIds);
  const next = new Set(suggestedIds);
  const added = suggestedIds.filter((id) => !base.has(id));
  const removed = baseIds.filter((id) => !next.has(id));
  return { added, removed };
}

export default function RuneCalculatorWidget({ runes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Data Processing
  const allRunes = useMemo(() => {
    if (!Array.isArray(runes)) return [];
    return runes.map(toRune).filter((x): x is Rune => Boolean(x));
  }, [runes]);

  const byId = useMemo(() => new Map(allRunes.map((r) => [r.id, r] as const)), [allRunes]);

  const availableTags = useMemo(() => {
    return uniqueStrings(allRunes.flatMap((r) => r.tags));
  }, [allRunes]);

  // 2. State
  const [goal, setGoal] = useState<Goal>("mapping");
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<number | "all">("all");
  const [tag, setTag] = useState<string | "all">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importText, setImportText] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // 3. Helpers
  const syncToUrl = useCallback((ids: string[], g: Goal) => {
    const params = new URLSearchParams();
    if (ids.length > 0) params.set("ids", ids.join(","));
    if (g !== "mapping") params.set("goal", g);
    const qs = params.toString();
    router.replace(`/tools/rune-combinations${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    if (allRunes.length === 0) return;

    const idsStr = searchParams.get("ids");
    if (idsStr && byId.size > 0) {
      const parsed = idsStr.split(",").filter((id) => byId.has(id));
      setSelectedIds(parsed.slice(0, MAX_SLOTS));
    }
    const g = searchParams.get("goal");
    if (g === "loot" || g === "challenge" || g === "mapping") {
      setGoal(g as Goal);
    }
  }, [searchParams, byId, allRunes.length, MAX_SLOTS]);

  // 5. Actions
  function toggleRune(id: string) {
    setResult(null);
    setError(null);
    const isSelected = selectedIds.includes(id);
    const next = isSelected
      ? selectedIds.filter((x) => x !== id)
      : selectedIds.length >= MAX_SLOTS
      ? selectedIds
      : [...selectedIds, id];

    setSelectedIds(next);
    syncToUrl(next, goal);
  }

  function clearSelection() {
    setSelectedIds([]);
    setResult(null);
    setError(null);
    syncToUrl([], goal);
  }

  function importIds() {
    const ids = parseIds(importText);
    if (ids.length === 0) return;
    const valid = ids.filter((id) => byId.has(id));
    const next = clampSelection(uniqueStrings([...selectedIds, ...valid]), MAX_SLOTS);
    setSelectedIds(next);
    syncToUrl(next, goal);
    setImportText("");
    setResult(null);
    setError(null);
  }

  function applySuggestion(ids: string[]) {
    const valid = ids.filter((id) => byId.has(id));
    const next = clampSelection(valid, MAX_SLOTS);
    setSelectedIds(next);
    syncToUrl(next, goal);
    setResult(null);
    setError(null);
  }

  function handleGoalChange(g: Goal) {
    setGoal(g);
    setResult(null);
    syncToUrl(selectedIds, g);
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL", err);
    }
  };

  async function recommend() {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools/runes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, goal }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data = (await res.json()) as ApiResponse;
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  // 6. Derived state
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRunes
      .filter((r) => {
        if (tier !== "all" && r.tier !== tier) return false;
        if (tag !== "all" && !r.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
          return false;
        if (!q) return true;
        const hay = `${r.name} ${r.id} ${r.tags.join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => b.tier - a.tier || a.id.localeCompare(b.id));
  }, [allRunes, query, tier, tag]);

  const selectedRunes = useMemo(() => {
    return selectedIds.map((id) => byId.get(id)).filter((x): x is Rune => !!x);
  }, [selectedIds, byId]);

  const combinedDifficulty = useMemo(() => {
    if (selectedRunes.length === 0) return 0;
    const sum = selectedRunes.reduce((acc, r) => acc + r.difficultyRating, 0);
    return sum / selectedRunes.length;
  }, [selectedRunes]);

  const combinedSlotCost = useMemo(() => {
    return selectedRunes.reduce((acc, r) => acc + r.slotCost, 0);
  }, [selectedRunes]);

  const combinedTags = useMemo(() => {
    const tags = selectedRunes.flatMap((r) => r.tags);
    const counts = new Map<string, number>();
    for (const t of tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12);
  }, [selectedRunes]);

  return (
    <section className="p2-section overflow-hidden">
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800 p2-divider">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              Build your rune loadout
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Up to {MAX_SLOTS} runes: pick a goal, add runes on the left, review stats and effects on the right.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="p2-card flex rounded-full p-1 text-sm">
              {(["mapping", "loot", "challenge"] as Goal[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGoalChange(g)}
                  className={[
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    goal === g
                      ? "bg-[#F2BF43] text-black"
                      : "text-white/80 hover:bg-white/5",
                  ].join(" ")}
                >
                  {goalLabel(g)}
                </button>
              ))}
            </div>
            <Button
              type="button"
              onClick={recommend}
              disabled={isLoading || allRunes.length === 0}
            >
              {isLoading ? "Working…" : selectedIds.length > 0 ? "Improve my setup" : "Recommend best setup"}
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{goalHelp(goal)}</div>
          <a href="#rune-calculator-how-to" className="shrink-0 text-xs p2-link">
            How to use this tool
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[360px_1fr]">
        <div className="border-b border-zinc-200 px-6 py-6 dark:border-zinc-800 p2-divider lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Rune Library
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {filtered.length} available
            </div>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Click a rune below to add it to your current setup.
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ID, or tag…"
              className="p2-input text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="p2-select text-sm !bg-[#1a1635] !text-white"
              >
                <option value="all" className="bg-[#1a1635]">All tiers</option>
                {[1, 2, 3, 4, 5].map((t) => (
                  <option key={t} value={t} className="bg-[#1a1635]">
                    Tier {t}
                  </option>
                ))}
              </select>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value === "all" ? "all" : e.target.value)}
                className="p2-select text-sm !bg-[#1a1635] !text-white"
              >
                <option value="all" className="bg-[#1a1635]">All tags</option>
                {availableTags.map((t) => (
                  <option key={t} value={t} className="bg-[#1a1635]">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {selectedRunes.length === 0 ? (
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Select runes on the list below to build a loadout.
              </div>
            ) : (
              selectedRunes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRune(r.id)}
                  className="p2-chip"
                  title="Remove"
                >
                  <span className="font-medium">{r.name ?? r.id}</span>
                  <span className="text-white/60">×</span>
                </button>
              ))
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste rune IDs to add…"
              className="p2-input flex-1 text-sm"
            />
            <Button type="button" variant="secondary" onClick={importIds} disabled={!importText.trim()}>
              Import
            </Button>
          </div>

          <div className="mt-4 max-h-[520px] overflow-auto pr-1">
            {allRunes.length === 0 ? (
              <div className="p2-card px-4 py-3 text-sm">
                Rune data is not available yet. Check the notice above and try again later.
              </div>
            ) : filtered.length === 0 ? (
              <div className="p2-card px-4 py-3 text-sm">
                No runes match your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filtered.map((r) => {
                  const selected = selectedIds.includes(r.id);
                  const disabled = !selected && selectedIds.length >= MAX_SLOTS;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleRune(r.id)}
                      disabled={disabled}
                      className={[
                        "relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60",
                        selected
                          ? "border-[#F2BF43]/70 bg-[#F2BF43]/12 shadow-[0_0_0_1px_rgba(242,191,67,0.35)] ring-2 ring-[#F2BF43]/45"
                          : "border-zinc-200/80 bg-white/5 hover:border-zinc-300 hover:bg-white/[0.08] dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-zinc-700 dark:hover:bg-white/[0.06]",
                      ].join(" ")}
                    >
                      {selected ? (
                        <span
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-[#F2BF43]"
                          aria-hidden
                        />
                      ) : null}
                      <div className="flex items-center justify-between gap-3 pl-0.5">
                        <div className="min-w-0 flex-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                          {r.name ?? r.id}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {selected ? (
                            <span className="rounded-full bg-[#F2BF43]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#F2BF43] ring-1 ring-[#F2BF43]/45">
                              In setup
                            </span>
                          ) : null}
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            {typeof r.tier === "number" ? `Tier ${r.tier}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {r.id} · Rating {r.difficultyRating}/5 · Cost {r.slotCost}
                      </div>
                      {r.tags && r.tags.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {r.tags.slice(0, 6).map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/75"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Current setup
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="p2-card px-4 py-3">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Difficulty Rating (avg)
              </div>
              <div className="mt-1 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {combinedDifficulty.toFixed(1)}/5
              </div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                Higher rating means more dangerous monsters.
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Total Slot Cost
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span
                  className={[
                    "text-lg font-semibold",
                    combinedSlotCost > MAX_SLOTS ? "text-red-500" : "text-zinc-950 dark:text-zinc-50",
                  ].join(" ")}
                >
                  {combinedSlotCost}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">/ {MAX_SLOTS}</span>
              </div>
              <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {combinedSlotCost > MAX_SLOTS ? "Exceeds max slots!" : "Typical max is 8 slots."}
              </div>
            </div>
            <div className="p2-card px-4 py-3">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Tag focus
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {combinedTags.length === 0 ? (
                  <div className="text-sm text-zinc-700 dark:text-zinc-200">—</div>
                ) : (
                  combinedTags.map(([t, c]) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/85"
                    >
                      <span>{t}</span>
                      <span className="text-white/60">{c}</span>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button type="button" onClick={copyShareUrl} disabled={selectedIds.length === 0}>
              {copySuccess ? "Copied!" : "Share"}
            </Button>
            <Button type="button" onClick={clearSelection} disabled={selectedIds.length === 0}>
              Clear
            </Button>
            <Button type="button" onClick={recommend} disabled={isLoading || allRunes.length === 0}>
              {isLoading ? "Working…" : "Get recommendations"}
            </Button>
          </div>

          <div className="mt-6 p2-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Effects & rewards
              </div>
              {selectedRunes.length > 0 && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedRunes.length} runes active
                </div>
              )}
            </div>
            {selectedRunes.length === 0 ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <span className="text-xl">🛠️</span>
                </div>
                <div className="mt-4 text-sm font-medium text-zinc-950 dark:text-zinc-50">
                  No runes selected
                </div>
                <p className="mt-1 max-w-[200px] text-xs text-zinc-500 dark:text-zinc-400">
                  Pick runes from the library on the left to start building your combination.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {selectedRunes.map((r) => (
                    <div
                      key={r.id}
                      className="p2-card px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                          {r.name}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                          Rating {r.difficultyRating}
                        </div>
                      </div>
                      <div className="mt-1 text-xs leading-5 text-zinc-700 dark:text-zinc-300">
                        {r.effect}
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">Reward:</span>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{r.reward}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          ) : null}

          {result ? (
            <div className="mt-6 p2-card p-5">
              <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                Recommendations
              </div>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Each card is one full loadout ranked for your goal. Skim the stats and rune notes first — names alone
                do not tell the whole story. Tap Apply to load that loadout and compare it in Effects and rewards
                above.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3">
                {result.suggestions.map((s, idx) => {
                  const baseIds = Array.isArray(result.inputIds) ? result.inputIds : selectedIds;
                  const summary = loadoutSummary(s.ids, byId);
                  const { added, removed } = diffLoadout(s.ids, baseIds);
                  const kindLabel =
                    s.kind === "best" ? "Starter pick" : s.kind === "improve" ? "Swap idea" : "Add-on idea";

                  return (
                    <div key={idx} className="p2-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-[#F2BF43]">{kindLabel}</div>
                          <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                            Option {idx + 1} of {result.suggestions.length}
                          </div>
                        </div>
                        <Button type="button" size="sm" variant="primary" onClick={() => applySuggestion(s.ids)}>
                          Apply
                        </Button>
                      </div>

                      {summary ? (
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-700 dark:text-zinc-200">
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                            Avg difficulty {summary.avgDifficulty.toFixed(1)}/5
                          </span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                            Slots {summary.slotTotal}/{MAX_SLOTS}
                          </span>
                          {summary.topTags.length > 0 ? (
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                              Tags: {summary.topTags.join(", ")}
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      {(removed.length > 0 || added.length > 0) && (
                        <div className="mt-3 space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
                          {removed.length > 0 ? (
                            <div>
                              <span className="font-medium text-zinc-800 dark:text-zinc-200">Removes: </span>
                              {removed.map((id) => byId.get(id)?.name ?? id).join(", ")}
                            </div>
                          ) : null}
                          {added.length > 0 ? (
                            <div>
                              <span className="font-medium text-zinc-800 dark:text-zinc-200">Adds: </span>
                              {added.map((id) => byId.get(id)?.name ?? id).join(", ")}
                            </div>
                          ) : null}
                        </div>
                      )}

                      {added.length > 0 ? (
                        <div className="mt-3 space-y-2">
                          {added.map((id) => {
                            const r = byId.get(id);
                            if (!r) return null;
                            return (
                              <div
                                key={id}
                                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs dark:bg-black/30"
                              >
                                <div className="font-semibold text-zinc-950 dark:text-zinc-50">{r.name}</div>
                                <div className="mt-1 line-clamp-2 leading-relaxed text-zinc-600 dark:text-zinc-300">
                                  {r.effect}
                                </div>
                                <div className="mt-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  {r.reward}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}

                      {s.reason ? (
                        <div className="mt-3 border-t border-zinc-200 pt-2 text-xs italic text-zinc-600 dark:border-white/10 dark:text-zinc-400">
                          {s.reason}
                        </div>
                      ) : null}

                      {s.ids.length > 1 ? (
                        <details className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <summary className="cursor-pointer select-none p2-link text-[11px]">
                            Full loadout names ({summary?.count ?? s.ids.length} runes)
                          </summary>
                          <div className="mt-1.5 leading-relaxed text-zinc-700 dark:text-zinc-300">
                            {s.ids.map((id) => byId.get(id)?.name ?? id).join(" · ")}
                          </div>
                        </details>
                      ) : (
                        <div className="mt-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                          {s.ids.map((id) => byId.get(id)?.name ?? id).join(" · ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

