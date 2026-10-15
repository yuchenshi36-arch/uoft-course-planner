"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { HS_PROGRAMS, HS_GENERAL_NOTES } from "@/lib/hs-admissions";
import { useLocale, useT } from "@/components/LocaleProvider";
import { hsTextEn } from "@/lib/i18n/en/hs-admissions";
import { programName } from "@/lib/i18n/localize";
import { SHOW_HS_MODE } from "@/lib/features";

export default function HsProgramPage() {
  const params = useParams<{ id: string }>();
  const locale = useLocale();
  const tr = useT();
  const hl = (zh: string) => (locale === "en" ? hsTextEn(zh) : zh);
  const program = HS_PROGRAMS.find((p) => p.id === params.id);
  const [activeCampus, setActiveCampus] = useState(
    () => program?.campuses[0]?.campus ?? "st-george"
  );

  // 高中生申请模块暂时下线（见 lib/features.ts），保证任何入口都回首页
  if (!SHOW_HS_MODE) redirect("/");

  if (!program) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link href="/hs" className="text-sm font-medium text-uoft hover:underline">
          {tr("hs.backToHs")}
        </Link>
        <p className="mt-8 text-slate-500">{tr("hs.programNotFound")}</p>
      </main>
    );
  }

  const c =
    program.campuses.find((cp) => cp.campus === activeCampus) ?? program.campuses[0];

  return (
    <main key={params.id} className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/hs" className="text-sm font-medium text-uoft hover:underline">
        {tr("hs.backToHs")}
      </Link>

      <section className="mb-6 mt-4">
        <h1 className="text-3xl font-bold text-uoft sm:text-4xl">{programName(locale, program.name, program.nameEn)}</h1>
        <p className="mt-1 text-slate-500">{tr("hs.programSubtitle", { nameEn: program.nameEn })}</p>
        {program.link && (
          <a
            href={program.link}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-medium text-uoft hover:underline"
          >
            {tr("hs.officialPage")}
          </a>
        )}
      </section>

      <div className="mb-2 flex flex-wrap gap-2">
        {program.campuses.map((cp) => {
          const active = cp.campus === c.campus;
          return (
            <button
              key={cp.campus}
              onClick={() => setActiveCampus(cp.campus)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-uoft text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-uoft/40 hover:text-uoft"
              }`}
            >
              {cp.campusName}
            </button>
          );
        })}
      </div>
      <p className="mb-6 text-xs text-slate-400">
        {tr("hs.campusNote")}
      </p>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-sm font-semibold text-slate-700">{tr("hs.generalNotes")}</h2>
        <ul className="mt-2 space-y-1.5">
          {HS_GENERAL_NOTES.map((n, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600">
              <span className="font-bold text-uoft">•</span>
              <span>{hl(n)}</span>
            </li>
          ))}
        </ul>
        {program.programNotes && program.programNotes.length > 0 && (
          <div className="mt-3 border-t border-slate-200 pt-3">
            {program.programNotes.map((n, i) => (
              <p key={i} className="flex gap-2 text-sm text-slate-600">
                <span className="font-bold text-uoft">•</span>
                <span>{hl(n)}</span>
              </p>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-uoft">{c.campusName}</h2>
          {c.link && (
            <a
              href={c.link}
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap text-xs font-medium text-uoft hover:underline"
            >
              {tr("hs.officialRequirement")}
            </a>
          )}
        </div>

        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          {c.degree && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400">{tr("hs.degree")}</p>
              <p className="mt-0.5 font-semibold text-slate-800">{c.degree}</p>
            </div>
          )}
          {c.options && c.options.length > 0 && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400">{tr("hs.options")}</p>
              <p className="mt-0.5 font-semibold text-slate-800">
                {c.options.join(" / ")}
              </p>
            </div>
          )}
          {c.ouac && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400">{tr("hs.ouac")}</p>
              <p className="mt-0.5 font-semibold text-slate-800">{c.ouac}</p>
            </div>
          )}
          {c.range && (
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-400">{tr("hs.range")}</p>
              <p className="mt-0.5 font-semibold text-slate-800">{hl(c.range)}</p>
            </div>
          )}
        </div>

        <h3 className="mb-2 mt-5 text-sm font-semibold text-slate-700">
          {tr("hs.requiredCourses")}
        </h3>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <tbody>
              {c.requirements.map((r) => (
                <tr
                  key={r.subject}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-2.5 text-slate-600">
                    {r.subject}
                    {r.recommended && (
                      <span className="ml-1.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                        {tr("hs.recommended")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <p className="font-semibold text-slate-800">{r.requirement}</p>
                    {r.grade && (
                      <p className="mt-0.5 text-xs text-slate-400">{tr("hs.suggestedGrade", { grade: r.grade })}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {c.notes && c.notes.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {c.notes.map((n, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600">
                <span className="font-bold text-uoft">•</span>
                <span>{hl(n)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}