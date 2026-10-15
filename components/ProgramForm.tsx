"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { programsOfCampus } from "@/lib/program-meta";
import { useLocale, useT } from "@/components/LocaleProvider";
import { programBlurb, programTitle } from "@/lib/i18n/localize";

const YEAR_KEYS = ["form.year1", "form.year2", "form.year3", "form.year4"] as const;

export default function ProgramForm({ campus }: { campus: string }) {
  const router = useRouter();
  const locale = useLocale();
  const tr = useT();
  const [year, setYear] = useState("1");
  const options = programsOfCampus(campus).filter((p) => !p.group);
  const [programId, setProgramId] = useState(options[0]?.id ?? "");
  const selected = options.find((p) => p.id === programId) ?? options[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const campusQ = campus === "st-george" ? "" : `&campus=${campus}`;
    router.push(`/plan?program=${programId}&year=${year}${campusQ}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            {tr("form.year")}
          </span>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-uoft focus:outline-none focus:ring-2 focus:ring-uoft/20"
          >
            {YEAR_KEYS.map((key, i) => (
              <option key={key} value={String(i + 1)}>
                {tr(key)}
              </option>
            ))}
          </select>
        </label>

        {options.length > 0 && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {tr("form.program")}
            </span>
            <select
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-uoft focus:outline-none focus:ring-2 focus:ring-uoft/20"
            >
              {options.map((p) => (
                <option key={p.id} value={p.id}>
                  {programTitle(locale, p.name, p.nameEn)}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-uoft px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-uoft-light sm:w-auto"
          >
            {tr("form.submit")}
          </button>
        </div>
      </div>
      {selected && (
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          {programBlurb(locale, selected.id, selected.blurb)}
        </p>
      )}
    </form>
  );
}
