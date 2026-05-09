import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type RuneRecord = {
  id?: string;
  slug?: string;
  name?: string;
  tags?: string[];
};

type Suggestion = {
  ids: string[];
  score: number;
  reason: string | null;
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

function normalizeIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const cleaned = ids
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean);
  return Array.from(new Set(cleaned));
}

function intersectCount(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setA = new Set(a);
  let count = 0;
  for (const t of b) {
    if (setA.has(t)) count += 1;
  }
  return count;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;
  const ids =
    body && typeof body === "object" && "ids" in body ? (body as { ids?: unknown }).ids : null;
  const normalizedIds = normalizeIds(ids);

  if (normalizedIds.length === 0) {
    return Response.json(
      {
        inputIds: [],
        normalizedIds: [],
        missingIds: [],
        suggestions: [],
      },
      { status: 200 },
    );
  }

  const runes = await loadRunes();
  const byId = new Map<string, RuneRecord>();
  for (const r of runes) {
    if (typeof r.id === "string" && r.id.trim()) byId.set(r.id.trim(), r);
  }

  const missingIds = normalizedIds.filter((id) => !byId.has(id));
  const foundIds = normalizedIds.filter((id) => byId.has(id));

  const selected = foundIds.map((id) => ({ id, rune: byId.get(id)! }));
  const selectedSet = new Set(foundIds);

  const suggestions: Suggestion[] = [];
  if (runes.length > 0 && selected.length > 0) {
    for (const { id: baseId, rune: baseRune } of selected) {
      const baseTags = Array.isArray(baseRune.tags) ? baseRune.tags : [];
      for (const r of runes) {
        const candidateId = typeof r.id === "string" ? r.id.trim() : "";
        if (!candidateId || candidateId === baseId || selectedSet.has(candidateId)) continue;
        const candidateTags = Array.isArray(r.tags) ? r.tags : [];
        const score = intersectCount(baseTags, candidateTags);
        if (score <= 0) continue;
        suggestions.push({
          ids: [baseId, candidateId],
          score,
          reason: score > 0 ? "High tag overlap — likely synergy" : null,
        });
      }
    }
  }

  const best = suggestions
    .sort((a, b) => b.score - a.score || a.ids.join("|").localeCompare(b.ids.join("|")))
    .filter((s, idx, arr) => {
      const key = s.ids.slice().sort().join("|");
      return idx === arr.findIndex((x) => x.ids.slice().sort().join("|") === key);
    })
    .slice(0, 20);

  return Response.json({
    inputIds: normalizedIds,
    normalizedIds,
    missingIds,
    suggestions: best,
  });
}
