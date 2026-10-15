"use client";

import { usePathname } from "next/navigation";
import { useT } from "@/components/LocaleProvider";

export default function Footer() {
  const pathname = usePathname();
  const tr = useT();
  if (pathname.startsWith("/share")) return null;
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 text-xs leading-relaxed text-slate-500">
        <p className="mb-2 font-medium text-slate-600">{tr("footer.title")}</p>
        <p>{tr("footer.body")}</p>
      </div>
    </footer>
  );
}
