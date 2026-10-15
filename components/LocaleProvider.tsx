"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { t, type UiKey, type UiVars } from "@/lib/i18n/ui";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** 客户端组件里取当前语言的文案函数 */
export function useT() {
  const locale = useLocale();
  return (key: UiKey, vars?: UiVars) => t(locale, key, vars);
}
