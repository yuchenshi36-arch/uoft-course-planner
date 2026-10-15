import { createClient } from "@libsql/client";

const isCloud = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);

let remoteClient: ReturnType<typeof createClient> | null = null;
let initPromise: Promise<void> | null = null;

function getRemote() {
  if (!remoteClient) {
    remoteClient = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return remoteClient;
}

async function migrateCloud() {
  const { SCHEMA_SQL } = await import("./db-local");
  const statements = SCHEMA_SQL.split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const client = getRemote();
  for (const stmt of statements) {
    await client.execute(stmt);
  }
  const cols = await client.execute("PRAGMA table_info(offer_cases)");
  const hasIelts = cols.rows.some((r) =>
    Array.isArray(r) ? r[1] === "ielts" : (r as { name?: string }).name === "ielts"
  );
  if (!hasIelts) {
    await client.execute("ALTER TABLE offer_cases ADD COLUMN ielts REAL");
  }
  const hasCurriculum = cols.rows.some((r) =>
    Array.isArray(r) ? r[1] === "curriculum" : (r as { name?: string }).name === "curriculum"
  );
  if (!hasCurriculum) {
    await client.execute("ALTER TABLE offer_cases ADD COLUMN curriculum TEXT NOT NULL DEFAULT 'OSSD'");
  }
}

function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = isCloud ? migrateCloud() : Promise.resolve();
  }
  return initPromise;
}

function rowsToObjects(res: { columns?: string[]; rows: unknown[] }): Record<string, unknown>[] {
  return res.rows.map((row) => {
    if (Array.isArray(row)) {
      const obj: Record<string, unknown> = {};
      const cols = res.columns ?? [];
      row.forEach((v, i) => {
        obj[cols[i] ?? `col${i}`] = v;
      });
      return obj;
    }
    return row as Record<string, unknown>;
  });
}

export async function dbAll(
  sql: string,
  ...args: unknown[]
): Promise<Record<string, unknown>[]> {
  await ensureInit();
  if (isCloud) {
    const res = await getRemote().execute({ sql, args: args as any });
    return rowsToObjects(res as unknown as { columns?: string[]; rows: unknown[] });
  }
  const local = await import("./db-local");
  return local.getDb().prepare(sql).all(...(args as any)) as unknown as Record<string, unknown>[];
}

export async function dbGet(
  sql: string,
  ...args: unknown[]
): Promise<Record<string, unknown> | undefined> {
  const rows = await dbAll(sql, ...args);
  return rows[0];
}

export async function dbRun(
  sql: string,
  ...args: unknown[]
): Promise<{ changes: number; lastInsertRowid: number }> {
  await ensureInit();
  if (isCloud) {
    const res = await getRemote().execute({ sql, args: args as any });
    return {
      changes: Number(res.rowsAffected),
      lastInsertRowid: Number(res.lastInsertRowid ?? 0),
    };
  }
  const local = await import("./db-local");
  const info = local.getDb().prepare(sql).run(...(args as any));
  return {
    changes: Number(info.changes),
    lastInsertRowid: Number(info.lastInsertRowid),
  };
}