import { NextResponse } from "next/server";
import { dbRun } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  let action = "";
  try {
    const form = await req.formData();
    action = String(form.get("action") ?? "");
  } catch {
    // 忽略解析失败
  }
  if (action === "approve") {
    await dbRun("UPDATE offer_cases SET status = 'approved' WHERE id = ?", n);
  } else if (action === "reject") {
    await dbRun("UPDATE offer_cases SET status = 'rejected' WHERE id = ?", n);
  } else if (action === "delete") {
    await dbRun("DELETE FROM offer_cases WHERE id = ?", n);
  }
  return NextResponse.redirect(new URL("/admin", req.url));
}