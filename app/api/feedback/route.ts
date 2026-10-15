import { NextResponse } from "next/server";
import { dbRun } from "@/lib/db";

export async function POST(req: Request) {
  let rating = 0;
  let message = "";
  let path = "/";
  try {
    const body = await req.json();
    rating = Math.min(5, Math.max(1, Math.round(Number(body.rating) || 0)));
    message = typeof body.message === "string" ? body.message.slice(0, 2000) : "";
    path = typeof body.path === "string" ? body.path.slice(0, 300) : "/";
  } catch {
    // 忽略解析失败
  }
  if (!rating) {
    return NextResponse.json({ ok: false, error: "rating required" }, { status: 400 });
  }
  await dbRun("INSERT INTO feedback (rating, message, path) VALUES (?, ?, ?)", rating, message, path);
  return NextResponse.json({ ok: true });
}