"use client";

import { useState } from "react";

export default function WardCalculatorWidget() {
  const [value, setValue] = useState<string>("");

  return (
    <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        Calculator
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Placeholder widget. We will implement inputs and calculations here.
      </p>
      <div className="mt-4">
        <label className="block text-sm font-medium text-zinc-950 dark:text-zinc-50">
          Base Ward
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="numeric"
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="e.g. 1200"
        />
      </div>
    </section>
  );
}
