import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

export const SCHEMA_SQL = `
    CREATE TABLE IF NOT EXISTS universities (
      id   INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS campuses (
      id            INTEGER PRIMARY KEY,
      university_id INTEGER NOT NULL REFERENCES universities(id),
      name          TEXT NOT NULL,
      slug          TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS programs (
      id          TEXT PRIMARY KEY,
      campus_id   INTEGER NOT NULL REFERENCES campuses(id),
      code        TEXT NOT NULL,
      name        TEXT NOT NULL,
      name_en     TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS courses (
      code        TEXT PRIMARY KEY,
      campus_id   INTEGER NOT NULL REFERENCES campuses(id),
      name        TEXT NOT NULL,
      description TEXT,
      credits     REAL NOT NULL DEFAULT 0.5,
      department  TEXT
    );

    CREATE TABLE IF NOT EXISTS program_courses (
      program_id      TEXT NOT NULL REFERENCES programs(id),
      year            INTEGER NOT NULL,
      course_code     TEXT NOT NULL REFERENCES courses(code),
      requirement_type TEXT NOT NULL DEFAULT 'core',
      note            TEXT,
      stream          TEXT NOT NULL DEFAULT 'specialist',
      alternatives    TEXT,
      credits         REAL,
      PRIMARY KEY (program_id, year, course_code, stream)
    );
    CREATE INDEX IF NOT EXISTS idx_program_courses_year
      ON program_courses (program_id, year);

    CREATE TABLE IF NOT EXISTS program_year_notes (
      program_id TEXT NOT NULL REFERENCES programs(id),
      year       INTEGER NOT NULL,
      note       TEXT NOT NULL,
      PRIMARY KEY (program_id, year)
    );

    CREATE TABLE IF NOT EXISTS instructors (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      rmp_id           TEXT UNIQUE,
      name             TEXT NOT NULL,
      department       TEXT,
      avg_rating       REAL,
      avg_difficulty   REAL,
      num_ratings      INTEGER DEFAULT 0,
      would_take_again REAL,
      tags             TEXT,
      source           TEXT NOT NULL DEFAULT 'sample',
      updated_at       TEXT
    );

    CREATE TABLE IF NOT EXISTS course_instructors (
      course_code   TEXT NOT NULL REFERENCES courses(code),
      instructor_id INTEGER NOT NULL REFERENCES instructors(id),
      role          TEXT DEFAULT 'instructor',
      PRIMARY KEY (course_code, instructor_id)
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      path       TEXT NOT NULL,
      visited_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      rating     INTEGER NOT NULL,
      message    TEXT,
      path       TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS offer_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campus TEXT NOT NULL,
      program TEXT NOT NULL,
      program_detail TEXT,
      curriculum TEXT NOT NULL DEFAULT 'OSSD',
      average REAL NOT NULL,
      english_grade REAL,
      ielts REAL,
      has_competition INTEGER NOT NULL DEFAULT 0,
      competition_detail TEXT,
      offer_status TEXT NOT NULL,
      coop INTEGER NOT NULL DEFAULT 0,
      year INTEGER NOT NULL,
      notes TEXT,
      sample INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT
    );
`;

export function migrateLocal(database: DatabaseSync) {
  const pcColumns = database
    .prepare("PRAGMA table_info(program_courses)")
    .all() as { name: string }[];
  if (pcColumns.length > 0 && !pcColumns.some((c) => c.name === "stream")) {
    database.exec("DROP TABLE program_courses;");
  }
  if (pcColumns.length > 0 && !pcColumns.some((c) => c.name === "alternatives")) {
    database.exec("ALTER TABLE program_courses ADD COLUMN alternatives TEXT;");
  }
  if (pcColumns.length > 0 && !pcColumns.some((c) => c.name === "credits")) {
    database.exec("ALTER TABLE program_courses ADD COLUMN credits REAL;");
  }
  database.exec(SCHEMA_SQL);
  const ocCols = database
    .prepare("PRAGMA table_info(offer_cases)")
    .all() as { name: string }[];
  if (!ocCols.some((c) => c.name === "ielts")) {
    database.exec("ALTER TABLE offer_cases ADD COLUMN ielts REAL;");
  }

  if (!ocCols.some((c) => c.name === "curriculum")) {
    database.exec("ALTER TABLE offer_cases ADD COLUMN curriculum TEXT NOT NULL DEFAULT 'OSSD';");
  }

  const seeded = database
    .prepare("SELECT value FROM meta WHERE key = ?")
    .get("offer_samples_seeded");
  if (!seeded) {
    const sampleOffers: Array<
      [string, string, string, number, number, string, string, number, number, string]
    > = [
      ["st-george", "计算机科学", "Computer Science", 94, 90, "Waterloo 数学竞赛", "admitted", 0, 2026, ""],
      ["st-george", "计算机科学", "Computer Science", 96, 92, "编程竞赛 + Waterloo", "admitted", 0, 2026, ""],
      ["st-george", "计算机科学", "Computer Science", 91, 88, "", "waitlisted", 0, 2026, ""],
      ["utm", "计算机科学", "Computer Science", 88, 85, "校内编程社团", "admitted", 0, 2026, ""],
      ["utsc", "计算机科学", "Computer Science", 95, 91, "Waterloo CCC", "admitted", 1, 2026, ""],
      ["st-george", "生命科学", "", 87, 86, "", "admitted", 0, 2026, ""],
      ["st-george", "人文学科", "", 84, 83, "模联", "admitted", 0, 2025, ""],
      ["st-george", "罗特曼商学院", "", 92, 90, "商业案例赛", "admitted", 0, 2026, ""],
      ["st-george", "数学与物理科学", "", 89, 87, "", "admitted", 0, 2025, ""],
      ["utsc", "社会科学", "", 83, 84, "", "waitlisted", 0, 2026, ""],
    ];
    const ins = database.prepare(
      "INSERT INTO offer_cases (campus, program, program_detail, average, english_grade, has_competition, competition_detail, offer_status, coop, year, notes, sample, status) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, 1, 'approved')"
    );
    for (const s of sampleOffers) {
      ins.run(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9]);
    }
    database.prepare("INSERT INTO meta (key, value) VALUES (?, ?)").run("offer_samples_seeded", "1");
  }
}

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const dbPath = process.env.DB_PATH ?? path.join(DATA_DIR, "uoft.db");
    db = new DatabaseSync(dbPath);
    db.exec("PRAGMA journal_mode = WAL;");
    db.exec("PRAGMA foreign_keys = ON;");
    migrateLocal(db);
  }
  return db;
}

export function getMeta(key: string): string | null {
  const row = getDb()
    .prepare("SELECT value FROM meta WHERE key = ?")
    .get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setMeta(key: string, value: string) {
  getDb()
    .prepare(
      "INSERT INTO meta (key, value) VALUES (?, ?) " +
        "ON CONFLICT(key) DO UPDATE SET value = excluded.value"
    )
    .run(key, value);
}