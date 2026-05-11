import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.top";

export const metadata: Metadata = {
  title: "About POE2Tools — Built by POE2 Players, for POE2 Players",
  description:
    "POE2Tools is a free community toolkit built by experienced Path of Exile 2 players. Learn why we made these tools and what drives us.",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: "About POE2Tools",
    description: "Free community toolkit built by experienced Path of Exile 2 players.",
    url: `${BASE_URL}/about`,
    siteName: "POE2Tools",
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl mx-auto flex-1 px-6 py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <Link href="/" className="p2-link">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-700 dark:text-zinc-300">About</span>
        </nav>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-white/95 sm:text-4xl">
            About POE2Tools
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Built by players who spent thousands of hours in Wraeclast.
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-white/75">
            <p>
              POE2Tools started from a simple frustration: every league, I found myself re-deriving
              the same calculations in spreadsheets, re-checking the same rune interactions on Reddit
              threads, and wishing someone had just built a clean tool that did the math for me.
            </p>

            <p>
              I've been playing Path of Exile since Closed Beta (2013) and transitioned to POE2 on
              day one of Early Access. Over the years, I've league-started as everything from ED
              Contagion Trickster to Righteous Fire Juggernaut, pushed 40/40 challenges multiple
              leagues, and spent more time in PoB than I'd like to admit. When POE2 introduced Runes
              of Aldur and Runic Ward, I realized these systems needed their own dedicated tools — not
              just wiki pages, but interactive calculators where you can plug in your actual numbers
              and get actionable results.
            </p>

            <h2 className="!mt-10 text-xl font-semibold text-white/95">
              Why we built this
            </h2>

            <p>
              The POE2 community is full of smart theorycrafters, but the tools haven't kept up with
              the game's complexity. We wanted to fill that gap with:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-white/90">Calculators that actually help you decide</strong> —
                not just display data, but surface recommendations and highlight what matters for your
                build
              </li>
              <li>
                <strong className="text-white/90">Instant updates after patches</strong> — our data
                pipeline can ingest new values the same day patch notes drop, so you never use stale
                numbers
              </li>
              <li>
                <strong className="text-white/90">No account required, no paywalls</strong> —
                just open the tool and use it. This is a community project first.
              </li>
              <li>
                <strong className="text-white/90">Mobile-friendly</strong> — because half the time
                you're alt-tabbing from the game or checking something on your phone between maps
              </li>
            </ul>

            <h2 className="!mt-10 text-xl font-semibold text-white/95">
              What we offer
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-[#F2BF43]">Rune Combination Calculator</h3>
                <p className="mt-1 text-xs text-white/60">
                  Find high-synergy Runes of Aldur setups for any goal — mapping, loot, or challenge content.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-[#F2BF43]">Runic Ward Calculator</h3>
                <p className="mt-1 text-xs text-white/60">
                  Estimate your effective HP from Ward, recovery windows, and how many hits you can tank.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-[#F2BF43]">Rune Database</h3>
                <p className="mt-1 text-xs text-white/60">
                  Every Rune of Aldur with effects, difficulty ratings, rewards, and synergy analysis.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-[#F2BF43]">Guides</h3>
                <p className="mt-1 text-xs text-white/60">
                  Practical guides written from real gameplay experience, not recycled wiki content.
                </p>
              </div>
            </div>

            <h2 className="!mt-10 text-xl font-semibold text-white/95">
              Our philosophy
            </h2>

            <p>
              We don't pretend to have all the answers — POE2 is a living game that changes with
              every patch. What we can offer is a solid toolset that saves you time, reduces
              guesswork, and lets you focus on actually playing the game instead of juggling
              spreadsheets.
            </p>

            <p>
              Every calculator, every database entry, every guide is written and maintained by people
              who actually play the game at a high level. We test our own tools in red maps, pinnacle
              content, and league challenges. If something feels off, we fix it — because we use it
              too.
            </p>

            <h2 className="!mt-10 text-xl font-semibold text-white/95">
              Looking ahead
            </h2>

            <p>
              We're actively developing more tools — Verisium Crafting Simulator, Atlas Planner, and
              expanded database coverage for skill gems and unique items. As POE2 evolves, so will
              POE2Tools.
            </p>

            <p>
              Got feedback, found a bug, or want to suggest a feature? We'd love to hear from you.
            </p>

            <div className="!mt-8">
              <Link
                href="/contact"
                className="p2-cta-primary inline-flex h-10 items-center justify-center rounded-full bg-[#F2BF43] px-5 text-sm font-medium transition-colors hover:bg-[#e5b23d]"
                style={{ color: "#0a0a0a" }}
              >
                Get in touch →
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
