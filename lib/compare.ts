import { dbAll } from "@/lib/db";
import {
  CAMPUS_META,
  PROGRAM_OPTIONS,
  PROGRAM_STREAM_CHILDREN,
  PROGRAM_STREAMS,
  isFoundationProgram,
  programsOfCampus,
} from "@/lib/program-meta";
import { getProgram } from "@/lib/planner";
import { programName, streamLabel } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/config";
import type {
  Program,
  ProgramOption,
  ProgramStream,
  StreamType,
} from "@/lib/types";

/**
 * 双专业对比：把两个专业（学位类型）的必修课都取出来，
 * 能互相满足要求的课程只算一次，得出"一起读一共要修多少门必修课"。
 */

export interface CompareStreamOption extends ProgramStream {
  /** 若该流是某个方向的子方向（Focus），记录父方向 key，用于英文名称映射 */
  parentStreamKey?: string;
}

export interface CompareProgramOption {
  id: string;
  label: string;
  /** 中文界面下同时显示英文名 */
  sublabel: string | null;
  streams: { key: string; label: string; type: StreamType }[];
}

/** 第一级下拉：专业大类（与首页的大类一致），第二级是它下面的细分专业 */
export interface CompareProgramGroup {
  id: string;
  label: string;
  sublabel: string | null;
  programs: CompareProgramOption[];
}

export interface CompareCourseRow {
  code: string;
  name: string;
  credits: number;
  group: "shared" | "onlyA" | "onlyB";
  yearsA: number[];
  yearsB: number[];
  /** 该课程在对应专业里只是"可选替代"，不是列出的主课程（但同样能满足要求） */
  altA: boolean;
  altB: boolean;
}

export interface CompareSide {
  program: Program;
  streamKey: string;
  streamLabel: string;
  /** 该学位类型没有必修清单时，用推荐课程估算 */
  usedRecommended: boolean;
  count: number;
  credits: number;
}

export interface ProgramComparison {
  a: CompareSide;
  b: CompareSide;
  rows: CompareCourseRow[];
  sharedCount: number;
  sharedCredits: number;
  totalCount: number;
  totalCredits: number;
}

interface ProgramRow {
  id: string;
  code: string;
  name: string;
  name_en: string;
  campus_id: number;
  campus: string;
  description: string | null;
}

interface CoreRow {
  course_code: string;
  year: number;
  credit_override: number | null;
  alternatives: string | null;
  requirement_type: string;
  name: string;
  course_credits: number;
}

