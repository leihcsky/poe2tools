"use client";

import { useEffect, useState } from "react";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 },
    );

    const ids = items.map((item) => item.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of Contents" className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
          On this page
        </h4>
        <ul className="mt-3 space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={[
                  "p2-nav-link block rounded-md px-2 py-1 text-xs leading-relaxed transition-colors",
                  item.level === 3 ? "pl-4" : "",
                  activeId === item.id
                    ? "bg-[#F2BF43]/10 text-[#F2BF43] font-medium"
                    : "text-white/60 hover:text-white/90 hover:bg-white/5",
                ].join(" ")}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
