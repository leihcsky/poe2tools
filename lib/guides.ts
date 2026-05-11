import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type GuideCategory = "patch" | "beginner" | "builds" | "economy" | "endgame";

export type GuideFrontmatter = {
  title: string;
  category: GuideCategory;
  date: string;
  lastModified?: string;
  readMinutes?: number;
  excerpt?: string;
  image?: string;
  keywords?: string[];
};

export type GuideDoc = {
  slug: string;
  frontmatter: GuideFrontmatter;
  body: string;
};

function parseFrontmatterBlock(block: string): Partial<GuideFrontmatter> {
  const lines = block.split(/\r?\n/g);
  const out: Record<string, unknown> = {};

  let currentKey: string | null = null;
  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "  ");
    if (!line.trim()) continue;

    const listMatch = /^ {2}-\s+(.*)$/.exec(line);
    if (listMatch && currentKey) {
      const v = listMatch[1].trim();
      const arr = Array.isArray(out[currentKey]) ? (out[currentKey] as unknown[]) : [];
      arr.push(stripQuotes(v));
      out[currentKey] = arr;
      continue;
    }

    const kvMatch = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!kvMatch) continue;

    const key = kvMatch[1];
    const valueRaw = kvMatch[2] ?? "";
    currentKey = key;

    if (!valueRaw.trim()) {
      out[key] = [];
      continue;
    }

    const v = valueRaw.trim();
    if (/^\d+$/.test(v)) {
      out[key] = Number(v);
    } else {
      out[key] = stripQuotes(v);
    }
  }

  return out;
}

function stripQuotes(v: string): string {
  const s = v.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    return s.slice(1, -1);
  }
  return s;
}

export function parseGuideFile(slug: string, raw: string): GuideDoc | null {
  const normalized = raw.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return null;
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) return null;

  const fmBlock = normalized.slice(4, end);
  const body = normalized.slice(end + "\n---\n".length);
  const partial = parseFrontmatterBlock(fmBlock);

  const title =
    typeof partial.title === "string" && partial.title.trim() ? partial.title.trim() : null;
  const category =
    typeof partial.category === "string" ? (partial.category as GuideCategory) : null;
  const date =
    typeof partial.date === "string" && partial.date.trim() ? partial.date.trim() : null;

  if (!title || !category || !date) return null;

  const readMinutes =
    typeof partial.readMinutes === "number" && Number.isFinite(partial.readMinutes)
      ? partial.readMinutes
      : undefined;

  const lastModified =
    typeof partial.lastModified === "string" && partial.lastModified.trim()
      ? partial.lastModified.trim()
      : undefined;

  const excerpt = typeof partial.excerpt === "string" ? partial.excerpt : undefined;
  const image = typeof partial.image === "string" ? partial.image : undefined;
  const keywords = Array.isArray(partial.keywords)
    ? (partial.keywords as unknown[]).filter((x): x is string => typeof x === "string")
    : undefined;

  return {
    slug,
    frontmatter: {
      title,
      category,
      date,
      lastModified,
      readMinutes,
      excerpt,
      image,
      keywords,
    },
    body: body.trim(),
  };
}

export async function listGuideSlugs(): Promise<string[]> {
  const baseDir = path.join(process.cwd(), "content", "guides");
  const entries = await readdir(baseDir, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith(".mdx") || name.endsWith(".md"))
    .map((name) => name.replace(/\.(mdx|md)$/i, ""));
}

export async function readGuide(slug: string): Promise<GuideDoc | null> {
  const baseDir = path.join(process.cwd(), "content", "guides");
  const fileMdx = path.join(baseDir, `${slug}.mdx`);
  const fileMd = path.join(baseDir, `${slug}.md`);

  const raw =
    (await readFile(fileMdx, "utf8").catch(() => null)) ??
    (await readFile(fileMd, "utf8").catch(() => null));

  if (!raw) return null;
  return parseGuideFile(slug, raw);
}

