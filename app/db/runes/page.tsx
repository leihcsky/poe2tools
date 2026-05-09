import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { DataStatusCallout } from "@/components/ui/DataStatus";
import { readDataMeta } from "@/lib/data-meta";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 60 * 60;

type RuneRecord = {
  id?: string;
  slug?: string;
  name?: string;
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

function toSlug(r: RuneRecord): string | null {
  if (typeof r.slug === "string" && r.slug.trim()) return r.slug.trim();
  if (typeof r.id === "string" && r.id.trim()) return r.id.trim();
  return null;
}

export default async function RunesIndexPage() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";
  const meta = await readDataMeta("runes.json");
  const runes = await loadRunes();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Rune Database
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Searchable rune reference generated from local JSON and revalidated
            after patch updates.
          </p>
          <div className="mt-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
            Patch {patchVersion}
          </div>
        </section>

        {meta ? (
          <div className="mt-6">
            <DataStatusCallout meta={meta} title="Rune dataset" />
          </div>
        ) : null}

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          {runes.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              No rune data yet. Add records to data/runes.json to generate the
              database.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {runes
                .map((r) => {
                  const slug = toSlug(r);
                  if (!slug) return null;
                  const title = r.name ?? slug;
                  return { slug, title };
                })
                .filter(Boolean)
                .map((x) => (
                  <Link
                    key={x!.slug}
                    href={`/db/runes/${x!.slug}`}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-950 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50 dark:hover:bg-zinc-950"
                  >
                    {x!.title}
                  </Link>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
