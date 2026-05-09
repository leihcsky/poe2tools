"use client";

import { useMemo, useState } from "react";

type Suggestion = {
  ids: string[];
  score: number;
  reason: string | null;
};

type ApiResponse = {
  inputIds: string[];
  normalizedIds: string[];
  missingIds: string[];
  suggestions: Suggestion[];
};

function parseIds(input: string): string[] {
  return input
    .split(/[\s,，;；\n]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function RuneCalculatorWidget() {
  const [rawInput, setRawInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

  const inputIds = useMemo(() => parseIds(rawInput), [rawInput]);

  async function handleSubmit() {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools/runes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids: inputIds }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data = (await res.json()) as ApiResponse;
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
            Calculator
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Separate rune IDs with commas, spaces, or new lines.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || inputIds.length === 0}
          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950"
        >
          {isLoading ? "Calculating…" : "Get suggestions"}
        </button>
      </div>

      <div className="mt-4">
        <textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          rows={4}
          placeholder="Example: rune_001, rune_002, rune_003"
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-950 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {inputIds.length} ID(s) detected
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Suggestions
            </h3>
            {result.missingIds.length > 0 ? (
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Missing: {result.missingIds.join(", ")}
              </div>
            ) : null}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3">
            {result.suggestions.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                No suggestions yet. This usually means the dataset is empty or
                there are no tags/rules available for scoring.
              </div>
            ) : (
              result.suggestions.map((s) => (
                <div
                  key={s.ids.join("|")}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                      {s.ids.join(" + ")}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      Score: {s.score}
                    </div>
                  </div>
                  {s.reason ? (
                    <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      {s.reason}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

