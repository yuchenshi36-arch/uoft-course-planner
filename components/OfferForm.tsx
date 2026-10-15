"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useT } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";

// 录取大类建议项：中英文各一套，提交的内容都是自由文本
const PROGRAM_SUGGESTIONS: Record<Locale, string[]> = {
  zh: [
    "计算机科学",
    "生命科学",
    "人文学科",
    "数学与物理科学",
    "罗特曼商学院",
    "社会科学",
    "工程",
    "音乐",
    "其他",
  ],
  en: [
    "Computer Science",
    "Life Sciences",
    "Humanities",
    "Mathematical & Physical Sciences",
    "Rotman Commerce",
    "Social Sciences",
    "Engineering",
    "Music",
    "Other",
  ],
};

const YEARS = [2027, 2026, 2025, 2024, 2023, 2022, 2021];

export default function OfferForm({
  showBoardLink = true,
}: {
  showBoardLink?: boolean;
}) {
  const locale = useLocale();
  const tr = useT();
  const [campus, setCampus] = useState("st-george");
  const [program, setProgram] = useState("");
  const [curriculum, setCurriculum] = useState("OSSD");
  const [average, setAverage] = useState("");
  const [englishGrade, setEnglishGrade] = useState("");
  const [ielts, setIelts] = useState("");
  const [hasCompetition, setHasCompetition] = useState(false);
  const [competitionDetail, setCompetitionDetail] = useState("");
  const [coop, setCoop] = useState(false);
  const [year, setYear] = useState("2026");
  const [offerStatus, setOfferStatus] = useState("admitted");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit() {
    setState("submitting");
    setError("");
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campus,
          program,
          curriculum,
          average: Number(average),
          englishGrade: englishGrade === "" ? null : Number(englishGrade),
          ielts: ielts === "" ? null : Number(ielts),
          hasCompetition,
          competitionDetail,
          coop,
          year: Number(year),
          offerStatus,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("error");
        setError(data.error ?? tr("offerForm.errorFallback"));
        return;
      }
      setState("done");
    } catch {
      setState("error");
      setError(tr("offerForm.errorNetwork"));
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-5xl">🎉</p>
        <h2 className="mt-4 text-2xl font-bold text-uoft">{tr("offerForm.doneTitle")}</h2>
        <p className="mt-2 text-sm text-slate-600">{tr("offerForm.doneBody")}</p>
        {showBoardLink && (
          <Link
            href="/hs/offers"
            className="mt-6 inline-block rounded-full bg-uoft px-6 py-2.5 text-sm font-medium text-white"
          >
            {tr("offerForm.doneBoard")}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            {tr("offerForm.campus")} *
          </span>
          <select
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="st-george">St. George</option>
            <option value="utm">UTM</option>
            <option value="utsc">UTSC</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            {tr("offerForm.year")} *
          </span>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            {tr("offerForm.curriculum")} *
          </span>
          <select
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="OSSD">{tr("offerForm.curriculum.osd")}</option>
            <option value="IB">IB</option>
            <option value="A-Level">A-Level</option>
            <option value="AP">AP</option>
            <option value="其他">{tr("offerForm.curriculum.other")}</option>
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          {tr("offerForm.program")} *
        </span>
        <input
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          list="program-suggestions"
          placeholder={tr("offerForm.programPlaceholder")}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        <datalist id="program-suggestions">
          {PROGRAM_SUGGESTIONS[locale].map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            {curriculum === "IB"
              ? tr("offerForm.average.ib")
              : curriculum === "AP"
                ? tr("offerForm.average.ap")
                : curriculum === "A-Level"
                  ? tr("offerForm.average.a-level")
                  : tr("offerForm.average.osd")}{" "}
            *
          </span>
          <input
            type="number"
            min={0}
            max={curriculum === "IB" ? 45 : curriculum === "AP" ? 5 : 100}
            step={0.5}
            value={average}
            onChange={(e) => setAverage(e.target.value)}
            placeholder={
              curriculum === "IB"
                ? tr("offerForm.averagePlaceholder.ib")
                : curriculum === "AP"
                  ? tr("offerForm.averagePlaceholder.ap")
                  : tr("offerForm.averagePlaceholder.osd")
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            {tr("offerForm.english")}
          </span>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={englishGrade}
            onChange={(e) => setEnglishGrade(e.target.value)}
            placeholder={tr("offerForm.englishPlaceholder")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            {tr("offerForm.ielts")}
          </span>
          <input
            type="number"
            min={0}
            max={9}
            step={0.5}
            value={ielts}
            onChange={(e) => setIelts(e.target.value)}
            placeholder={tr("offerForm.ieltsPlaceholder")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasCompetition}
            onChange={(e) => setHasCompetition(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-medium text-slate-700">{tr("offerForm.competition")}</span>
        </label>
        {hasCompetition && (
          <textarea
            value={competitionDetail}
            onChange={(e) => setCompetitionDetail(e.target.value)}
            placeholder={tr("offerForm.competitionPlaceholder")}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            rows={2}
          />
        )}
        <label className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            checked={coop}
            onChange={(e) => setCoop(e.target.checked)}
            className="h-4 w-4"
          />
          <span className="font-medium text-slate-700">{tr("offerForm.coop")}</span>
        </label>
      </div>

      <div className="text-sm">
        <span className="mb-1 block font-medium text-slate-700">
          {tr("offerForm.status")} *
        </span>
        <div className="flex gap-4">
          {[
            { value: "admitted", label: tr("offers.status.admitted") },
            { value: "waitlisted", label: tr("offers.status.waitlisted") },
            { value: "rejected", label: tr("offers.status.rejected") },
          ].map((o) => (
            <label key={o.value} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="offerStatus"
                value={o.value}
                checked={offerStatus === o.value}
                onChange={() => setOfferStatus(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">{tr("offerForm.notes")}</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={tr("offerForm.notesPlaceholder")}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          rows={2}
        />
      </label>

      <button
        onClick={submit}
        disabled={state === "submitting"}
        className="w-full rounded-full bg-uoft py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {state === "submitting" ? tr("offerForm.submitting") : tr("offerForm.submit")}
      </button>
      {state === "error" && (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}