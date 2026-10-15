"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CAMPUS_META } from "@/lib/program-meta";
import { useLocale } from "@/components/LocaleProvider";
import { campusName } from "@/lib/i18n/localize";

export default function CampusSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const current = searchParams.get("campus") ?? "st-george";
  if (pathname.startsWith("/hs") || pathname.startsWith("/share")) return null;

  return (
    <nav className="flex items-center gap-1 rounded-full border border-blue-100/40 bg-white/10 p-1 text-xs">
      {CAMPUS_META.map((c) => {
        const active = c.slug === current;
        // 切换到其他校区时回到该校区首页；首页本身保留 ?campus=
        const href = c.slug === "st-george" ? "/" : `/?campus=${c.slug}`;
        return (
          <Link
            key={c.slug}
            href={href}
            className={`rounded-full px-3 py-1 font-medium transition ${
              active
                ? "bg-white text-uoft shadow-sm"
                : "text-blue-100/90 hover:bg-white/15 hover:text-white"
            }`}
          >
            {campusName(locale, c.slug, c.nameZh)}
          </Link>
        );
      })}
    </nav>
  );
}
