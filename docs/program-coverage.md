# 官网专业对照与补齐流程

本文档说明如何保证网站专业覆盖与多伦多大学官方目录一致：
怎么找到"漏了哪些专业"、怎么把新专业加进来、有哪些不能踩的坑。

## 1. 权威数据源

文理学院（Faculty of Arts & Science）大一入学的全部专业，官方全集在：

**Program and Certificate Search**
https://artsci.calendar.utoronto.ca/search-programs

该搜索页支持按类型筛选：

| type 值 | 类型 |
| --- | --- |
| 1 | Combined Degree Program |
| 2 | Specialist |
| 3 | Major |
| 4 | Minor |
| 5 | Focus |
| 6 | Certificate - Category 1 |
| 7 | Certificate - Category 2 |

注意：

- **护理（BScN）、药学（PharmD）等"第二入口专业"不在这个列表里**，要去各学院官网查
  （Bloomberg 护理学院、Leslie Dan 药学院）。它们不是大一入学专业，需要先完成约两年
  大学课程再申请，网站里放在独立的"第二入口专业"大类下。
- 日历每年 8-9 月更新；当前基线为 2026-27 版（2026-08 核对）。

## 2. 抓取官方全集

脚本：[`work/scrape_official_programs.mjs`](../../work/scrape_official_programs.mjs)
（位于项目外的 work 目录；如需长期维护可拷入 `scripts/`）。

```bash
# 在仓库根目录（he）执行
node work/scrape_official_programs.mjs
```

输出：`work/official_programs.json`

- 按 type=1..7 逐页抓取，正则提取每个条目的标题与 AS 代码
  （如 `ASMAJ0608`、`ASSPE0608`、`ASFOC1689K`、`ASCER2400`、`AS CHRM`）
- 同时抓取条目所属的 FAS Program Area（学科板块），便于按学科整理缺口
- 2026-08 基线：共 404 个官方条目（Specialist / Major / Minor / Focus / 证书合计）
- Combined Degree Program 页面没有 AS 代码，脚本会跳过（数量很少，单独人工核对即可）

## 3. 与网站现有专业对比

脚本：[`work/compare_programs.mjs`](../../work/compare_programs.mjs)

```bash
node work/compare_programs.mjs
```

输出：`work/program_gaps.txt`

原理：把 `lib/program-meta.ts` 里的字符串字面量（专业名/Stream 标签）与官方标题做
模糊匹配（词重叠率 ≥ 0.45 视为已覆盖），未匹配的按学科板块分组输出。

⚠️ 匹配结果必须人工复核：

- 中文标签、缩写会造成"误报缺失"（实际已覆盖）
- 官网标题的 `(Arts Program)` / `(Science Program)` 后缀不影响识别
- 别名（如 Human Biology vs HMB）可能"漏报"（实际缺失却匹配上）

## 4. 新增一个专业的标准流水线

以"精算 Actuarial Science"（`work/rebuild_actuarial.js`）为最新范本，
`work/rebuild_stats.js`、`work/rebuild_engsci.js` 也是可参考的示例。

### 第 1 步：查官网，拿准数据

打开该专业页面（如 https://artsci.calendar.utoronto.ca/program/asspe0608），记录：

- 官方总学分（如 Major 8.5 / Specialist 13.0）
- 进专业要求（完成多少学分、哪些课程、最低分）
- 按年份/阶段的必修课、可替代课程（"任选其一"）

### 第 2 步：写数据库重建脚本

新建 `work/rebuild_xxx.js`（在项目根目录运行），做四件事：

1. `programs` 表插入/更新专业行（id、code、中文名、官方英文名、描述）
2. `courses` 表补齐缺失课程（**课名必须来自官网课程页**，学分、系别写准确）
3. `program_courses` 写入各年份、各 Stream 的必修课：
   - "任选其一"用一条记录 + `alternatives` JSON 数组表示，`credits` 只计一次
   - `stream` 与 `lib/program-meta.ts` 里的 key 保持一致
