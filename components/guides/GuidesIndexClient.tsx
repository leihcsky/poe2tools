"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export type GuideCategory =
  | "all"
  | "patch"
  | "beginner"
  | "builds"
  | "economy"
  | "endgame";

export type GuideListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<GuideCategory, "all">;
  dateLabel: string;
  readMinutes?: number;
  featured?: boolean;
  placeholder?: boolean;
};

type Props = {
  patchVersion: string;
  patchName: string;
  items: GuideListItem[];
};

function categoryLabel(cat: GuideCategory): string {
  switch (cat) {
    case "all":
      return "All";
    case "patch":
      return "Patch notes";
    case "beginner":
      return "Beginner";
    case "builds":
      return "Builds";
    case "economy":
      return "Economy & crafting";
    case "endgame":
      return "Endgame";
  }
}

function categoryChipClass(active: boolean): string {
  return [
    "text-sm px-4 py-1.5 rounded-full border transition-colors",
    active
      ? "bg-blue-700 text-white border-blue-700"
      : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900/30",
  ].join(" ");
}

function categoryPillClass(category: GuideListItem["category"]): string {
  switch (category) {
    case "patch":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200";
    case "beginner":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200";
    case "builds":
      return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200";
    case "economy":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200";
    case "endgame":
      return "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-200";
  }
}

export default function GuidesIndexClient({
  patchVersion,
  patchName,
  items,
}: Props) {
  const [active, setActive] = useState<GuideCategory>("all");
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = useMemo<GuideCategory>(() => {
    const cat = searchParams.get("cat");
    switch (cat) {
      case "patch":
      case "beginner":
      case "builds":
      case "economy":
      case "endgame":
      case "all":
        return cat;
      default:
        return "all";
    }
  }, [searchParams]);

  useEffect(() => {
    setActive(urlCategory);
  }, [urlCategory]);

  const selectCategory = (cat: GuideCategory) => {
    setActive(cat);
    if (cat === "all") {
      router.replace("/guides", { scroll: false });
      return;
    }
    router.replace(`/guides?cat=${cat}`, { scroll: false });
  };

  const counts = useMemo(() => {
    const base = { patch: 0, beginner: 0, builds: 0, economy: 0, endgame: 0 };
    for (const it of items) base[it.category] += 1;
    return base;
  }, [items]);

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((it) => it.category === active);
  }, [items, active]);

  const featured =
    filtered.find((x) => x.featured) ?? filtered.find((x) => x.category === "patch") ?? filtered[0];
  const rest = filtered.filter((x) => x !== featured);

  return (
    <div className="p2-section overflow-hidden">
      <div className="px-6 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Guides
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Patch notes breakdowns, beginner walkthroughs, build suggestions, and
          economy tips — updated every patch.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        {(
          [
            "all",
            "patch",
            "beginner",
            "builds",
            "economy",
            "endgame",
          ] as GuideCategory[]
        ).map((cat) => (
          <button
            key={cat}
            type="button"
            className={categoryChipClass(active === cat)}
            onClick={() => selectCategory(cat)}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px]">
        <div className="px-6 py-6 border-b border-zinc-200 dark:border-zinc-800 lg:border-b-0 lg:border-r">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            <span className="font-medium">
              Patch {patchVersion} “{patchName}”
            </span>{" "}
            is coming — guides are being prepared and will be updated as notes drop.
          </div>

          {featured ? (
            <Link
              href={featured.placeholder ? "/guides" : `/guides/${featured.slug}`}
              className="mt-4 block p2-card p-5 transition-colors hover:bg-white/5"
            >
              <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                Featured
              </div>
              <div className="mt-2 text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                {featured.title}
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {featured.excerpt}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span
                  className={[
                    "inline-flex items-center rounded-full border px-2.5 py-1 font-medium",
                    categoryPillClass(featured.category),
                  ].join(" ")}
                >
                  {categoryLabel(featured.category)}
                </span>
                <span>
                  {featured.dateLabel}
                  {typeof featured.readMinutes === "number"
                    ? ` · ${featured.readMinutes} min read`
                    : ""}
                </span>
              </div>
            </Link>
          ) : null}

          <div className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 p2-divider">
            {rest.length === 0 ? (
              <div className="py-8 text-sm text-zinc-600 dark:text-zinc-400">
                No guides in this category yet.
              </div>
            ) : (
              rest.map((it) => (
                <Link
                  key={it.slug}
                  href={it.placeholder ? "/guides" : `/guides/${it.slug}`}
                  className="flex gap-4 py-4 transition-colors hover:bg-white/4"
                >
                  <div className="flex-1">
                    <span
                      className={[
                        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                        categoryPillClass(it.category),
                      ].join(" ")}
                    >
                      {categoryLabel(it.category)}
                    </span>
                    <div className="mt-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                      {it.title}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      {it.excerpt}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {it.dateLabel}
                      {typeof it.readMinutes === "number"
                        ? ` · ${it.readMinutes} min read`
                        : ""}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <aside className="px-6 py-6">
          <div className="mb-6">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Browse by category
            </div>
            <div className="mt-3 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              {(
                [
                  ["patch", counts.patch],
                  ["beginner", counts.beginner],
                  ["builds", counts.builds],
                  ["economy", counts.economy],
                  ["endgame", counts.endgame],
                ] as const
              ).map(([cat, count]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => selectCategory(cat)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2 py-2 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span>{categoryLabel(cat)}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Related tools
            </div>
            <div className="mt-3 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              <Link
                href="/tools/rune-combinations"
                className="flex items-center justify-between rounded-xl px-2 py-2 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span>Rune combos</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  →
                </span>
              </Link>
              <Link
                href="/tools/runic-ward-calc"
                className="flex items-center justify-between rounded-xl px-2 py-2 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span>Runic Ward</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  →
                </span>
              </Link>
              <Link
                href="/db/runes"
                className="flex items-center justify-between rounded-xl px-2 py-2 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span>Rune database</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  →
                </span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
