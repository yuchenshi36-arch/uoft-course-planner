import { NextResponse } from "next/server";
import { dbRun } from "@/lib/db";

export async function POST(req: Request) {
  let path = "/";
  try {
    const body = await req.json();
    if (typeof body.path === "string" && body.path.startsWith("/")) {
      path = body.path.slice(0, 300);
    }
  } catch {
    // 忽略解析失败
  }
  await dbRun("INSERT INTO page_views (path) VALUES (?)", path);
  return NextResponse.json({ ok: true });
}