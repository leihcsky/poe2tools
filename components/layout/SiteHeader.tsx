"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavIconProps = { className?: string };

function LogoMark({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#171233" />
      <path
        fill="#F2BF43"
        d="M21 7.2a6.1 6.1 0 0 1-7.7 7.7l-6.8 6.8a1.2 1.2 0 0 1-1.7-1.7l6.8-6.8A6.1 6.1 0 0 1 16.8 3a4.7 4.7 0 0 0-1.3 3.3 2.2 2.2 0 1 0 2.2 2.2A4.7 4.7 0 0 0 21 7.2z"
      />
      <path
        fill="#7C3AED"
        d="M19 11l.7 2.5L22 14l-2.3.5L19 17l-.7-2.5L16 14l2.3-.5L19 11z"
      />
    </svg>
  );
}

function IconHome({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.1 3 10.2v10.2h6.2v-6.2h5.6v6.2H21V10.2L12 3.1z"
      />
    </svg>
  );
}

function IconTools({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 7.2a6.1 6.1 0 0 1-7.7 7.7l-6.8 6.8a1.2 1.2 0 0 1-1.7-1.7l6.8-6.8A6.1 6.1 0 0 1 16.8 3a4.7 4.7 0 0 0-1.3 3.3 2.2 2.2 0 1 0 2.2 2.2A4.7 4.7 0 0 0 21 7.2z"
      />
    </svg>
  );
}

function IconBook({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M6 3h12a2 2 0 0 1 2 2v15.5a.5.5 0 0 1-.7.45A7.7 7.7 0 0 0 16 20H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 3v12h10a9 9 0 0 1 2 .22V5H6z"
      />
    </svg>
  );
}

function IconCompass({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm4.5 5.5-2.2 6.1-6.1 2.2 2.2-6.1 6.1-2.2zm-6 6 3-1.1 1.1-3-3 1.1-1.1 3z"
      />
    </svg>
  );
}

function IconDatabase({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2c5 0 9 1.6 9 3.6v12.8C21 20.4 17 22 12 22S3 20.4 3 18.4V5.6C3 3.6 7 2 12 2zm0 2C7.1 4 5 5.1 5 5.6S7.1 7.2 12 7.2s7-1.1 7-1.6S16.9 4 12 4zm7 4.8c-1.8 1-4.7 1.6-7 1.6s-5.2-.6-7-1.6v2.6c0 .5 2.1 1.6 7 1.6s7-1.1 7-1.6V8.8zm0 5c-1.8 1-4.7 1.6-7 1.6s-5.2-.6-7-1.6v2.6c0 .5 2.1 1.6 7 1.6s7-1.1 7-1.6v-2.6z"
      />
    </svg>
  );
}

function IconChevron({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.4 9.2 12 13.8l4.6-4.6 1.4 1.4-6 6-6-6 1.4-1.4z"
      />
    </svg>
  );
}

function IconSpark({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2l1.2 4.3L17.5 8l-4.3 1.2L12 13.5l-1.2-4.3L6.5 8l4.3-1.7L12 2zm7 9l.7 2.5L22 14l-2.3.5L19 17l-.7-2.5L16 14l2.3-.5L19 11zm-14 2l.8 2.9L9 17l-3.2.7L5 20l-.8-2.9L1 17l3.2-.7L5 13z"
      />
    </svg>
  );
}

function IconShield({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2 4 5.5V12c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V5.5L12 2zm0 2.3 6 2.6V12c0 3.8-2.4 7.2-6 7.8-3.6-.6-6-4-6-7.8V6.9l6-2.6z"
      />
    </svg>
  );
}

function IconFlask({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 2h6v2h-1v5.3l4.8 7.8A3.5 3.5 0 0 1 15.8 22H8.2a3.5 3.5 0 0 1-3-5.9L10 9.3V4H9V2zm3 10-5 8h10l-5-8z"
      />
    </svg>
  );
}

function IconMap({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M15 4 9 2 3 4v16l6-2 6 2 6-2V2l-6 2zm0 2.2 4-1.3v12.4l-4 1.3V6.2zM5 6.2l4-1.3v12.4l-4 1.3V6.2zm6 .1 2 .7v12.4l-2-.7V6.3z"
      />
    </svg>
  );
}

function IconTag({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
      />
    </svg>
  );
}

