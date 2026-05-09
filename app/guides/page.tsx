import { readdir } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 60 * 60;

async function listGuideSlugs(): Promise<string[]> {
  const baseDir = path.join(process.cwd(), "content", "guides");
  const entries = await readdir(baseDir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((name) => name.replace(/\.(mdx|md)$/i, ""));
}

export default async function GuidesIndexPage() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";
  const slugs = await listGuideSlugs();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Guides
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Patch notes breakdowns, beginner walkthroughs, build suggestions,
            and economy tips. Updated every patch.
          </p>
          <div className="mt-4 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            Patch {patchVersion}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          {slugs.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              No guides yet. Add markdown or MDX files to content/guides to
              publish articles.
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {slugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/guides/${slug}`}
                  className="flex items-center justify-between py-3 text-sm hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <span className="font-medium text-zinc-950 dark:text-zinc-50">
                    {slug}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

