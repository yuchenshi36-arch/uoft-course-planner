import type { Locale } from "@/lib/i18n/config";
import {
  CAMPUS_BLURB_EN,
  CAMPUS_NAME_EN,
  DEGREE_EN,
  GROUP_EN,
  PROGRAM_BLURB_EN,
  STREAM_EN,
} from "@/lib/i18n/en/programs";
import {
  PROGRAM_DESC_EN,
  YEAR_NOTE_EN,
  courseDescEn,
  courseNoteEn,
} from "@/lib/i18n/en/db";
import { HINT_EN, type HintText } from "@/lib/i18n/en/hints";

const isZh = (locale: Locale) => locale === "zh";

/** 校区显示名（中文为「圣乔治校区」，英文为 St. George） */
export function campusName(locale: Locale, slug: string, zhName: string): string {
  if (isZh(locale)) return zhName;
  return CAMPUS_NAME_EN[slug] ?? slug;
}

export function campusBlurb(locale: Locale, slug: string, zh: string): string {
  if (isZh(locale)) return zh;
  return CAMPUS_BLURB_EN[slug] ?? zh;
}

/** 专业名：中文界面「中文名（English）」，英文界面只用英文名 */
export function programTitle(
  locale: Locale,
  zhName: string | null | undefined,
  enName: string | null | undefined
): string {
  const zh = (zhName ?? "").trim();
  const en = (enName ?? "").trim();
  if (isZh(locale)) {
    if (zh && en) return `${zh}（${en}）`;
    return zh || en;
  }
  return en || zh;
}

/** 专业名（不带括号的纯名称） */
export function programName(
  locale: Locale,
  zhName: string | null | undefined,
  enName: string | null | undefined
): string {
  const zh = (zhName ?? "").trim();
  const en = (enName ?? "").trim();
  return isZh(locale) ? zh || en : en || zh;
}

export function programBlurb(locale: Locale, id: string, zh: string): string {
  if (isZh(locale)) return zh;
  return PROGRAM_BLURB_EN[id] ?? zh;
}

export function programDegree(
  locale: Locale,
  id: string,
  degree: string | undefined
): string | undefined {
  if (!degree) return degree;
  if (isZh(locale)) return degree;
  return DEGREE_EN[id] ?? degree;
}

export function groupLabel(locale: Locale, group: string | undefined): string | undefined {
  if (!group) return group;
  if (isZh(locale)) return group;
  return GROUP_EN[group] ?? group;
}

/** 学位流名称：children 用 `${programId}:${stream}#${key}`，普通流用 `${programId}:${key}` */
export function streamLabel(
  locale: Locale,
  programId: string,
  streamKey: string,
  zh: string,
  parentStreamKey?: string
): string {
  if (isZh(locale)) return zh;
  const key = parentStreamKey
    ? `${programId}:${parentStreamKey}#${streamKey}`
    : `${programId}:${streamKey}`;
  return STREAM_EN[key] ?? zh;
}

export function programDescription(locale: Locale, id: string, zh: string): string {
  if (isZh(locale)) return zh;
  return PROGRAM_DESC_EN[id] ?? zh;
}

export function courseDescription(
  locale: Locale,
  code: string,
  zh: string | null | undefined
): string | null {
  if (!zh) return null;
  if (isZh(locale)) return zh;
  return courseDescEn(code, zh);
}

export function courseNote(
  locale: Locale,
  note: string | null | undefined
): string | null {
  if (!note) return null;
  if (isZh(locale)) return note;
  return courseNoteEn(note);
}

export function yearNote(
  locale: Locale,
  programId: string,
  year: number,
  zh: string | null | undefined
): string | null {
  if (!zh) return null;
  if (isZh(locale)) return zh;
  return YEAR_NOTE_EN[`${programId}|${year}`] ?? zh;
}

/** 选课提示卡（title / body / items） */
export function hintText(
  locale: Locale,
  key: string,
  zh: HintText
): HintText {
  if (isZh(locale)) return zh;
  return HINT_EN[key] ?? zh;
}
