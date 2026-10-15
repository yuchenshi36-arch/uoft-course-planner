"use client";

import { useState } from "react";
import { useLocale, useT } from "@/components/LocaleProvider";
import { programName } from "@/lib/i18n/localize";
import type { CompareCourseRow, ProgramComparison } from "@/lib/compare";
import { groupByYear } from "@/lib/compare-utils";
import type { UiKey } from "@/lib/i18n/ui";

type Tab = "all" | "shared" | "onlyA" | "onlyB";

const TAB_KEYS: { key: Tab; label: UiKey }[] = [
  { key: "all", label: "compare.tab.all" },
  { key: "shared", label: "compare.tab.shared" },
  { key: "onlyA", label: "compare.tab.onlyA" },
  { key: "onlyB", label: "compare.tab.onlyB" },
];

const YEAR_KEYS: Record<number, UiKey> = {
  1: "year.short.1",
  2: "year.short.2",
  3: "year.short.3",
  4: "year.short.4",
};

const GROUP_BADGE: Record<
  CompareCourseRow["group"],
  { label: UiKey; className: string }
> = {
  shared: { label: "compare.badge.shared", className: "bg-emerald-100 text-emerald-700" },
  onlyA: { label: "compare.tab.onlyA", className: "bg-blue-50 text-blue-600" },
  onlyB: { label: "compare.tab.onlyB", className: "bg-violet-50 text-violet-600" },
};

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export default function CompareResult({ data }: { data: ProgramComparison }) {
  const locale = useLocale();
  const tr = useT();
  const [tab, setTab] = useState<Tab>("all");

  const nameA = programName(locale, data.a.program.name, data.a.program.nameEn);
  const nameB = programName(locale, data.b.program.name, data.b.program.nameEn);
  const counts: Record<Tab, number> = {
    all: data.rows.length,
    shared: data.rows.filter((r) => r.group === "shared").length,
    onlyA: data.rows.filter((r) => r.group === "onlyA").length,
    onlyB: data.rows.filter((r) => r.group === "onlyB").length,
  };

  const visible = data.rows.filter((r) => tab === "all" || r.group === tab);
  const yearGroups = groupByYear(visible);
  const yearLabel = (y: number) =>
    YEAR_KEYS[y] ? tr(YEAR_KEYS[y]) : tr("compare.yearTag", { y });

  // 分组按"最早要修的年级"，某一侧要求的年级和分组不同时额外标出来
  const otherYearTags = (
    row: CompareCourseRow,
    side: "a" | "b",
    sectionYear: number
  ) => {
    const years = (side === "a" ? row.yearsA : row.yearsB).filter(
      (y) => y !== sectionYear
    );
    return years.map((y) => (
      <span
        key={`${side}-${y}`}
        className="rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700"
      >
        {side === "a" ? "A" : "B"} {yearLabel(y)}
      </span>
    ));
  };

  return (
    <section className="mt-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            { tag: "compare.programA", name: nameA, side: data.a },
            { tag: "compare.programB", name: nameB, side: data.b },
          ] as const
        ).map((card) => (
          <div
            key={card.tag}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-uoft">
              {tr(card.tag)}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{card.name}</p>
            <p className="text-xs text-slate-500">{card.side.streamLabel}</p>
            <p className="mt-2 text-sm text-slate-700">
              {tr("compare.stat.required")}{" "}
              {tr("compare.stat.count", { n: card.side.count })} ·{" "}
              {tr("common.credits", { n: fmt(card.side.credits) })}
            </p>
            {card.side.usedRecommended && (
              <p className="mt-1 text-[11px] text-amber-600">
                {tr("compare.recommendedNote")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-lg font-bold text-emerald-900">
          {tr("compare.summary", { total: data.totalCount })}
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          {tr("compare.summaryDetail", {
            sum: data.a.count + data.b.count,
            a: data.a.count,
            b: data.b.count,
            shared: data.sharedCount,
          })}
        </p>
        <p className="mt-1 text-xs text-emerald-700">
          {tr("compare.stat.total")}{" "}
          {tr("compare.stat.count", { n: data.totalCount })} ·{" "}
          {tr("common.credits", { n: fmt(data.totalCredits) })}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {TAB_KEYS.map((tItem) => {
          const active = tItem.key === tab;
          return (
            <button
              key={tItem.key}
              type="button"
              onClick={() => setTab(tItem.key)}
              aria-pressed={active}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-uoft text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tr(tItem.label)}
              <span className="ml-1 opacity-70">({counts[tItem.key]})</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-400">{tr("compare.yearGroupHint")}</p>

      {yearGroups.map((group) => (
        <div key={group.year} className="mt-5">
          <h3 className="mb-2 flex items-baseline gap-2 text-base font-bold text-slate-800">
            {yearLabel(group.year)}
            <span className="text-xs font-medium text-slate-400">
              {tr("compare.stat.count", { n: group.rows.length })}
            </span>
          </h3>
          <ul className="space-y-2">
            {group.rows.map((row) => {
              const badge = GROUP_BADGE[row.group];
              return (
                <li
                  key={`${row.group}-${row.code}`}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      <span
                        className={
                          row.group === "shared" ? "text-emerald-600" : "text-uoft"
                        }
                      >
                        {row.code}
                      </span>
                      <span className="ml-2 font-normal text-slate-600">
                        {row.name}
                      </span>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badge.className}`}
                      >
                        {tr(badge.label)}
                      </span>
                      {otherYearTags(row, "a", group.year)}
                      {otherYearTags(row, "b", group.year)}
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {tr("common.credits", { n: fmt(row.credits) })}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {visible.length === 0 && (
        <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
          {tr("compare.emptyList")}
        </p>
      )}
    </section>
  );
}