interface Slot {
  code: string;
  /** 主课程 + 官方列出的替代课程 */
  codes: string[];
  name: string;
  credits: number;
  year: number;
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

/** 所有在数据库里带课程数据的专业（分类目录页没有课程，不参与对比） */
export async function getComparablePrograms(): Promise<Program[]> {
  const rows = (await dbAll(
    `SELECT p.id, p.code, p.name, p.name_en, p.campus_id, p.description, c.name AS campus
       FROM programs p
       JOIN campuses c ON c.id = p.campus_id
      WHERE p.id IN (SELECT DISTINCT program_id FROM program_courses)
      ORDER BY p.id`
  )) as unknown as ProgramRow[];
  return rows.map(toProgram);
}

/** 每个专业可选的学位类型（含 Focus 子方向），只保留数据库里有课程数据的 */
export async function getStreamChoices(): Promise<
  Record<string, CompareStreamOption[]>
> {
  const rows = (await dbAll(
    "SELECT DISTINCT program_id, stream FROM program_courses"
  )) as unknown as { program_id: string; stream: string }[];
  const byProgram = new Map<string, Set<string>>();
  for (const r of rows) {
    const set = byProgram.get(r.program_id) ?? new Set<string>();
    set.add(r.stream);
    byProgram.set(r.program_id, set);
  }

  const out: Record<string, CompareStreamOption[]> = {};
  for (const [programId, streams] of byProgram) {
    const config = PROGRAM_STREAMS[programId] ?? [
      { key: "specialist", label: "Specialist", type: "specialist" as StreamType },
    ];
    const handled = new Set<string>();
    const list: CompareStreamOption[] = [];
    for (const s of config) {
      handled.add(s.key);
      if (streams.has(s.key)) list.push({ ...s });
    }
    for (const [groupKey, children] of Object.entries(PROGRAM_STREAM_CHILDREN)) {
      if (!groupKey.startsWith(`${programId}:`)) continue;
      const parentStreamKey = groupKey.slice(programId.length + 1);
      for (const c of children) {
        handled.add(c.key);
        if (streams.has(c.key)) list.push({ ...c, parentStreamKey });
      }
    }
    for (const key of streams) {
      if (!handled.has(key)) list.push({ key, label: key, type: "specialist" });
    }
    if (list.length > 0) out[programId] = list;
  }
  return out;
}


/** 某个专业往上找到最顶层的"大类"（如 eng-engsci-math -> eng） */
function topCategoryId(
  programId: string,
  byOptionId: Map<string, { id: string; parent?: string }>
): string {
  let current = byOptionId.get(programId);
  const seen = new Set<string>();
  while (current?.parent && !seen.has(current.id)) {
    seen.add(current.id);
    current = byOptionId.get(current.parent);
  }
  return current?.id ?? programId;
}

/**
 * 对比页的下拉选项：只列出"专业大类"，细分专业放在大类下面，
 * 名称已按当前语言本地化；大类顺序与首页一致。
 */
export async function getCompareGroups(
  locale: Locale,
  campusSlug: string
): Promise<CompareProgramGroup[]> {
  const campusId = CAMPUS_META.find((c) => c.slug === campusSlug)?.id;
  const [programs, streams] = await Promise.all([
    getComparablePrograms(),
    getStreamChoices(),
  ]);
  const byOptionId = new Map<string, ProgramOption>(
    PROGRAM_OPTIONS.map((o) => [o.id, o])
  );
  const optionIndex = new Map<string, number>(
    PROGRAM_OPTIONS.map((o, i) => [o.id, i])
  );

  const buckets = new Map<string, CompareProgramOption[]>();
  for (const p of programs) {
    if (campusId && p.campusId !== campusId) continue;
    if (isFoundationProgram(p.id)) continue;
    const list = streams[p.id] ?? [];
    if (list.length === 0) continue;
    const categoryId = topCategoryId(p.id, byOptionId);
    const bucket = buckets.get(categoryId) ?? [];
    bucket.push({
      id: p.id,
      label: programName(locale, p.name, p.nameEn),
      sublabel: locale === "zh" ? p.nameEn : null,
      streams: list.map((s) => ({
        key: s.key,
        label: streamLabel(locale, p.id, s.key, s.label, s.parentStreamKey),
        type: s.type,
      })),
    });
    buckets.set(categoryId, bucket);
  }

  // 大类顺序跟随首页（PROGRAM_OPTIONS 的排列），细分专业也按同一顺序
  const groups: CompareProgramGroup[] = [];
  const pushGroup = (categoryId: string) => {
    const children = buckets.get(categoryId);
    if (!children || children.length === 0) return;
    buckets.delete(categoryId);
    const option = byOptionId.get(categoryId);
    groups.push({
      id: categoryId,
      label: option ? programName(locale, option.name, option.nameEn) : categoryId,
      sublabel: option && locale === "zh" ? option.nameEn : null,
      programs: [...children].sort(
        (x, y) => (optionIndex.get(x.id) ?? 0) - (optionIndex.get(y.id) ?? 0)
      ),
    });
  };
  for (const option of programsOfCampus(campusSlug)) {
    if (option.group) continue;
    pushGroup(option.id);
  }
  for (const categoryId of buckets.keys()) pushGroup(categoryId);
  return groups;
}
/** 某个专业（学位类型）全年级的必修课槽位；任选其一的课会带上替代课程 */
async function getSlots(
  programId: string,
  stream: string
): Promise<{ slots: Slot[]; usedRecommended: boolean }> {
  const rows = (await dbAll(
    `SELECT pc.course_code, pc.year, pc.credits AS credit_override, pc.alternatives,
            pc.requirement_type, co.name, co.credits AS course_credits
       FROM program_courses pc
       JOIN courses co ON co.code = pc.course_code
      WHERE pc.program_id = ? AND pc.stream = ?
      ORDER BY pc.year, pc.course_code`,
    programId,
    stream
  )) as unknown as CoreRow[];

  const core = rows.filter((r) => r.requirement_type === "core");
  const used = core.length > 0 ? core : rows.filter((r) => r.requirement_type === "recommended");

  const slots: Slot[] = used.map((r) => {
    let alternatives: string[] = [];
    if (r.alternatives) {
      try {
        alternatives = JSON.parse(r.alternatives);
      } catch {
        alternatives = [];
      }
    }
    return {
      code: r.course_code,
      codes: [r.course_code, ...alternatives],
      name: r.name,
      credits: r.credit_override ?? r.course_credits ?? 0.5,
      year: r.year,
    };
  });
  return { slots, usedRecommended: core.length === 0 && used.length > 0 };
}

/** 课程编号 -> 官方名称与学分（部分替代课程不在课程表里，取不到就退回槽位信息） */
async function getCourseInfo(
  codes: string[]
): Promise<Map<string, { name: string; credits: number }>> {
  const info = new Map<string, { name: string; credits: number }>();
  const unique = [...new Set(codes)];
  if (unique.length === 0) return info;
  const placeholders = unique.map(() => "?").join(",");
  const rows = (await dbAll(
    `SELECT code, name, credits FROM courses WHERE code IN (${placeholders})`,
    ...unique
  )) as unknown as { code: string; name: string; credits: number }[];
  for (const r of rows) info.set(r.code, { name: r.name, credits: r.credits });
  return info;
}

interface Entry {
  slotIndex: number;
  primary: boolean;
  slot: Slot;
}

function buildUniverse(slots: Slot[]): Map<string, Entry> {
  const map = new Map<string, Entry>();
  slots.forEach((slot, i) => {
    slot.codes.forEach((code, ci) => {
      const primary = ci === 0;
      const prev = map.get(code);
      if (!prev || (primary && !prev.primary)) {
        map.set(code, { slotIndex: i, primary, slot });
      }
    });
  });
  return map;
}


export async function comparePrograms(
  locale: Locale,
  aId: string,
  aStream: string,
  bId: string,
  bStream: string
): Promise<ProgramComparison | null> {
  const [programA, programB] = await Promise.all([getProgram(aId), getProgram(bId)]);
  if (!programA || !programB) return null;

  const [sideA, sideB] = await Promise.all([
    getSlots(aId, aStream),
    getSlots(bId, bStream),
  ]);
  const universeA = buildUniverse(sideA.slots);
  const universeB = buildUniverse(sideB.slots);

  // 两个专业都能用上的课程，优先配对"两边都是主课程"的组合，
  // 保证一门课只被认领一次（同一门课不能同时顶掉两门不同的必修）
  const sharedCodes = [...universeA.keys()].filter((c) => universeB.has(c));
  const primaryScore = (code: string) =>
    (universeA.get(code)?.primary ? 1 : 0) + (universeB.get(code)?.primary ? 1 : 0);
  sharedCodes.sort((x, y) => primaryScore(y) - primaryScore(x) || x.localeCompare(y));

  const usedA = new Set<number>();
  const usedB = new Set<number>();
  const pairs: { code: string; a: Slot; b: Slot }[] = [];
  for (const code of sharedCodes) {
    const ai = sideA.slots.findIndex(
      (s, i) => !usedA.has(i) && s.codes.includes(code)
    );
    const bi = sideB.slots.findIndex(
      (s, i) => !usedB.has(i) && s.codes.includes(code)
    );
    if (ai < 0 || bi < 0) continue;
    usedA.add(ai);
    usedB.add(bi);
    pairs.push({ code, a: sideA.slots[ai], b: sideB.slots[bi] });
  }

  const info = await getCourseInfo(pairs.map((p) => p.code));
  const rows: CompareCourseRow[] = pairs.map((p) => {
    const meta = info.get(p.code);
    return {
      code: p.code,
      name: meta?.name ?? p.a.name,
      credits: meta?.credits ?? Math.min(p.a.credits, p.b.credits),
      group: "shared" as const,
      yearsA: [p.a.year],
      yearsB: [p.b.year],
      altA: p.a.code !== p.code,
      altB: p.b.code !== p.code,
    };
  });

  const pushOnly = (
    slots: Slot[],
    used: Set<number>,
    group: "onlyA" | "onlyB"
  ) => {
    slots.forEach((slot, i) => {
      if (used.has(i)) return;
      rows.push({
        code: slot.code,
        name: slot.name,
        credits: slot.credits,
        group,
        yearsA: group === "onlyA" ? [slot.year] : [],
        yearsB: group === "onlyB" ? [slot.year] : [],
        altA: false,
        altB: false,
      });
    });
  };
  pushOnly(sideA.slots, usedA, "onlyA");
  pushOnly(sideB.slots, usedB, "onlyB");
  rows.sort((x, y) => {
    const rank = { shared: 0, onlyA: 1, onlyB: 2 };
    return rank[x.group] - rank[y.group] || x.code.localeCompare(y.code);
  });

  const creditsA = sideA.slots.reduce((sum, s) => sum + s.credits, 0);
  const creditsB = sideB.slots.reduce((sum, s) => sum + s.credits, 0);
  // 共用的课只算一次：省下的是它能顶掉的那部分学分（两边取其小）
  const sharedCredits = pairs.reduce(
    (sum, p) => sum + Math.min(p.a.credits, p.b.credits),
    0
  );

  const streamConfig = await getStreamChoices();
  const labelOf = (programId: string, streamKey: string) => {
    const found = (streamConfig[programId] ?? []).find((s) => s.key === streamKey);
    if (!found) return streamKey;
    return streamLabel(locale, programId, found.key, found.label, found.parentStreamKey);
  };

  return {
    a: {
      program: programA,
      streamKey: aStream,
      streamLabel: labelOf(aId, aStream),
      usedRecommended: sideA.usedRecommended,
      count: sideA.slots.length,
      credits: creditsA,
    },
    b: {
      program: programB,
      streamKey: bStream,
      streamLabel: labelOf(bId, bStream),
      usedRecommended: sideB.usedRecommended,
      count: sideB.slots.length,
      credits: creditsB,
    },
    rows,
    sharedCount: pairs.length,
    sharedCredits,
    totalCount: sideA.slots.length + sideB.slots.length - pairs.length,
    totalCredits: creditsA + creditsB - sharedCredits,
  };
}
