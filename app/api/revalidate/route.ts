import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_TOKEN;
  if (expected) {
    const token = request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "")
      .trim();

    if (!token || token !== expected) {
      return Response.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  const body = (await request.json().catch(() => null)) as unknown;
  const path =
    body && typeof body === "object" && "path" in body && typeof body.path === "string"
      ? body.path
      : null;
  const typeRaw =
    body && typeof body === "object" && "type" in body ? (body as { type?: unknown }).type : null;
  const type = typeRaw === "page" || typeRaw === "layout" ? typeRaw : null;

  if (!path) {
    return Response.json({ ok: false, error: "Missing path" }, { status: 400 });
  }

  if (path.includes("[") && !type) {
    return Response.json(
      { ok: false, error: "Missing type for dynamic path" },
      { status: 400 },
    );
  }

  if (type) revalidatePath(path, type);
  else revalidatePath(path);

  return Response.json({
    ok: true,
    revalidated: true,
    now: Date.now(),
    path,
    type,
  });
}

