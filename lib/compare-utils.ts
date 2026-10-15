import type { CompareCourseRow } from "@/lib/compare";

/**
 * 对比结果的纯函数工具（不碰数据库），客户端组件也能安全引用。
 * 类型从 lib/compare 里 import type 进来，编译后不会带上任何服务端代码。
 */

const GROUP_RANK: Record<CompareCourseRow["group"], number> = {
  shared: 0,
  onlyA: 1,
  onlyB: 2,
};

/** 一门课最早要修的年级：两个专业要求不同时取较早的那个 */
export function firstYearOf(row: CompareCourseRow): number {
  const years = [...row.yearsA, ...row.yearsB];
  return years.length > 0 ? Math.min(...years) : 99;
}

/** 按年级（大一 → 大四）分组，组内 可共用 → 仅 A → 仅 B，再按课程编号排 */
export function groupByYear(
  rows: CompareCourseRow[]
): { year: number; rows: CompareCourseRow[] }[] {
  const map = new Map<number, CompareCourseRow[]>();
  for (const row of rows) {
    const year = firstYearOf(row);
    const list = map.get(year) ?? [];
    list.push(row);
    map.set(year, list);
  }
  return [...map.entries()]
    .sort((x, y) => x[0] - y[0])
    .map(([year, list]) => ({
      year,
      rows: [...list].sort(
        (x, y) =>
          GROUP_RANK[x.group] - GROUP_RANK[y.group] || x.code.localeCompare(y.code)
      ),
    }));
}
