import { dbAll, dbGet } from "@/lib/db";
import { SHOW_INSTRUCTOR_RATINGS } from "@/lib/features";
import type {
  Course,
  Instructor,
  Plan,
  PlanCourse,
  Program,
  ProgramStream,
  RequirementType,
} from "@/lib/types";
import {
  MAX_YEAR,
  PROGRAM_STREAM_CHILDREN,
  PROGRAM_STREAMS,
} from "@/lib/program-meta";

interface ProgramRow {
  id: string;
  code: string;
  name: string;
  name_en: string;
  campus_id: number;
  campus: string;
  description: string | null;
}

interface CourseRow {
  code: string;
  name: string;
  description: string | null;
  credits: number;
  department: string | null;
  requirement_type: RequirementType;
  note: string | null;
  alternatives: string | null;
  credit_override: number | null;
}

interface InstructorRow {
  id: number;
  rmp_id: string | null;
  name: string;
  department: string | null;
  avg_rating: number | null;
  avg_difficulty: number | null;
  num_ratings: number | null;
  would_take_again: number | null;
  tags: string | null;
  source: "rmp" | "sample";
}

function toProgram(row: ProgramRow): Program {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    nameEn: row.name_en,
    campusId: row.campus_id,
    campus: row.campus,
    description: row.description,
  };
}

function toInstructor(row: InstructorRow): Instructor {
  let tags: string[] = [];
  if (row.tags) {
    try {
      tags = JSON.parse(row.tags);
    } catch {
      tags = [];
    }
  }
  return {
    id: row.id,
    rmpId: row.rmp_id,
    name: row.name,
    department: row.department,
    avgRating: row.avg_rating,
    avgDifficulty: row.avg_difficulty,
    numRatings: row.num_ratings,
    wouldTakeAgain: row.would_take_again,
    tags,
    source: row.source,
  };
}

export async function getPrograms(): Promise<Program[]> {
  const rows = (await dbAll(
    `SELECT p.*, c.name AS campus
       FROM programs p
       JOIN campuses c ON c.id = p.campus_id
      ORDER BY p.id`
  )) as unknown as ProgramRow[];
  return rows.map(toProgram);
}

export async function getProgram(id: string): Promise<Program | null> {
  const row = (await dbGet(
    `SELECT p.*, c.name AS campus
       FROM programs p
       JOIN campuses c ON c.id = p.campus_id
      WHERE p.id = ?`,
    id
  )) as unknown as ProgramRow | undefined;
  return row ? toProgram(row) : null;
}

export function getAvailableYears(programId: string): number[] {
  // 固定显示 1-4 年级，避免"大三大四消失"的困惑；
  // 没有课程数据的年级由 PlanView 展示细分方向卡片引导选择。
  return Array.from({ length: MAX_YEAR }, (_, i) => i + 1);
}


export async function getInstructorsForCourse(courseCode: string): Promise<Instructor[]> {
  if (!SHOW_INSTRUCTOR_RATINGS) return [];
  const rows = (await dbAll(
    `SELECT i.*
       FROM instructors i
       JOIN course_instructors ci ON ci.instructor_id = i.id
      WHERE ci.course_code = ?
      ORDER BY i.avg_rating DESC`,
    courseCode
  )) as unknown as InstructorRow[];
  return rows.map(toInstructor);
}

export async function getStreams(programId: string): Promise<ProgramStream[]> {
  const rows = (await dbAll(
    "SELECT DISTINCT stream FROM program_courses WHERE program_id = ?",
    programId
  )) as unknown as { stream: string }[];
  const withData = new Set(rows.map((r) => r.stream));
  const config = PROGRAM_STREAMS[programId] ?? [
    { key: "specialist", label: "Specialist", type: "specialist" as const },
  ];
  return config.filter((s) => withData.has(s.key));
}

export function normalizeStream(raw: string | undefined, programId: string): string {
  const config = PROGRAM_STREAMS[programId] ?? [];
  const valid = new Set(config.map((s) => s.key));
  for (const s of config) {
    const children = PROGRAM_STREAM_CHILDREN[`${programId}:${s.key}`] ?? [];
    for (const c of children) valid.add(c.key);
  }
  if (raw && valid.has(raw)) return raw;
  return config[0]?.key ?? "specialist";
}

export async function getPlan(
  programId: string,
  year: number,
  stream: string = "specialist"
): Promise<Plan | null> {
  const program = await getProgram(programId);
  if (!program) return null;

  const rows = (await dbAll(
    `SELECT co.code, co.name, co.description, co.credits, co.department,
            pc.requirement_type, pc.note, pc.alternatives, pc.credits AS credit_override
       FROM program_courses pc
       JOIN courses co ON co.code = pc.course_code
      WHERE pc.program_id = ? AND pc.year = ? AND pc.stream = ?
      ORDER BY co.code`,
    programId,
    year,
    stream
  )) as unknown as CourseRow[];

  const build = async (type: RequirementType): Promise<PlanCourse[]> => {
    const items: PlanCourse[] = [];
    for (const r of rows.filter((x) => x.requirement_type === type)) {
      let alternatives: string[] = [];
      if (r.alternatives) {
        try {
          alternatives = JSON.parse(r.alternatives);
        } catch {
          alternatives = [];
        }
      }
      const optionInstructors =
        alternatives.length > 0
          ? await Promise.all(
              alternatives.map(async (code) => ({
                code,
                instructors: await getInstructorsForCourse(code),
              }))
            )
          : undefined;
      items.push({
        code: r.code,
        name: r.name,
        description: r.description,
        credits: r.credit_override ?? r.credits,
        department: r.department,
        requirementType: r.requirement_type,
        note: r.note,
        instructors: await getInstructorsForCourse(r.code),
        alternatives,
        optionInstructors,
      });
    }
    return items;
  };

  // 当前流本身有子方向（如 Data Science Specialist 下的 Focus）时直接取；
  // 若当前流已是某个子方向（focus-qfin），则回查其所属分组，保证顶部仍可切换
  const subStreams =
    PROGRAM_STREAM_CHILDREN[`${programId}:${stream}`] ??
    Object.entries(PROGRAM_STREAM_CHILDREN).find(
      ([key, children]) =>
        key.startsWith(`${programId}:`) &&
        children.some((c) => c.key === stream)
    )?.[1] ??
    [];

  return {
    program,
    year,
    years: getAvailableYears(programId),
    stream,
    streams: await getStreams(programId),
    subStreams,
    yearNote: await getYearNote(programId, year),
    core: await build("core"),
    recommended: await build("recommended"),
    elective: await build("elective"),
  };
}

export async function getYearNote(
  programId: string,
  year: number
): Promise<string | null> {
  const row = (await dbGet(
    "SELECT note FROM program_year_notes WHERE program_id = ? AND year = ?",
    programId,
    year
  )) as { note: string } | undefined;
  return row?.note ?? null;
}

export function normalizeYear(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "1", 10);
  if (Number.isNaN(n)) return 1;
  return Math.min(MAX_YEAR, Math.max(1, n));
}