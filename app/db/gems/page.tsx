import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { DataStatusCallout } from "@/components/ui/DataStatus";
import { readDataMeta } from "@/lib/data-meta";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 60 * 60;

type GemRecord = {
  id?: string;
  slug?: string;
  name?: string;
};

async function loadGems(): Promise<GemRecord[]> {
  const filePath = path.join(process.cwd(), "data", "gems.json");
  const raw = await readFile(filePath, "utf8").catch(() => "");
  const trimmed = raw.trim();
  if (!trimmed) return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed as GemRecord[];
    if (parsed && typeof parsed === "object") {
      const maybeGems = (parsed as { gems?: unknown }).gems;
      if (Array.isArray(maybeGems)) return maybeGems as GemRecord[];
    }
    return [];
  } catch {
    return [];
  }
}

function toSlug(g: GemRecord): string | null {
  if (typeof g.slug === "string" && g.slug.trim()) return g.slug.trim();
  if (typeof g.id === "string" && g.id.trim()) return g.id.trim();
  return null;
}

export default async function GemsIndexPage() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";
  const meta = await readDataMeta("gems.json");
  const gems = await loadGems();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Skill Gem Database
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Gem reference pages generated from local JSON, with ISR for patch
            updates.
          </p>
          <div className="mt-4 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-200">
            Patch {patchVersion}
          </div>
        </section>

        {meta ? (
          <div className="mt-6">
            <DataStatusCallout meta={meta} title="Gem dataset" />
          </div>
        ) : null}

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          {gems.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Skill gem data isn’t published yet. Check back after Patch{" "}
              {patchVersion} notes drop.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {gems
                .map((g) => {
                  const slug = toSlug(g);
                  if (!slug) return null;
                  const title = g.name ?? slug;
                  return { slug, title };
                })
                .filter(Boolean)
                .map((x) => (
                  <Link
                    key={x!.slug}
                    href={`/db/gems/${x!.slug}`}
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
