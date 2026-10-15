# UofT 选课助手（Course Planner）

输入年级和目标专业，自动生成多伦多大学（St. George / 密西沙加 / 士嘉堡）的课程计划，
并支持双专业对比：一次看清两个专业之间哪些必修课可以共用。

当前支持 **12 大专业**：**计算机科学 (Computer Science)**、**生命科学 (Life Sciences)**、
**罗德曼商学院 (Rotman Commerce)**、**数学与物理科学 (Mathematics & Physical Sciences)**、
**人文学科 (Humanities)**、**社会科学 (Social Sciences)**、**音乐 (Music)**、
**体育 (Kinesiology & Physical Education)**、**建筑与视觉研究 (Architecture & Visual Studies)**、
**工程 (Engineering)**、**环境研究 (Environmental Studies)**、
**第二入口专业 (Second-Entry Programs)**，共细分出 **103 个方向卡片**。

- 数学与物理科学：数学、物理、化学、统计、天文与天体物理、地球科学、**精算 (Actuarial Science)**
- 人文学科：哲学、英语、历史、古典学、语言学、东亚研究、**宗教、艺术史、电影研究、
  女性与性别研究、考古学、戏剧、原住民研究**
- 社会科学：经济、心理、政治、社会学、人类学、犯罪学、地理、**认知科学、城市研究**，
  以及经济/心理的进阶 Specialist
- 环境研究：环境研究、环境与健康、环境伦理、环境地理、气候变化研究
- 第二入口专业：护理（BScN）、药学（PharmD）——需先完成约两年大学课程再申请
- 工程：工程科学（含 8 个细分方向）、化工、土木、ECE、工业、机械、材料、矿物、TrackOne

覆盖大一到大四共 **1652 门课程**、**2842 条课程要求**（含 Specialist / Major / Minor
等学位类型的差异化课程与"任选其一"组合）、**374 条年级说明**。
专业要求以 UofT Arts & Science Academic Calendar（2026-27）为准整理。

## 功能

- 首页展示 11 大专业，点击专业进入细分方向选择页，再点方向查看对应必修课
- 每个细分方向有各自独立的四年课程组合（必修 / 推荐 / 选修）
- 支持按官方命名切换学位类型（如统计的 Specialist in Statistical Science:
  Methods & Practice / Theory & Methods、Statistics Major / Minor、Applied Data Science Minor），
  每种学位类型显示各自独立的修课要求（含备选课程，如数学 MAT135/136、MAT137、MAT157、
  MAT148/149、MAT158/159 任选序列）
- 未确定方向时可查看通用基础课；高年级页面会引导选择细分方向
- UofT 通常大二起即可申请进入专业（每年都可申请），提示文案已按此说明
- 每个年级附带选课提示（如大三方向分化、大四研究项目、进专业要求等）
- 双专业对比：选两个专业，查看可同时计入两个专业的必修课，以及双专业所需的总课程数
- 中英双语：页面右上角一键切换中文 / English

## 技术栈

- Next.js 16（App Router）+ React 19 + TypeScript
- Tailwind CSS 4
- 数据库：Turso（libSQL 云端）；未配置云端连接时自动回退到本地 SQLite
  （Node 内置 `node:sqlite`，无需额外数据库服务）

## 本地运行

需要 Node.js 22.5+（推荐 LTS 24）。

```bash
npm install        # 安装依赖
npm run seed       # 写入课程/专业种子数据（生成 data/uoft.db）
npm run dev        # 启动开发服务器，打开 http://localhost:3000
```

### 环境变量（可选）

不配置时使用本地 `data/uoft.db`；配置后读写云端数据库，方便多人共享同一份数据：

```bash
TURSO_DATABASE_URL=libsql://<your-database>.turso.io
TURSO_AUTH_TOKEN=<your-token>
```

把上面两行写在 `.env.local`（该文件已在 `.gitignore` 中，不会被提交）。

也可以先构建再运行：

```bash
npm run build
npm start
```

## 数据说明与免责声明

- 课程与专业要求基于 UofT 公开学术日历整理，仅供选课参考，请以
  [UofT Academic Calendar](https://artsci.calendar.utoronto.ca/) 官方要求为准。
- 本项目与 University of Toronto 无隶属关系。

## 如何保持专业覆盖完整

官网全集对照、缺口清单与新增专业的完整流程，见
[docs/program-coverage.md](docs/program-coverage.md)。

## 扩展其他大学

数据表已按"大学 → 校区 → 专业 → 课程"分层设计：

1. 在 `scripts/seed.ts`（由 `work/gen_seed.js` 生成）中新增大学、校区、专业和课程要求
2. 重新执行 `npm run seed`

## 目录结构

```
app/          页面（首页 + 课程计划页）
components/   界面组件（表单、课程卡片、双专业对比、教授对比表）
lib/          数据库、i18n、课程计划与双专业对比逻辑
scripts/      数据脚本（seed 种子数据）
data/         生成的 SQLite 数据库
docs/         维护文档（专业覆盖对照流程等）
```
