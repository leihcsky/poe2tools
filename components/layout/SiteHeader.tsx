import Link from "next/link";

type NavIconProps = { className?: string };

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
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-50"
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
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/30"
    >
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-200">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          {title}
          {badge ? <span className="ml-2 align-middle">{badge}</span> : null}
        </div>
        <div className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
          {description}
        </div>
      </div>
    </Link>
  );
}

function Menu({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="group relative">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-50">
          {icon}
          <span>{label}</span>
          <IconChevron className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="absolute left-0 top-full h-3 w-full" aria-hidden="true" />
        <div className="invisible absolute left-0 top-full z-50 mt-2 w-[min(720px,calc(100vw-48px))] rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-950">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const patchVersion = process.env.NEXT_PUBLIC_PATCH_VERSION ?? "0.5";

  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-950 dark:text-zinc-50"
        >
          POE2Tools
        </Link>

        <nav className="flex items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          <NavLink href="/">
            <IconHome className="h-4 w-4" />
            Home
          </NavLink>

          <Menu label="Tools" icon={<IconTools className="h-4 w-4" />}>
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
                    href="/tools/verisium-craft"
                    icon={<IconFlask className="h-4 w-4" />}
                    title="Verisium Crafting Simulator"
                    description="Compare crafting paths and expected cost."
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

          <Menu label="Guides" icon={<IconBook className="h-4 w-4" />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Guides
                </div>
                <div className="mt-2 flex flex-col">
                  <DropDownItem
                    href="/guides"
                    icon={<IconBook className="h-4 w-4" />}
                    title="Beginner guide"
                    description="Start strong with the basics."
                  />
                  <DropDownItem
                    href="/guides"
                    icon={<IconTag className="h-4 w-4" />}
                    title="Build picks"
                    description="League start and endgame ideas."
                  />
                  <DropDownItem
                    href="/guides"
                    icon={<IconTag className="h-4 w-4" />}
                    title="Patch notes breakdown"
                    description="What changed and why it matters."
                  />
                  <DropDownItem
                    href="/guides"
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
                    icon={<IconBook className="h-4 w-4" />}
                    title="All guides"
                    description="Browse the full guide library."
                  />
                  <DropDownItem
                    href="/tools/rune-combinations"
                    icon={<IconSpark className="h-4 w-4" />}
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

          <Menu label="Database" icon={<IconDatabase className="h-4 w-4" />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              </div>
              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  API
                </div>
                <div className="mt-2 flex flex-col">
                  <DropDownItem
                    href="/api/db/runes"
                    icon={<IconDatabase className="h-4 w-4" />}
                    title="Database API"
                    description="JSON endpoints for local datasets."
                  />
                </div>
              </div>
              <div>
                <div className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Tip
                </div>
                <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-200">
                  Database pages are statically generated and revalidated after
                  updates.
                </div>
              </div>
            </div>
          </Menu>
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 md:flex">
            <IconSearch className="h-4 w-4" />
            Search…
          </div>
        </div>
      </div>
    </header>
  );
}
