import { readFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

type DbType = "runes" | "gems" | "uniques";

function isDbType(v: string): v is DbType {
  return v === "runes" || v === "gems" || v === "uniques";
}

async function loadJsonArray(fileName: string): Promise<unknown[]> {
  const filePath = path.join(process.cwd(), "data", fileName);
  const raw = await readFile(filePath, "utf8").catch(() => "");
  const trimmed = raw.trim();
  if (!trimmed) return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") {
      const keys = Object.keys(parsed as Record<string, unknown>);
      if (keys.length === 1) {
        const only = (parsed as Record<string, unknown>)[keys[0]];
        if (Array.isArray(only)) return only;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  if (!isDbType(type)) {
    return Response.json({ ok: false, error: "Unknown type" }, { status: 404 });
  }

  const id = request.nextUrl.searchParams.get("id");
  const slug = request.nextUrl.searchParams.get("slug");

  const fileName = `${type}.json`;
  const items = await loadJsonArray(fileName);

  if (!id && !slug) {
    return Response.json({ ok: true, type, items });
  }

  const match = items.find((x) => {
    if (!x || typeof x !== "object") return false;
    const obj = x as Record<string, unknown>;
    const objId = typeof obj.id === "string" ? obj.id : null;
    const objSlug = typeof obj.slug === "string" ? obj.slug : null;
    if (id && objId === id) return true;
    if (slug && objSlug === slug) return true;
    return false;
  });

  if (!match) {
    return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return Response.json({ ok: true, type, item: match });
}

