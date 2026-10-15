import Link from "next/link";
import { dbAll, dbGet } from "@/lib/db";
import { getLocale } from "@/lib/i18n/server";
import { translator } from "@/lib/i18n/ui";

export const dynamic = "force-dynamic";

interface ViewRow {
  d: string;
  n: number;
}

interface TopRow {
  path: string;
  n: number;
}

interface FeedbackRow {
  id: number;
  rating: number;
  message: string | null;
  path: string | null;
  created_at: string;
}

interface OfferRow {
  id: number;
  campus: string;
  program: string;
  program_detail: string | null;
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
  sample: number;
  created_at: string;
}

export default async function AdminPage() {
  const locale = await getLocale();
  const t = translator(locale);
  const total = Number((await dbGet("SELECT COUNT(*) n FROM page_views"))?.n ?? 0);
  const today = Number(
    (await dbGet(
      "SELECT COUNT(*) n FROM page_views WHERE date(visited_at) = date('now', 'localtime')"
    ))?.n ?? 0
  );
  const week = (await dbAll(
    "SELECT date(visited_at) d, COUNT(*) n FROM page_views WHERE visited_at >= datetime('now', '-6 days', 'localtime') GROUP BY date(visited_at) ORDER BY d"
  )) as unknown as ViewRow[];
  const top = (await dbAll(
    "SELECT path, COUNT(*) n FROM page_views GROUP BY path ORDER BY n DESC LIMIT 10"
  )) as unknown as TopRow[];
  const feedbacks = (await dbAll(
    "SELECT * FROM feedback ORDER BY id DESC LIMIT 50"
  )) as unknown as FeedbackRow[];
  const offers = (await dbAll(
    "SELECT * FROM offer_cases WHERE status = 'pending' ORDER BY id DESC LIMIT 100"
  )) as unknown as OfferRow[];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/" className="text-sm font-medium text-uoft hover:underline">
        {t("admin.backHome")}
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-uoft">{t("admin.title")}</h1>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">{t("admin.stat.total")}</p>
          <p className="mt-1 text-3xl font-bold text-uoft">{total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">{t("admin.stat.today")}</p>
          <p className="mt-1 text-3xl font-bold text-uoft">{today}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">{t("admin.stat.feedback")}</p>
          <p className="mt-1 text-3xl font-bold text-uoft">{feedbacks.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400">{t("admin.stat.pendingOffers")}</p>
          <p className="mt-1 text-3xl font-bold text-uoft">{offers.length}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800">{t("admin.visits7d")}</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-400">
              <tr>
                <th className="px-4 py-2">{t("admin.col.date")}</th>
                <th className="px-4 py-2">{t("admin.col.views")}</th>
              </tr>
            </thead>
            <tbody>
              {week.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-slate-400">
                    {t("admin.noData")}
                  </td>
                </tr>
              )}
              {week.map((r) => (
                <tr key={r.d} className="border-t border-slate-100">
                  <td className="px-4 py-2 text-slate-600">{r.d}</td>
                  <td className="px-4 py-2 font-semibold text-slate-800">{r.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800">{t("admin.topPages")}</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-400">
              <tr>
                <th className="px-4 py-2">{t("admin.col.page")}</th>
                <th className="px-4 py-2">{t("admin.col.views")}</th>
              </tr>
            </thead>
            <tbody>
              {top.map((r, i) => (
                <tr key={r.path} className="border-t border-slate-100">
                  <td className="px-4 py-2 text-slate-600">
                    <span className="mr-2 text-xs text-slate-400">{i + 1}</span>
                    {r.path}
                  </td>
                  <td className="px-4 py-2 font-semibold text-slate-800">{r.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800">
          {t("admin.offerReview", { n: offers.length })}
        </h2>
        <div className="mt-3 space-y-3">
          {offers.length === 0 && (
            <p className="text-sm text-slate-400">{t("admin.offerEmpty")}</p>
          )}
          {offers.map((o) => (
            <div key={o.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-800">
                  #{o.id} {o.program}
                </p>
                <p className="text-xs text-slate-400">{o.created_at}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5">{o.campus}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5">{t("admin.applyYear", { y: o.year })}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5">{t("admin.average", { n: o.average })}{o.curriculum === "IB" ? "/45" : ""}{o.curriculum && o.curriculum !== "OSSD" ? " · " + o.curriculum : ""}</span>
                {o.english_grade != null && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5">{t("admin.english", { n: o.english_grade })}</span>
                )}
                {o.ielts != null && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5">{t("admin.ielts", { n: o.ielts })}</span>
                )}
                <span className="rounded-full bg-slate-100 px-2 py-0.5">{o.offer_status}</span>
                {o.coop === 1 && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-sky-600">Co-op</span>
                )}
              </div>
              {o.has_competition === 1 && o.competition_detail && (
                <p className="mt-2 text-sm text-slate-600">🏆 {o.competition_detail}</p>
              )}
              {o.notes && <p className="mt-2 text-sm text-slate-500">{o.notes}</p>}
              <div className="mt-3 flex gap-2">
                <form method="POST" action={`/api/offers/${o.id}`}>
                  <input type="hidden" name="action" value="approve" />
                  <button className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
                    {t("admin.approve")}
                  </button>
                </form>
                <form method="POST" action={`/api/offers/${o.id}`}>
                  <input type="hidden" name="action" value="reject" />
                  <button className="rounded-full bg-rose-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-700">
                    {t("admin.reject")}
                  </button>
                </form>
                <form method="POST" action={`/api/offers/${o.id}`}>
                  <input type="hidden" name="action" value="delete" />
                  <button className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                    {t("admin.delete")}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800">{t("admin.feedbackTitle")}</h2>
        <div className="mt-3 space-y-3">
          {feedbacks.length === 0 && (
            <p className="text-sm text-slate-400">{t("admin.feedbackEmpty")}</p>
          )}
          {feedbacks.map((f) => (
            <div key={f.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-amber-400">
                  {"★".repeat(f.rating)}
                  <span className="text-slate-300">{"★".repeat(5 - f.rating)}</span>
                  <span className="ml-2 text-sm text-slate-500">{t("admin.rating", { n: f.rating })}</span>
                </p>
                <p className="text-xs text-slate-400">
                  {f.created_at} · {f.path}
                </p>
              </div>
              {f.message && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{f.message}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}