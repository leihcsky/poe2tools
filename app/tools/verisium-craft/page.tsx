import type { Metadata } from "next";
import CraftingSimWidget from "@/components/tools/CraftingSimWidget";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function VerisiumCraftPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Verisium Crafting Simulator
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Compare crafting paths by success chance and expected cost. This
            page is statically rendered; simulation runs in a client component.
          </p>
        </section>

        <CraftingSimWidget />
      </main>
    </div>
  );
}
