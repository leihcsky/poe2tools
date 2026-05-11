"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Mod = { text: string; min: number | null; max: number | null; type: string };

type UniqueItem = {
  slug: string;
  name: string;
  base_item: string;
  item_class: string;
  required_level: number;
  implicit_mods: Mod[];
  explicit_mods: Mod[];
  tags: string[];
  use_cases: string[];
};

const PAGE_SIZE = 12;
const GRID_ROWS = 4;

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

export default function UniqueListClient({ items }: { items: UniqueItem[] }) {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("");

  const itemClasses = useMemo(() => {
    const set = new Set(items.map((i) => i.item_class));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (filterClass !== "all") {
      list = list.filter((i) => i.item_class === filterClass);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.base_item.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [items, filterClass, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function goToPage(p: number) {
    setPage(Math.max(1, Math.min(totalPages, p)));
    setPageInput("");
  }

  function handlePageInputSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (!isNaN(num)) goToPage(num);
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => { setFilterClass("all"); setPage(1); }}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filterClass === "all"
                ? "bg-[#F2BF43] text-black"
                : "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white",
            ].join(" ")}
          >
            All ({items.length})
          </button>
          {itemClasses.map((cls) => {
            const count = items.filter((i) => i.item_class === cls).length;
            return (
              <button
                key={cls}
                type="button"
                onClick={() => { setFilterClass(cls); setPage(1); }}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  filterClass === cls
                    ? "bg-[#F2BF43] text-black"
                    : "bg-white/8 text-white/70 hover:bg-white/12 hover:text-white",
                ].join(" ")}
              >
                {cls} ({count})
              </button>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="Search uniques..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full sm:w-48 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/90 outline-none placeholder:text-white/40 focus:border-[#F2BF43]/50"
        />
      </div>

      {/* Results count */}
      <div className="mt-3 text-xs text-white/50">
        Showing {pageItems.length} of {filtered.length} items
        {filterClass !== "all" ? ` (${filterClass})` : ""}
        {search.trim() ? ` matching "${search}"` : ""}
      </div>

      {/* Item grid */}
      {pageItems.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/60">
          No items found matching your filters.
        </div>
      ) : (
        <div
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))` }}
        >
          {pageItems.map((item) => (
            <Link
              key={item.slug}
              href={`/db/uniques/${item.slug}`}
              className="p2-nav-link group flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-[#F2BF43]/40 hover:bg-white/[0.06] h-[10.5rem]"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-[#F2BF43] group-hover:text-[#F2BF43] transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeClass(item.item_class)}`}
                >
                  {item.item_class}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-white/40">{item.base_item} · Lv.{item.required_level}</p>

              <div className="mt-2 flex-1 space-y-0.5 overflow-hidden">
                {item.explicit_mods.slice(0, 2).map((mod, i) => (
                  <p key={i} className="text-xs leading-snug text-white/60 line-clamp-1">
                    {mod.text}
                  </p>
                ))}
                {item.explicit_mods.length > 2 && (
                  <p className="text-[10px] text-white/40">+{item.explicit_mods.length - 2} more mods</p>
                )}
              </div>

              <div className="mt-auto pt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-white/40">
                {item.tags.slice(0, 3).map((t) => (
                  <span key={t} className="rounded-full border border-white/8 bg-white/[0.03] px-1.5 py-0.5">{t}</span>
                ))}
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

          <span className="text-xs text-white/50">Page {safePage} / {totalPages}</span>

          <button
            type="button"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>

          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5">
            <label htmlFor="unique-page-input" className="text-xs text-white/40">Go to</label>
            <input
              id="unique-page-input"
              type="number"
              min={1}
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={String(safePage)}
              className="w-14 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center text-xs text-white/90 outline-none placeholder:text-white/30 focus:border-[#F2BF43]/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button type="submit" className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10 transition-colors">Go</button>
          </form>
        </div>
      )}
    </div>
  );
}
