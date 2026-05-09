import WardCalculatorWidget from "@/components/tools/WardCalculatorWidget";

export const dynamic = "force-static";

export default function RunicWardCalcPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-5xl mx-auto flex-1 px-6 py-12">
        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Runic Ward Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Estimate total Ward, effective survivability, and recovery behavior
            from your character stats. This page is statically rendered; the
            interactive calculator runs in a client component.
          </p>
        </section>

        <WardCalculatorWidget />
      </main>
    </div>
  );
}
