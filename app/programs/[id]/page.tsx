import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CAMPUS_META,
  isFoundationProgram,
  normalizeCampus,
  programsOfCampus,
} from "@/lib/program-meta";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";
import {
  programBlurb,
  programDegree,
  programName,
  programTitle,
} from "@/lib/i18n/localize";

export const dynamic = "force-dynamic";

export default async function MajorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ campus?: string }>;
}) {
  const { id } = await params;
  const { campus: rawCampus } = await searchParams;
  const locale = await getLocale();
  const campus = normalizeCampus(rawCampus);
  const options = programsOfCampus(campus);
  const campusMeta = CAMPUS_META.find((c) => c.slug === campus)!;
  // 注意：本页链接均已带有查询参数，校区参数需用 & 拼接
  const campusQ = campus === "st-george" ? "" : `&campus=${campus}`;
  const major = options.find((p) => p.id === id && !p.group);
  if (!major) notFound();
  const branches = options.filter(
    (p) => p.parent === id && !isFoundationProgram(p.id)
  );
  const majorName = programName(locale, major.name, major.nameEn);
  const majorDegree = programDegree(locale, major.id, major.degree);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href={campus === "st-george" ? "/" : `/?campus=${campus}`}
        className="text-sm font-medium text-slate-600 transition hover:text-uoft"
      >
        {t(locale, "common.backHome")}
      </Link>

      <header className="mb-8 mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-uoft">
          {campusMeta.name} · {major.code}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          {programTitle(locale, major.name, major.nameEn)}
          {majorDegree && (
            <span className="ml-2 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              {majorDegree}
            </span>
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          {programBlurb(locale, major.id, major.blurb)}
        </p>
        <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          📌{" "}
          {branches.length > 0
            ? t(locale, "program.descWithBranches")
            : t(locale, "program.descSingle")}
        </p>
      </header>

      <section>
        {branches.length > 0 ? (
          <>
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              {t(locale, "program.branches")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => {
                const degree = programDegree(locale, b.id, b.degree);
                return (
                  <Link
                    key={b.id}
                    href={`/plan?program=${b.id}&year=1${campusQ}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-uoft/40 hover:shadow-md"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-uoft">
                      {campusMeta.name} · {b.code}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-800 group-hover:text-uoft">
                      {programName(locale, b.name, b.nameEn)}
                    </h3>
                    {locale === "zh" && (
                      <p className="text-sm text-slate-500">{b.nameEn}</p>
                    )}
                    {degree && (
                      <p className="mt-1.5 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                        {degree}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-slate-600">
                      {programBlurb(locale, b.id, b.blurb)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-3xl">📘</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">
              {t(locale, "program.singleTitle")}
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">
              {t(locale, "program.singleNote", {
                name: majorName,
                nameEn: major.nameEn,
              })}
            </p>
            <Link
              href={`/plan?program=${major.id}&year=1${campusQ}`}
              className="mt-4 inline-block rounded-lg bg-uoft px-5 py-2 text-sm font-semibold text-white transition hover:bg-uoft-light"
            >
              {t(locale, "program.viewPlan")}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
