"use client";

import Link from "next/link";
import { useState } from "react";
import CourseCard from "@/components/CourseCard";
import { useLocale, useT } from "@/components/LocaleProvider";
import {
  CAMPUS_META,
  PROGRAM_OPTIONS,
  PROGRAM_STREAM_CHILDREN,
  isFoundationProgram,
} from "@/lib/program-meta";
import { YEAR_HINTS } from "@/lib/year-hints";
import {
  campusName,
  hintText,
  programDegree,
  programName,
  programTitle,
  streamLabel,
  yearNote,
} from "@/lib/i18n/localize";
import type { Plan, PlanCourse, ProgramStream, RequirementType } from "@/lib/types";
import type { UiKey } from "@/lib/i18n/ui";

type Filter = "all" | RequirementType;

const GROUP_LABEL: Record<RequirementType, UiKey> = {
  core: "plan.group.core",
  recommended: "plan.group.recommended",
  elective: "plan.group.elective",
};

const STREAM_TYPE_LABEL: Record<ProgramStream["type"], UiKey> = {
  specialist: "plan.streamType.specialist",
  major: "plan.streamType.major",
  minor: "plan.streamType.minor",
  focus: "plan.streamType.focus",
};

function hintKey(programId: string, year: number, streams?: string[]): string {
  return streams?.length
    ? `${programId}:${year}:${streams.join(",")}`
    : `${programId}:${year}`;
}

