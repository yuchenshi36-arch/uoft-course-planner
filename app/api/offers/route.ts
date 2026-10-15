import { NextResponse } from "next/server";
import { dbRun } from "@/lib/db";
import { SHOW_HS_MODE } from "@/lib/features";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";

const CAMPUSES = new Set(["st-george", "utm", "utsc"]);
const STATUSES = new Set(["admitted", "waitlisted", "rejected"]);
const CURRICULA = new Set(["OSSD", "IB", "A-Level", "AP", "其他"]);

export async function POST(req: Request) {
  // 高中生申请功能关闭时，不再接受新的录取案例提交
  if (!SHOW_HS_MODE) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  const locale = await getLocale();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: t(locale, "error.generic") }, { status: 400 });
  }
  const curriculum = String(body.curriculum ?? "OSSD").trim();
  const campus = String(body.campus ?? "").trim();
  const program = String(body.program ?? "").trim().slice(0, 80);
  const programDetail = String(body.programDetail ?? "").trim().slice(0, 120);
  const average = Number(body.average);
  const englishRaw = body.englishGrade;
  const englishGrade =
    englishRaw === "" || englishRaw == null ? null : Number(englishRaw);
  const ieltsRaw = body.ielts;
  const ielts = ieltsRaw === "" || ieltsRaw == null ? null : Number(ieltsRaw);
  const hasCompetition = body.hasCompetition ? 1 : 0;
  const competitionDetail = String(body.competitionDetail ?? "").trim().slice(0, 300);
  const offerStatus = String(body.offerStatus ?? "").trim();
  const coop = body.coop ? 1 : 0;
  const year = Math.round(Number(body.year) || 0);
  const notes = String(body.notes ?? "").trim().slice(0, 500);

  if (!CAMPUSES.has(campus)) {
    return NextResponse.json({ ok: false, error: t(locale, "error.campus") }, { status: 400 });
  }
  if (!CURRICULA.has(curriculum)) {
    return NextResponse.json({ ok: false, error: t(locale, "error.curriculum") }, { status: 400 });
  }
  if (!program) {
    return NextResponse.json({ ok: false, error: t(locale, "error.program") }, { status: 400 });
  }
  if (!(average >= 0 && average <= 100)) {
    return NextResponse.json({ ok: false, error: t(locale, "error.average") }, { status: 400 });
  }
  if (englishGrade != null && !(englishGrade >= 0 && englishGrade <= 100)) {
    return NextResponse.json({ ok: false, error: t(locale, "error.english") }, { status: 400 });
  }
  if (ielts != null && !(ielts >= 0 && ielts <= 9)) {
    return NextResponse.json({ ok: false, error: t(locale, "error.ielts") }, { status: 400 });
  }
  if (!STATUSES.has(offerStatus)) {
    return NextResponse.json({ ok: false, error: t(locale, "error.status") }, { status: 400 });
  }
  if (year < 2019 || year > 2030) {
    return NextResponse.json({ ok: false, error: t(locale, "error.year") }, { status: 400 });
  }

  const result = await dbRun(
    "INSERT INTO offer_cases (campus, program, program_detail, curriculum, average, english_grade, ielts, has_competition, competition_detail, offer_status, coop, year, notes, sample, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending')",
    campus, program, programDetail, curriculum, average, englishGrade, ielts, hasCompetition, competitionDetail, offerStatus, coop, year, notes
  );

  return NextResponse.json({ ok: true, id: Number(result.lastInsertRowid) });
}
