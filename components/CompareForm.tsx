"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useT } from "@/components/LocaleProvider";
import type { CompareProgramGroup } from "@/lib/compare";

export default function CompareForm({
  groups,
  campus,
  aId,
  bId,
  aStream,
  bStream,
}: {
  groups: CompareProgramGroup[];
  campus: string;
  aId?: string;
  bId?: string;
  aStream?: string;
  bStream?: string;
}) {
  const router = useRouter();
  const tr = useT();

  const programsById = useMemo(() => {
    const map = new Map<string, CompareProgramGroup["programs"][number]>();
    for (const g of groups) for (const p of g.programs) map.set(p.id, p);
    return map;
  }, [groups]);

  const categoryOf = (programId?: string) =>
    programId
      ? (groups.find((g) => g.programs.some((p) => p.id === programId))?.id ?? "")
      : "";

  const [aCategory, setACategory] = useState(() => categoryOf(aId));
  const [bCategory, setBCategory] = useState(() => categoryOf(bId));
  const [a, setA] = useState(aId ?? "");
  const [b, setB] = useState(bId ?? "");
  const [sa, setSa] = useState(aStream ?? "");
  const [sb, setSb] = useState(bStream ?? "");

  const programsOf = (categoryId: string) =>
    groups.find((g) => g.id === categoryId)?.programs ?? [];
  const streamsOf = (programId: string) => programsById.get(programId)?.streams ?? [];

  function go(nextA: string, nextB: string, nextSa: string, nextSb: string) {
    if (!nextA || !nextB || !nextSa || !nextSb) return;
    const sp = new URLSearchParams({ a: nextA, b: nextB, sa: nextSa, sb: nextSb });
    if (campus !== "st-george") sp.set("campus", campus);
    router.push(`/compare?${sp.toString()}`);
  }

  function pickCategory(side: "a" | "b", categoryId: string) {
    const children = programsOf(categoryId);
    // 大类下只有一个可选专业时直接选中，省一次点击
    const only = children.length === 1 ? children[0] : undefined;
    const nextProgram = only?.id ?? "";
    const nextStream = only?.streams[0]?.key ?? "";
    if (side === "a") {
      setACategory(categoryId);
      setA(nextProgram);
      setSa(nextStream);
      go(nextProgram, b, nextStream, sb);
    } else {
      setBCategory(categoryId);
      setB(nextProgram);
      setSb(nextStream);
      go(a, nextProgram, sa, nextStream);
    }
  }

  function pickProgram(side: "a" | "b", id: string) {
    const first = streamsOf(id)[0]?.key ?? "";
    if (side === "a") {
      setA(id);
      setSa(first);
      go(id, b, first, sb);
    } else {
      setB(id);
      setSb(first);
      go(a, id, sa, first);
    }
  }

  function pickStream(side: "a" | "b", key: string) {
    if (side === "a") {
      setSa(key);
      go(a, b, key, sb);
    } else {
      setSb(key);
      go(a, b, sa, key);
    }
  }

  const selectClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-uoft focus:outline-none focus:ring-2 focus:ring-uoft/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  function sideFields(side: "a" | "b") {
    const categoryId = side === "a" ? aCategory : bCategory;
    const programId = side === "a" ? a : b;
    const streamKey = side === "a" ? sa : sb;
    const children = programsOf(categoryId);
    const streams = streamsOf(programId);
    return (
      <div className="block">
        <span className={labelClass}>
          {side === "a" ? tr("compare.programA") : tr("compare.programB")}
        </span>
        <select
          value={categoryId}
          onChange={(e) => pickCategory(side, e.target.value)}
          className={selectClass}
        >
          <option value="">{tr("compare.categoryPlaceholder")}</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.sublabel ? `${g.label}（${g.sublabel}）` : g.label}
            </option>
          ))}
        </select>
        {categoryId !== "" && (
          <select
            value={programId}
            onChange={(e) => pickProgram(side, e.target.value)}
            className={`${selectClass} mt-2`}
          >
            <option value="">{tr("compare.placeholder")}</option>
            {children.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sublabel ? `${p.label}（${p.sublabel}）` : p.label}
              </option>
            ))}
          </select>
        )}
        {programId !== "" && streams.length > 1 && (
          <select
            value={streamKey}
            onChange={(e) => pickStream(side, e.target.value)}
            className={`${selectClass} mt-2`}
          >
            {streams.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go(a, b, sa, sb);
      }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {sideFields("a")}
        {sideFields("b")}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-uoft px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-uoft-light"
        >
          {tr("compare.submit")}
        </button>
        <span className="text-xs text-slate-400">{tr("compare.campusHint")}</span>
      </div>
    </form>
  );
}