export default function PlanView({ plan }: { plan: Plan }) {
  const locale = useLocale();
  const tr = useT();
  const [filter, setFilter] = useState<Filter>("all");
  const campusMeta =
    CAMPUS_META.find((c) => c.id === plan.program.campusId) ?? CAMPUS_META[0];
  const campusQ =
    campusMeta.slug === "st-george" ? "" : `&campus=${campusMeta.slug}`;
  const relatedBranches = PROGRAM_OPTIONS.filter(
    (b) => b.parent === plan.program.id && !isFoundationProgram(b.id)
  );
  const isMainProgram = relatedBranches.length > 0;
  const programOption = PROGRAM_OPTIONS.find((p) => p.id === plan.program.id);
  const isSubProgram = !!programOption?.parent;
  // 细分专业（小类）统一显示“选择学位类型”卡片，与统计（pms-sta）一致；
  // 分类页本身没有课程流（如 eng-engsci 大类）时不显示空的选择器
  const showStreamSelector =
    plan.streams.length > 1 || (isSubProgram && plan.streams.length > 0);
  const activeTab =
    plan.streams.find((s) => s.key === plan.stream) ??
    plan.streams.find((s) =>
      (PROGRAM_STREAM_CHILDREN[`${plan.program.id}:${s.key}`] ?? []).some(
        (c) => c.key === plan.stream
      )
    );
  const parentStreamKey = plan.streams.find((s) =>
    (PROGRAM_STREAM_CHILDREN[`${plan.program.id}:${s.key}`] ?? []).some(
      (c) => c.key === plan.stream
    )
  )?.key;
  // 细分专业本身没有子方向时（如 TrackOne），空年级展示其父专业的方向卡片作为引导
  const branchCandidates = relatedBranches.length
    ? relatedBranches
    : !programOption?.parent
      ? PROGRAM_OPTIONS.filter(
          (b) =>
            b.parent === programOption?.parent &&
            b.id !== plan.program.id &&
            !isFoundationProgram(b.id)
        )
      : [];
  // 同一（专业, 年级, 方向）可能有多张提示卡，第二张起加 `#2`、`#3` 后缀，
  // 与 lib/i18n/en/hints.ts 里的英文键保持一致
  const hintOccurrences = new Map<string, number>();
  const hints = YEAR_HINTS.filter(
    (h) =>
      h.programId === plan.program.id &&
      h.year === plan.year &&
      (!h.streams || h.streams.includes(plan.stream))
  ).map((h) => {
    const base = hintKey(h.programId, h.year, h.streams);
    const occurrence = (hintOccurrences.get(base) ?? 0) + 1;
    hintOccurrences.set(base, occurrence);
    const key = occurrence === 1 ? base : `${base}#${occurrence}`;
    return {
      key,
      text: hintText(locale, key, {
        title: h.title,
        body: h.body,
        items: h.items,
      }),
    };
  });
  const rawGroups: { key: RequirementType; items: PlanCourse[] }[] = [
    { key: "core", items: plan.core },
    { key: "recommended", items: plan.recommended },
    { key: "elective", items: plan.elective },
  ];
  // 目前只展示必修核心课：进专业要求的课程都应是必修（含"任选其一"系列）。
  // 第二入口专业（护理/药学/医学放射科学/教育）没有必修清单，
  // 统一展示推荐课作为先修/参考选课（无论是否有方向流）。
  const groups = rawGroups
    .filter((g) => g.items.length > 0)
    .filter(
      (g) =>
        g.key === "core" ||
        (g.key === "recommended" &&
          (plan.streams.length === 0 || plan.program.id.startsWith("second")))
    );
  const visible = filter === "all" ? groups : groups.filter((g) => g.key === filter);
  const coreCredits = groups
    .filter((g) => g.key === "core")
    .flatMap((g) => g.items)
    .reduce((sum, c) => sum + c.credits, 0);
  const recommendedCredits = groups
    .filter((g) => g.key === "recommended")
    .flatMap((g) => g.items)
    .reduce((sum, c) => sum + c.credits, 0);

  const currentYearNote = yearNote(locale, plan.program.id, plan.year, plan.yearNote);
  const programDegreeLabel = programDegree(locale, plan.program.id, programOption?.degree);

  const branchGrid =
    branchCandidates.length > 0 ? (
      <div className="grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-3">
        {branchCandidates.map((b) => {
          const degree = programDegree(locale, b.id, b.degree);
          return (
            <Link
              key={b.id}
              href={`/plan?program=${b.id}&year=${plan.year}${campusQ}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-uoft/40 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-uoft">
                {b.code}
              </p>
              <h3 className="mt-0.5 font-semibold text-slate-800">
                {programName(locale, b.name, b.nameEn)}
              </h3>
              {locale === "zh" && (
                <p className="mt-0.5 text-xs text-slate-500">{b.nameEn}</p>
              )}
              {degree && (
                <p className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  {degree}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    ) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-uoft">
            {campusMeta.name} · {plan.program.code}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {programTitle(locale, plan.program.name, plan.program.nameEn)}
            {programDegreeLabel && (
              <span className="ml-2 inline-block rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {programDegreeLabel}
              </span>
            )}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            {programName(locale, plan.program.name, plan.program.nameEn)} ·{" "}
            {plan.year}
            {locale === "zh" ? " 年级课程计划" : " course plan"}
          </p>
          <Link
            href={
              campusMeta.slug === "st-george"
                ? "/compare"
                : `/compare?campus=${campusMeta.slug}`
            }
            className="mt-2 inline-block rounded-full border border-uoft/30 px-3 py-1 text-xs font-semibold text-uoft transition hover:bg-uoft/5"
          >
            {tr("compare.entry.cta")}
          </Link>
        </div>
      </div>

      {showStreamSelector && (
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-slate-500">
            {tr("plan.stream.selectHint")}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {plan.streams.map((s) => (
              <Link
                key={s.key}
                href={`/plan?program=${plan.program.id}&year=${plan.year}&stream=${s.key}${campusQ}`}
                className={`rounded-xl border p-3 transition ${
                  s.key === activeTab?.key
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-uoft/40 hover:shadow-sm"
                }`}
              >
              <p
                className={`text-[11px] font-semibold uppercase tracking-wide ${
                  s.key === activeTab?.key ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {tr(STREAM_TYPE_LABEL[s.type])}
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  s.key === activeTab?.key ? "text-emerald-900" : "text-slate-800"
                }`}
              >
                {streamLabel(locale, plan.program.id, s.key, s.label)}
              </p>
              {s.key === activeTab?.key && (
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  {tr("plan.stream.current")}
                </p>
              )}
            </Link>
          ))}
          </div>
        </div>
      )}

      {plan.subStreams.length > 0 && (
        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-slate-500">
            {tr("plan.focus.select")}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {plan.subStreams.map((c) => {
              const active = c.key === plan.stream;
              return (
                <Link
                  key={c.key}
                  href={`/plan?program=${plan.program.id}&year=${plan.year}&stream=${c.key}${campusQ}`}
                  className={`rounded-xl border p-3 transition ${
                    active
                      ? "border-emerald-500 bg-emerald-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-uoft/40 hover:shadow-sm"
                  }`}
                >
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wide ${
                      active ? "text-emerald-600" : "text-slate-400"
                    }`}
                  >
                    {tr("plan.focus.label")}
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      active ? "text-emerald-900" : "text-slate-800"
                    }`}
                  >
                    {streamLabel(locale, plan.program.id, c.key, c.label, parentStreamKey)}
                  </p>
                  {active && (
                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      {tr("plan.stream.current")}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {plan.years.map((y) => (
          <Link
            key={y}
            href={`/plan?program=${plan.program.id}&year=${y}&stream=${plan.stream}${campusQ}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              y === plan.year
                ? "bg-uoft text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tr("plan.year", { y })}
          </Link>
        ))}
        <span className="ml-auto text-sm text-slate-500">
          {coreCredits > 0
            ? tr("plan.credits.core", { n: coreCredits.toFixed(1) })
            : recommendedCredits > 0 && plan.program.id.startsWith("second")
              ? tr("plan.credits.prereq", { n: recommendedCredits.toFixed(1) })
              : tr("plan.credits.none")}
          {groups.length > 1 && tr("plan.credits.optional")}
          {tr("plan.credits.perYear")}
        </span>
      </div>

      {currentYearNote && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          💡 {currentYearNote}
        </div>
      )}

      {hints.map((h) => (
        <div
          key={h.key}
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <p className="text-sm font-semibold text-amber-900">📌 {h.text.title}</p>
          <p className="mt-1 text-sm text-amber-900">{h.text.body}</p>
          {h.text.items && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
              {h.text.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {groups.length === 0 ? (
        plan.streams.length > 1 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-2xl">🎓</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">
              {tr("plan.empty.noCourses", {
                label: streamLabel(
                  locale,
                  plan.program.id,
                  plan.stream,
                  plan.streams.find((s) => s.key === plan.stream)?.label ??
                    plan.stream,
                  parentStreamKey
                ),
                year: plan.year,
              })}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              {plan.yearNote
                ? tr("plan.empty.streamPool")
                : tr("plan.empty.streamFew")}
            </p>
          </div>
        ) : branchGrid ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-2xl">🧭</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">
              {tr("plan.empty.branchesTitle", { year: plan.year })}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              {tr("plan.empty.branchesNote", {
                name: programName(locale, plan.program.name, plan.program.nameEn),
              })}
            </p>
            {branchGrid && <div className="mt-6">{branchGrid}</div>}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-2xl">📅</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">
              {tr("plan.empty.noRequirements", { year: plan.year })}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
              {plan.yearNote
                ? tr("plan.empty.noRequirementsPool")
                : tr("plan.empty.noRequirementsFree")}
            </p>
          </div>
        )
      ) : (
        <>
          {groups.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === "all"
                    ? "bg-slate-800 text-white"
                    : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tr("common.all")}
              </button>
              {groups.map((g) => (
                <button
                  key={g.key}
                  onClick={() => setFilter(g.key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    filter === g.key
                      ? "bg-slate-800 text-white"
                      : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {locale === "zh"
                    ? `${tr(GROUP_LABEL[g.key])}（${g.items.length}）`
                    : `${tr(GROUP_LABEL[g.key])} (${g.items.length})`}
                </button>
              ))}
            </div>
          )}

          {visible.map((g) => (
            <section key={g.key} className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${
                    g.key === "core"
                      ? "bg-uoft"
                      : g.key === "recommended"
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                  }`}
                />
                {tr(GROUP_LABEL[g.key])}
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {g.items.map((course) => (
                  <CourseCard key={course.code} course={course} />
                ))}
              </div>
            </section>
          ))}

          {isMainProgram && branchGrid && (
            <section className="mt-10">
              <h2 className="mb-1 text-xl font-semibold text-slate-800">
                {tr("plan.branches.title")}
              </h2>
              <p className="mb-4 text-sm text-slate-500">
                {tr("plan.branches.note")}
              </p>
              {branchGrid}
            </section>
          )}
        </>
      )}
    </main>
  );
}
