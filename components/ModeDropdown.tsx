"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/LocaleProvider";
import { SHOW_HS_MODE } from "@/lib/features";

const modes = [
  { href: "/", labelKey: "mode.planner.label", descKey: "mode.planner.desc" },
  { href: "/hs", labelKey: "mode.hs.label", descKey: "mode.hs.desc" },
] as const;

function isActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/plan") || pathname.startsWith("/programs");
  }
  return pathname.startsWith(href);
}

export default function ModeDropdown() {
  const pathname = usePathname();
  const tr = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 高中生申请模块下线时，模式下拉只剩一项：直接作为标题链接，不显示下拉箭头
  const visibleModes = modes.filter((m) => m.href !== "/hs" || SHOW_HS_MODE);
  if (visibleModes.length <= 1) {
    return (
      <Link
        href={visibleModes[0]?.href ?? "/"}
        className="flex cursor-pointer items-center gap-1.5 text-lg font-bold"
      >
        <span className="text-2xl">🎓</span>
        <span className="whitespace-nowrap">{tr("brand.name")}</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-1.5 text-lg font-bold"
      >
        <span className="text-2xl">🎓</span>
        <span className="whitespace-nowrap">{tr("brand.name")}</span>
                <svg
          className={`h-[1em] w-[1em] text-blue-200 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 shadow-lg">
          {visibleModes.map((m) => {
            const activeMode = isActive(m.href, pathname);
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition ${
                  activeMode
                    ? "bg-uoft text-white"
                    : "hover:bg-slate-50"
                }`}
              >
                <span>
                  <span className="block text-sm font-semibold">{tr(m.labelKey)}</span>
                  <span
                    className={`block text-xs ${activeMode ? "text-blue-100" : "text-slate-400"}`}
                  >
                    {tr(m.descKey)}
                  </span>
                </span>
                {activeMode && <span className="text-sm">✓</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
