import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { listGuideSlugs, readGuide } from "@/lib/guides";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 60 * 60;

export async function generateStaticParams() {
  const slugs = await listGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

function plainTextFromMarkdown(md: string, maxLen: number): string {
  const s = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await readGuide(slug);
  if (!doc) return {};

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://poe2tools.top";

  const title = doc.frontmatter.title;
  const description =
    doc.frontmatter.excerpt?.trim() ||
    plainTextFromMarkdown(doc.body, 160) ||
    "Patch guides, beginner walkthroughs, and endgame strategies for Path of Exile 2.";

  const keywords = Array.isArray(doc.frontmatter.keywords)
    ? doc.frontmatter.keywords.filter((k) => typeof k === "string")
    : undefined;

  const image = doc.frontmatter.image || "/images/guides/poe2-runes-of-aldur-explained.svg";
  const url = `/guides/${slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: [image],
    },
    other: {
      "article:published_time": doc.frontmatter.date,
      "article:modified_time": doc.frontmatter.date,
      "og:site_name": "POE2Tools",
      "og:url": `${siteUrl}${url}`,
    },
  };
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const label = match[1];
    const href = match[2];
    nodes.push(
      <a
        key={`${match.index}-${href}`}
        href={href}
        className="p2-link"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {label}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function Markdown({ body }: { body: string }) {
  const lines = body.split(/\n/g);
  const out: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const start = i + 1;
      let end = start;
      while (end < lines.length && !lines[end].startsWith("```")) end += 1;
      const code = lines.slice(start, end).join("\n");
      out.push(
        <pre
          key={`code-${i}`}
          className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-100"
        >
          <code className={lang ? `language-${lang}` : undefined}>{code}</code>
        </pre>,
      );
      i = end + 1;
      continue;
    }

    const img = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line.trim());
    if (img) {
      out.push(
        <div key={`img-${i}`} className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <Image
            src={img[2]}
            alt={img[1]}
            width={1200}
            height={630}
            className="h-auto w-full"
          />
        </div>,
      );
      i += 1;
      continue;
    }

    const h1 = /^#\s+(.+)$/.exec(line);
    if (h1) {
      out.push(
        <h1
          key={`h1-${i}`}
          className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          {renderInline(h1[1])}
        </h1>,
      );
      i += 1;
      continue;
    }

    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2) {
      out.push(
        <h2
          key={`h2-${i}`}
          className="mt-6 text-xl font-semibold text-zinc-950 dark:text-zinc-50"
        >
          {renderInline(h2[1])}
        </h2>,
      );
      i += 1;
      continue;
    }

    const h3 = /^###\s+(.+)$/.exec(line);
    if (h3) {
      out.push(
        <h3
          key={`h3-${i}`}
          className="mt-6 text-base font-semibold text-zinc-950 dark:text-zinc-50"
        >
          {renderInline(h3[1])}
        </h3>,
      );
      i += 1;
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        items.push(lines[j].replace(/^\s*-\s+/, ""));
        j += 1;
      }
      out.push(
        <ul key={`ul-${i}`} className="mt-4 list-disc pl-6 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          {items.map((t, idx) => (
            <li key={idx}>{renderInline(t)}</li>
          ))}
        </ul>,
      );
      i = j;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && /^\s*\d+\.\s+/.test(lines[j])) {
        items.push(lines[j].replace(/^\s*\d+\.\s+/, ""));
        j += 1;
      }
      out.push(
        <ol key={`ol-${i}`} className="mt-4 list-decimal pl-6 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
          {items.map((t, idx) => (
            <li key={idx}>{renderInline(t)}</li>
          ))}
        </ol>,
      );
      i = j;
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const para: string[] = [];
    let j = i;
    while (j < lines.length && lines[j].trim() && !lines[j].startsWith("#") && !lines[j].startsWith("```") && !/^\s*-\s+/.test(lines[j]) && !/^\s*\d+\.\s+/.test(lines[j])) {
      para.push(lines[j]);
      j += 1;
    }

    out.push(
      <p key={`p-${i}`} className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        {renderInline(para.join(" "))}
      </p>,
    );
    i = j;
  }

  return <div>{out}</div>;
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await readGuide(slug);
  if (!doc) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://poe2tools.top";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: doc.frontmatter.title,
    description:
      doc.frontmatter.excerpt?.trim() ||
      plainTextFromMarkdown(doc.body, 180) ||
      undefined,
    image: doc.frontmatter.image ? `${siteUrl}${doc.frontmatter.image}` : undefined,
    datePublished: doc.frontmatter.date,
    dateModified: doc.frontmatter.date,
    author: {
      "@type": "Organization",
      name: "POE2Tools",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "POE2Tools",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/guides/${slug}`,
    },
  };

  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const relatedSlugs = await listGuideSlugs();
  const relatedDocs = await Promise.all(
    relatedSlugs.filter((s) => s !== slug).map((s) => readGuide(s)),
  );
  const more = relatedDocs
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
    .slice(0, 6);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-4xl mx-auto flex-1 px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <Link href="/" className="p2-link">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/guides"
            className="p2-link"
          >
            Guides
          </Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-zinc-700 dark:text-zinc-300">
            {doc.frontmatter.title}
          </span>
        </nav>

        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Guide
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {doc.frontmatter.title}
          </h1>

          <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {(() => {
              const dt = new Date(doc.frontmatter.date);
              return Number.isNaN(dt.getTime())
                ? doc.frontmatter.date
                : fmt.format(dt);
            })()}
            {typeof doc.frontmatter.readMinutes === "number"
              ? ` · ${doc.frontmatter.readMinutes} min read`
              : ""}
          </div>

          {doc.frontmatter.image ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <Image
                src={doc.frontmatter.image}
                alt={doc.frontmatter.title}
                width={1200}
                height={630}
                className="h-auto w-full"
              />
            </div>
          ) : null}

          <Markdown body={doc.body} />
        </section>

        <section className="mt-8 p2-section p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              More guides
            </h2>
            <Link
              href="/guides"
              className="p2-link text-xs"
            >
              Back to all guides →
            </Link>
          </div>

          {more.length === 0 ? (
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              No other guides yet.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {more.map((g) => {
                const dt = new Date(g.frontmatter.date);
                const dateLabel = Number.isNaN(dt.getTime())
                  ? g.frontmatter.date
                  : fmt.format(dt);
                return (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="p2-card p-4 transition-colors hover:bg-white/6"
                  >
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {dateLabel}
                      {typeof g.frontmatter.readMinutes === "number"
                        ? ` · ${g.frontmatter.readMinutes} min read`
                        : ""}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      {g.frontmatter.title}
                    </div>
                    {g.frontmatter.excerpt ? (
                      <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {g.frontmatter.excerpt}
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
