import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  adminCookieValue,
  checkAdminPassword,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  let password = "";
  try {
    const form = await req.formData();
    password = String(form.get("password") ?? "");
  } catch {
    // 表单解析失败按密码错误处理
  }

  const ok = checkAdminPassword(password);
  const res = NextResponse.redirect(
    new URL(ok ? "/admin" : "/admin?error=1", req.url),
    303
  );

  if (ok) {
    res.cookies.set(ADMIN_COOKIE, adminCookieValue()!, adminCookieOptions());
  } else {
    res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  }

  return res;
}
