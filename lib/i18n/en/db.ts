import { COURSE_DESC_EN } from "@/lib/i18n/en/course-desc";
import { NOTE_EN } from "@/lib/i18n/en/course-note";
import { PROGRAM_DESC_EN } from "@/lib/i18n/en/program-desc";
import { YEAR_NOTE_EN } from "@/lib/i18n/en/year-notes";

export { COURSE_DESC_EN, NOTE_EN, PROGRAM_DESC_EN, YEAR_NOTE_EN };

/** 只是英文课程名的中文注解时，英文界面无需重复显示 */
const GLOSS_MARK = /[0-9A-Za-z≥≤%（）()\/]|任选|必修|要求|学分|序列|其一|之一|组合|推荐|选一|进专业|至少|另需|补足|停产|限额|年级|等/;

export function isPureGlossZh(text: string, maxLen = 24): boolean {
  const s = text.replace(/。$/, "").trim();
  if (!s) return false;
  if (GLOSS_MARK.test(s)) return false;
  return [...s].length <= maxLen;
}

/** 课程简介：纯注解直接省略（英文课程名已经显示） */
export function courseDescEn(code: string, zh: string | null | undefined): string | null {
  if (!zh) return null;
  const explicit = COURSE_DESC_EN[code];
  if (explicit) return explicit;
  if (isPureGlossZh(zh, 20)) return null;
  return zh;
}

/**
 * 中文 note 在英文界面下的呈现：
 * - 纯中文注解（如「视觉策略」对应 Visual Strategies）直接省略，因为英文课程名已经显示；
 * - 「注解（限定说明）」只保留括号内的限定说明；
 * - 其余按 NOTE_EN 翻译，查不到时原样返回。
 */
export function courseNoteEn(note: string): string | null {
  const trimmed = note.trim();
  if (!trimmed) return null;
  if (!/[\u4e00-\u9fff]/.test(trimmed)) return trimmed || null;

  let rest = trimmed;
  const lead = trimmed.match(/^([^（(]*)（/);
  if (lead) {
    const gloss = lead[1].trim();
    if (gloss && isPureGlossZh(gloss)) rest = trimmed.slice(lead[1].length).trim();
  }

  if (isPureGlossZh(rest)) return null;

  const explicit = NOTE_EN[rest] ?? NOTE_EN[trimmed];
  if (explicit) return explicit;

  if (!/[\u4e00-\u9fff]/.test(rest)) return rest;
  return rest;
}
