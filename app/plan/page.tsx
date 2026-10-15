import { notFound } from "next/navigation";
import PlanView from "@/components/PlanView";
import { getPlan, normalizeStream, normalizeYear } from "@/lib/planner";
import { normalizeCampus, programsOfCampus } from "@/lib/program-meta";

export const dynamic = "force-dynamic";

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{
    program?: string;
    year?: string;
    stream?: string;
    campus?: string;
  }>;
}) {
  const params = await searchParams;
  const campus = normalizeCampus(params.campus);
  const options = programsOfCampus(campus);
  const programId = options.some((p) => p.id === params.program)
    ? (params.program as string)
    : (options[0]?.id ?? "csc");
  const year = normalizeYear(params.year);
  const stream = normalizeStream(params.stream, programId);
  const plan = await getPlan(programId, year, stream);
  if (!plan) notFound();
  return <PlanView plan={plan} />;
}
