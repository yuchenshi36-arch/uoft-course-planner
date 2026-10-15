import Link from "next/link";
import ProgramForm from "@/components/ProgramForm";
import {
  CAMPUS_META,
  normalizeCampus,
  programsOfCampus,
} from "@/lib/program-meta";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";
import {
  campusBlurb,
  campusName,
  programBlurb,
  programDegree,
  programName,
} from "@/lib/i18n/localize";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ campus?: string }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const campus = normalizeCampus(params.campus);
  const campusMeta = CAMPUS_META.find((c) => c.slug === campus)!;
  const mainPrograms = programsOfCampus(campus).filter((p) => !p.group);
  const campusQ = campus === "st-george" ? "" : `?campus=${campus}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-uoft/15 bg-gradient-to-br from-[#eef4fb] via-white to-[#dce7f6] px-6 py-10 text-center shadow-sm sm:py-12">
        {/* 细点纹 + 蓝光，纯 CSS，不依赖任何图片 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,42,92,0.10) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-uoft-accent/25 blur-3xl"
        />
        {/* 想把背景换成照片：把自己的图放到 public/hero.jpg 即可（没有这张图也不会报错） */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/85 via-white/50 to-transparent"
        />
        <div className="relative">
          <h1 className="text-3xl font-bold text-uoft sm:text-4xl">
            {t(locale, "home.title")}
          </h1>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {CAMPUS_META.map((c) => {
              const active = c.slug === campus;
              return (
                <Link
                  key={c.slug}
                  href={c.slug === "st-george" ? "/" : `/?campus=${c.slug}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-uoft text-white"
                      : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {locale === "zh"
                    ? `${c.nameZh}（${c.name}）`
                    : campusName(locale, c.slug, c.nameZh)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ProgramForm campus={campus} />

      <section className="mt-6">
        <Link
          href={
            campus === "st-george" ? "/compare" : `/compare?campus=${campus}`
          }
          className="group flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-uoft/20 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-uoft/40 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-slate-800 group-hover:text-uoft">
              {t(locale, "compare.entry.title")}
            </p>
            <p className="mt-0.5 text-sm text-slate-600">
              {t(locale, "compare.entry.body")}
            </p>
          </div>
          <span className="text-sm font-semibold text-uoft">
            {t(locale, "compare.entry.cta")}
          </span>
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="mb-1 text-xl font-semibold text-slate-800">
          {t(locale, "home.supported")}
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          {t(locale, "home.supportedHint", {
            blurb: campusBlurb(locale, campusMeta.slug, campusMeta.blurb),
          })}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {mainPrograms.map((p) => {
            const degree = programDegree(locale, p.id, p.degree);
            return (
              <Link
                key={p.id}
                href={`/programs/${p.id}${campusQ}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-uoft/40 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-uoft">
                  {campusMeta.name} · {p.code}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-800 group-hover:text-uoft">
                  {programName(locale, p.name, p.nameEn)}
                </h3>
                {locale === "zh" && (
                  <p className="text-sm text-slate-500">{p.nameEn}</p>
                )}
                {degree && (
                  <p className="mt-1.5 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                    {degree}
                  </p>
                )}
                <p className="mt-2 text-sm text-slate-600">
                  {programBlurb(locale, p.id, p.blurb)}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

    </main>
  );
}
