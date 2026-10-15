/** 站点语言：zh = 中文（默认），en = English */
export type Locale = "zh" | "en";

/** 语言偏好存放在 cookie 中，服务端与客户端都能读取 */
export const LOCALE_COOKIE = "uoft_lang";

export const DEFAULT_LOCALE: Locale = "zh";

export const LOCALES: Locale[] = ["zh", "en"];

export function normalizeLocale(raw: string | undefined | null): Locale {
  return raw === "en" ? "en" : DEFAULT_LOCALE;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}