function IconSearch({ className }: NavIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 2a8 8 0 1 1 5.3 14l4.2 4.2-1.4 1.4L13.9 17.4A8 8 0 0 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"
      />
    </svg>
  );
}

function NavLink({
  href,
  children,
  onNavigate,
  pathname,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate?: () => void;
  pathname: string;
}) {
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
      aria-current={isActive ? "page" : undefined}
      className={[
        "p2-nav-link inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#F2BF43]/15 text-[#F2BF43] ring-1 ring-[#F2BF43]/35"
          : "text-white/80 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function DropDownItem({
  href,
  icon,
  title,
  description,
  badge,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
      className="p2-nav-link flex items-start gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/6"
    >
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/35 to-cyan-500/25 text-white/90 ring-1 ring-white/10">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-white">
          {title}
          {badge ? <span className="ml-2 align-middle">{badge}</span> : null}
        </div>
        <div className="mt-0.5 text-xs text-white/70">
          {description}
        </div>
      </div>
    </Link>
  );
}

function Menu({
  id,
  label,
  icon,
  align = "left",
  maxWidth = "720px",
  children,
  openId,
  onOpen,
  onClose,
  isActive = false,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  align?: "left" | "right";
  maxWidth?: string;
  children: React.ReactNode;
  openId: string | null;
  onOpen: () => void;
  onClose: () => void;
  isActive?: boolean;
}) {
  const isOpen = openId === id;

  return (
    <div className="relative">
      <div
        className="relative"
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      >
        <button
          type="button"
          onClick={() => (isOpen ? onClose() : onOpen())}
          className={[
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            isActive
              ? "bg-[#F2BF43]/15 text-[#F2BF43] ring-1 ring-[#F2BF43]/35"
              : "text-white/80 hover:bg-white/10 hover:text-white",
          ].join(" ")}
          aria-expanded={isOpen}
        >
          {icon}
          <span>{label}</span>
          <IconChevron className="h-4 w-4 text-white/60" />
        </button>

        <div
          className="absolute left-0 top-full h-3 w-full"
          aria-hidden="true"
        />

        <div
          className={[
            "absolute top-full z-[200] mt-2 p2-popover p-4 transition-opacity duration-150",
            align === "right" ? "right-0" : "left-0",
            isOpen
              ? "visible pointer-events-auto opacity-100"
              : "invisible pointer-events-none opacity-0",
          ].join(" ")}
          style={{ width: `min(${maxWidth}, calc(100dvw - 48px))` }}
          onClickCapture={onClose}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";
  const pathname = usePathname();
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"tools" | "guides" | "db" | null>(null);
  const prevPathnameRef = useRef<string | null>(null);

  const closeMenus = () => setOpenId(null);

  useEffect(() => {
    const t = setTimeout(() => setOpenId(null), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      setMobileOpen(false);
      setMobileSection(null);
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header className="site-header sticky top-0 z-[150] w-full border-b border-white/10 bg-[#171233]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-base font-semibold text-zinc-950 dark:text-zinc-50"
        >
          <LogoMark className="h-9 w-9" />
          <span className="tracking-tight leading-none">
            <span>poe</span>
            <span className="text-[color:var(--link)]">2</span>
            <span>tools</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300 sm:flex">
          <NavLink href="/" pathname={pathname} onNavigate={closeMenus}>
            <IconHome className="h-4 w-4" />
            Home
          </NavLink>

          <Menu
            id="tools"
            label="Tools"
            icon={<IconTools className="h-4 w-4" />}
            align="left"
            isActive={pathname.startsWith("/tools")}
            openId={openId}
            onOpen={() => setOpenId("tools")}
            onClose={() => setOpenId((v) => (v === "tools" ? null : v))}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Tools
                </div>
                <div className="mt-2 flex flex-col">
                  <DropDownItem
                    href="/tools/rune-combinations"
                    icon={<IconSpark className="h-4 w-4" />}
                    title="Rune Combination Calculator"
                    description="Find strong Runes of Aldur combos fast."
                    badge={
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                        {patchVersion}
                      </span>
                    }
                  />
                  <DropDownItem
                    href="/tools/runic-ward-calc"
                    icon={<IconShield className="h-4 w-4" />}
                    title="Runic Ward Calculator"
                    description="Estimate Ward value and recovery."
                    badge={
                      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                        {patchVersion}
                      </span>
                    }
                  />
                  <DropDownItem
                    href="/tools"
                    icon={<IconFlask className="h-4 w-4" />}
                    title="Verisium Crafting Simulator"
                    description="Compare crafting paths and expected cost."
                    badge={
                      <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                        Coming soon
                      </span>
                    }
                  />
                  <DropDownItem
                    href="/tools"
                    icon={<IconMap className="h-4 w-4" />}
                    title="Atlas Planner"
                    description="Visual Atlas tree planning with presets."
                    badge={
                      <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                        Coming soon
                      </span>
                    }
                  />
                </div>
              </div>

              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Quick links
                </div>
                <div className="mt-2 flex flex-col">
                  <DropDownItem
                    href="/tools"
                    icon={<IconTools className="h-4 w-4" />}
                    title="All tools"
                    description="Browse every calculator and planner."
                  />
                  <DropDownItem
                    href="/db/runes"
                    icon={<IconDatabase className="h-4 w-4" />}
                    title="Rune database"
                    description="Lookup rune effects and tags."
                  />
                </div>
              </div>

              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Status
                </div>
                <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                  Each tool can display its own data freshness, so you can
                  quickly see what’s current or needs updates after a patch.
                </div>
              </div>
            </div>
          </Menu>

          <Menu
            id="guides"
            label="Guides"
            icon={<IconCompass className="h-4 w-4" />}
            align="left"
            isActive={pathname.startsWith("/guides")}
            openId={openId}
            onOpen={() => setOpenId("guides")}
            onClose={() => setOpenId((v) => (v === "guides" ? null : v))}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Guides
                </div>
                <div className="mt-2 flex flex-col">
                  <DropDownItem
                    href="/guides?cat=beginner"
                    icon={<IconBook className="h-4 w-4" />}
                    title="Beginner guide"
                    description="Start strong with the basics."
                  />
                  <DropDownItem
                    href="/guides?cat=builds"
                    icon={<IconShield className="h-4 w-4" />}
                    title="Build picks"
                    description="League start and endgame ideas."
                  />
                  <DropDownItem
                    href="/guides?cat=patch"
                    icon={<IconSpark className="h-4 w-4" />}
                    title="Patch notes breakdown"
                    description="What changed and why it matters."
                  />
                  <DropDownItem
                    href="/guides?cat=economy"
                    icon={<IconFlask className="h-4 w-4" />}
                    title="Economy & crafting"
                    description="Currency, farming, and crafting tips."
                  />
                </div>
              </div>
              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Discover
                </div>
                <div className="mt-2 flex flex-col">
                  <DropDownItem
                    href="/guides"
                    icon={<IconSearch className="h-4 w-4" />}
                    title="All guides"
                    description="Browse the full guide library."
                  />
                  <DropDownItem
                    href="/tools/rune-combinations"
                    icon={<IconTools className="h-4 w-4" />}
                    title="Related tool: Rune combos"
                    description="Jump straight into the calculator."
                  />
                </div>
              </div>
              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Notes
                </div>
                <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                  Guides can also show a freshness badge if they depend on patch
                  data.
                </div>
              </div>
            </div>
          </Menu>

          <Menu
            id="database"
            label="Database"
            icon={<IconDatabase className="h-4 w-4" />}
            align="right"
            maxWidth="460px"
            isActive={pathname.startsWith("/db")}
            openId={openId}
            onOpen={() => setOpenId("database")}
            onClose={() => setOpenId((v) => (v === "database" ? null : v))}
          >
            <div>
              <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Database
              </div>
              <div className="mt-2 flex flex-col">
                <DropDownItem
                  href="/db/runes"
                  icon={<IconSpark className="h-4 w-4" />}
                  title="Runes"
                  description="Effects, tags, and quick reference."
                  badge={
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                      {patchVersion}
                    </span>
                  }
                />
                <DropDownItem
                  href="/db/gems"
                  icon={<IconTag className="h-4 w-4" />}
                  title="Skill gems"
                  description="Stats, scaling, and synergy notes."
                />
                <DropDownItem
                  href="/db/uniques"
                  icon={<IconFlask className="h-4 w-4" />}
                  title="Unique items"
                  description="Mods and acquisition info."
                />
              </div>

              <div className="mt-3 px-2">
                <div className="p2-card px-3 py-2 text-xs text-white/75">
                  Pages are prebuilt and auto-refreshed after patch updates.
                </div>
              </div>
            </div>
          </Menu>
        </nav>

        <div className="relative z-[160] flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation select-none items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/85 [-webkit-tap-highlight-color:transparent] hover:bg-white/[0.06] active:bg-white/[0.08] sm:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M4 6.5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              />
            </svg>
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 md:flex">
              <IconSearch className="h-4 w-4" />
              Search…
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[9999] sm:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            className="absolute inset-0 min-h-[100dvh] cursor-default bg-black/55"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center px-4 pt-3 sm:pt-4">
            <div className="pointer-events-auto mt-14 w-full max-w-lg pb-8">
              <div className="p2-popover p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold uppercase tracking-wider text-white/55">
                        Menu
                      </div>
                      <button
                        type="button"
                        className="touch-manipulation rounded-lg px-2 py-1 text-xs text-white/70 hover:bg-white/5 hover:text-white/90"
                        onClick={() => setMobileOpen(false)}
                      >
                        Close
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        href="/"
                        className="p2-nav-link touch-manipulation rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/90 hover:bg-white/[0.06]"
                        onClick={() => setMobileOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        href="/guides"
                        className="p2-nav-link touch-manipulation rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/90 hover:bg-white/[0.06]"
                        onClick={() => setMobileOpen(false)}
                      >
                        Guides
                      </Link>
                      <Link
                        href="/db/gems"
                        className="p2-nav-link touch-manipulation rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/90 hover:bg-white/[0.06]"
                        onClick={() => setMobileOpen(false)}
                      >
                        Gems
                      </Link>
                      <Link
                        href="/db/runes"
                        className="p2-nav-link touch-manipulation rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/90 hover:bg-white/[0.06]"
                        onClick={() => setMobileOpen(false)}
                      >
                        Runes
                      </Link>
                    </div>

                    <div className="mt-4 space-y-2">
                      <button
                        type="button"
                        className="touch-manipulation flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-white/90 hover:bg-white/[0.06]"
                        onClick={() =>
                          setMobileSection((v) => (v === "tools" ? null : "tools"))
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <IconTools className="h-4 w-4" />
                          Tools
                        </span>
                        <IconChevron
                          className={[
                            "h-4 w-4 transition-transform",
                            mobileSection === "tools" ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </button>
                      {mobileSection === "tools" ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2">
                          <Link
                            href="/tools"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            All tools
                          </Link>
                          <Link
                            href="/tools/rune-combinations"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            Rune combos ({patchVersion})
                          </Link>
                          <Link
                            href="/tools/runic-ward-calc"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            Runic Ward calc ({patchVersion})
                          </Link>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        className="touch-manipulation flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-white/90 hover:bg-white/[0.06]"
                        onClick={() =>
                          setMobileSection((v) => (v === "guides" ? null : "guides"))
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <IconCompass className="h-4 w-4" />
                          Guides
                        </span>
                        <IconChevron
                          className={[
                            "h-4 w-4 transition-transform",
                            mobileSection === "guides" ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </button>
                      {mobileSection === "guides" ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2">
                          <Link
                            href="/guides"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            All guides
                          </Link>
                          <Link
                            href="/guides?cat=beginner"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            Beginner
                          </Link>
                          <Link
                            href="/guides?cat=patch"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            Patch
                          </Link>
                          <Link
                            href="/guides?cat=economy"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            Economy
                          </Link>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        className="touch-manipulation flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-white/90 hover:bg-white/[0.06]"
                        onClick={() =>
                          setMobileSection((v) => (v === "db" ? null : "db"))
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <IconDatabase className="h-4 w-4" />
                          Database
                        </span>
                        <IconChevron
                          className={[
                            "h-4 w-4 transition-transform",
                            mobileSection === "db" ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      </button>
                      {mobileSection === "db" ? (
                        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2">
                          <Link
                            href="/db/gems"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            Skill gems
                          </Link>
                          <Link
                            href="/db/runes"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            Runes
                          </Link>
                          <Link
                            href="/db/uniques"
                            className="p2-nav-link touch-manipulation block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white/95"
                            onClick={() => setMobileOpen(false)}
                          >
                            Unique items
                          </Link>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href="/about"
                        className="p2-nav-link touch-manipulation rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06] hover:text-white/95"
                        onClick={() => setMobileOpen(false)}
                      >
                        About
                      </Link>
                      <Link
                        href="/contact"
                        className="p2-nav-link touch-manipulation rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 hover:bg-white/[0.06] hover:text-white/95"
                        onClick={() => setMobileOpen(false)}
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      )}
    </header>
  );
}
