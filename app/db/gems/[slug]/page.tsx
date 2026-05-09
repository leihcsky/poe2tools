import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 60 * 60;
export const dynamicParams = false;

type GemRecord = {
  id?: string;
  slug?: string;
  name?: string;
  description?: string;
  tags?: string[];
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

function toSlug(gem: GemRecord): string | null {
  const s = typeof gem.slug === "string" ? gem.slug : null;
  if (s && s.trim()) return s.trim();
  const id = typeof gem.id === "string" ? gem.id : null;
  if (id && id.trim()) return id.trim();
  return null;
}

export async function generateStaticParams() {
  const gems = await loadGems();
  const slugs = gems.map(toSlug).filter((v): v is string => Boolean(v));
  const unique = Array.from(new Set(slugs));
  return unique.map((slug) => ({ slug }));
}

export default async function GemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gems = await loadGems();
  const gem = gems.find((g) => toSlug(g) === slug) ?? gems.find((g) => g.id === slug);
  if (!gem) notFound();

  const title = gem.name ?? slug;
  const tags = Array.isArray(gem.tags) ? gem.tags : [];

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-4xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Skill Gem
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {title}
          </h1>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Slug: {slug}
            {gem.id ? ` · id: ${gem.id}` : ""}
          </div>

          {gem.description ? (
            <p className="mt-6 text-base leading-7 text-zinc-700 dark:text-zinc-300">
              {gem.description}
            </p>
          ) : null}

          {tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
