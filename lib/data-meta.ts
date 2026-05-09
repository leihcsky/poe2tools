import { readFile } from "node:fs/promises";
import path from "node:path";

export type DataStatus = "current" | "outdated" | "updating";

export type DataMeta = {
  patch_version: string;
  last_updated: string;
  status: DataStatus;
};

function isDataStatus(v: unknown): v is DataStatus {
  return v === "current" || v === "outdated" || v === "updating";
}

export async function readDataMeta(fileName: string): Promise<DataMeta | null> {
  const filePath = path.join(process.cwd(), "data", fileName);
  const raw = await readFile(filePath, "utf8").catch(() => "");
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object") return null;
    const meta = (parsed as { meta?: unknown }).meta;
    if (!meta || typeof meta !== "object") return null;

    const patch_version = (meta as { patch_version?: unknown }).patch_version;
    const last_updated = (meta as { last_updated?: unknown }).last_updated;
    const status = (meta as { status?: unknown }).status;

    if (typeof patch_version !== "string") return null;
    if (typeof last_updated !== "string") return null;
    if (!isDataStatus(status)) return null;

    return { patch_version, last_updated, status };
  } catch {
    return null;
  }
}

