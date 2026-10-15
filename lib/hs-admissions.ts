export interface HsRequirement {
  subject: string;
  requirement: string;
  recommended?: boolean;
  grade?: string;
}

export interface HsCampusInfo {
  campus: "st-george" | "utm" | "utsc";
  campusName: string;
  link?: string;
  degree?: string;
  options?: string[];
  ouac?: string;
  range?: string;
  requirements: HsRequirement[];
  notes?: string[];
}

export interface HsProgram {
  id: string;
  name: string;
  nameEn: string;
  link?: string;
  programNotes?: string[];
  campuses: HsCampusInfo[];
}

export const HS_GENERAL_NOTES = [
  "OSSD：至少六门 12 年级 U/M 课程，其中必须包含英语（ENG4U / EAE4U）。",
  "官网给出的建议录取范围仅为参考，不保证录取；实际录取视名额与申请者整体竞争情况而定。",
  "12 年级成绩未出时，会参考对应 11 年级 U/M 成绩；全年按已有成绩发放有条件录取。",
  "Grade 12 课程中的 Co-op 部分不计入录取。",
  "英语非第一语言者需提供英语能力证明（除非符合豁免条件）。",
];

const sgGeneral = [
  "录取平均分可能不含微积分，但会重点考察最近一次英语与数学/微积分成绩。",
];

