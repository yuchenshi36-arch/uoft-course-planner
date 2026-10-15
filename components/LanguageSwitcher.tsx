"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, normalizeLocale, type Locale } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/ui";
import { useLocale } from "@/components/LocaleProvider";

const OPTIONS: { value: Locale; key: "lang.zh" | "lang.en" }[] = [
  { value: "zh", key: "lang.zh" },
  { value: "en", key: "lang.en" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-blue-100/40 bg-white/10 p-1 text-xs"
      role="group"
      aria-label={t(locale, "lang.switchLabel")}
    >
      {OPTIONS.map((opt) => {
        const active = normalizeLocale(opt.value) === locale;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => choose(opt.value)}
            aria-pressed={active}
            className={`cursor-pointer rounded-full px-3 py-1 font-medium transition ${
              active
                ? "bg-white text-uoft shadow-sm"
                : "text-blue-100/90 hover:bg-white/15 hover:text-white"
            } ${pending ? "opacity-70" : ""}`}
          >
            {t(locale, opt.key)}
          </button>
        );
      })}
    </div>
  );
}
