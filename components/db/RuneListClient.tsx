"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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

const PAGE_SIZE = 12;

function difficultyColor(rating: number): string {
  if (rating <= 1) return "text-emerald-500";
  if (rating <= 2) return "text-zinc-400";
  if (rating <= 3) return "text-amber-400";
  if (rating <= 4) return "text-red-400";
  return "text-red-500";
}

function difficultyLabel(rating: number): string {
  if (rating <= 1) return "Easy";
  if (rating <= 2) return "Mild";
  if (rating <= 3) return "Moderate";
  if (rating <= 4) return "Hard";
  return "Extreme";
}

function categoryColor(cat: string): string {
  switch (cat) {
    case "elemental":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "physical":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "chaos":
      return "border-purple-500/30 bg-purple-500/10 text-purple-300";
    case "utility":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    case "economy":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/15 bg-white/5 text-white/70";
  }
}

export default function RuneListClient({
  runes,
  categories,
}: {
  runes: RuneRecord[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = runes;
    if (filterCat !== "all") {
      list = list.filter((r) => r.category === filterCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.sub_type.toLowerCase().includes(q),
      );
    }
    return list;
  }, [runes, filterCat, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRunes = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterChange(cat: string) {
    setFilterCat(cat);
    setPage(1);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filterCat === "all"
                ? "bg-[#F2BF43] text-black"
                : "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white",
            ].join(" ")}
          >
            All ({runes.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleFilterChange(cat)}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                filterCat === cat
                  ? "bg-[#F2BF43] text-black"
                  : "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search runes..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full sm:w-48 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-[#F2BF43]/50"
        />
      </div>

      {/* Results count */}
      <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Showing {pageRunes.length} of {filtered.length} runes
        {filterCat !== "all" ? ` in "${filterCat}"` : ""}
        {search.trim() ? ` matching "${search}"` : ""}
      </div>

      {/* Rune grid */}
      {pageRunes.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/60">
          No runes found matching your filters.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pageRunes.map((rune) => (
            <Link
              key={rune.slug}
              href={`/db/runes/${rune.slug}`}
              className="p2-nav-link group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-[#F2BF43]/40 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-white/95 group-hover:text-[#F2BF43] transition-colors">
                  {rune.name}
                </h3>
                <span className="shrink-0 text-[10px] font-medium text-white/40">
                  T{rune.tier}
                </span>
              </div>

              <p className="mt-1.5 text-xs leading-relaxed text-white/60 line-clamp-2">
                {rune.monster_modifier.description}
              </p>

              <p className="mt-1 text-xs leading-relaxed text-emerald-400 line-clamp-1">
                ↳ {rune.reward.description}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${categoryColor(rune.category)}`}>
                  {rune.sub_type || rune.category}
                </span>
                <span className={`text-[10px] font-medium ${difficultyColor(rune.monster_modifier.difficulty_rating)}`}>
                  {difficultyLabel(rune.monster_modifier.difficulty_rating)} ({rune.monster_modifier.difficulty_rating}/5)
                </span>
                <span className="text-[10px] text-white/40">
                  · {rune.slot_cost} slot{rune.slot_cost > 1 ? "s" : ""}
                </span>
              </div>

              {rune.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {rune.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-white/8 px-1.5 py-0.5 text-[10px] text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                  {rune.tags.length > 4 && (
                    <span className="text-[10px] text-white/40">+{rune.tags.length - 4}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-xs text-white/50">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
