import { notFound } from "next/navigation";
import Link from "next/link";
import { listGuideSlugs, readGuide } from "@/lib/guides";
import type { Metadata } from "next";
import TableOfContents, { type TocItem } from "@/components/guides/TableOfContents";
import GuideCoverImage from "@/components/guides/GuideCoverImage";

export const runtime = "nodejs";
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

function clampMetaText(s: string, maxLen: number): string {
  const t = s.trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
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

  const title = doc.frontmatter.title.trim();
  const rawDescription =
    doc.frontmatter.excerpt?.trim() ||
    plainTextFromMarkdown(doc.body, 200) ||
    "Patch guides and Path of Exile 2 strategies.";
  const description = clampMetaText(rawDescription, 155);

  const keywords = Array.isArray(doc.frontmatter.keywords)
    ? doc.frontmatter.keywords.filter((k) => typeof k === "string")
    : undefined;

  const image = doc.frontmatter.image || "/images/guides/poe2-runes-of-aldur-explained.svg";
  const url = `/guides/${slug}`;

  return {
    title: { absolute: title },
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractToc(body: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = body.split(/\n/g);
  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line);
    if (!h2) continue;
    const text = h2[1].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_~`]/g, "");
    items.push({ id: slugify(text), text });
  }
  return items;
}

function renderInline(text: string): React.ReactNode[] {
  const raw: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > lastIndex) raw.push(text.slice(lastIndex, match.index));
    const label = match[1];
    const href = match[2];
    raw.push(
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
  if (lastIndex < text.length) raw.push(text.slice(lastIndex));

  const out: React.ReactNode[] = [];
  let frag = 0;
  for (let k = 0; k < raw.length; k++) {
    const n = raw[k];
    if (typeof n !== "string") {
      out.push(n);
      continue;
    }
    const parts = n.split(/(\*\*[^*]+\*\*)/g);
    for (const p of parts) {
      if (!p) continue;
      const bold = /^\*\*([^*]+)\*\*$/.exec(p);
      if (bold) {
        out.push(
          <strong
            key={`em-${frag++}`}
            className="font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {bold[1]}
          </strong>,
        );
      } else {
        out.push(p);
      }
    }
  }
  return out;
}

function parsePipeTableRow(line: string): string[] | null {
  const t = line.trim();
  if (!t.startsWith("|") || !t.endsWith("|")) return null;
  return t
    .slice(1, -1)
    .split("|")
    .map((c) => c.trim());
}

function isMarkdownTableSeparatorRow(cells: string[]): boolean {
  return (
    cells.length > 0 &&
    cells.every((c) => {
      const s = c.replace(/\s/g, "");
      return /^:?-{2,}:?$/.test(s);
    })
  );
}

type ListBranch = { text: string; children: ListBranch[] };

function flatDepthToTree(flat: { depth: number; text: string }[]): ListBranch[] {
  const result: ListBranch[] = [];
  const stack: { depth: number; list: ListBranch[] }[] = [{ depth: -1, list: result }];
  for (const row of flat) {
    const node: ListBranch = { text: row.text, children: [] };
    while (stack.length > 1 && row.depth <= stack[stack.length - 1].depth) {
      stack.pop();
    }
    stack[stack.length - 1].list.push(node);
    stack.push({ depth: row.depth, list: node.children });
  }
  return result;
}

function renderUlBranches(nodes: ListBranch[], depth = 0): React.ReactNode {
  if (nodes.length === 0) return null;
  const isNested = depth > 0;
  return (
    <ul
      className={
        isNested
          ? "mt-2 list-outside list-[circle] space-y-1.5 border-l-2 border-dashed border-zinc-300/75 pl-4 text-[0.96em] marker:text-zinc-500 dark:border-zinc-600/55 dark:marker:text-zinc-400"
          : "list-outside list-disc space-y-2.5 pl-7 marker:text-amber-700/80 dark:marker:text-amber-400/75"
      }
    >
      {nodes.map((n, idx) => (
        <li key={idx} className="pl-0.5 leading-relaxed sm:pl-0">
          {renderInline(n.text)}
          {n.children.length > 0 ? renderUlBranches(n.children, depth + 1) : null}
        </li>
      ))}
    </ul>
  );
}

function renderOlBranches(nodes: ListBranch[], depth = 0): React.ReactNode {
  if (nodes.length === 0) return null;
  const isNested = depth > 0;
  const listStyle =
    depth === 0
      ? "list-outside list-decimal space-y-2.5 pl-7 marker:font-medium marker:text-zinc-500 dark:marker:text-zinc-400"
      : depth === 1
        ? "mt-2 list-outside space-y-1.5 border-l-2 border-dashed border-zinc-300/75 pl-4 text-[0.96em] [list-style-type:lower-alpha] dark:border-zinc-600/55"
        : "mt-2 list-outside space-y-1.5 border-l-2 border-dotted border-zinc-300/65 pl-4 text-[0.94em] [list-style-type:lower-roman] dark:border-zinc-600/45";
  return (
    <ol className={listStyle}>
      {nodes.map((n, idx) => (
        <li key={idx} className="leading-relaxed">
          {renderInline(n.text)}
          {n.children.length > 0 ? renderOlBranches(n.children, depth + 1) : null}
        </li>
      ))}
    </ol>
  );
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
          className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-100"
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
        <div key={`img-${i}`} className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <GuideCoverImage src={img[2]} alt={img[1] || ""} width={1200} height={630} />
        </div>,
      );
      i += 1;
      continue;
    }

    if (/^-{3,}$|^\*{3,}$|^_{3,}$/.test(line.trim())) {
      out.push(
        <hr
          key={`hr-${i}`}
          className="my-10 border-0 border-t border-zinc-200 dark:border-zinc-800"
        />,
      );
      i += 1;
      continue;
    }

    const tableStart = parsePipeTableRow(line);
    if (tableStart) {
      const rows: string[][] = [];
      let j = i;
      while (j < lines.length) {
        const parsed = parsePipeTableRow(lines[j]);
        if (!parsed) break;
        if (isMarkdownTableSeparatorRow(parsed)) {
          j += 1;
          continue;
        }
        rows.push(parsed);
        j += 1;
      }
      if (rows.length > 0) {
        const [header, ...body] = rows;
        out.push(
          <div
            key={`tbl-${i}`}
            className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/40"
          >
            <table className="min-w-full divide-y divide-zinc-200 text-left text-sm leading-relaxed dark:divide-zinc-800">
              <thead>
                <tr>
                  {header.map((cell, hi) => (
                    <th
                      key={hi}
                      scope="col"
                      className="whitespace-nowrap bg-zinc-50 px-4 py-3 font-semibold text-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-100"
                    >
                      {renderInline(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700 dark:divide-zinc-800/80 dark:text-zinc-300">
                {body.map((row, ri) => (
                  <tr key={ri}>
                    {header.map((_, ci) => (
                      <td key={ci} className="px-4 py-3.5 align-top">
                        {renderInline(row[ci] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        i = j;
      } else {
        i += 1;
      }
      continue;
    }

    const h1 = /^#\s+(.+)$/.exec(line);
    if (h1) {
      out.push(
        <h1
          key={`h1-${i}`}
          className="mt-10 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          {renderInline(h1[1])}
        </h1>,
      );
      i += 1;
      continue;
    }

    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2) {
      const headingText = h2[1].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_~`]/g, "");
      out.push(
        <h2
          key={`h2-${i}`}
          id={slugify(headingText)}
          className="mt-14 scroll-mt-28 text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          {renderInline(h2[1])}
        </h2>,
      );
      i += 1;
      continue;
    }

    const h3 = /^###\s+(.+)$/.exec(line);
    if (h3) {
      const headingText = h3[1].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_~`]/g, "");
      out.push(
        <h3
          key={`h3-${i}`}
          id={slugify(headingText)}
          className="mt-8 scroll-mt-28 border-l-[3px] border-amber-500/55 pl-4 text-[0.98rem] font-semibold leading-snug text-zinc-800 dark:border-amber-400/50 dark:text-zinc-200"
        >
          {renderInline(h3[1])}
        </h3>,
      );
      i += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quotes: string[] = [];
      let j = i;
      while (j < lines.length && /^\s*>\s?/.test(lines[j])) {
        quotes.push(lines[j].replace(/^\s*>\s?/, ""));
        j += 1;
      }
      out.push(
        <blockquote
          key={`bq-${i}`}
          className="mt-8 border-l-[3px] border-amber-500/65 bg-amber-500/[0.07] py-4 pl-5 pr-4 text-[15px] leading-[1.75] text-zinc-700 dark:border-amber-400/55 dark:bg-amber-500/[0.09] dark:text-zinc-200"
        >
          {quotes.map((q, qi) => (
            <p key={qi} className={qi > 0 ? "mt-3" : ""}>
              {renderInline(q)}
            </p>
          ))}
        </blockquote>,
      );
      i = j;
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const flat: { depth: number; text: string }[] = [];
      let j = i;
      while (j < lines.length) {
        const m = /^(\s*)-\s+(.*)$/.exec(lines[j]);
        if (!m) break;
        const indent = m[1].replace(/\t/g, "  ").length;
        const depth = Math.max(0, Math.floor(indent / 2));
        flat.push({ depth, text: m[2].trimEnd() });
        j += 1;
      }
      if (flat.length > 0) {
        out.push(
          <div
            key={`ul-${i}`}
            className="guide-md-list mt-6 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300"
          >
            {renderUlBranches(flatDepthToTree(flat), 0)}
          </div>,
        );
      }
      i = j;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const flat: { depth: number; text: string }[] = [];
      let j = i;
      while (j < lines.length) {
        const m = /^(\s*)\d+\.\s+(.*)$/.exec(lines[j]);
        if (!m) break;
        const indent = m[1].replace(/\t/g, "  ").length;
        const depth = Math.max(0, Math.floor(indent / 2));
        flat.push({ depth, text: m[2].trimEnd() });
        j += 1;
      }
      if (flat.length > 0) {
        out.push(
          <div
            key={`ol-${i}`}
            className="guide-md-list mt-6 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300"
          >
            {renderOlBranches(flatDepthToTree(flat), 0)}
          </div>,
        );
      }
      i = j;
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const para: string[] = [];
    let j = i;
    while (
      j < lines.length &&
      lines[j].trim() &&
      !lines[j].startsWith("#") &&
      !lines[j].startsWith("```") &&
      !/^\s*-\s+/.test(lines[j]) &&
      !/^\s*\d+\.\s+/.test(lines[j]) &&
      !/^\s*>\s?/.test(lines[j]) &&
      !parsePipeTableRow(lines[j]) &&
      !/^-{3,}$|^\*{3,}$|^_{3,}$/.test(lines[j].trim())
    ) {
      para.push(lines[j]);
      j += 1;
    }

    out.push(
      <p key={`p-${i}`} className="mt-6 text-[15px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
        {renderInline(para.join(" "))}
      </p>,
    );
    i = j;
  }

  return (
    <div className="max-w-[48rem] [&>:first-child]:mt-0 [&>h2+p]:mt-4 [&>h3+p]:mt-3 [&>h2+blockquote]:mt-4 [&>h3+blockquote]:mt-3 [&>h2+.guide-md-list]:mt-4 [&>h3+.guide-md-list]:mt-3">
      {out}
    </div>
  );
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
    description: clampMetaText(
      doc.frontmatter.excerpt?.trim() ||
        plainTextFromMarkdown(doc.body, 200) ||
        "Path of Exile 2 guides and patch notes.",
      160,
    ),
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
    .slice(0, 2);

  const tocItems = extractToc(doc.body);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-6xl mx-auto flex-1 px-6 py-12">
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

        <div className="flex gap-8">
          {/* Main article */}
          <article className="min-w-0 flex-1">
            <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Guide
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {doc.frontmatter.title}
              </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <span>
              Published{" "}
              {(() => {
                const dt = new Date(doc.frontmatter.date);
                return Number.isNaN(dt.getTime()) ? doc.frontmatter.date : fmt.format(dt);
              })()}
            </span>
            {(() => {
              const mod = doc.frontmatter.lastModified ?? doc.frontmatter.date;
              if (mod === doc.frontmatter.date) return null;
              const dt = new Date(mod);
              if (Number.isNaN(dt.getTime())) return null;
              return (
                <span className="text-zinc-500 dark:text-zinc-500">
                  · Updated {fmt.format(dt)}
                </span>
              );
            })()}
            {typeof doc.frontmatter.readMinutes === "number" && (
              <span>· {doc.frontmatter.readMinutes} min read</span>
            )}
          </div>

              {doc.frontmatter.image ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <GuideCoverImage
                    src={doc.frontmatter.image}
                    alt={doc.frontmatter.title}
                    width={1200}
                    height={630}
                  />
                </div>
              ) : null}

              <div className={doc.frontmatter.image ? "mt-6" : "mt-4"}>
                <Markdown body={doc.body} />
              </div>
            </section>
          </article>

          {/* Table of Contents sidebar */}
          <aside className="hidden w-56 shrink-0 self-start xl:sticky xl:top-24 xl:z-10 xl:block">
            <TableOfContents items={tocItems} />
          </aside>
        </div>

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
                    className="p2-nav-link group overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all hover:border-[#F2BF43]/30 hover:bg-white/[0.06]"
                  >
                    {g.frontmatter.image && (
                      <div className="relative h-32 w-full overflow-hidden bg-white/5">
                        <GuideCoverImage
                          src={g.frontmatter.image}
                          alt={g.frontmatter.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="text-[11px] font-medium text-white/50">
                        {dateLabel}
                        {typeof g.frontmatter.readMinutes === "number"
                          ? ` · ${g.frontmatter.readMinutes} min read`
                          : ""}
                      </div>
                      <div className="mt-1.5 text-sm font-semibold text-white/95 group-hover:text-[#F2BF43] transition-colors">
                        {g.frontmatter.title}
                      </div>
                      {g.frontmatter.excerpt && (
                        <div className="mt-1 text-xs leading-relaxed text-white/60 line-clamp-2">
                          {g.frontmatter.excerpt}
                        </div>
                      )}
                    </div>
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
