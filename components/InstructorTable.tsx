"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/LocaleProvider";
import type { Instructor } from "@/lib/types";
import type { UiKey } from "@/lib/i18n/ui";

type SortKey = "rating" | "difficulty" | "retake" | "reviews";

const SORT_OPTIONS: { key: SortKey; labelKey: UiKey }[] = [
  { key: "rating", labelKey: "ins.sort.rating" },
  { key: "difficulty", labelKey: "ins.sort.difficulty" },
  { key: "retake", labelKey: "ins.sort.retake" },
  { key: "reviews", labelKey: "ins.sort.reviews" },
];

export default function InstructorTable({ instructors }: { instructors: Instructor[] }) {
  const tr = useT();
  const [sortKey, setSortKey] = useState<SortKey>("rating");

  const sorted = useMemo(() => {
    const copy = [...instructors];
    copy.sort((a, b) => {
      switch (sortKey) {
        case "difficulty":
          return (a.avgDifficulty ?? 99) - (b.avgDifficulty ?? 99);
        case "retake":
          return (b.wouldTakeAgain ?? -1) - (a.wouldTakeAgain ?? -1);
        case "reviews":
          return (b.numRatings ?? 0) - (a.numRatings ?? 0);
        default:
          return (b.avgRating ?? 0) - (a.avgRating ?? 0);
      }
    });
    return copy;
  }, [instructors, sortKey]);

  const recommended = useMemo(() => {
    // 只有评分达到 3.0 且评价数足够（≥3 条）的教授才值得被推荐，
    // 避免"只有一位教授可选但评分很低"时仍然显示推荐。
    const eligible = instructors.filter(
      (i) => (i.numRatings ?? 0) >= 3 && (i.avgRating ?? 0) >= 3.0
    );
    if (!eligible.length) return null;
    return eligible.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))[0];
  }, [instructors]);

  const anySufficientReviews = instructors.some((i) => (i.numRatings ?? 0) >= 3);
  const noRecommendReason =
    !recommended && instructors.length > 0
      ? anySufficientReviews
        ? tr("ins.reason.lowRating")
        : tr("ins.reason.fewReviews")
      : null;

  // 没有教授数据时整块不显示（评分数据是可选的，缺数据时不留"暂无"占位）
  if (!instructors.length) return null;

  return (
    <div className="mt-4">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-slate-500">{tr("ins.title")}</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortKey(opt.key)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition ${
              sortKey === opt.key
                ? "bg-uoft text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tr(opt.labelKey)}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">{tr("ins.col.professor")}</th>
              <th className="px-3 py-2 font-medium">{tr("ins.col.rating")}</th>
              <th className="px-3 py-2 font-medium">{tr("ins.col.difficulty")}</th>
              <th className="px-3 py-2 font-medium">{tr("ins.col.reviews")}</th>
              <th className="px-3 py-2 font-medium">{tr("ins.col.retake")}</th>
              <th className="px-3 py-2 font-medium">{tr("ins.col.source")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((instructor) => {
              const isRecommended = recommended?.id === instructor.id;
              return (
                <tr key={instructor.id} className={isRecommended ? "bg-uoft/5" : undefined}>
                  <td className="px-3 py-2.5">
                    <span className="font-medium text-slate-800">{instructor.name}</span>
                    {isRecommended && (
                      <span className="ml-1.5 rounded bg-uoft px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {tr("ins.recommended")}
                      </span>
                    )}
                    {instructor.department && (
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {instructor.department}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-slate-800">
                    {instructor.avgRating != null ? `★ ${instructor.avgRating.toFixed(1)}` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">
                    {instructor.avgDifficulty != null
                      ? instructor.avgDifficulty.toFixed(1)
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">
                    {instructor.numRatings ?? 0}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600">
                    {instructor.wouldTakeAgain != null && instructor.wouldTakeAgain >= 0
                      ? `${instructor.wouldTakeAgain.toFixed(0)}%`
                      : "—"}
                  </td>
                  <td className="px-3 py-2.5">
                    {instructor.source === "sample" ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        {tr("ins.sample")}
                      </span>
                    ) : (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                        RMP
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {noRecommendReason && (
        <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          ⚠️ {noRecommendReason}
        </p>
      )}
    </div>
  );
}
