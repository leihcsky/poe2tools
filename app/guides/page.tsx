import { Suspense } from "react";
import GuidesIndexClient, {
  type GuideListItem,
} from "@/components/guides/GuidesIndexClient";
import { listGuideSlugs, readGuide } from "@/lib/guides";
import type { Metadata } from "next";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "POE2 Guides — Patch 0.5 Runes of Aldur, Builds & Beginner Tips",
  description:
    "POE2 guides for Path of Exile 2 Patch 0.5: Runes of Aldur explained, patch-day prep checklist, beginner first-hours walkthrough, and endgame strategies.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "POE2 Guides — Patch 0.5 Runes of Aldur, Builds & Beginner Tips",
    description:
      "POE2 guides for Path of Exile 2 Patch 0.5: Runes of Aldur explained, patch-day prep checklist, beginner first-hours walkthrough, and endgame strategies.",
    url: "/guides",
  },
};

export default async function GuidesIndexPage() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";
  const patchName = process.env.NEXT_PUBLIC_PATCH_NAME ?? "Return of the Ancients";
  const slugs = await listGuideSlugs();

  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

  const docs = await Promise.all(slugs.map((s) => readGuide(s)));
  const items: GuideListItem[] = docs
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .map((d) => ({
      slug: d.slug,
      title: d.frontmatter.title,
      excerpt: d.frontmatter.excerpt ?? "",
      category: d.frontmatter.category,
      dateLabel: (() => {
        const dt = new Date(d.frontmatter.date);
        return Number.isNaN(dt.getTime()) ? d.frontmatter.date : fmt.format(dt);
      })(),
      readMinutes: d.frontmatter.readMinutes,
      featured: d.frontmatter.category === "patch",
    }));

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <Suspense>
          <GuidesIndexClient
            patchVersion={patchVersion}
            patchName={patchName}
            items={items}
          />
        </Suspense>
      </main>
    </div>
  );
}
