"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import CampusSwitcher from "@/components/CampusSwitcher";
import ModeDropdown from "@/components/ModeDropdown";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  if (pathname.startsWith("/share")) return null;
  return (
    <header className="bg-uoft text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <ModeDropdown />
        <div className="flex flex-wrap items-center gap-2">
          <Suspense
            fallback={
              <span className="text-xs text-blue-100/80">St. George / UTM / UTSC</span>
            }
          >
            <CampusSwitcher />
          </Suspense>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
