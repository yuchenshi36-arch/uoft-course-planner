import Link from "next/link";
import { HS_PROGRAMS } from "@/lib/hs-admissions";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";
import { programName, programTitle } from "@/lib/i18n/localize";
import { redirect } from "next/navigation";
import { SHOW_HS_MODE } from "@/lib/features";

export default async function HighSchoolPage() {
  // 高中生申请模块暂时下线（见 lib/features.ts），保证任何入口都回首页
  if (!SHOW_HS_MODE) redirect("/");
  const locale = await getLocale();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-uoft sm:text-4xl">
          {t(locale, "hs.title")}
        </h1>
        <p className="mt-3 text-slate-600">{t(locale, "hs.subtitle")}</p>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-semibold text-slate-800">
          {t(locale, "hs.majors")}
        </h2>
        <p className="mb-4 text-sm text-slate-500">{t(locale, "hs.majorsHint")}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HS_PROGRAMS.map((p) => (
            <Link
              key={p.id}
              href={`/hs/${p.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-uoft/40 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-uoft">
                {p.campuses.map((c) => c.campusName.replace(/ \(.*\)/, "")).join(" / ")}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-800 group-hover:text-uoft">
                {programName(locale, p.name, p.nameEn)}
              </h3>
              {locale === "zh" && (
                <p className="text-sm text-slate-500">{p.nameEn}</p>
              )}
              <p className="mt-3 text-sm text-slate-600">
                {t(locale, "hs.viewRequirements")}{" "}
                <span className="font-semibold text-uoft transition group-hover:translate-x-0.5">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
        <Link
          href="/hs/offers"
          className="mt-6 flex items-center justify-between rounded-2xl border border-uoft/30 bg-gradient-to-r from-uoft/10 to-amber-50 p-5 shadow-sm transition hover:border-uoft/50 hover:shadow-md"
        >
          <div>
            <p className="text-sm font-semibold text-uoft">
              {t(locale, "hs.offersCardTitle")}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {t(locale, "hs.offersCardBody")}
            </p>
          </div>
          <span className="text-2xl text-uoft">→</span>
        </Link>
        <p className="mt-6 text-sm text-slate-400">{t(locale, "hs.moreComing")}</p>
      </section>
    </main>
  );
}
