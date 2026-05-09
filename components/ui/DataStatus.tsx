import type { ReactNode } from "react";
import type { DataMeta, DataStatus } from "@/lib/data-meta";

type Variant = {
  wrapper: string;
  dot: string;
  badge: string;
  label: string;
};

function variantFor(status: DataStatus): Variant {
  if (status === "current") {
    return {
      wrapper:
        "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100",
      dot: "bg-emerald-500",
      badge:
        "border-emerald-200 bg-white text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200",
      label: "Current",
    };
  }

  if (status === "updating") {
    return {
      wrapper:
        "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-100",
      dot: "bg-blue-500",
      badge:
        "border-blue-200 bg-white text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200",
      label: "Updating",
    };
  }

  return {
    wrapper:
      "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100",
    dot: "bg-amber-500",
    badge:
      "border-amber-200 bg-white text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200",
    label: "Outdated",
  };
}

export function DataStatusBadge({ meta }: { meta: DataMeta }) {
  const v = variantFor(meta.status);
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        v.badge,
      ].join(" ")}
    >
      <span className={["h-2 w-2 rounded-full", v.dot].join(" ")} />
      <span>{v.label}</span>
      <span className="text-zinc-500 dark:text-zinc-400">
        Patch {meta.patch_version}
      </span>
    </span>
  );
}

export function DataStatusCallout({
  meta,
  title,
  right,
}: {
  meta: DataMeta;
  title?: ReactNode;
  right?: ReactNode;
}) {
  const v = variantFor(meta.status);

  const copy =
    meta.status === "current"
      ? "This dataset is up to date."
      : meta.status === "updating"
        ? "This dataset is being updated."
        : "This dataset may be out of date.";

  return (
    <div className={["rounded-2xl border px-4 py-3", v.wrapper].join(" ")}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={["h-2.5 w-2.5 rounded-full", v.dot].join(" ")} />
          <div className="text-sm">
            <div className="font-medium">
              {title ?? "Data status"}{" "}
              <span className="font-normal opacity-80">— {copy}</span>
            </div>
            <div className="text-xs opacity-80">
              Patch {meta.patch_version} · Last updated {meta.last_updated}
            </div>
          </div>
        </div>
        {right ? <div className="text-xs opacity-90">{right}</div> : null}
      </div>
    </div>
  );
}

