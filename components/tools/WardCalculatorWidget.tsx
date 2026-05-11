"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";

// ─── Placeholder coefficients (update after Patch 0.5 notes) ────────────────
const WARD_RECOVERY_BASE_DELAY = 3.0; // seconds before Ward starts recovering
const WARD_RECOVERY_RATE_BASE = 0.33; // fraction of total Ward recovered per second (at 0% bonus)
const EHP_REFERENCE_HIT = 4000; // reference hit size for comparison

type ContentTier = {
  label: string;
  wardMin: number;
  ehpMin: number;
  note: string;
};

const CONTENT_THRESHOLDS: ContentTier[] = [
  { label: "White maps (T1–T5)", wardMin: 800, ehpMin: 3000, note: "Comfortable entry" },
  { label: "Yellow maps (T6–T10)", wardMin: 1500, ehpMin: 5000, note: "Need some mitigation" },
  { label: "Red maps (T11–T16)", wardMin: 2500, ehpMin: 8000, note: "Ward + layered defense" },
  { label: "Pinnacle bosses", wardMin: 4000, ehpMin: 12000, note: "High Ward + recovery" },
  { label: "Uber content", wardMin: 6000, ehpMin: 18000, note: "Fully invested Ward build" },
];

// ─── Calculation helpers ────────────────────────────────────────────────────

function calcTotalWard(
  baseWard: number,
  percentIncreased: number,
  flatBonus: number,
  runicWardBonus: number,
): number {
  return Math.round(baseWard * (1 + percentIncreased / 100) + flatBonus + runicWardBonus);
}

function calcRecoveryTime(totalWard: number, recoveryRate: number): number {
  const ratePerSec = WARD_RECOVERY_RATE_BASE * (1 + recoveryRate / 100);
  if (ratePerSec <= 0) return Infinity;
  const fillTime = 1 / ratePerSec; // seconds to recover 100% once recovery starts
  return WARD_RECOVERY_BASE_DELAY + fillTime;
}

function calcEHP(totalWard: number, mitigationPercent: number): number {
  const mitFactor = 1 / (1 - Math.min(mitigationPercent, 99) / 100);
  return Math.round(totalWard * mitFactor);
}

