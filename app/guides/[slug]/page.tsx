import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 60 * 60;

type GuideIndexItem = {
  slug: string;
  title?: string;
  summary?: string;
};

async function loadGuideIndex(): Promise<GuideIndexItem[]> {
  const baseDir = path.join(process.cwd(), "content", "guides");
  const entries = await readdir(baseDir, { withFileTypes: true }).catch(() => []);
  const slugs = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((name) => name.replace(/\.(mdx|md)$/i, ""));

  return slugs.map((slug) => ({ slug }));
}

export async function generateStaticParams() {
  const index = await loadGuideIndex();
  return index.map((g) => ({ slug: g.slug }));
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const baseDir = path.join(process.cwd(), "content", "guides");
  const fileMdx = path.join(baseDir, `${slug}.mdx`);
  const fileMd = path.join(baseDir, `${slug}.md`);

  const raw =
    (await readFile(fileMdx, "utf8").catch(() => null)) ??
    (await readFile(fileMd, "utf8").catch(() => null));

  if (!raw) notFound();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-4xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Guide
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {slug}
          </h1>
          <pre className="mt-6 whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-100">
            {raw}
          </pre>
        </section>
      </main>
    </div>
  );
}
