import { cookies } from "next/headers";
import { LOCALE_COOKIE, normalizeLocale, type Locale } from "@/lib/i18n/config";

/** 在服务端组件 / route handler 中读取当前语言 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
}
