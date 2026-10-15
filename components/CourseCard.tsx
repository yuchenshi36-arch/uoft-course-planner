"use client";

import InstructorTable from "@/components/InstructorTable";
import { useLocale, useT } from "@/components/LocaleProvider";
import { courseDescription, courseNote } from "@/lib/i18n/localize";
import type { PlanCourse } from "@/lib/types";

export default function CourseCard({ course }: { course: PlanCourse }) {
  const locale = useLocale();
  const tr = useT();
  const isChoiceSlot = course.alternatives.length > 0;
  const codeLabel = [course.code, ...course.alternatives].join(" / ");
  const description = courseDescription(locale, course.code, course.description);
  const note = courseNote(locale, course.note);
  // 任选其一课程的每个选项各自带教授数据；全都没有数据时整块不显示
  const optionSlots = [
    { code: course.code, instructors: course.instructors },
    ...(course.optionInstructors ?? []),
  ];
  const ratedSlots = optionSlots.filter((slot) => slot.instructors.length > 0);
  const showOptionRatings = isChoiceSlot && ratedSlots.length > 0;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            <span className={isChoiceSlot ? "text-uoft" : undefined}>{codeLabel}</span>
            <span className="ml-2 font-medium text-slate-500">{course.name}</span>
            {isChoiceSlot && (
              <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                {tr("course.chooseOne")}
              </span>
            )}
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {tr("common.credits", { n: course.credits })}
        </span>
      </div>
      {description && (
        <p className="text-sm text-slate-600">{description}</p>
      )}
      {note && (
        <p className="mt-1.5 text-xs text-uoft">
          💡 {note}
        </p>
      )}
      {isChoiceSlot ? (
        showOptionRatings && (
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-500">{tr("course.optionRatings")}</p>
          <div className="mt-1.5 space-y-2">
            {ratedSlots.map((opt) => (
              <div
                key={opt.code}
                className="rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2"
              >
                <p className="text-xs font-semibold text-slate-700">{opt.code}</p>
                <div className="mt-1 space-y-1">
                  {[...opt.instructors]
                    .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
                    .map((ins) => (
                      <div
                        key={ins.id}
                        className="flex flex-wrap items-center gap-x-2 text-xs text-slate-600"
                      >
                        <span className="font-medium text-slate-800">{ins.name}</span>
                        {ins.avgRating != null && (
                          <span className="text-amber-600">★ {ins.avgRating.toFixed(1)}</span>
                        )}
                        {ins.avgDifficulty != null && (
                          <span>
                            {tr("course.difficulty", { n: ins.avgDifficulty.toFixed(1) })}
                          </span>
                        )}
                        <span>{tr("course.reviews", { n: ins.numRatings ?? 0 })}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        )
      ) : (
        <InstructorTable instructors={course.instructors} />
      )}
    </article>
  );
}
