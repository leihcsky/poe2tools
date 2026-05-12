import Link from "next/link";

const footerLinks = {
  Tools: [
    { label: "Rune Combination Calculator", href: "/tools/rune-combinations" },
    { label: "Runic Ward Calculator", href: "/tools/runic-ward-calc" },
    { label: "All Tools", href: "/tools" },
  ],
  Guides: [
    { label: "Runes of Aldur Explained", href: "/guides/poe2-runes-of-aldur-explained" },
    { label: "Patch 0.5 Checklist", href: "/guides/poe2-0-5-what-to-prepare" },
    { label: "All Guides", href: "/guides" },
  ],
  Database: [
    { label: "Rune Database", href: "/db/runes" },
    { label: "Skill Gems", href: "/db/gems" },
    { label: "Unique Items", href: "/db/uniques" },
  ],
  Site: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/8 bg-[#0d0a1f]">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
                {heading}
              </div>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="p2-nav-link text-sm text-white/60 transition-colors hover:text-white/90"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/8 pt-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white/80 tracking-tight">
              poe<span className="text-[#F2BF43]">2</span>tools
            </span>
          </div>
          <p className="text-xs text-white/40 text-center sm:text-right">
            POE2Tools is a fan-made project. Not affiliated with or endorsed by Grinding Gear Games.
            <br className="hidden sm:block" />
            Path of Exile is a trademark of Grinding Gear Games.
          </p>
        </div>
      </div>
    </footer>
  );
}
