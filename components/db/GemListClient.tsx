"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type GemRecord = {
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

const PAGE_SIZE = 12;
const GRID_ROWS = 4;

const GEM_TYPE_FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "support", label: "Support" },
] as const;

function gemTypeBadge(type: string): string {
  if (type === "active") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  return "border-blue-500/30 bg-blue-500/10 text-blue-300";
}

export default function GemListClient({
  gems,
  tags: _tags,
}: {
  gems: GemRecord[];
  tags: string[];
}) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("");

  const filtered = useMemo(() => {
    let list = gems;
    if (filterType !== "all") {
      list = list.filter((g) => g.gem_type === filterType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [gems, filterType, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageGems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function goToPage(p: number) {
    const clamped = Math.max(1, Math.min(totalPages, p));
    setPage(clamped);
    setPageInput("");
  }

  function handleFilterChange(type: string) {
    setFilterType(type);
    setPage(1);
    setPageInput("");
  }

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
    setPageInput("");
  }

  function handlePageInputSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (!isNaN(num)) goToPage(num);
  }

  const countByType = (type: string) =>
    type === "all" ? gems.length : gems.filter((g) => g.gem_type === type).length;

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          {GEM_TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => handleFilterChange(f.key)}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filterType === f.key
                  ? "bg-[#F2BF43] text-black"
                  : "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white",
              ].join(" ")}
            >
              {f.label} ({countByType(f.key)})
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search gems..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full sm:w-48 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-[#F2BF43]/50"
        />
      </div>

      {/* Results count */}
      <div className="mt-3 text-xs text-white/50">
        Showing {pageGems.length} of {filtered.length} gems
        {filterType !== "all" ? ` (${filterType})` : ""}
        {search.trim() ? ` matching "${search}"` : ""}
      </div>

      {/* Gem grid — each card has fixed height to prevent layout shift */}
      {pageGems.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/60">
          No gems found matching your filters.
        </div>
      ) : (
        <div
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))` }}
        >
          {pageGems.map((gem) => (
            <Link
              key={gem.slug}
              href={`/db/gems/${gem.slug}`}
              className="p2-nav-link group flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-[#F2BF43]/40 hover:bg-white/[0.06] h-[9.5rem]"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-white/95 group-hover:text-[#F2BF43] transition-colors line-clamp-1">
                  {gem.name}
                </h3>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${gemTypeBadge(gem.gem_type)}`}
                >
                  {gem.gem_type}
                </span>
              </div>

              <p className="mt-1.5 text-xs leading-relaxed text-white/60 line-clamp-2 flex-1">
                {gem.description}
              </p>

              <div className="mt-auto pt-2 flex flex-wrap items-center gap-2 text-[10px] text-white/50">
                {gem.cast_time !== null && (
                  <span>{gem.cast_time}s cast</span>
                )}
                {gem.weapon_requirements.length > 0 && (
                  <span className="text-amber-300/70">
                    {gem.weapon_requirements.slice(0, 2).join(", ")}
                    {gem.weapon_requirements.length > 2 && ` +${gem.weapon_requirements.length - 2}`}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage <= 1}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          <span className="text-xs text-white/50">
            Page {safePage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>

          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5">
            <label htmlFor="gem-page-input" className="text-xs text-white/40">
              Go to
            </label>
            <input
              id="gem-page-input"
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={String(safePage)}
              className="w-14 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center text-xs text-white/90 outline-none placeholder:text-white/30 focus:border-[#F2BF43]/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="submit"
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10 transition-colors"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
