import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://poe2tools.top";

export const metadata: Metadata = {
  title: "Contact POE2Tools — Feedback, Bugs & Suggestions",
  description:
    "Get in touch with POE2Tools. Report bugs, suggest features, or share feedback about our Path of Exile 2 tools and guides.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact POE2Tools",
    description: "Report bugs, suggest features, or share feedback about our POE2 tools.",
    url: `${BASE_URL}/contact`,
    siteName: "POE2Tools",
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-3xl mx-auto flex-1 px-6 py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <Link href="/" className="p2-link">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-700 dark:text-zinc-300">Contact</span>
        </nav>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-white/95 sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-white/50">
            We read every message. Response time is usually within 24 hours.
          </p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-white/75">
            <p>
              Whether you found a bug, have a feature suggestion, or just want to say hi — we'd love
              to hear from you. POE2Tools is community-driven, and your feedback directly shapes what
              we build next.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2BF43]/15 text-[#F2BF43]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white/90">Bug Reports</h3>
                <p className="mt-1 text-xs text-white/60">
                  Found a calculation error, broken layout, or unexpected behavior? Let us know and
                  we'll fix it fast.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2BF43]/15 text-[#F2BF43]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="currentColor" d="M19 11l.7 2.5L22 14l-2.3.5L19 17l-.7-2.5L16 14l2.3-.5L19 11zm-7-9l1.2 4.3L17.5 8l-4.3 1.2L12 13.5l-1.2-4.3L6.5 8l4.3-1.7L12 2zm-7 11l.8 2.9L9 17l-3.2.7L5 20l-.8-2.9L1 17l3.2-.7L5 13z" />
                  </svg>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white/90">Feature Requests</h3>
                <p className="mt-1 text-xs text-white/60">
                  Have an idea for a new tool, calculator improvement, or guide topic? We prioritize
                  community suggestions.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2BF43]/15 text-[#F2BF43]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                  </svg>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white/90">General Feedback</h3>
                <p className="mt-1 text-xs text-white/60">
                  Questions about the site, collaboration ideas, or data corrections — anything goes.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2BF43]/15 text-[#F2BF43]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="currentColor" d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white/90">Contribute</h3>
                <p className="mt-1 text-xs text-white/60">
                  Interested in contributing content, data, or code? We're open to collaborators who
                  share our passion for POE2.
                </p>
              </div>
            </div>

            <h2 className="!mt-10 text-xl font-semibold text-white/95">
              How to reach us
            </h2>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">Email</dt>
                  <dd className="mt-1 text-sm text-[#F2BF43]">
                    contact@poe2tools.top
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">GitHub</dt>
                  <dd className="mt-1 text-sm text-white/75">
                    Open an issue on our repository for bugs or feature requests
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-white/50">Discord</dt>
                  <dd className="mt-1 text-sm text-white/75">
                    Join our community server (link coming soon)
                  </dd>
                </div>
              </dl>
            </div>

            <p className="text-xs text-white/40">
              Please note: We cannot provide in-game support or account-related help. For game issues,
              contact Grinding Gear Games directly through their support channels.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