4. `program_year_notes` 写年级说明（进专业要求、关键提醒、SOA VEE 等）

### 第 3 步：改 `lib/program-meta.ts`

- `PROGRAM_OPTIONS_BASE`：加大类卡片（无 group）或细分卡片（`group` + `parent`）
- `PROGRAM_DEGREE`：加学位类型标注（如 "Specialist · Major（限额录取）"）
- `buildStreams`：加 case，**Stream 标签必须与官网专业名 1:1**（如
  "Specialist in Statistical Science: Methods and Practice"）
- Focus / 子方向：在 `PROGRAM_STREAM_CHILDREN` 里挂，或作为独立 stream key

### 第 4 步：改 `lib/year-hints.ts`

加大一"进专业要求"提示卡（含可替代课程与最低分），大三大四关键提醒按需加。

### 第 5 步：重建并验证

```bash
# 项目根目录（uoft-course-planner）执行
node ../work/rebuild_xxx.js   # 写入数据库
node ../work/gen_seed.js      # 由数据库重新生成 scripts/seed.ts
npm run seed                  # 用种子数据重建数据库
npm run build                 # 类型检查 + 构建
# 重启 localhost:3000
```

验证清单：

- [ ] 主页出现新大类卡片；大类页出现细分卡片；细分页出现 Specialist/Major/Minor 卡片
- [ ] 1-4 年级页签都在，切换年份不跳回第一个 Stream
- [ ] 各年级学分合计 = 官网总学分
- [ ] 大一有进专业要求提示（含替代课程与最低分）
- [ ] 无问号乱码；专业名与官网一字不差

## 5. 铁律（避免返工）

- **专业名 1:1 官网**，含 Stream / Focus 后缀，不能自创缩写
- "任选其一"用一条 `alternatives` 槽位，`credits` 只算一次
- **进专业要求必须写进大一提示卡**，含可替代课程与最低分
- 大三大四页签保留；某年级无官方必修时展示方向卡片引导，而不是让页面"消失"
- 第二入口专业只放先修要求与申请说明，**不编造具体课号**
- 课程名出现 "？" 通常意味着课名没补全，逐个修正后再上线

## 6. 第二入口专业（护理 / 药学）

- 数据源：各学院官网（Bloomberg BScN、Leslie Dan PharmD），不是 A&S 日历
- 实现方式：`lib/program-meta.ts` 加大类 + 两个细分卡片，`buildStreams` 返回空数组
  （无学位类型选择器），内容用 `program_year_notes` + `year-hints` 提示卡呈现
- 护理 BScN（2026 年及以后入学）：10.0 学分、B 均分、生理 1.0 / 微生物 0.5 /
  统计 0.5 / 生命或物理科学 1.0 / 社科 1.0 或 0.5+0.5 人文，CASPer，2 年加速项目
- 药学 PharmD：≥8.0 FCE、均分 ≥70%、生物 1.0 / 化学 1.5 / 数学 1.0（含微积分）/
  人文社科 1.0 FCE，CASPer + 在线评估，4 年制

## 7. 当前覆盖基线（2026-08-16 核对）

- 官方全集：404 个条目；网站已覆盖的缺口清单见 `work/program_gaps.txt`
- 网站数据：115 个专业条目、12 大主类（含环境研究与第二入口专业）、1652 门课程、
  2842 条课程要求、374 条年级说明
- 已补：精算、护理/药学（第二入口）、认知科学、宗教（含佛教/伊斯兰）、艺术史、
  电影研究、女性与性别研究、考古学、戏剧、原住民研究、城市研究、
  环境研究大板块（环境研究/环境与健康/环境伦理/环境地理/气候变化）、
  金融经济学 Specialist、心理学研究 Specialist
- 仍未补的重点方向：语言文化类（意/葡/西/法/德/斯拉夫等）、区域研究
  （加拿大/美国/非洲/拉美等）、公共政策、中世纪/文艺复兴/凯尔特、
  环境能源/行为/经济/毒理、各学院项目与证书（见缺口清单）
