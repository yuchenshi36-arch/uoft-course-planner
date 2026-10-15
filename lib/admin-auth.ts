import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * 管理后台的口令保护。
 *
 * 密码写在 .env.local 的 ADMIN_PASSWORD 里（该文件不会被提交到 Git）。
 * 登录成功后浏览器里存的是一个哈希值，不是明文密码。
 * 没有配置 ADMIN_PASSWORD 时，后台一律拒绝访问。
 */

export const ADMIN_COOKIE = "uoft_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14;

function hashOf(password: string) {
  return createHash("sha256").update(`uoft-admin:${password}`).digest("hex");
}

function sameString(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function adminCookieValue() {
  const password = process.env.ADMIN_PASSWORD;
  return password ? hashOf(password) : null;
}

export function checkAdminPassword(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !input) return false;
  return sameString(hashOf(input), hashOf(password));
}

export async function isAdmin() {
  const expected = adminCookieValue();
  if (!expected) return false;
  const given = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!given) return false;
  return sameString(given, expected);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  };
}
