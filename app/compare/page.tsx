import type { Metadata } from "next";
import CompareForm from "@/components/CompareForm";
import CompareResult from "@/components/CompareResult";
import { comparePrograms, getCompareGroups } from "@/lib/compare";
import { normalizeCampus } from "@/lib/program-meta";
import { getLocale } from "@/lib/i18n/server";
import { t } from "@/lib/i18n/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: `${t(locale, "compare.title")} · ${t(locale, "brand.name")}`,
  };
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{
    a?: string;
    b?: string;
    sa?: string;
    sb?: string;
    campus?: string;
  }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const campus = normalizeCampus(params.campus);
  const groups = await getCompareGroups(locale, campus);
  const byId = new Map(
    groups.flatMap((g) => g.programs).map((p) => [p.id, p])
  );

  const a = params.a && byId.has(params.a) ? params.a : undefined;
  const b = params.b && byId.has(params.b) ? params.b : undefined;
  const streamFor = (id: string | undefined, raw: string | undefined) => {
    if (!id) return undefined;
    const list = byId.get(id)?.streams ?? [];
    return list.some((s) => s.key === raw) ? (raw as string) : list[0]?.key;
  };
  const sa = streamFor(a, params.sa);
  const sb = streamFor(b, params.sb);

  const comparison =
    a && b && sa && sb ? await comparePrograms(locale, a, sa, b, sb) : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        {t(locale, "compare.title")}
      </h1>
      <p className="mt-2 mb-6 max-w-3xl text-sm text-slate-600">
        {t(locale, "compare.subtitle")}
      </p>

      <CompareForm
        key={`${campus}|${a ?? ""}|${b ?? ""}|${sa ?? ""}|${sb ?? ""}`}
        groups={groups}
        campus={campus}
        aId={a}
        bId={b}
        aStream={sa}
        bStream={sb}
      />

      {comparison ? (
        <CompareResult data={comparison} />
      ) : (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-500">
          {t(locale, "compare.empty")}
        </p>
      )}

      <p className="mt-6 text-xs leading-relaxed text-slate-400">
        {t(locale, "compare.footnote")}
      </p>
    </main>
  );
}
