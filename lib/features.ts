/**
 * 功能开关（想重新上线某个模块时，把这里改回 true 再重启即可）
 *
 * SHOW_HS_MODE —— 高中生申请（含录取案例榜 /share/*）
 *   关掉后：顶部模式下拉里不再出现「高中生申请」，/hs/* 与 /share/* 会直接跳回首页。
 *   相关代码与数据（lib/hs-admissions.ts、lib/i18n/en/hs-admissions.ts、offer_cases 表）都原封不动保留。
 *
 * SHOW_INSTRUCTOR_RATINGS —— 教授评分（Rate My Professors）
 *   关掉后：课程卡片不再显示教授对比表，也不查 instructors 表。
 *   评分数据与抓取脚本都不在仓库里，全部放在仓库外的 ../rmp-data-backup/：
 *   数据 JSON + purge/restore 脚本，以及 rmp-code/ 下的 fetch-rmp.ts、
 *   rmp-candidates.ts、rmp.ts。
 *   要恢复：把这里改回 true，把 rmp-code/ 里的三个文件放回原位，再跑那边的 restore 脚本。
 */
export const SHOW_HS_MODE = false;

export const SHOW_INSTRUCTOR_RATINGS = false;