export const HS_PROGRAMS: HsProgram[] = [
  {
    id: "computer-science",
    name: "计算机科学",
    nameEn: "Computer Science",
    link: "https://future.utoronto.ca/program/computer-science",
    programNotes: [
      "提供带薪实习（Work-integrated Learning）方向",
    ],
    campuses: [
      {
        campus: "st-george",
        campusName: "St. George",
        link: "https://www.artsci.utoronto.ca/future/ready-apply/admission-categories/computer-science",
        degree: "HBSc",
        options: ["Specialist", "Major", "Minor"],
        ouac: "TAD",
        range: "Low 90s（90 分左右及以上）",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U", grade: "high 80s" },
          { subject: "Calculus & Vectors", requirement: "MCV4U", grade: "low 90s" },
        ],
        notes: [
          ...sgGeneral,
          "需提交补充申请（Supplemental Application）：提交 OUAC 申请后在 JOIN U of T 账户中完成，含 4 道简答题，围绕个人经历与特质，与 CS 本身无关、不限时；建议尽早提交。",
          "CS 录取通知不可延期（Offers not eligible for deferral）。",
          "可同时选择备选录取大类（数学与物理科学 / 生命科学 / 社会科学 / 人文学科；CS 与 Rotman Commerce 不可作为备选），不影响第一志愿；若被备选大类录取，仍可能等待第一志愿、视名额而定。",
          "转学生不能直接申请 CS 录取大类或专业（双重注册高中生等特殊情况除外）。",
        ],
      },
      {
        campus: "utm",
        campusName: "UTM (Mississauga)",
        link: "https://www.utm.utoronto.ca/future-students/programs/computer-science",
        degree: "HBSc",
        options: ["Specialist", "Major", "Minor"],
        ouac: "TMX",
        range: "Mid to High 80s",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U" },
          { subject: "Advanced Functions", requirement: "MHF4U" },
          { subject: "Calculus & Vectors", requirement: "MCV4U" },
          { subject: "Math of Data Management", requirement: "MDM4U", recommended: true },
        ],
        notes: [
          "需提交补充申请：一道文字题——列出成绩单未体现、且能帮助招生官理解你对计算领域兴趣与潜力的成就/经历；建议具体简洁、离线准备好再提交，多次提交只采用最近一次。",
          "CS 录取大类仅接受高中直接申请；转学生（含多大其他学院）不可申请，CS Specialist 与 Major 仅面向高中直接申请者开放。",
          "最低要求：安省至少六门 12 年级 U/M 课程（含 ENG4U ≥70%）；安省外需 12 年级英语 ≥70%；总体平均分至少 75%（按 ENG4U + 最佳五门 12 年级 U/M 计算）。",
          "UTM 保留优先考虑单次完成课程成绩学生的权利。",
        ],
      },
      {
        campus: "utsc",
        campusName: "UTSC (Scarborough)",
        link: "https://www.utsc.utoronto.ca/admissions/programs/computer-science",
        degree: "HBSc",
        options: ["Specialist", "Major", "Minor"],
        ouac: "TXC",
        range: "Low 90s 左右（Co-op 方向需 High 90s）",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U" },
          { subject: "Calculus & Vectors", requirement: "MCV4U" },
          { subject: "Advanced Functions", requirement: "MHF4U" },
        ],
        notes: [
          "最低要求：English（ENG4U / EAE4U）不低于 70%。",
        ],
      },
    ],
  },
  {
    id: "life-sciences",
    name: "生命科学",
    nameEn: "Life Sciences",
    link: "https://www.artsci.utoronto.ca/future/ready-apply/admission-categories/life-sciences",
    campuses: [
      {
        campus: "st-george",
        campusName: "St. George",
        ouac: "TLG",
        range: "Mid to high 80s（85 分左右及以上）",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U", grade: "mid to high 80s" },
          { subject: "Calculus & Vectors", requirement: "MCV4U", grade: "mid to high 80s" },
        ],
        notes: [
          ...sgGeneral,
          "无需补充申请（Supplementary Application Form Required: No）。",
          "录取必修只要求英语（ENG4U）和微积分（MCV4U），官网没有「三门科学选两门」的规定；但进入心理学等方向需 12 年级生物，修化学课程需 SCH4U，物理（SPH4U）对生理学、神经科学及 Specialist 方向强烈推荐，实际建议高中修完生物和化学（有余力再加物理）。",
        ],
      },
      {
        campus: "utm",
        campusName: "UTM (Mississauga)",
        link: "https://www.utm.utoronto.ca/future-students/programs/biology",
        degree: "HBSc",
        ouac: "TML",
        range: "Low to Mid 80s（80–85 分左右）",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U" },
          { subject: "Advanced Functions", requirement: "MHF4U" },
          { subject: "Biology", requirement: "SBI4U" },
          { subject: "Chemistry", requirement: "SCH4U" },
          { subject: "Calculus & Vectors", requirement: "MCV4U", recommended: true },
        ],
        notes: [
          "UTM 按具体专业申请，此处以 Biology 为代表；人类学、生物技术等其他生命科学类专业以官网各专业页面为准。",
        ],
      },
    ],
  },
  {
    id: "humanities",
    name: "人文学科",
    nameEn: "Humanities",
    link: "https://www.artsci.utoronto.ca/future/ready-apply/admission-categories/humanities",
    campuses: [
      {
        campus: "st-george",
        campusName: "St. George",
        ouac: "TAH",
        range: "Low to mid 80s（80–85 分左右）",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U", grade: "low to mid 80s" },
        ],
        notes: [
          ...sgGeneral,
          "无需补充申请（Supplementary Application Form Required: No）。",
          "部分专业方向可能需要额外高中课程，才能修读第一年课程或在第二年进入该专业。",
        ],
      },
    ],
  },
  {
    id: "mathematical-physical-sciences",
    name: "数学与物理科学",
    nameEn: "Mathematical & Physical Sciences",
    link: "https://www.artsci.utoronto.ca/future/ready-apply/admission-categories/mathematical-physical-sciences",
    campuses: [
      {
        campus: "st-george",
        campusName: "St. George",
        range: "Mid to high 80s",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U", grade: "mid to high 80s" },
          { subject: "Calculus & Vectors", requirement: "MCV4U", grade: "mid to high 80s" },
        ],
        notes: [...sgGeneral],
      },
    ],
  },
  {
    id: "rotman-commerce",
    name: "罗特曼商学院",
    nameEn: "Rotman Commerce",
    link: "https://www.artsci.utoronto.ca/future/ready-apply/admission-categories/rotman-commerce",
    campuses: [
      {
        campus: "st-george",
        campusName: "St. George",
        range: "Mid to high 80s",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U", grade: "high 80s" },
          { subject: "Calculus & Vectors", requirement: "MCV4U", grade: "high 80s" },
        ],
        notes: [
          ...sgGeneral,
          "需要补充申请（Supplemental Application）；可在 JOIN U of T 选择第二录取大类（不影响第一志愿，第一志愿申请者处理完后视名额评估）。",
        ],
      },
    ],
  },
  {
    id: "social-sciences",
    name: "社会科学",
    nameEn: "Social Sciences",
    link: "https://www.artsci.utoronto.ca/future/ready-apply/admission-categories/social-sciences",
    campuses: [
      {
        campus: "st-george",
        campusName: "St. George",
        range: "Mid to high 80s",
        requirements: [
          { subject: "English", requirement: "ENG4U / EAE4U", grade: "mid to high 80s" },
        ],
        notes: [...sgGeneral],
      },
    ],
  },
];