function calcHitsToDeplete(totalWard: number, mitigationPercent: number, avgHit: number): number {
  if (avgHit <= 0) return Infinity;
  const mitigated = avgHit * (1 - Math.min(mitigationPercent, 99) / 100);
  if (mitigated <= 0) return Infinity;
  return Math.ceil(totalWard / mitigated);
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function WardCalculatorWidget() {
  const [baseWard, setBaseWard] = useState(1200);
  const [percentIncreased, setPercentIncreased] = useState(80);
  const [flatBonus, setFlatBonus] = useState(200);
  const [runicWardBonus, setRunicWardBonus] = useState(300);
  const [recoveryRate, setRecoveryRate] = useState(60);
  const [mitigation, setMitigation] = useState(40);
  const [avgHitInput, setAvgHitInput] = useState(EHP_REFERENCE_HIT);

  const totalWard = useMemo(
    () => calcTotalWard(baseWard, percentIncreased, flatBonus, runicWardBonus),
    [baseWard, percentIncreased, flatBonus, runicWardBonus],
  );

  const recoveryTime = useMemo(() => calcRecoveryTime(totalWard, recoveryRate), [totalWard, recoveryRate]);

  const ehp = useMemo(() => calcEHP(totalWard, mitigation), [totalWard, mitigation]);

  const hitsToDeplete = useMemo(
    () => calcHitsToDeplete(totalWard, mitigation, avgHitInput),
    [totalWard, mitigation, avgHitInput],
  );

  function resetDefaults() {
    setBaseWard(1200);
    setPercentIncreased(80);
    setFlatBonus(200);
    setRunicWardBonus(300);
    setRecoveryRate(60);
    setMitigation(40);
    setAvgHitInput(EHP_REFERENCE_HIT);
  }

  return (
    <section className="p2-section overflow-hidden">
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800 p2-divider">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              Ward stats input
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Enter values from your gear and passives. Results update instantly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={resetDefaults}>
              Reset
            </Button>
            <a href="#ward-thresholds" className="p2-link text-xs shrink-0">
              Content thresholds ↓
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[340px_1fr]">
        {/* ─── Left: Inputs ─── */}
        <div className="border-b border-zinc-200 px-6 py-6 dark:border-zinc-800 p2-divider lg:border-b-0 lg:border-r">
          <div className="space-y-5">
            <InputField
              label="Base Ward (from gear)"
              value={baseWard}
              onChange={setBaseWard}
              min={0}
              max={20000}
              step={50}
              hint="Sum of Ward values on all equipment"
            />
            <InputField
              label="% Increased Ward"
              value={percentIncreased}
              onChange={setPercentIncreased}
              min={0}
              max={500}
              step={5}
              hint="From passives, affixes, and buffs"
              suffix="%"
            />
            <InputField
              label="Flat Ward bonus"
              value={flatBonus}
              onChange={setFlatBonus}
              min={0}
              max={5000}
              step={25}
              hint="Flat +Ward from tree, jewels, or buffs"
            />
            <InputField
              label="Runic Ward bonus"
              value={runicWardBonus}
              onChange={setRunicWardBonus}
              min={0}
              max={5000}
              step={25}
              hint="Bonus Ward from inscribed runes"
            />

            <div className="border-t border-white/10 pt-5" />

            <InputField
              label="Ward Recovery Rate"
              value={recoveryRate}
              onChange={setRecoveryRate}
              min={0}
              max={300}
              step={5}
              hint="% increased Ward recovery speed"
              suffix="%"
            />
            <InputField
              label="Damage Mitigation"
              value={mitigation}
              onChange={setMitigation}
              min={0}
              max={99}
              step={1}
              hint="Combined armour + resistances (approx %)"
              suffix="%"
            />

            <div className="border-t border-white/10 pt-5" />

            <InputField
              label="Average incoming hit"
              value={avgHitInput}
              onChange={setAvgHitInput}
              min={100}
              max={50000}
              step={100}
              hint="Typical hit from content you run (for comparison)"
            />
          </div>
        </div>

        {/* ─── Right: Results ─── */}
        <div className="px-6 py-6">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">Results</h3>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ResultCard
              label="Total Ward"
              value={totalWard.toLocaleString()}
              color={totalWard >= 2500 ? "good" : totalWard >= 1200 ? "ok" : "low"}
            />
            <ResultCard
              label="Effective HP (Ward)"
              value={ehp.toLocaleString()}
              color={ehp >= 8000 ? "good" : ehp >= 4000 ? "ok" : "low"}
            />
            <ResultCard
              label="Recovery time"
              value={`${recoveryTime.toFixed(2)}s`}
              color={recoveryTime <= 1 ? "good" : recoveryTime <= 1.5 ? "ok" : "low"}
            />
            <ResultCard
              label={`Hits to deplete (${avgHitInput} dmg)`}
              value={hitsToDeplete === Infinity ? "∞" : String(hitsToDeplete)}
              color={hitsToDeplete >= 5 ? "good" : hitsToDeplete >= 3 ? "ok" : "low"}
            />
          </div>

          <div className="mt-6 p2-card p-4">
            <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              Quick summary
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              With <span className="font-semibold text-zinc-950 dark:text-zinc-50">{totalWard.toLocaleString()}</span>{" "}
              Ward and {mitigation}% mitigation, your Ward pool equals roughly{" "}
              <span className="font-semibold text-zinc-950 dark:text-zinc-50">{ehp.toLocaleString()}</span> effective HP.
              After taking no damage for{" "}
              <span className="font-semibold text-zinc-950 dark:text-zinc-50">{recoveryTime.toFixed(2)}s</span>,
              Ward fully recovers. A {avgHitInput.toLocaleString()} damage hit (after mitigation) would need{" "}
              <span className="font-semibold text-zinc-950 dark:text-zinc-50">
                {hitsToDeplete === Infinity ? "infinite" : hitsToDeplete}
              </span>{" "}
              hits to break through your Ward.
            </p>
          </div>

          {/* ─── Threshold table ─── */}
          <div id="ward-thresholds" className="mt-6 scroll-mt-28">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Content thresholds — how much Ward do you need?
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Reference targets. Your build position is highlighted.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    <th className="py-2 pr-4">Content</th>
                    <th className="py-2 pr-4">Ward target</th>
                    <th className="py-2 pr-4">EHP target</th>
                    <th className="py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTENT_THRESHOLDS.map((tier) => {
                    const meetsWard = totalWard >= tier.wardMin;
                    const meetsEhp = ehp >= tier.ehpMin;
                    const passed = meetsWard && meetsEhp;
                    return (
                      <tr
                        key={tier.label}
                        className={[
                          "border-b border-white/5 text-sm",
                          passed
                            ? "text-emerald-400"
                            : "text-zinc-600 dark:text-zinc-400",
                        ].join(" ")}
                      >
                        <td className="py-2 pr-4 font-medium">{tier.label}</td>
                        <td className="py-2 pr-4">{tier.wardMin.toLocaleString()}</td>
                        <td className="py-2 pr-4">{tier.ehpMin.toLocaleString()}</td>
                        <td className="py-2">
                          {passed ? "✓ You meet this" : tier.note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── Kalguuran skill Ward cost: coming soon ─── */}
          <div id="kalguuran-skills" className="mt-6 scroll-mt-28 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2BF43]/15 text-sm text-[#F2BF43]">
                ⚡
              </span>
              <div>
                <h4 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                  Kalguuran skill Ward cost calculator
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Kalguuran skills use Runic Ward instead of mana, with no attribute or weapon requirements. Each
                  skill has unique per-cast and cooldown mechanics that determine how fast your Ward drains under
                  sustained use. We will add per-skill breakdowns here once Patch 0.5 details are confirmed.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-300">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Coming after Patch 0.5 notes
                </div>
                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                  Once available, you will be able to select your Kalguuran skills and see how many casts
                  your Ward pool can sustain, optimal rotation timing, and per-second drain rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  hint?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-zinc-950 dark:text-zinc-50">{label}</span>
        {suffix ? (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{suffix}</span>
        ) : null}
      </label>
      {hint ? (
        <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">{hint}</div>
      ) : null}
      <div className="mt-2 flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-[#F2BF43]"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
          className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center text-sm text-white outline-none focus:border-[#F2BF43]/50"
        />
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "good" | "ok" | "low";
}) {
  const colorClass =
    color === "good"
      ? "text-emerald-400"
      : color === "ok"
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="p2-card px-4 py-3">
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${colorClass}`}>{value}</div>
    </div>
  );
}
