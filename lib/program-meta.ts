import type { ProgramOption } from "@/lib/types";
import type { ProgramStream } from "@/lib/types";
import { UTM_PROGRAM_OPTIONS, UTM_STREAMS } from "@/lib/program-meta-utm";
import { UTSC_PROGRAM_OPTIONS, UTSC_STREAMS } from "@/lib/program-meta-utsc";
import {
  GEN_UTM_PROGRAM_OPTIONS,
  GEN_UTM_STREAMS,
} from "@/lib/program-meta-utm-generated";
import {
  GEN_UTSC_PROGRAM_OPTIONS,
  GEN_UTSC_STREAMS,
} from "@/lib/program-meta-utsc-generated";

const PROGRAM_OPTIONS_BASE: ProgramOption[] = [
  // ---- 主修专业 ----
  {
    id: "csc",
    code: "CSC",
    name: "计算机科学",
    nameEn: "Computer Science",
    blurb: "编程、算法、软件系统，热门专业，入学后需满足专业录取要求",
  },
  {
    id: "lif",
    code: "LIF",
    name: "生命科学",
    nameEn: "Life Sciences",
    blurb: "生物、化学、物理等方向，进入后可按兴趣细分专业",
  },
  {
    id: "rot",
    code: "RC",
    name: "罗德曼商学院",
    nameEn: "Rotman Commerce",
    blurb: "商科方向，会计、金融、市场营销、管理",
  },

  // ---- 计算机科学 · 细分方向 ----
  {
    id: "csc-ai",
    code: "AI",
    name: "人工智能与机器学习",
    nameEn: "AI & Machine Learning",
    blurb: "机器学习、深度学习、计算机视觉与自然语言处理",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-sys",
    code: "SYS",
    name: "系统方向",
    nameEn: "Systems",
    blurb: "操作系统、网络、数据库系统与编译器",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-theory",
    code: "THE",
    name: "理论方向",
    nameEn: "Theory",
    blurb: "高级算法、计算复杂性与数理逻辑",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-web",
    code: "WEB",
    name: "Web 与互联网技术",
    nameEn: "Web and Internet Technologies",
    blurb: "大规模 Web 与互联网应用：系统、算法与机器学习",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-data",
    code: "DSC",
    name: "数据科学",
    nameEn: "Data Science",
    blurb: "统计推断、机器学习与数据分析，偏数理与建模",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-general",
    code: "CSCG",
    name: "计算机科学（通用）",
    nameEn: "Computer Science (General)",
    blurb: "尚未选定 Focus 时选这里：Computer Science Specialist / Major / Minor 完整计划",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-game",
    code: "GAME",
    name: "游戏设计",
    nameEn: "Game Design",
    blurb: "计算机图形学、动画与游戏引擎，结合 AI 与人机交互",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-hci",
    code: "HCI",
    name: "人机交互",
    nameEn: "Human-Computer Interaction",
    blurb: "交互式媒体设计、可用性工程与用户体验研究",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-nlp",
    code: "NLP",
    name: "计算语言学与自然语言处理",
    nameEn: "Computational Linguistics & NLP",
    blurb: "语言建模、文本处理与智能搜索，语言学 + 编程",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-vision",
    code: "CV",
    name: "计算机视觉",
    nameEn: "Computer Vision",
    blurb: "图像理解、三维视觉与机器学习结合的感知系统",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },
  {
    id: "csc-sci",
    code: "SCICOMP",
    name: "科学计算",
    nameEn: "Scientific Computing",
    blurb: "数值方法、微分方程与高性能计算，数学 + 编程",
    group: "计算机科学 · 细分方向",
    parent: "csc",
  },

  // ---- 生命科学 · 细分方向 ----
  {
    id: "lif-imm",
    code: "IMM",
    name: "免疫学",
    nameEn: "Immunology",
    blurb: "免疫系统与疾病机制，适合对医学研究、疫苗、肿瘤免疫感兴趣的同学",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-bch",
    code: "BCH",
    name: "生物化学",
    nameEn: "Biochemistry",
    blurb: "蛋白质、代谢与分子机制，生物与化学的交叉核心",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-mgy",
    code: "MGY",
    name: "分子遗传学与微生物学",
    nameEn: "Molecular Genetics & Microbiology",
    blurb: "基因、细菌与病毒，实验导向，常见医学/研究路径",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-hmb",
    code: "HMB",
    name: "人类生物学",
    nameEn: "Human Biology",
    blurb: "神经科学、遗传与生物技术的综合方向，跨学科选择灵活",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-psl",
    code: "PSL",
    name: "生理学",
    nameEn: "Physiology",
    blurb: "人体各系统的功能与调节，医学预科经典路径",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-nfs",
    code: "NFS",
    name: "营养科学",
    nameEn: "Nutritional Sciences",
    blurb: "营养素、膳食与健康，偏应用与临床营养",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-csb",
    code: "CSB",
    name: "细胞与分子生物学",
    nameEn: "Cell & Molecular Biology",
    blurb: "基因表达、细胞行为与组学方法，下设细胞分子网络/植物生物技术/干细胞三个方向",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-pcl",
    code: "PCL",
    name: "药理学与毒理学",
    nameEn: "Pharmacology & Toxicology",
    blurb: "药物作用机制与人体反应，医药研发方向",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-neuro",
    code: "NRO",
    name: "神经科学",
    nameEn: "Neuroscience",
    blurb: "神经系统的结构与功能，跨生物、心理与生理",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-qb",
    code: "QBIO",
    name: "定量生物学",
    nameEn: "Quantitative Biology",
    blurb: "生物 + 数学/统计/编程，适合生物信息与计算方向",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-bio",
    code: "BIO",
    name: "生物学",
    nameEn: "Biology",
    blurb: "广义生物学：动物、植物、微生物与生态的经典路径",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-ecol",
    code: "EEB",
    name: "生态与进化生物学",
    nameEn: "Ecology & Evolutionary Biology",
    blurb: "生态系统、进化机制与生物多样性，偏野外与种群研究",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-anim",
    code: "AP",
    name: "动物生理学",
    nameEn: "Animal Physiology",
    blurb: "动物生理系统、内分泌与比较生理学，实验导向",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-global",
    code: "GH",
    name: "全球健康",
    nameEn: "Global Health",
    blurb: "全球卫生议题、疾病负担与健康政策，跨学科方向",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-health",
    code: "HD",
    name: "健康与疾病",
    nameEn: "Health & Disease",
    blurb: "人类疾病机制、组织病理与临床前研究，限额录取",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-lmp",
    code: "LMP",
    name: "病理生物学",
    nameEn: "Laboratory Medicine & Pathobiology",
    blurb: "疾病分子机制、干细胞病理与心血管病理，偏医学研究",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-bcb",
    code: "BCB",
    name: "生物信息与计算生物学",
    nameEn: "Bioinformatics & Computational Biology",
    blurb: "生物大数据 + 编程：基因组、系统生物学与算法建模",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-foundation",
    code: "LIF1",
    name: "通用基础课（未定专业）",
    nameEn: "General Foundation (Undecided)",
    blurb: "大一通用基础课：生物、化学、数学与物理；大二再决定细分方向",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },

  // ---- Rotman Commerce · 细分方向 ----
  {
    id: "rot-fin",
    code: "FIN",
    name: "金融",
    nameEn: "Finance",
    blurb: "资本市场、公司金融与投资分析",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },
  {
    id: "rot-acc",
    code: "ACC",
    name: "会计",
    nameEn: "Accounting",
    blurb: "财务会计与审计方向，适合 CPA 路径",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },
  {
    id: "rot-mkt",
    code: "MKT",
    name: "市场营销",
    nameEn: "Marketing",
    blurb: "营销管理、市场研究与消费者行为",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },
  {
    id: "rot-mgt",
    code: "MGT",
    name: "战略与创新",
    nameEn: "Strategy & Innovation",
    blurb: "战略管理、创业、游戏理论与商业设计",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },
  {
    id: "rot-data",
    code: "DS",
    name: "商业数据科学",
    nameEn: "Data Science in Business",
    blurb: "编程 + 数据工具 + 商业分析，三大专业都可选",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },
  {
    id: "rot-intl",
    code: "IB",
    name: "国际商务",
    nameEn: "International Business",
    blurb: "国际贸易、国际金融与跨国经营，可配合外语学习",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },
  {
    id: "rot-lead",
    code: "LEAD",
    name: "组织领导力",
    nameEn: "Leadership in Organizations",
    blurb: "人力资源管理、谈判与组织行为，偏人与组织",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },
  {
    id: "rot-diverse",
    code: "DE",
    name: "多元经济体管理",
    nameEn: "Managing in Diverse Economies",
    blurb: "发展经济学 + 跨文化管理，U of T Global Scholar 方向",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },
  {
    id: "rot-foundation",
    code: "RC1",
    name: "Rotman Commerce 通用基础课",
    nameEn: "Rotman Commerce Foundation (BCom)",
    blurb: "三大 Specialist 共有的基础课：经济、数学与商科入门",
    group: "Rotman Commerce · 细分方向",
    parent: "rot",
  },

  // ---- 数学与物理科学 ----
  {
    id: "pms",
    code: "MPS",
    name: "数学与物理科学",
    nameEn: "Mathematics & Physical Sciences",
    blurb: "数学、物理、化学、统计、天文与地球科学等理科方向，大一以微积分为基础",
  },
  {
    id: "pms-math",
    code: "MATH",
    name: "数学",
    nameEn: "Mathematics",
    blurb: "分析、代数、几何与数论，理论数学的核心路径",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "pms-phy",
    code: "PHYS",
    name: "物理",
    nameEn: "Physics",
    blurb: "力学、电磁、量子与热物理，偏理论与实验",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "pms-che",
    code: "CHEM",
    name: "化学",
    nameEn: "Chemistry",
    blurb: "有机、无机、分析、物理化学，实验导向",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "pms-sta",
    code: "STAT",
    name: "统计",
    nameEn: "Statistics",
    blurb: "概率、统计推断、实验设计与数据科学，就业面广",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "pms-ast",
    code: "ASTRO",
    name: "天文与天体物理",
    nameEn: "Astronomy & Astrophysics",
    blurb: "恒星、星系与宇宙学，物理 + 数学 + 观测",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "pms-ess",
    code: "ERTH",
    name: "地球科学",
    nameEn: "Earth Sciences",
    blurb: "矿物、岩石、地层与海洋，偏野外与地质",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "pms-act",
    code: "ACT",
    name: "精算",
    nameEn: "Actuarial Science",
    blurb: "保险精算、金融风险管理与寿险/财险建模，属统计系，限额录取",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },

  // ---- 人文学科 ----
  {
    id: "hum",
    code: "HUM",
    name: "人文学科",
    nameEn: "Humanities",
    blurb: "哲学、历史、文学、古典学与语言等人文方向",
  },
  {
    id: "hum-phl",
    code: "PHIL",
    name: "哲学",
    nameEn: "Philosophy",
    blurb: "逻辑、伦理学、形而上学与哲学史",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-eng",
    code: "ENGL",
    name: "英语",
    nameEn: "English",
    blurb: "英国与美国文学、文学理论与创意写作",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-his",
    code: "HIST",
    name: "历史",
    nameEn: "History",
    blurb: "欧洲、北美与世界史，研究方法与专题研讨",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-cla",
    code: "CLAS",
    name: "古典学",
    nameEn: "Classics",
    blurb: "古希腊罗马史、文学、拉丁语与希腊语",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-lin",
    code: "LING",
    name: "语言学",
    nameEn: "Linguistics",
    blurb: "语音、音系、句法、语义与语言理论",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-eas",
    code: "EAS",
    name: "东亚研究",
    nameEn: "East Asian Studies",
    blurb: "中、日、韩语言文化，历史、文学与思想",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-rel",
    code: "RLG",
    name: "宗教",
    nameEn: "Religion & Religious Studies",
    blurb: "宗教系：Religion、佛教研究、伊斯兰研究，开放录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-arth",
    code: "ARTH",
    name: "艺术史",
    nameEn: "Art History",
    blurb: "视觉艺术、建筑与物质文化史（FAH），Specialist 需修语言",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-cin",
    code: "CIN",
    name: "电影研究",
    nameEn: "Cinema Studies",
    blurb: "电影类型、理论、历史与批判研究，限额录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-wgs",
    code: "WGS",
    name: "女性与性别研究",
    nameEn: "Women and Gender Studies",
    blurb: "性别、种族、阶级与权力的交叉研究，开放录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-arch",
    code: "ARCH",
    name: "考古学",
    nameEn: "Archaeology",
    blurb: "考古学（ANT/ARH）：田野发掘与物质文化分析，限额录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-dra",
    code: "DRM",
    name: "戏剧",
    nameEn: "Drama, Theatre & Performance Studies",
    blurb: "戏剧研究 + 表演/导演/设计工作室课程（部分需试镜或作品集）",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-ind",
    code: "INS",
    name: "原住民研究",
    nameEn: "Indigenous Studies",
    blurb: "原住民历史、知识体系、土地与主权议题，开放录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-mst",
    code: "MST",
    name: "中世纪研究",
    nameEn: "Medieval Studies",
    blurb: "历史、思想、文学与艺术交叉，开放录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-ren",
    code: "REN",
    name: "文艺复兴研究",
    nameEn: "Renaissance Studies",
    blurb: "文学、历史、艺术史与语言，开放录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-cel",
    code: "CLT",
    name: "凯尔特研究",
    nameEn: "Celtic Studies",
    blurb: "凯尔特语言、文学与文化；Specialist 已暂停录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },

  // ---- 社会科学 ----
  {
    id: "soc",
    code: "SOC",
    name: "社会科学",
    nameEn: "Social Sciences",
    blurb: "经济、心理、政治、社会学与人类学等方向",
  },
  {
    id: "soc-eco",
    code: "ECON",
    name: "经济学",
    nameEn: "Economics",
    blurb: "微观/宏观理论、计量经济学与政策分析",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-psy",
    code: "PSYC",
    name: "心理学",
    nameEn: "Psychology",
    blurb: "认知、发展、社会与临床心理学，统计实验导向",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-soc",
    code: "SOCI",
    name: "社会学",
    nameEn: "Sociology",
    blurb: "社会理论、研究方法与社会不平等议题",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-pol",
    code: "POLS",
    name: "政治科学",
    nameEn: "Political Science",
    blurb: "政治理论、比较政治、国际关系与加拿大政治",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-ir",
    code: "INTL",
    name: "国际关系",
    nameEn: "International Relations",
    blurb: "国际政治、全球政治经济与外交政策",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-ant",
    code: "ANTH",
    name: "人类学",
    nameEn: "Anthropology",
    blurb: "社会文化、考古、生物与医学人类学",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-cri",
    code: "CRIM",
    name: "犯罪学与社会法律研究",
    nameEn: "Criminology & Sociolegal Studies",
    blurb: "犯罪、刑法、警务与司法制度研究",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-geo",
    code: "GEOG",
    name: "地理",
    nameEn: "Geography",
    blurb: "城市、环境、经济地理与地理信息系统",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-cog",
    code: "COG",
    name: "认知科学",
    nameEn: "Cognitive Science",
    blurb: "University College 跨学科：心理、语言、哲学与计算机，限额录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-urb",
    code: "URB",
    name: "城市研究",
    nameEn: "Urban Studies",
    blurb: "城市建筑、政策、经济与社会跨学科研究，限额录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-policy",
    code: "PPG",
    name: "公共政策",
    nameEn: "Public Policy",
    blurb: "Munk 学院：经济、政治与公共治理交叉，限额录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-pcj",
    code: "PCJ",
    name: "和平、冲突与正义",
    nameEn: "Peace, Conflict and Justice",
    blurb: "冲突研究与和平建设，限额录取、竞争激烈",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },

  // ---- 音乐 ----
  {
    id: "music",
    code: "MUS",
    name: "音乐",
    nameEn: "Music",
    blurb: "多伦多大学音乐学院（Faculty of Music）：表演、作曲、音乐教育等方向",
  },
  {
    id: "mus-perf",
    code: "PERF",
    name: "音乐表演（古典）",
    nameEn: "Performance (Classical)",
    blurb: "钢琴、声乐、管弦乐等古典器乐/声乐表演",
    group: "音乐 · 细分方向",
    parent: "music",
  },
  {
    id: "mus-jazz",
    code: "JAZZ",
    name: "爵士乐表演",
    nameEn: "Performance (Jazz)",
    blurb: "爵士乐即兴、合奏与爵士历史",
    group: "音乐 · 细分方向",
    parent: "music",
  },
  {
    id: "mus-comp",
    code: "COMP",
    name: "作曲",
    nameEn: "Composition",
    blurb: "创作、配器与作曲课程，个性化一对一作曲课",
    group: "音乐 · 细分方向",
    parent: "music",
  },
  {
    id: "mus-edu",
    code: "EDU",
    name: "音乐教育",
    nameEn: "Music Education",
    blurb: "音乐教学方法、课堂实践与教育理论",
    group: "音乐 · 细分方向",
    parent: "music",
  },
  {
    id: "mus-hist",
    code: "HIST",
    name: "音乐史与文化",
    nameEn: "Music History & Culture",
    blurb: "西方音乐史、民族音乐学与音乐分析",
    group: "音乐 · 细分方向",
    parent: "music",
  },
  {
    id: "mus-tech",
    code: "TECH",
    name: "音乐技术与数字媒体",
    nameEn: "Music Technology & Digital Media",
    blurb: "电子音乐、录音技术与数字媒体创作",
    group: "音乐 · 细分方向",
    parent: "music",
  },
  {
    id: "music-foundation",
    code: "MUSF",
    name: "音乐通用基础课",
    nameEn: "Music Foundation (MusBac)",
    blurb: "音乐学院大一通用基础：音乐史、理论与技能课程",
    group: "音乐 · 细分方向",
    parent: "music",
  },

  // ---- 体育 ----
  {
    id: "kin",
    code: "KIN",
    name: "体育",
    nameEn: "Kinesiology & Physical Education",
    blurb: "Bachelor of Kinesiology（BKin）：运动科学、人体生理与体育文化",
  },

  // ---- 建筑与视觉研究 ----
  {
    id: "arc",
    code: "ARC",
    name: "建筑与视觉研究",
    nameEn: "Architecture & Visual Studies",
    blurb: "Daniels 学院：建筑研究与视觉研究两个本科专业",
  },
  {
    id: "arc-arch",
    code: "ARCH",
    name: "建筑研究",
    nameEn: "Architectural Studies",
    blurb: "设计工作室、建筑史与理论，偏设计与空间",
    group: "建筑与视觉研究 · 细分方向",
    parent: "arc",
  },
  {
    id: "arc-vis",
    code: "VIS",
    name: "视觉研究",
    nameEn: "Visual Studies",
    blurb: "当代艺术创作、策展实践与视觉文化",
    group: "建筑与视觉研究 · 细分方向",
    parent: "arc",
  },
  {
    id: "arc-foundation",
    code: "ARCF",
    name: "建筑与视觉研究通用基础课",
    nameEn: "Architecture & Visual Studies Foundation (Honours BA)",
    blurb: "Daniels 学院大一通用基础：设计与视觉概念课程",
    group: "建筑与视觉研究 · 细分方向",
    parent: "arc",
  },

  // ---- 工程 ----
  {
    id: "eng",
    code: "ENG",
    name: "工程",
    nameEn: "Engineering",
    blurb: "应用科学与工程学院：Core 8 核心专业 + 工程科学 + TrackOne",
  },
  {
    id: "eng-engsci",
    code: "ENSCI",
    name: "工程科学",
    nameEn: "Engineering Science",
    blurb: "顶尖精英项目，大二后分航空航天、生物医学、机器人等方向",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-engsci-aero",
    code: "AERO",
    name: "航空航天工程",
    nameEn: "Aerospace Engineering",
    blurb: "飞行器设计与推进、空间系统、空气动力学与控制",
    group: "工程科学 · 细分方向",
    parent: "eng-engsci",
  },
  {
    id: "eng-engsci-bme",
    code: "BME",
    name: "生物医学系统工程",
    nameEn: "Biomedical Systems Engineering",
    blurb: "生物系统建模、生物材料、医学影像与组织工程",
    group: "工程科学 · 细分方向",
    parent: "eng-engsci",
  },
  {
    id: "eng-engsci-ece",
    code: "EECE",
    name: "电气与计算机工程",
    nameEn: "Electrical & Computer Engineering",
    blurb: "电子电路、通信、计算机系统、机器学习与信号处理",
    group: "工程科学 · 细分方向",
    parent: "eng-engsci",
  },
  {
    id: "eng-engsci-energy",
    code: "ENY",
    name: "能源系统工程",
    nameEn: "Energy Systems Engineering",
    blurb: "电力系统、能源政策、燃料电池与可持续能源",
    group: "工程科学 · 细分方向",
    parent: "eng-engsci",
  },
  {
    id: "eng-engsci-mi",
    code: "MI",
    name: "机器智能",
    nameEn: "Machine Intelligence",
    blurb: "机器学习、人工智能、机器人感知与决策系统",
    group: "工程科学 · 细分方向",
    parent: "eng-engsci",
  },
  {
    id: "eng-engsci-math",
    code: "EMSF",
    name: "工程数学、统计与金融",
    nameEn: "Engineering Mathematics, Statistics & Finance",
    blurb: "概率统计、金融工程、优化建模与数据分析",
    group: "工程科学 · 细分方向",
    parent: "eng-engsci",
  },
  {
    id: "eng-engsci-phy",
    code: "EP",
    name: "工程物理",
    nameEn: "Engineering Physics",
    blurb: "量子力学、电磁场、光子学与先进物理实验",
    group: "工程科学 · 细分方向",
    parent: "eng-engsci",
  },
  {
    id: "eng-engsci-rob",
    code: "ROB",
    name: "机器人工程",
    nameEn: "Robotics Engineering",
    blurb: "机器人学、控制理论、计算机视觉与嵌入式系统",
    group: "工程科学 · 细分方向",
    parent: "eng-engsci",
  },
  {
    id: "eng-chem",
    code: "CHEM",
    name: "化学工程",
    nameEn: "Chemical Engineering",
    blurb: "传热传质、分离过程、反应工程与生物工程",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-civil",
    code: "CIV",
    name: "土木工程",
    nameEn: "Civil Engineering",
    blurb: "结构、水利、市政与建筑工程管理",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-ece",
    code: "ECE",
    name: "电气与计算机工程",
    nameEn: "Electrical & Computer Engineering",
    blurb: "电路、信号、计算机系统、机器学习与机器人",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-ind",
    code: "IND",
    name: "工业工程",
    nameEn: "Industrial Engineering",
    blurb: "运筹优化、数据分析、人因与系统工程",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-mec",
    code: "MECH",
    name: "机械工程",
    nameEn: "Mechanical Engineering",
    blurb: "机械设计、动力学、热力学与制造",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-mse",
    code: "MSE",
    name: "材料工程",
    nameEn: "Materials Engineering",
    blurb: "材料热力学、机械性能、电子与光学材料",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-min",
    code: "MIN",
    name: "矿物工程",
    nameEn: "Mineral Engineering",
    blurb: "矿业、矿物加工与可持续能源方向",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-trackone",
    code: "T1",
    name: "TrackOne（通识大一）",
    nameEn: "TrackOne (General First Year)",
    blurb: "大一通识探索，大二从 Core 8 中选择具体工程专业",
    group: "工程 · 细分方向",
    parent: "eng",
  },
  {
    id: "eng-foundation",
    code: "ENGF",
    name: "工程通用基础课",
    nameEn: "Engineering Foundation (First Year)",
    blurb: "应用科学与工程学院大一通用基础课，大二进入具体工程专业",
    group: "工程 · 细分方向",
    parent: "eng",
  },

  // ---- 环境研究（School of the Environment）----
  {
    id: "env",
    code: "ENV",
    name: "环境研究",
    nameEn: "Environmental Studies",
    blurb: "环境学院：环境科学、政策、伦理与健康交叉方向",
  },
  {
    id: "env-std",
    code: "ENVS",
    name: "环境研究",
    nameEn: "Environmental Studies Major",
    blurb: "环境科学 + 政策 + 伦理的综合路径，开放录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-health",
    code: "ENVH",
    name: "环境与健康",
    nameEn: "Environment & Health",
    blurb: "环境因素对人类健康的影响，开放录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-ethic",
    code: "ENVE",
    name: "环境伦理",
    nameEn: "Environmental Ethics",
    blurb: "哲学 + 环境政策交叉，开放录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-geo",
    code: "ENVG",
    name: "环境地理",
    nameEn: "Environmental Geography",
    blurb: "地理方法与环境系统研究，限额录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-clim",
    code: "ENVC",
    name: "气候变化研究",
    nameEn: "Climate Change Studies",
    blurb: "气候科学 + 政策 + 伦理，Minor，限额录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-energy",
    code: "ENVE2",
    name: "环境与能源",
    nameEn: "Environment and Energy",
    blurb: "能源政策与环境科学交叉，Minor，开放录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-behave",
    code: "ENVB",
    name: "环境与行为",
    nameEn: "Environment & Behaviour",
    blurb: "环境心理学方向，Minor，需已注册心理专业",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-eco",
    code: "ENVE3",
    name: "环境经济学",
    nameEn: "Environmental Economics",
    blurb: "经济学 + 环境政策，Minor，限额录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-tox",
    code: "ENVT",
    name: "环境与毒理学",
    nameEn: "Environment & Toxicology",
    blurb: "环境科学 + 药理学/毒理学，Specialist，限额录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },

  // ---- 语言类（2026 补全）----
  {
    id: "hum-fre",
    code: "FRE",
    name: "法语",
    nameEn: "French",
    blurb: "语言、语言学与文学三大路径，开放录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-ger",
    code: "GER",
    name: "德语",
    nameEn: "German Studies",
    blurb: "语言、文学与文化；Specialist 已暂停录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-ita",
    code: "ITA",
    name: "意大利语",
    nameEn: "Italian Studies",
    blurb: "文学、电影、语言学与文化研究四大方向",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-hun",
    code: "HUN",
    name: "匈牙利语",
    nameEn: "Hungarian Studies",
    blurb: "语言、电影、历史与政治；已暂停录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-yid",
    code: "YID",
    name: "意第绪语",
    nameEn: "Yiddish",
    blurb: "Al and Malka Green 意第绪语 Minor",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },

  // ---- 区域与文化研究（2026 补全）----
  {
    id: "soc-afr",
    code: "AFR",
    name: "非洲研究",
    nameEn: "African Studies",
    blurb: "非洲社会、历史、文化与语言，开放录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-ams",
    code: "AMS",
    name: "美国研究",
    nameEn: "American Studies",
    blurb: "政治经济、社会、文化、历史四大集群",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-can",
    code: "CDN",
    name: "加拿大研究",
    nameEn: "Canadian Studies",
    blurb: "加拿大社会、历史与文化，开放录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-car",
    code: "CAR",
    name: "加勒比研究",
    nameEn: "Caribbean Studies",
    blurb: "加勒比社会、历史、文学与文化",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-cas",
    code: "CAS",
    name: "当代亚洲研究",
    nameEn: "Contemporary Asian Studies",
    blurb: "亚洲社会、政治、经济与文化",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-eur",
    code: "EUR",
    name: "欧洲事务",
    nameEn: "European Affairs",
    blurb: "语言 + 欧洲政治/经济/文化，限额录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-las",
    code: "LAS",
    name: "拉丁美洲研究",
    nameEn: "Latin American Studies",
    blurb: "拉美社会、历史、政治与文化表达",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-dts",
    code: "DTS",
    name: "离散与跨国研究",
    nameEn: "Diaspora & Transnational Studies",
    blurb: "移民、流散社区与跨国连接",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-acs",
    code: "ACS",
    name: "亚洲加拿大研究",
    nameEn: "Asian Canadian Studies",
    blurb: "Minor：加拿大亚洲裔社群与流散",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "hum-jst",
    code: "JST",
    name: "犹太研究",
    nameEn: "Jewish Studies",
    blurb: "犹太历史、宗教、文化、希伯来语与意第绪语",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-nmc",
    code: "NMC",
    name: "近东与中东文明",
    nameEn: "Near and Middle Eastern Civilizations",
    blurb: "古代/中世纪/现代三流 + 语言（NML）",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },

  // ---- 交叉学科（2026 补全）----
  {
    id: "hum-bms",
    code: "BMS",
    name: "图书与媒体研究",
    nameEn: "Book and Media Studies",
    blurb: "印刷/数字媒体文化史与理论，限额录取",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "soc-cses",
    code: "CSE",
    name: "批判性公平与团结研究",
    nameEn: "Critical Studies in Equity and Solidarity",
    blurb: "性别、种族、性少数与公平议题",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "hum-cre",
    code: "CRE",
    name: "创造力与社会",
    nameEn: "Creativity and Society",
    blurb: "Minor：创造力形式 + 社会语境",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-dhu",
    code: "DHU",
    name: "数字人文",
    nameEn: "Digital Humanities",
    blurb: "Minor：数字技术应用于人文学术",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "soc-eds",
    code: "EDS",
    name: "教育与社会",
    nameEn: "Education and Society",
    blurb: "Minor：教育议题 + 社会分析，限额录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-esl",
    code: "ESL",
    name: "伦理、社会与法律",
    nameEn: "Ethics, Society, and Law",
    blurb: "伦理学 + 社会 + 法律交叉，限额录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "hum-hps",
    code: "HPS",
    name: "科学技术史与哲学",
    nameEn: "History and Philosophy of Science and Technology",
    blurb: "科学史、科学哲学与技术研究",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-lct",
    code: "LCT",
    name: "文学与批判理论",
    nameEn: "Literature and Critical Theory",
    blurb: "比较文学与文化理论两大流",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-mcs",
    code: "MCS",
    name: "物质文化与符号学",
    nameEn: "Material Culture and Semiotics",
    blurb: "Minor：物品、文本与意义生产",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-bioeth",
    code: "BIE",
    name: "生物伦理",
    nameEn: "Bioethics",
    blurb: "哲学 + 生物医学交叉",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-chc",
    code: "CHC",
    name: "基督教与文化",
    nameEn: "Christianity and Culture",
    blurb: "宗教教育、基督教与社会/艺术/科学/教育",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },
  {
    id: "hum-bpm",
    code: "BPM",
    name: "佛教、心理学与心理健康",
    nameEn: "Buddhism, Psychology and Mental Health",
    blurb: "Minor：佛教思想与心理科学交叉（已暂停录取）",
    group: "人文学科 · 细分方向",
    parent: "hum",
  },

  // ---- 环境与理科（2026 补全）----
  {
    id: "env-sci",
    code: "ENVS2",
    name: "环境科学",
    nameEn: "Environmental Science",
    blurb: "环境科学 + 政策与社会，限额录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-bio",
    code: "ENVB2",
    name: "环境生物学",
    nameEn: "Environmental Biology",
    blurb: "生态学、保护生物学与环境生物",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-geosci",
    code: "ENVG2",
    name: "环境地球科学",
    nameEn: "Environmental Geosciences",
    blurb: "地球系统与环境地质；Minor 已暂停录取",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "env-anth",
    code: "ENVA",
    name: "环境人类学",
    nameEn: "Environmental Anthropology",
    blurb: "Minor：人类学视角下的环境议题",
    group: "环境研究 · 细分方向",
    parent: "env",
  },
  {
    id: "soc-gds",
    code: "GDS",
    name: "地理数据科学",
    nameEn: "Geographic Data Science",
    blurb: "GIS、空间分析与数据方法，限额录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-gis",
    code: "GIS",
    name: "地理信息系统",
    nameEn: "Geographic Information Systems",
    blurb: "Minor：GIS 方法与空间分析",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "soc-irhr",
    code: "IRH",
    name: "劳资关系与人力资源",
    nameEn: "Industrial Relations & Human Resources",
    blurb: "雇佣关系、谈判与人力资源管理，限额录取",
    group: "社会科学 · 细分方向",
    parent: "soc",
  },
  {
    id: "pms-ees",
    code: "EES",
    name: "地球与环境系统",
    nameEn: "Earth and Environmental Systems",
    blurb: "地球科学核心 + 选修集群",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "lif-agb",
    code: "AGB",
    name: "应用遗传学与生物技术",
    nameEn: "Applied Genetics and Biotechnology",
    blurb: "遗传学基础 + 应用；Specialist 限额录取",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-biod",
    code: "BIO2",
    name: "生物多样性保护",
    nameEn: "Biodiversity and Conservation Biology",
    blurb: "生态学、演化与保护",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-genome",
    code: "GNM",
    name: "基因组生物学",
    nameEn: "Genome Biology",
    blurb: "CSB/EEB/MGY 联合：基因组学与分子生物学",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "lif-biotox",
    code: "BTX",
    name: "生物医学毒理学",
    nameEn: "Biomedical Toxicology",
    blurb: "药理学与毒理学，限额录取",
    group: "生命科学 · 细分方向",
    parent: "lif",
  },
  {
    id: "pms-geophys",
    code: "GPH",
    name: "地球物理",
    nameEn: "Geophysics",
    blurb: "物理、数学与地球科学交叉",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "pms-mat",
    code: "MSE",
    name: "材料科学",
    nameEn: "Materials Science",
    blurb: "化学与材料科学交叉，限额录取",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },
  {
    id: "pms-econmath",
    code: "ECM",
    name: "经济学与数学",
    nameEn: "Economics & Mathematics",
    blurb: "经济 + 数学双核心，限额录取",
    group: "数学与物理科学 · 细分方向",
    parent: "pms",
  },

  // ---- 音乐（文理学院）与林业（2026 补全）----
  {
    id: "mus-arts",
    code: "MUS2",
    name: "音乐（文理学院）",
    nameEn: "Music (Arts & Science)",
    blurb: "音乐史/理论/作曲/音乐科技；需面试或试镜",
    group: "音乐 · 细分方向",
    parent: "music",
  },
  {
    id: "for",
    code: "FOR",
    name: "林业",
    nameEn: "Forestry",
    blurb: "森林保护、森林保护科学、森林生物材料；由 Daniels 建筑、景观与设计学院管理（原林学院），本科经文理学院招生",
  },
  {
    id: "for-bio",
    code: "FORB",
    name: "森林生物材料科学",
    nameEn: "Forest Biomaterials Science",
    blurb: "生物材料与生物炼制（已暂停录取）",
    group: "林业 · 细分方向",
    parent: "for",
  },
  {
    id: "for-con",
    code: "FORC",
    name: "森林保护",
    nameEn: "Forest Conservation",
    blurb: "生态、政策与社会，开放录取",
    group: "林业 · 细分方向",
    parent: "for",
  },
  {
    id: "for-sci",
    code: "FORS",
    name: "森林保护科学",
    nameEn: "Forest Conservation Science",
    blurb: "科学导向的森林与保护研究",
    group: "林业 · 细分方向",
    parent: "for",
  },

  // ---- 第二入口专业（置于最底部）----
  {
    id: "second",
    code: "2ND",
    name: "第二入口专业",
    nameEn: "Second-Entry Programs",
    blurb: "需要先完成大学课程再申请的本科专业：护理（BScN）、药学（PharmD）、医学放射科学（MRSc）、教育（BEd）",
  },
  {
    id: "second-nursing",
    code: "NUR",
    name: "护理",
    nameEn: "Nursing (BScN)",
    blurb: "Bloomberg 护理学院 BScN：第二入口、2 年制加速项目，含临床实习",
    group: "第二入口专业 · 细分方向",
    parent: "second",
  },
  {
    id: "second-pharm",
    code: "PHM",
    name: "药学",
    nameEn: "Pharmacy (PharmD)",
    blurb: "Leslie Dan 药学院 PharmD：第二入口、4 年制药学博士",
    group: "第二入口专业 · 细分方向",
    parent: "second",
  },
  {
    id: "second-mrs",
    code: "MRS",
    name: "医学放射科学",
    nameEn: "Medical Radiation Sciences (MRSc)",
    blurb: "Temerty 医学院放射肿瘤系 × Michener 学院联合培养：放射治疗、核医学与分子影像、医学影像技术三个方向",
    group: "第二入口专业 · 细分方向",
    parent: "second",
  },
  {
    id: "second-bed",
    code: "BED",
    name: "教育",
    nameEn: "Education (BEd)",
    blurb: "OISE 教育学学士（BEd）：第二入口、2 年制教师培养，分 P/J、J/I、I/S 三个年级段",
    group: "第二入口专业 · 细分方向",
    parent: "second",
  },
];

// 学位/专业类型标注（以 UofT 官方日历的 Specialist / Major / Minor / Focus 为准）
export const PROGRAM_DEGREE: Record<string, string> = {
  // 三大主修
  "csc": "Specialist · Major · Minor",
  "lif": "Major / Specialist 按方向而定",
  "rot": "BCom（三大 Specialist）",
  // 数学与物理科学
  "pms": "Major / Specialist 按方向而定",
  "pms-math": "Specialist ×8 + Major + Minor（开放录取）",
  "pms-phy": "Physics Specialist + Chemical Physics + Biological Physics ×4 + Physics & Philosophy + Major · Minor",
  "pms-che": "Chemistry Specialist + Biological / Chemical Physics / Pharmaceutical / Synthetic & Catalytic + Environmental Major · Minor",
  "pms-sta": "Specialist ×2 + Data Science Specialist + Major + Minor ×2 + Focus ×2",
  "pms-ast": "Major · Minor（另有 Astronomy & Physics 联合 Specialist）",
  "pms-ess": "Geology Specialist · Geoscience Major · Geoscience Minor（开放录取）",
  "pms-act": "Specialist · Major（限额录取）",
  // 人文学科
  "hum": "多数为 Major，部分有 Specialist",
  "hum-phl": "Specialist · Major · Minor ×2（含 Bioethics）",
  "hum-eng": "English Specialist · Major · Minor ×2（含 Creative Writing）",
  "hum-his": "Specialist · Major · Minor",
  "hum-cla": "Major · Minor ×3（Classical Civilization / Greek / Latin）",
  "hum-lin": "Specialist · Major · Minor",
  "hum-eas": "Specialist · Major · Minor",
  "hum-rel": "Religion Specialist · Major · Minor + Buddhist ×2 + Islamic Major",
  "hum-arth": "Specialist · Major · Minor",
  "hum-cin": "Specialist · Major · Minor",
  "hum-wgs": "Specialist · Major · Minor",
  "hum-arch": "Specialist · Major · Minor（限额录取）",
  "hum-dra": "Specialist · Major · Minor（开放录取）",
  "hum-ind": "Specialist · Major · Minor（开放录取）",
  "hum-mst": "Specialist · Major · Minor（开放录取）",
  "hum-ren": "Specialist · Major · Minor（开放录取）",
  "hum-cel": "Major · Minor（开放录取；Specialist 已暂停录取）",
  "hum-fre": "Major ×5 · Minor ×2（开放录取）",
  "hum-ger": "Specialist · Major · Minor ×3（开放录取；Specialist 已暂停录取）",
  "hum-ita": "Specialist · Major · Minor ×2（开放录取）",
  "hum-hun": "Major · Minor（均已暂停录取）",
  "hum-yid": "Minor（开放录取）",
  // 社会科学
  "soc": "Major / Specialist 按方向而定",
  "soc-eco": "Specialist ×2（含 Financial Economics）+ Major + Minor",
  "soc-cog": "Major ×5（Arts ×3 / Science ×2，限额录取）",
  "soc-psy": "Specialist ×2（含 Research Thesis）+ Major + Minor",
  "soc-urb": "Specialist · Major · Minor（限额录取）",
  "soc-soc": "Specialist · Major · Minor",
  "soc-pol": "Specialist · Major · Minor",
  "soc-ir": "Specialist · Major",
  "soc-ant": "Specialist（SCL）· Major · Minor ×2（含 Medical Anthropology）",
  "soc-cri": "Specialist · Major",
  "soc-geo": "Specialist（Human / Physical & Environmental）· Major · Minor ×2",
  "soc-policy": "Major（限额录取）",
  "soc-pcj": "Major · Specialist（限额录取、竞争激烈）",
  "soc-afr": "Specialist · Major · Minor（开放录取）",
  "soc-ams": "Major · Minor（开放录取）",
  "soc-can": "Specialist · Major · Minor（开放录取）",
  "soc-car": "Specialist · Major · Minor（开放录取）",
  "soc-cas": "Major · Minor（开放录取）",
  "soc-eur": "Major · Minor（限额录取）",
  "soc-las": "Major · Minor（开放录取）",
  "soc-dts": "Major · Minor（开放录取）",
  "soc-acs": "Minor（开放录取）",
  "hum-jst": "Specialist · Major · Minor（开放录取）",
  "hum-nmc": "Specialist ×4 · Major ×4 · Minor（开放录取）",
  "hum-bms": "Major · Minor（限额录取）",
  "soc-cses": "Major · Minor（开放录取）",
  "hum-cre": "Minor（开放录取）",
  "hum-dhu": "Minor（开放录取）",
  "soc-eds": "Minor（限额录取）",
  "soc-esl": "Major（限额录取）",
  "hum-hps": "Major · Minor（开放录取）",
  "hum-lct": "Specialist ×2 · Major ×2 · Minor（开放录取）",
  "hum-mcs": "Minor（开放录取）",
  "hum-bioeth": "Specialist · Major · Minor（开放录取）",
  "hum-chc": "Major ×2 · Minor ×2（开放录取）",
  "hum-bpm": "Minor（已暂停录取）",
  // 计算机科学细分（Focus 属于 Specialist/Major 内的方向）
  "csc-ai": "Focus（隶属 Specialist/Major）",
  "csc-sys": "Focus（隶属 Specialist/Major）",
  "csc-theory": "Focus（隶属 Specialist/Major）",
  "csc-web": "Focus（隶属 Specialist/Major）",
  "csc-data": "Data Science Specialist · Applied Data Science Minor · Focus ×2",
  "csc-game": "Focus（隶属 Specialist/Major）",
  "csc-hci": "Focus（隶属 Specialist/Major）",
  "csc-nlp": "Focus（隶属 Specialist/Major）",
  "csc-vision": "Focus（隶属 Specialist/Major）",
  "csc-sci": "Focus（隶属 Specialist/Major）",
  "csc-general": "Specialist · Major · Minor",
  // 生命科学细分
  "lif-imm": "Specialist · Major · Minor",
  "lif-bch": "Specialist · Major",
  "lif-mgy": "Specialist（Genetics / Microbiology 双流）· Major",
  "lif-hmb": "Major（另有应用遗传/健康与疾病等 Specialist）",
  "lif-psl": "Specialist · Major · Minor",
  "lif-nfs": "Major",
  "lif-csb": "Specialist · Major（Cell & Molecular Biology）",
  "lif-pcl": "Specialist · Major（另有 Biomedical Toxicology Specialist）",
  "lif-neuro": "Specialist · Major",
  "lif-qb": "Major（限额录取）",
  "lif-bio": "Specialist · Major · Minor",
  "lif-ecol": "Specialist · Major · Minor",
  "lif-anim": "Major",
  "lif-global": "Specialist · Major",
  "lif-health": "Specialist · Major",
  "lif-lmp": "Pathobiology Specialist",
  "lif-bcb": "Specialist",
  "lif-foundation": "通用基础课（未定专业）",
  // Rotman
  "rot-fin": "Finance & Economics Specialist (BCom)",
  "rot-acc": "Accounting Specialist (BCom)",
  "rot-mkt": "Focus in Marketing（属 Management Specialist）",
  "rot-mgt": "Management Specialist (BCom)",
  "rot-data": "Focus in Data Science in Business",
  "rot-intl": "Focus in International Business",
  "rot-lead": "Focus in Leadership in Organizations",
  "rot-diverse": "Focus in Managing in Diverse Economies",
  "rot-foundation": "BCom 通用基础课",
  // 音乐
  "music": "Bachelor of Music (MusBac)",
  "mus-perf": "Performance – Classical (MusBac)",
  "mus-jazz": "Performance – Jazz (MusBac)",
  "mus-comp": "Composition (MusBac)",
  "mus-edu": "Music Education (MusBac)",
  "mus-hist": "Music History & Culture (MusBac)",
  "mus-tech": "Music Technology & Digital Media (MusBac)",
  "music-foundation": "MusBac 通用基础课",
  // 体育
  "kin": "Bachelor of Kinesiology (BKin)",
  // 建筑与视觉研究
  "arc": "Honours BA",
  "arc-arch": "Honours BA",
  "arc-vis": "Honours BA（曾为 Specialist/Major 体系）",
  "arc-foundation": "Honours BA 通用基础课",
  // 工程
  "eng": "BASc（专业学位）",
  "eng-engsci": "BASc（专业学位）",
  "eng-engsci-aero": "BASc · Major in Aerospace Engineering",
  "eng-engsci-bme": "BASc · Major in Biomedical Systems Engineering",
  "eng-engsci-ece": "BASc · Major in Electrical & Computer Engineering",
  "eng-engsci-energy": "BASc · Major in Energy Systems Engineering",
  "eng-engsci-mi": "BASc · Major in Machine Intelligence",
  "eng-engsci-math": "BASc · Major in Engineering Mathematics, Statistics & Finance",
  "eng-engsci-phy": "BASc · Major in Engineering Physics",
  "eng-engsci-rob": "BASc · Major in Robotics Engineering",
  "eng-chem": "BASc（专业学位）",
  "eng-civil": "BASc（专业学位）",
  "eng-ece": "BASc（专业学位）",
  "eng-ind": "BASc（专业学位）",
  "eng-mec": "BASc（专业学位）",
  "eng-mse": "BASc（专业学位）",
  "eng-min": "BASc（专业学位）",
  "eng-trackone": "BASc（通识大一）",
  "eng-foundation": "大一通用基础课",
  // 环境研究
  "env": "Major / Specialist / Minor 按方向而定",
  "env-std": "Major · Minor（开放录取）",
  "env-health": "Specialist · Major（开放录取）",
  "env-ethic": "Major · Minor（开放录取）",
  "env-geo": "Specialist · Major · Minor（限额录取）",
  "env-clim": "Minor（限额录取）",
  "env-energy": "Minor（开放录取）",
  "env-behave": "Minor（限额录取，需已注册心理专业）",
  "env-eco": "Minor（限额录取）",
  "env-tox": "Specialist（限额录取）",
  "env-sci": "Major · Minor（限额录取）",
  "env-bio": "Major · Minor（开放录取）",
  "env-geosci": "Specialist · Minor（Minor 已暂停录取）",
  "env-anth": "Minor（开放录取）",
  "soc-gds": "Major ×3（Human/Urban/Physical-Environmental，限额录取）",
  "soc-gis": "Minor（开放录取）",
  "soc-irhr": "Major · Specialist（限额录取）",
  "pms-ees": "Major（开放录取）",
  "lif-agb": "Specialist · Major（限额录取）",
  "lif-biod": "Major（开放录取）",
  "lif-genome": "Major（开放录取）",
  "lif-biotox": "Specialist · Major（限额录取）",
  "pms-geophys": "Specialist（开放录取）",
  "pms-mat": "Specialist（限额录取）",
  "pms-econmath": "Specialist（限额录取）",
  "mus-arts": "Specialist ×2 · Major ×4 · Minor（限额录取）",
  "for": "Major / Specialist / Minor 按方向而定",
  "for-bio": "Major · Minor（已暂停录取）",
  "for-con": "Specialist · Major · Minor（开放录取）",
  "for-sci": "Specialist · Major · Minor（开放录取）",
  // 第二入口专业
  "second": "第二入口（非大一入学）",
  "second-nursing": "BScN · 第二入口",
  "second-pharm": "PharmD · 第二入口",
  "second-mrs": "MRSc · 第二入口 · 三方向",
  "second-bed": "BEd · 第二入口 · 2 年",
  // UTM（密西沙加校区）
  "utm-bus": "BBA / BCom / HBA",
  "utm-mgmt": "Specialist (BBA) · Major (HBA)",
  "utm-acctfin": "Specialist (BBA)",
  "utm-csc": "Specialist · Major · Minor",
  "utm-lif": "按细分方向而定",
  "utm-bio": "Specialist · Major · Minor",
  "utm-neuro": "Specialist",
  "utm-math": "Specialist / Minor 按方向而定",
  "utm-stats": "Specialist · Major · Minor",
  "utm-mathspec": "Specialist · Minor",
  "utm-psy": "Specialist · Major · Minor",
  "utm-econ": "Specialist · Major · Minor（另设 BCom）",
  "utm-soc": "Specialist / Major / Minor 按方向而定",
  "utm-socio": "Specialist · Major · Minor",
  "utm-crim": "Specialist · Major · Minor",
  "utm-hum": "Specialist / Major / Minor 按方向而定",
  "utm-eng": "Specialist · Major · Minor",
  "utm-his": "Specialist · Major · Minor",
  "utm-ccit": "Major 为主",
  "utm-ccit-major": "Major",
  "utm-sci": "Specialist / Major / Minor 按方向而定",
  "utm-chem": "Specialist · Major · Minor",
  "utm-for": "Specialist / Major / Minor 按方向而定",
  "utm-forsci": "Major · Minor",
  // UTSC（士嘉堡校区）
  "utsc-bus": "BBA Specialist",
  "utsc-mgmt": "Specialist (BBA) · Co-op",
  "utsc-econmgmt": "Specialist (BBA) · Major · Minor",
  "utsc-csc": "Specialist ×5 · Major · Minor",
  "utsc-lif": "按细分方向而定",
  "utsc-hbio": "Specialist · Major",
  "utsc-mbid": "Major · Co-op",
  "utsc-mbb": "Specialist · Co-op",
  "utsc-neuro": "Specialist ×3 · Major",
  "utsc-math": "Specialist / Major / Minor 按方向而定",
  "utsc-stats": "Specialist ×3 · Major · Minor",
  "utsc-mathspec": "Specialist ×3 · Major",
  "utsc-psy": "Specialist · Major · Minor",
  "utsc-health": "Major / Minor 按方向而定",
  "utsc-hpol": "Major · Co-op",
  "utsc-pop": "Major · Co-op",
  "utsc-mental": "Specialist · Major · Minor",
  "utsc-soc": "Specialist / Major / Minor 按方向而定",
  "utsc-socio": "Specialist · Major · Minor",
  "utsc-pol": "Specialist · Major · Minor",
  "utsc-public-law": "Major · Minor",
  "utsc-philosophy": "Specialist · Major · Minor（含 Co-op）",
  "utsc-music": "Major · Minor",
  "utsc-studio-art": "Specialist · Major · Minor",
  "utsc-theatre-and-performance": "Major · Minor",
  "utsc-linguistics": "Specialist · Major · Minor（含 Co-op）",
  "utsc-french": "Specialist · Major · Minor（含 Co-op）",
  "utsc-art-history-and-visual-culture": "Major · Minor",
  "utsc-creative-writing": "Major · Minor（限额录取）",
  "utsc-hum": "Specialist / Major / Minor 按方向而定",
  "utsc-eng": "Major · Minor",
  "utsc-hist": "Specialist · Major · Minor",
  "utsc-env": "Major / Minor 按方向而定",
  "utsc-envsc": "Major · Co-op",
};

const ST_GEORGE_OPTIONS: ProgramOption[] = PROGRAM_OPTIONS_BASE.map((p) => ({
  ...p,
  campus: "st-george",
  degree: p.degree ?? PROGRAM_DEGREE[p.id],
}));

// 生成数据中若包含已手写的专业 id（如给 utsc-csc 补方向流），只合并流，不重复建选项
const UTM_EXISTING_IDS = new Set(UTM_PROGRAM_OPTIONS.map((p) => p.id));
const UTSC_EXISTING_IDS = new Set(UTSC_PROGRAM_OPTIONS.map((p) => p.id));

// 全部校区专业（含校区字段）
export const PROGRAM_OPTIONS: ProgramOption[] = [
  ...ST_GEORGE_OPTIONS,
  ...UTM_PROGRAM_OPTIONS.map((p) => ({
    ...p,
    campus: "utm",
    degree: p.degree ?? PROGRAM_DEGREE[p.id],
  })),
  ...UTSC_PROGRAM_OPTIONS.map((p) => ({
    ...p,
    campus: "utsc",
    degree: p.degree ?? PROGRAM_DEGREE[p.id],
  })),
  ...GEN_UTM_PROGRAM_OPTIONS.filter((p) => !UTM_EXISTING_IDS.has(p.id)).map((p) => ({
    ...p,
    campus: "utm",
    degree: p.degree,
  })),
  ...GEN_UTSC_PROGRAM_OPTIONS.filter((p) => !UTSC_EXISTING_IDS.has(p.id)).map((p) => ({
    ...p,
    campus: "utsc",
    degree: p.degree,
  })),
];

// 校区元信息
export const CAMPUS_META: {
  slug: string;
  id: number;
  name: string;
  nameZh: string;
  blurb: string;
}[] = [
  {
    slug: "st-george",
    id: 1,
    name: "St. George",
    nameZh: "圣乔治校区",
    blurb: "主校区：文理学院、工程、Rotman 商学院、音乐、林业、第二入口专业等",
  },
  {
    slug: "utm",
    id: 2,
    name: "UTM",
    nameZh: "密西沙加校区",
    blurb: "Mississauga：商科、计算机、生命科学、法证科学、CCIT 传媒等",
  },
  {
    slug: "utsc",
    id: 3,
    name: "UTSC",
    nameZh: "士嘉堡校区",
    blurb: "Scarborough：BBA 商科、计算机、统计、生命科学、健康研究等",
  },
];

/**
 * 「大一通用基础课 / TrackOne（通识大一）」这类"还没定方向"的模板，
 * 不作为可选的细分方向 / 可选专业展示。
 */
export function isFoundationProgram(id: string): boolean {
  return id.endsWith("-foundation") || id === "eng-trackone";
}

export function normalizeCampus(raw: string | undefined): string {
  return CAMPUS_META.some((c) => c.slug === raw) ? (raw as string) : "st-george";
}

export function programsOfCampus(campus: string): ProgramOption[] {
  return PROGRAM_OPTIONS.filter((p) => (p.campus ?? "st-george") === campus);
}

// 学位流配置：key 为数据库 stream 值，label 为官方专业名称（以 UofT 官方日历为准，一比一对应）
const named = (spec: string, major: string, minor?: string): ProgramStream[] => {
  const out: ProgramStream[] = [
    { key: "specialist", label: spec, type: "specialist" },
    { key: "major", label: major, type: "major" },
  ];
  if (minor) out.push({ key: "minor", label: minor, type: "minor" });
  return out;
};

const specOnly = (label: string): ProgramStream[] => [
  { key: "specialist", label, type: "specialist" },
];

const majorOnly = (label: string): ProgramStream[] => [
  { key: "major", label, type: "major" },
];

const minorOnly = (label: string): ProgramStream[] => [
  { key: "minor", label, type: "minor" },
];

const focus = (name: string): ProgramStream[] => [
  { key: "specialist", label: `${name} (Specialist)`, type: "focus" },
  { key: "major", label: `${name} (Major)`, type: "focus" },
];

function buildStreams(id: string): ProgramStream[] {
  switch (id) {
    // ── 计算机科学 ─────────────────────────────────────────────
    case "csc":
      return specOnly("计算机科学 · 未定方向");
    case "csc-ai":
      return focus("Focus in Artificial Intelligence");
    case "csc-sys":
      return focus("Focus in Computer Systems");
    case "csc-theory":
      return focus("Focus in Theory of Computation");
    case "csc-web":
      return majorOnly("Focus in Web and Internet Technologies");
    case "csc-game":
      return focus("Focus in Game Design");
    case "csc-hci":
      return focus("Focus in Human-Computer Interaction");
    case "csc-nlp":
      return focus(
        "Focus in Computational Linguistics and Natural Language Processing"
      );
    case "csc-vision":
      return focus("Focus in Computer Vision");
    case "csc-sci":
      return focus("Focus in Scientific Computing");
    case "csc-data":
      return [
        { key: "ds-spec", label: "Data Science Specialist", type: "specialist" },
        { key: "ds-minor", label: "Applied Data Science Minor", type: "minor" },
      ];
    case "csc-general":
      return named(
        "Computer Science Specialist",
        "Computer Science Major",
        "Computer Science Minor"
      );

    // ── 生命科学 ───────────────────────────────────────────────
    case "lif":
      return specOnly("生命科学 · 未定方向");
    case "lif-foundation":
      return specOnly("通用基础课（未定专业）");
    case "lif-imm":
      return named("Immunology Specialist", "Immunology Major", "Immunology Minor");
    case "lif-bch":
      return named("Biochemistry Specialist", "Biochemistry Major");
    case "lif-mgy":
      return [
        {
          key: "specialist",
          label: "MGY Specialist: Genetics Stream",
          type: "specialist",
        },
        {
          key: "spec-micro",
          label: "MGY Specialist: Microbiology Stream",
          type: "specialist",
        },
        {
          key: "major",
          label: "Molecular Genetics and Microbiology Major",
          type: "major",
        },
      ];
    case "lif-hmb":
      return majorOnly("Human Biology Major");
    case "lif-psl":
      return named("Physiology Specialist", "Physiology Major", "Physiology Minor");
    case "lif-nfs":
      return majorOnly("Nutritional Sciences Major");
    case "lif-csb":
      return named(
        "Cell & Molecular Biology Specialist",
        "Cell & Molecular Biology Major"
      );
    case "lif-pcl":
      return named(
        "Specialist in Pharmacology and Biomedical Toxicology",
        "Pharmacology Major"
      );
    case "lif-neuro":
      return named("Neuroscience Specialist", "Neuroscience Major");
    case "lif-qb":
      return majorOnly("Quantitative Biology Major");
    case "lif-bio":
      return named("Biology Specialist", "Biology Major", "Biology Minor");
    case "lif-ecol":
      return named(
        "Ecology and Evolutionary Biology Specialist",
        "Ecology and Evolutionary Biology Major",
        "Ecology and Evolutionary Biology Minor"
      );
    case "lif-anim":
      return majorOnly("Animal Physiology Major");
    case "lif-global":
      return named("Global Health Specialist", "Global Health Major");
    case "lif-health":
      return named("Health & Disease Specialist", "Health & Disease Major");
    case "lif-lmp":
      return specOnly("Pathobiology Specialist");
    case "lif-bcb":
      return specOnly("Bioinformatics and Computational Biology Specialist");

    // ── Rotman Commerce ────────────────────────────────────────
    case "rot":
      return specOnly("Rotman Commerce · 未定方向");
    case "rot-foundation":
      return specOnly("Rotman Commerce 通用基础课（BCom）");
    case "rot-acc":
      return specOnly("Accounting Specialist (BCom)");
    case "rot-fin":
      return specOnly("Finance & Economics Specialist (BCom)");
    case "rot-mgt":
      return specOnly("Management Specialist (BCom)");
    case "rot-mkt":
      return [{ key: "specialist", label: "Focus in Marketing（属 Management Specialist）", type: "focus" }];
    case "rot-data":
      return [{ key: "specialist", label: "Focus in Data Science in Business", type: "focus" }];
    case "rot-intl":
      return [{ key: "specialist", label: "Focus in International Business", type: "focus" }];
    case "rot-lead":
      return [{ key: "specialist", label: "Focus in Leadership in Organizations", type: "focus" }];
    case "rot-diverse":
      return [{ key: "specialist", label: "Focus in Managing in Diverse Economies", type: "focus" }];

    // ── 数学与物理科学 ─────────────────────────────────────────
    case "pms":
      return specOnly("数学与物理科学 · 未定方向");
    case "pms-math":
      return [
        { key: "specialist", label: "Mathematics Specialist", type: "specialist" },
        { key: "spec-applied", label: "Applied Mathematics Specialist", type: "specialist" },
        {
          key: "spec-math-phy",
          label: "Mathematics and Physics Specialist",
          type: "specialist",
        },
        {
          key: "spec-math-phl",
          label: "Mathematics and Philosophy Specialist",
          type: "specialist",
        },
        {
          key: "spec-econfin",
          label: "Mathematical Applications in Economics and Finance Specialist",
          type: "specialist",
        },
        {
          key: "spec-teaching",
          label: "Mathematics & Its Applications Specialist (Teaching)",
          type: "specialist",
        },
        {
          key: "spec-physci",
          label: "Mathematics & Its Applications Specialist (Physical Science)",
          type: "specialist",
        },
        {
          key: "spec-probstats",
          label: "Mathematics & Its Applications Specialist (Probability/Statistics)",
          type: "specialist",
        },
        { key: "major", label: "Mathematics Major", type: "major" },
        { key: "minor", label: "Mathematics Minor", type: "minor" },
      ];
    case "pms-phy":
      return [
        { key: "specialist", label: "Physics Specialist", type: "specialist" },
        { key: "spec-chemphys", label: "Chemical Physics Specialist", type: "specialist" },
        {
          key: "spec-bio-adv",
          label: "Biological Physics Specialist: Advanced Physics Stream",
          type: "specialist",
        },
        {
          key: "spec-bio-bch",
          label: "Biological Physics Specialist: Biochemistry Stream",
          type: "specialist",
        },
        {
          key: "spec-bio-imm",
          label: "Biological Physics Specialist: Immunology Stream",
          type: "specialist",
        },
        {
          key: "spec-bio-psl",
          label: "Biological Physics Specialist: Physiology Stream",
          type: "specialist",
        },
        {
          key: "spec-phy-phl",
          label: "Physics and Philosophy Specialist",
          type: "specialist",
        },
        { key: "major", label: "Physics Major", type: "major" },
        { key: "minor", label: "Physics Minor", type: "minor" },
      ];
    case "pms-che":
      return [
        { key: "specialist", label: "Chemistry Specialist", type: "specialist" },
        {
          key: "spec-biochem",
          label: "Biological Chemistry Specialist",
          type: "specialist",
        },
        { key: "spec-chemphys", label: "Chemical Physics Specialist", type: "specialist" },
        {
          key: "spec-pharma",
          label: "Pharmaceutical Chemistry Specialist",
          type: "specialist",
        },
        {
          key: "spec-synth",
          label: "Synthetic & Catalytic Chemistry Specialist",
          type: "specialist",
        },
        {
          key: "env-major",
          label: "Environmental Chemistry Major",
          type: "major",
        },
        {
          key: "env-minor",
          label: "Environmental Chemistry Minor",
          type: "minor",
        },
        { key: "major", label: "Chemistry Major", type: "major" },
        { key: "minor", label: "Chemistry Minor", type: "minor" },
      ];
    case "pms-sta":
      return [
        {
          key: "spec-methods",
          label: "Specialist in Statistical Science: Methods and Practice",
          type: "specialist",
        },
        {
          key: "spec-theory",
          label: "Specialist in Statistical Science: Theory and Methods",
          type: "specialist",
        },
        { key: "ds-spec", label: "Data Science Specialist", type: "specialist" },
        { key: "major", label: "Statistics Major", type: "major" },
        { key: "minor", label: "Statistics Minor", type: "minor" },
        { key: "ds-minor", label: "Applied Data Science Minor", type: "minor" },
      ];
    case "pms-ast":
      return [
        {
          key: "major",
          label: "Astronomy & Astrophysics Major",
          type: "major",
        },
        {
          key: "minor",
          label: "Astronomy & Astrophysics Minor",
          type: "minor",
        },
      ];
    case "pms-ess":
      return named(
        "Geology Specialist",
        "Geoscience Major",
        "Geoscience Minor"
      );
    case "pms-act":
      return named(
        "Actuarial Science Specialist",
        "Actuarial Science Major"
      );

    // ── 人文学科 ───────────────────────────────────────────────
    case "hum":
      return specOnly("人文学科 · 未定方向");
    case "hum-phl":
      return [
        ...named("Philosophy Specialist", "Philosophy Major", "Philosophy Minor"),
        { key: "phl-bioethics", label: "Bioethics Minor", type: "minor" },
      ];
    case "hum-eng":
      return [
        ...named(
          "English Specialist",
          "English Major - Stream in Literature and Language",
          "English Minor"
        ),
        { key: "eng-creative", label: "Minor in Creative Writing", type: "minor" },
      ];
    case "hum-his":
      return named("History Specialist", "History Major", "History Minor");
    case "hum-cla":
      return [
        {
          key: "major",
          label: "Classics (Greek and Latin) Major",
          type: "major",
        },
        {
          key: "minor",
          label: "Classical Civilization Minor",
          type: "minor",
        },
        { key: "cla-greek", label: "Greek Minor", type: "minor" },
        { key: "cla-latin", label: "Latin Minor", type: "minor" },
      ];
    case "hum-lin":
      return named("Linguistics Specialist", "Linguistics Major", "Linguistics Minor");
    case "hum-eas":
      return named(
        "East Asian Studies Specialist",
        "East Asian Studies Major",
        "East Asian Studies Minor"
      );

    // ── 社会科学 ───────────────────────────────────────────────
    case "soc":
      return specOnly("社会科学 · 未定方向");
    case "soc-eco":
      return [
        ...named("Economics Specialist", "Economics Major", "Economics Minor"),
        { key: "spec-finecon", label: "Financial Economics Specialist", type: "specialist" },
      ];
    case "soc-psy":
      return [
        ...named("Psychology Specialist", "Psychology Major", "Psychology Minor"),
        { key: "spec-research", label: "Psychology Research Specialist - Thesis", type: "specialist" },
      ];
    case "soc-soc":
      return named("Sociology Specialist", "Sociology Major", "Sociology Minor");
    case "soc-pol":
      return named(
        "Political Science Specialist",
        "Political Science Major",
        "Political Science Minor"
      );
    case "soc-ir":
      return named(
        "International Relations Specialist",
        "International Relations Major"
      );
    case "soc-ant":
      return [
        {
          key: "specialist",
          label: "Anthropology Specialist (Society, Culture, and Language)",
          type: "specialist",
        },
        {
          key: "major-scl",
          label: "Anthropology Major (Society, Culture, and Language)",
          type: "major",
        },
        {
          key: "major",
          label: "Anthropology Major (General)",
          type: "major",
        },
        {
          key: "minor",
          label: "Anthropology Minor (General)",
          type: "minor",
        },
        { key: "ant-medical", label: "Medical Anthropology Minor", type: "minor" },
      ];
    case "soc-cri":
      return named(
        "Criminology and Sociolegal Studies - Specialist",
        "Criminology and Sociolegal Studies - Major"
      );
    case "soc-geo":
      return [
        ...named(
          "Human Geography Specialist",
          "Human Geography Major",
          "Human Geography Minor"
        ),
        {
          key: "geo-physenv",
          label: "Physical and Environmental Geography Minor",
          type: "minor",
        },
      ];
    case "soc-cog":
      return [
        { key: "arts-perc", label: "Cognitive Science Major - Arts (Perception and Attention Stream)", type: "major" },
        { key: "arts-lang", label: "Cognitive Science Major - Arts (Language and Cognition Stream)", type: "major" },
        { key: "arts-think", label: "Cognitive Science Major - Arts (Thinking and Reasoning Stream)", type: "major" },
        { key: "sci-comp", label: "Cognitive Science Major - Science (Computational Cognition Stream)", type: "major" },
        { key: "sci-brain", label: "Cognitive Science Major - Science (Cognition and the Brain Stream)", type: "major" },
      ];
    case "soc-urb":
      return named("Urban Studies Specialist", "Urban Studies Major", "Urban Studies Minor");
    case "soc-policy":
      return majorOnly("Public Policy Major");
    case "soc-pcj":
      return named(
        "Peace, Conflict and Justice Specialist",
        "Peace, Conflict and Justice Major"
      );

    // ── 人文学科 · 新增方向（宗教 / 艺术史 / 电影 / 女性研究）────────
    case "hum-rel":
      return [
        { key: "specialist", label: "Religion Specialist", type: "specialist" },
        { key: "major", label: "Religion Major", type: "major" },
        { key: "minor", label: "Religion Minor", type: "minor" },
        { key: "budd-spec", label: "Buddhist Studies Specialist", type: "specialist" },
        { key: "budd-major", label: "Buddhist Studies Major", type: "major" },
        { key: "islam-major", label: "Islamic Studies Major", type: "major" },
      ];
    case "hum-arth":
      return named(
        "Art History Specialist",
        "Art History Major",
        "Art History Minor"
      );
    case "hum-cin":
      return named(
        "Cinema Studies Specialist",
        "Cinema Studies Major",
        "Cinema Studies Minor"
      );
    case "hum-wgs":
      return [
        { key: "specialist", label: "Women and Gender Studies Specialist Program", type: "specialist" },
        { key: "major", label: "Women and Gender Studies Major Program", type: "major" },
        { key: "minor", label: "Women and Gender Studies Minor Program", type: "minor" },
      ];
    case "hum-arch":
      return named("Archaeology Specialist", "Archaeology Major", "Archaeology Minor");
    case "hum-dra":
      return named("Drama Specialist", "Drama Major", "Drama Minor");
    case "hum-ind":
      return named(
        "Indigenous Studies Specialist",
        "Indigenous Studies Major",
        "Indigenous Studies Minor"
      );
    case "hum-mst":
      return named(
        "Medieval Studies Specialist",
        "Medieval Studies Major",
        "Medieval Studies Minor"
      );
    case "hum-ren":
      return named(
        "Renaissance Studies Specialist",
        "Renaissance Studies Major",
        "Renaissance Studies Minor"
      );
    case "hum-cel":
      return [
        { key: "specialist", label: "Celtic Studies Specialist（已暂停录取）", type: "specialist" },
        { key: "major", label: "Celtic Studies Major", type: "major" },
        { key: "minor", label: "Celtic Studies Minor", type: "minor" },
      ];

    // ── 音乐（Faculty of Music，MusBac）────────────────────────
    case "music":
      return specOnly("音乐 · 未定方向");
    case "music-foundation":
      return specOnly("音乐通用基础课（MusBac）");
    case "mus-perf":
      return specOnly("Performance – Classical (MusBac)");
    case "mus-jazz":
      return specOnly("Performance – Jazz (MusBac)");
    case "mus-comp":
      return specOnly("Composition (MusBac)");
    case "mus-edu":
      return specOnly("Music Education (MusBac)");
    case "mus-hist":
      return specOnly("Music History & Culture (MusBac)");
    case "mus-tech":
      return specOnly("Music Technology & Digital Media (MusBac)");

    // ── 体育（BKin）────────────────────────────────────────────
    case "kin":
      return specOnly("Kinesiology (BKin)");

    // ── 建筑与视觉研究（Honours BA）────────────────────────────
    case "arc":
      return specOnly("建筑与视觉研究 · 未定方向");
    case "arc-foundation":
      return specOnly("建筑与视觉研究通用基础课（Honours BA）");
    case "arc-arch":
      return specOnly("Architectural Studies (Honours BA)");
    case "arc-vis":
      return specOnly("Visual Studies (Honours BA)");

    // ── 工程（BASc）────────────────────────────────────────────
    case "eng":
      return specOnly("工程 · 未定方向");
    case "eng-foundation":
      return specOnly("工程通用基础课（大一）");
    case "eng-engsci":
      return specOnly("Engineering Science (BASc)");
    case "eng-engsci-aero":
      return majorOnly("Major in Aerospace Engineering (BASc)");
    case "eng-engsci-bme":
      return majorOnly("Major in Biomedical Systems Engineering (BASc)");
    case "eng-engsci-ece":
      return majorOnly("Major in Electrical & Computer Engineering (BASc)");
    case "eng-engsci-energy":
      return majorOnly("Major in Energy Systems Engineering (BASc)");
    case "eng-engsci-mi":
      return majorOnly("Major in Machine Intelligence (BASc)");
    case "eng-engsci-math":
      return majorOnly("Major in Engineering Mathematics, Statistics & Finance (BASc)");
    case "eng-engsci-phy":
      return majorOnly("Major in Engineering Physics (BASc)");
    case "eng-engsci-rob":
      return majorOnly("Major in Robotics Engineering (BASc)");
    case "eng-chem":
      return specOnly("Chemical Engineering (BASc)");
    case "eng-civil":
      return specOnly("Civil Engineering (BASc)");
    case "eng-ece":
      return specOnly("Electrical & Computer Engineering (BASc)");
    case "eng-ind":
      return specOnly("Industrial Engineering (BASc)");
    case "eng-mec":
      return specOnly("Mechanical Engineering (BASc)");
    case "eng-min":
      return specOnly("Mineral Engineering (BASc)");
    case "eng-mse":
      return specOnly("Materials Engineering (BASc)");
    case "eng-trackone":
      return specOnly("TrackOne (General First Year)");

    // ── 环境研究（School of the Environment）────────────────────
    case "env":
      return specOnly("环境研究 · 未定方向");
    case "env-std":
      return named(
        "Environmental Studies Major",
        "Environmental Studies Minor"
      );
    case "env-health":
      return named(
        "Environment & Health Specialist",
        "Environment & Health Major"
      );
    case "env-ethic":
      return [
        { key: "major", label: "Environmental Ethics Major", type: "major" },
        { key: "minor", label: "Environmental Ethics Minor", type: "minor" },
      ];
    case "env-geo":
      return named(
        "Environmental Geography Specialist",
        "Environmental Geography Major",
        "Environmental Geography Minor"
      );
    case "env-clim":
      return minorOnly("Climate Change Studies Minor");
    case "env-energy":
      return minorOnly("Environment and Energy Minor");
    case "env-behave":
      return minorOnly("Environment & Behaviour Minor");
    case "env-eco":
      return minorOnly("Environmental Economics Minor");
    case "env-tox":
      return specOnly("Environment & Toxicology Specialist");
    case "env-sci":
      return named("Environmental Science Major", "Environmental Science Minor");
    case "env-bio":
      return named("Environmental Biology Major", "Environmental Biology Minor");
    case "env-geosci":
      return named("Environmental Geosciences Specialist", "Environmental Geosciences Minor（已暂停录取）");
    case "env-anth":
      return minorOnly("Environmental Anthropology Minor");
    case "soc-gds":
      return [
        { key: "human", label: "Geographic Data Science Major - Human Systems Stream", type: "major" },
        { key: "urban", label: "Geographic Data Science Major - Urban Systems Stream", type: "major" },
        { key: "physenv", label: "Geographic Data Science Major - Physical and Environmental Systems Stream", type: "major" },
      ];
    case "soc-gis":
      return minorOnly("Geographic Information Systems Minor");
    case "soc-irhr":
      return named("Industrial Relations & Human Resources Specialist", "Industrial Relations & Human Resources Major");
    case "pms-ees":
      return majorOnly("Earth and Environmental Systems Major");
    case "lif-agb":
      return named("Applied Genetics and Biotechnology Specialist", "Applied Genetics and Biotechnology Major");
    case "lif-biod":
      return majorOnly("Biodiversity and Conservation Biology Major");
    case "lif-genome":
      return majorOnly("Genome Biology Major");
    case "lif-biotox":
      return named("Biomedical Toxicology Specialist", "Biomedical Toxicology Major");
    case "pms-geophys":
      return specOnly("Geophysics Specialist");
    case "pms-mat":
      return specOnly("Materials Science Specialist");
    case "pms-econmath":
      return specOnly("Economics & Mathematics Specialist");

    // ── 语言类（2026）────────────────────────────────────────
    case "hum-fre":
      return [
        { key: "major-learn", label: "French Language Learning Major", type: "major" },
        { key: "major-ling", label: "French Language and French Linguistics Major", type: "major" },
        { key: "specialist-ling", label: "French Language and French Linguistics Specialist", type: "specialist" },
        { key: "major-lit", label: "French Language and Literature Major", type: "major" },
        { key: "specialist-lit", label: "French Language and Literature Specialist", type: "specialist" },
        { key: "minor", label: "French Studies Minor", type: "minor" },
        { key: "minor-lang", label: "Minor in French Language", type: "minor" },
      ];
    case "hum-ger":
      return [
        { key: "specialist", label: "German Studies Specialist（已暂停录取）", type: "specialist" },
        { key: "major", label: "German Studies Major", type: "major" },
        { key: "minor", label: "German Studies Minor", type: "minor" },
        { key: "minor-eng", label: "German Studies in English Minor", type: "minor" },
        { key: "minor-bus", label: "Business German Minor", type: "minor" },
      ];
    case "hum-ita":
      return [
        { key: "specialist", label: "Italian Studies Specialist", type: "specialist" },
        { key: "major", label: "Italian Studies Major", type: "major" },
        { key: "minor", label: "Italian Studies Minor", type: "minor" },
        { key: "minor-lang", label: "Italian Language Minor", type: "minor" },
      ];
    case "hum-hun":
      return named("Hungarian Studies Major（已暂停录取）", "Hungarian Studies Minor（已暂停录取）");
    case "hum-yid":
      return minorOnly("Al and Malka Green Yiddish Program Minor");

    // ── 区域与文化研究（2026）────────────────────────────────
    case "soc-afr":
      return named("African Studies Specialist", "African Studies Major", "African Studies Minor");
    case "soc-ams":
      return named("American Studies Major", "American Studies Minor");
    case "soc-can":
      return named("Canadian Studies Specialist", "Canadian Studies Major", "Canadian Studies Minor");
    case "soc-car":
      return named("Caribbean Studies Specialist", "Caribbean Studies Major", "Caribbean Studies Minor");
    case "soc-cas":
      return named("Contemporary Asian Studies Major", "Contemporary Asian Studies Minor");
    case "soc-eur":
      return named("European Affairs Major", "European Affairs Minor");
    case "soc-las":
      return named("Latin American Studies Major", "Latin American Studies Minor");
    case "soc-dts":
      return named("Diaspora & Transnational Studies Major", "Diaspora & Transnational Studies Minor");
    case "soc-acs":
      return minorOnly("Asian Canadian Studies Minor");
    case "hum-jst":
      return named("Jewish Studies Specialist", "Jewish Studies Major", "Jewish Studies Minor");
    case "hum-nmc":
      return [
        { key: "specialist-general", label: "NMC Specialist (General)", type: "specialist" },
        { key: "specialist-ancient", label: "NMC Specialist (Ancient)", type: "specialist" },
        { key: "specialist-medieval", label: "NMC Specialist (Medieval)", type: "specialist" },
        { key: "specialist-modern", label: "NMC Specialist (Modern)", type: "specialist" },
        { key: "major-general", label: "NMC Major (General)", type: "major" },
        { key: "major-ancient", label: "NMC Major (Ancient)", type: "major" },
        { key: "major-medieval", label: "NMC Major (Medieval)", type: "major" },
        { key: "major-modern", label: "NMC Major (Modern)", type: "major" },
        { key: "minor", label: "Near and Middle Eastern Civilizations Minor", type: "minor" },
      ];

    // ── 交叉学科（2026）──────────────────────────────────────
    case "hum-bms":
      return named("Book and Media Studies Major", "Book and Media Studies Minor");
    case "soc-cses":
      return named("Critical Studies in Equity and Solidarity Major", "Critical Studies in Equity and Solidarity Minor");
    case "hum-cre":
      return minorOnly("Creativity and Society Minor");
    case "hum-dhu":
      return minorOnly("Digital Humanities Minor");
    case "soc-eds":
      return minorOnly("Education and Society Minor");
    case "soc-esl":
      return majorOnly("Ethics, Society, and Law Major");
    case "hum-hps":
      return named("History and Philosophy of Science and Technology Major", "History and Philosophy of Science and Technology Minor");
    case "hum-lct":
      return [
        { key: "specialist-cmp", label: "Literature and Critical Theory Specialist (Comparative Literature Stream)", type: "specialist" },
        { key: "specialist-cul", label: "Literature and Critical Theory Specialist (Cultural Theory Stream)", type: "specialist" },
        { key: "major-cmp", label: "Literature and Critical Theory Major (Comparative Literature Stream)", type: "major" },
        { key: "major-cul", label: "Literature and Critical Theory Major (Cultural Theory Stream)", type: "major" },
        { key: "minor", label: "Literature and Critical Theory Minor", type: "minor" },
      ];
    case "hum-mcs":
      return minorOnly("Material Culture and Semiotics Minor");
    case "hum-bioeth":
      return named("Bioethics Specialist", "Bioethics Major", "Bioethics Minor");
    case "hum-chc":
      return [
        { key: "major", label: "Christianity and Culture Major", type: "major" },
        { key: "minor", label: "Christianity and Culture Minor", type: "minor" },
        { key: "minor-edu", label: "Christianity and Education Minor", type: "minor" },
        { key: "major-reledu", label: "Major Program in Religious Education（已暂停录取）", type: "major" },
      ];
    case "hum-bpm":
      return minorOnly("Buddhism, Psychology and Mental Health Minor（已暂停录取）");

    // ── 音乐（文理学院）与林业（2026）────────────────────────
    case "mus-arts":
      return [
        { key: "specialist", label: "Music Specialist（已暂停录取）", type: "specialist" },
        { key: "specialist-ens", label: "Music Specialist with Ensemble Option（已暂停录取）", type: "specialist" },
        { key: "major-research", label: "Music Major - Research Stream", type: "major" },
        { key: "major-creative", label: "Music Major - Creative Practice Stream", type: "major" },
        { key: "ens-research", label: "Music Major with Ensemble Option - Research Stream", type: "major" },
        { key: "ens-creative", label: "Music Major with Ensemble Option - Creative Practice Stream", type: "major" },
        { key: "minor", label: "Music History & Culture Minor", type: "minor" },
      ];
    case "for":
      return specOnly("林业 · 未定方向");
    case "for-bio":
      return named("Forest Biomaterials Science Major（已暂停录取）", "Forest Biomaterials Science Minor（已暂停录取）");
    case "for-con":
      return named("Forest Conservation Specialist", "Forest Conservation Major", "Forest Conservation Minor");
    case "for-sci":
      return named("Forest Conservation Science Specialist", "Forest Conservation Science Major", "Forest Conservation Science Minor");

    // ── 第二入口专业（护理 / 药学 / 医学放射科学 / 教育）────────
    case "second":
      return specOnly("第二入口专业 · 未定方向");
    case "second-nursing":
      return [];
    case "second-pharm":
      return [];
    case "second-mrs":
      return [
        { key: "radio", label: "Radiological Technology", type: "focus" },
        { key: "therapy", label: "Radiation Therapy", type: "focus" },
        { key: "nucmed", label: "Nuclear Medicine & Molecular Imaging Technology", type: "focus" },
      ];
    case "second-bed":
      return [];

    default:
      return specOnly("Specialist");
  }
}

export const PROGRAM_STREAMS: Record<string, ProgramStream[]> = Object.fromEntries(
  PROGRAM_OPTIONS.map((p) => [p.id, buildStreams(p.id)])
);
Object.assign(PROGRAM_STREAMS, UTM_STREAMS, UTSC_STREAMS, GEN_UTM_STREAMS, GEN_UTSC_STREAMS);

// 子学位流：Data Science Specialist 下设两个 Focus（点进 Specialist 后显示）
const DS_FOCUSES: ProgramStream[] = [
  { key: "focus-qfin", label: "Focus in Quantitative Finance", type: "specialist" },
  { key: "focus-techlead", label: "Focus in Technology Leadership", type: "specialist" },
];
const IR_FOCUS_SPEC: ProgramStream[] = [
  { key: "focus-cfs-spec", label: "Focus in Canadian Foreign & Security Relations (Specialist)", type: "specialist" },
  { key: "focus-ieco-spec", label: "Focus in International Economy (Specialist)", type: "specialist" },
  { key: "focus-ilaw-spec", label: "Focus in International Law & Human Rights (Specialist)", type: "specialist" },
  { key: "focus-tran-spec", label: "Focus in Transnational Exchanges (Specialist)", type: "specialist" },
];
const IR_FOCUS_MAJ: ProgramStream[] = [
  { key: "focus-cfs-major", label: "Focus in Canadian Foreign & Security Relations (Major)", type: "major" },
  { key: "focus-ieco-major", label: "Focus in International Economy (Major)", type: "major" },
  { key: "focus-ilaw-major", label: "Focus in International Law & Human Rights (Major)", type: "major" },
  { key: "focus-tran-major", label: "Focus in Transnational Exchanges (Major)", type: "major" },
];
const POL_FOCUS_SPEC: ProgramStream[] = [
  { key: "focus-qpa-spec", label: "Focus in Quantitative Political Analysis (Specialist)", type: "specialist" },
  { key: "focus-lawpol-spec", label: "Focus in Law and Politics (Specialist)", type: "specialist" },
];
const POL_FOCUS_MAJ: ProgramStream[] = [
  { key: "focus-qpa-major", label: "Focus in Quantitative Political Analysis (Major)", type: "major" },
  { key: "focus-lawpol-major", label: "Focus in Law and Politics (Major)", type: "major" },
];
const GEO_FOCUS_SPEC: ProgramStream[] = [
  { key: "focus-plan-spec", label: "Focus in Planning (Specialist)", type: "specialist" },
  { key: "focus-urban-spec", label: "Focus in Urban Geography (Specialist)", type: "specialist" },
];
const GEO_FOCUS_MAJ: ProgramStream[] = [
  { key: "focus-plan-major", label: "Focus in Planning (Major)", type: "major" },
  { key: "focus-urban-major", label: "Focus in Urban Geography (Major)", type: "major" },
];
const CSB_FOCUS_MAJ: ProgramStream[] = [
  { key: "focus-molnet", label: "Focus in Molecular Networks of the Cell", type: "major" },
  { key: "focus-plantbio", label: "Focus in Plant Genomics and Biotechnology", type: "major" },
  { key: "focus-stemcell", label: "Focus in Stem Cells and Developmental Biology", type: "major" },
];
export const PROGRAM_STREAM_CHILDREN: Record<string, ProgramStream[]> = {
  "pms-sta:ds-spec": DS_FOCUSES,
  "csc-data:ds-spec": DS_FOCUSES,
  "soc-eco:specialist": [
    { key: "focus-dae-spec", label: "Focus in Data Analytics (Specialist)", type: "specialist" },
  ],
  "soc-eco:major": [
    { key: "focus-dae-major", label: "Focus in Data Analytics (Major)", type: "major" },
  ],
  "soc-ir:specialist": IR_FOCUS_SPEC,
  "soc-ir:major": IR_FOCUS_MAJ,
  "hum-his:specialist": [
    { key: "focus-law-spec", label: "Focus in Law and History (Specialist)", type: "specialist" },
  ],
  "hum-his:major": [
    { key: "focus-law-major", label: "Focus in Law and History (Major)", type: "major" },
  ],
  "soc-pol:specialist": POL_FOCUS_SPEC,
  "soc-pol:major": POL_FOCUS_MAJ,
  "soc-geo:specialist": GEO_FOCUS_SPEC,
  "soc-geo:major": GEO_FOCUS_MAJ,
  "soc-ant:specialist": [
    { key: "focus-med-scl-spec", label: "Focus in Medical Anthropology (Specialist: Society, Culture and Language)", type: "specialist" },
  ],
  "soc-ant:major": [
    { key: "focus-med-gen", label: "Focus in Medical Anthropology (Major: General)", type: "major" },
  ],
  "soc-ant:major-scl": [
    { key: "focus-med-scl-major", label: "Focus in Medical Anthropology (Major: Society, Culture and Language)", type: "major" },
  ],
  "lif-csb:major": CSB_FOCUS_MAJ,
};

export const PROGRAM_NAME: Record<string, string> = Object.fromEntries(
  PROGRAM_OPTIONS.map((p) => [p.id, p.name])
);

export const MAX_YEAR = 4;
