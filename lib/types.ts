export type RequirementType = "core" | "recommended" | "elective";
export type StreamType = "specialist" | "major" | "minor" | "focus";

/** 学位流：对应官方日历中一个具体的命名专业（如 Specialist in Statistical Science: Theory and Methods） */
export interface ProgramStream {
  key: string;
  label: string;
  type: StreamType;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  campusId: number;
  campus: string;
  description: string | null;
}

export interface Course {
  code: string;
  name: string;
  description: string | null;
  credits: number;
  department: string | null;
}

export interface Instructor {
  id: number;
  rmpId: string | null;
  name: string;
  department: string | null;
  avgRating: number | null;
  avgDifficulty: number | null;
  numRatings: number | null;
  wouldTakeAgain: number | null;
  tags: string[];
  source: "rmp" | "sample";
}

export interface PlanCourse extends Course {
  requirementType: RequirementType;
  note: string | null;
  instructors: Instructor[];
  /** 同组备选课程（"任选其一"系列），仅显示在主课程旁 */
  alternatives: string[];
  /** 备选课程各自的教授（用于"任选其一"槽位展示评分） */
  optionInstructors?: { code: string; instructors: Instructor[] }[];
}

export interface Plan {
  program: Program;
  year: number;
  years: number[];
  stream: string;
  streams: ProgramStream[];
  /** 当前学位流下的子方向（如 Data Science Specialist 下的 Focus） */
  subStreams: ProgramStream[];
  yearNote: string | null;
  core: PlanCourse[];
  recommended: PlanCourse[];
  elective: PlanCourse[];
}

export interface ProgramOption {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  blurb: string;
  group?: string;
  parent?: string;
  /** 校区 slug：st-george / utm / utsc（默认 st-george） */
  campus?: string;
  /** 学位/专业类型标注，如 "Specialist · Major"、"Focus"、"BCom" 等 */
  degree?: string;
}
