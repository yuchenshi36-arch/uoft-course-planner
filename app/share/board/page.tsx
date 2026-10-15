import type { Metadata } from "next";
import { dbAll } from "@/lib/db";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";
import { offerProgramNameEn } from "@/lib/i18n/en/hs-admissions";
import { redirect } from "next/navigation";
import { SHOW_HS_MODE } from "@/lib/features";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // 高中生申请模块暂时下线（见 lib/features.ts），保证任何入口都回首页
  if (!SHOW_HS_MODE) redirect("/");
  const locale = await getLocale();
  return {
    title: t(locale, "offers.shareBoardTitle"),
    description: t(locale, "offers.shareBoardSubtitle"),
  };
}

interface OfferRow {
  id: number;
  campus: string;
  program: string;
  curriculum: string;
  average: number;
  english_grade: number | null;
  ielts: number | null;
  has_competition: number;
  competition_detail: string | null;
  offer_status: string;
  coop: number;
  year: number;
  notes: string | null;
}

const CAMPUS_LABEL: Record<string, string> = {
  "st-george": "St. George",
  utm: "UTM",
  utsc: "UTSC",
};

const STATUS_KEY: Record<string, "offers.status.admitted" | "offers.status.waitlisted" | "offers.status.rejected"> = {
  admitted: "offers.status.admitted",
  waitlisted: "offers.status.waitlisted",
  rejected: "offers.status.rejected",
};

const STATUS_STYLE: Record<string, string> = {
  admitted: "bg-emerald-50 text-emerald-600",
  waitlisted: "bg-amber-50 text-amber-600",
  rejected: "bg-rose-50 text-rose-600",
};

export default async function ShareBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ campus?: string; program?: string; result?: string }>;
}) {
  const locale = await getLocale();
  const sp = await searchParams;
  const campus = sp.campus ?? "";
  const program = (sp.program ?? "").trim();
  const result = sp.result ?? "";

  const rows = (
    (await dbAll(
      "SELECT * FROM offer_cases WHERE status = 'approved' ORDER BY year DESC, id DESC"
    )) as unknown as OfferRow[]
  ).filter((r) => {
    if (campus && r.campus !== campus) return false;
    if (program && !r.program.includes(program)) return false;
    if (result && r.offer_status !== result) return false;
    return true;
  });

  const admitted = rows.filter((r) => r.offer_status === "admitted");
  const ossdAdmitted = admitted.filter((r) => r.curriculum === "OSSD");
  const avgAdmitted = ossdAdmitted.length
    ? ossdAdmitted.reduce((s, r) => s + r.average, 0) / ossdAdmitted.length
    : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="text-center">
        <p className="text-4xl">🎓</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-800 sm:text-4xl">{t(locale, "offers.title")}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {t(locale, "offers.subtitle")}
        </p>
      </div>

      <form
        method="GET"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-slate-400">{t(locale, "offers.filter.campus")}</span>
          <select
            name="campus"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="">{t(locale, "common.all")}</option>
            <option value="st-george" selected={campus === "st-george"}>St. George</option>
            <option value="utm" selected={campus === "utm"}>UTM</option>
            <option value="utsc" selected={campus === "utsc"}>UTSC</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-slate-400">{t(locale, "offers.filter.program")}</span>
          <input
            name="program"
            defaultValue={program}
            placeholder={t(locale, "offers.filter.programPlaceholder")}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs text-slate-400">{t(locale, "offers.filter.result")}</span>
          <select
            name="result"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="">{t(locale, "common.all")}</option>
            <option value="admitted" selected={result === "admitted"}>{t(locale, "offers.status.admitted")}</option>
            <option value="waitlisted" selected={result === "waitlisted"}>{t(locale, "offers.status.waitlisted")}</option>
            <option value="rejected" selected={result === "rejected"}>{t(locale, "offers.status.rejected")}</option>
          </select>
        </label>
        <button className="rounded-lg bg-uoft px-5 py-1.5 text-sm font-medium text-white">{t(locale, "offers.filter.submit")}</button>
      </form>

      <section className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">{t(locale, "offers.stat.cases")}</p>
          <p className="mt-1 text-3xl font-bold text-uoft">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">{t(locale, "offers.stat.admitted")}</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{admitted.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">{t(locale, "offers.stat.avg")}</p>
          <p className="mt-1 text-3xl font-bold text-uoft">
            {avgAdmitted ? avgAdmitted.toFixed(1) : "—"}
          </p>
        </div>
      </section>

      <section className="mt-8 space-y-3">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">{t(locale, "offers.empty")}</p>
          </div>
        )}
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-800">{locale === "zh" ? r.program : offerProgramNameEn(r.program)}</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[r.offer_status] ?? ""}`}>
                {STATUS_KEY[r.offer_status] ? t(locale, STATUS_KEY[r.offer_status]) : r.offer_status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{CAMPUS_LABEL[r.campus] ?? r.campus}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{t(locale, "offers.row.year", { y: r.year })}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{t(locale, "offers.row.average", { n: r.average })}{r.curriculum === "IB" ? "/45" : ""}</span>
              {r.curriculum && r.curriculum !== "OSSD" && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600">{r.curriculum}</span>
              )}
              {r.english_grade != null && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{t(locale, "offers.row.english", { n: r.english_grade })}</span>
              )}
              {r.ielts != null && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{t(locale, "offers.row.ielts", { n: r.ielts })}</span>
              )}
              {r.coop === 1 && (
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-600">{t(locale, "offers.row.coop")}</span>
              )}
            </div>
            {r.has_competition === 1 && r.competition_detail && (
              <p className="mt-3 text-sm text-slate-600">🏆 {r.competition_detail}</p>
            )}
            {r.notes && <p className="mt-2 text-sm text-slate-500">{r.notes}</p>}
          </div>
        ))}
      </section>

      <p className="mt-8 text-center">
        <a
          href="/share/offer"
          className="inline-block rounded-full border border-uoft/40 px-5 py-2 text-sm font-medium text-uoft transition hover:bg-uoft/5"
        >
          {t(locale, "offers.shareCta")}
        </a>
      </p>

      <p className="mt-6 text-center text-xs text-slate-400">
        {t(locale, "offers.disclaimer")}
      </p>
    </main>
  );
}