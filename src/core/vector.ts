import { createHash } from "node:crypto";
import path from "node:path";

import type { BridgeConfig, SearchHit } from "../types/events.js";
import { resolveBridgePaths } from "./paths.js";

export interface SemanticDoc {
  id: string;
  source: string;
  ts: string;
  text: string;
  ref?: string;
}

function normalizeTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function embedText(text: string, dimensions: number): number[] {
  const vec = new Array<number>(dimensions).fill(0);
  for (const token of normalizeTokens(text)) {
    const hash = createHash("sha256").update(token).digest();
    const idx = hash.readUInt16BE(0) % dimensions;
    const sign = (hash[2] ?? 0) % 2 === 0 ? 1 : -1;
    vec[idx] = (vec[idx] ?? 0) + sign;
  }
  const norm = Math.sqrt(vec.reduce((acc, n) => acc + n * n, 0)) || 1;
  return vec.map((n) => n / norm);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < len; i += 1) {
    dot += a[i]! * b[i]!;
  }
  return dot;
}

interface SqliteDbLike {
  exec: (sql: string) => void;
  prepare: (sql: string) => {
    run: (...args: any[]) => unknown;
    all: (...args: any[]) => unknown[];
  };
  close: () => void;
}

async function openDb(dbPath: string): Promise<SqliteDbLike> {
  const sqliteModule = await import("node:sqlite");
  const DatabaseSyncCtor = sqliteModule.DatabaseSync;
  const db = new DatabaseSyncCtor(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS docs (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL,
      ts TEXT NOT NULL,
      ref TEXT,
      text TEXT NOT NULL,
      vector TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_docs_ts ON docs(ts DESC);
  `);
  return db;
}

export function semanticEnabled(config: BridgeConfig): boolean {
  return Boolean(config.semanticSearch.enabled);
}

export async function upsertSemanticDoc(
  workspace: string,
  config: BridgeConfig,
  doc: SemanticDoc
): Promise<void> {
  if (!semanticEnabled(config)) {
    return;
  }
  const paths = resolveBridgePaths(path.resolve(workspace));
  const db = await openDb(paths.vectorDbFile);
  try {
    const vector = embedText(doc.text, config.semanticSearch.dimensions);
    db.prepare(
      `
      INSERT INTO docs (id, source, ts, ref, text, vector)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        source = excluded.source,
        ts = excluded.ts,
        ref = excluded.ref,
        text = excluded.text,
        vector = excluded.vector
    `
    ).run(doc.id, doc.source, doc.ts, doc.ref ?? null, doc.text, JSON.stringify(vector));
  } finally {
    db.close();
  }
}

export async function semanticSearch(
  workspace: string,
  config: BridgeConfig,
  query: string,
  limit: number
): Promise<SearchHit[]> {
  if (!semanticEnabled(config)) {
    return [];
  }
  const paths = resolveBridgePaths(path.resolve(workspace));
  const db = await openDb(paths.vectorDbFile);
  try {
    const queryVector = embedText(query, config.semanticSearch.dimensions);
    const rows = db
      .prepare("SELECT id, source, ts, ref, text, vector FROM docs ORDER BY ts DESC LIMIT 1000")
      .all() as Array<{
      id: string;
      source: string;
      ts: string;
      ref: string | null;
      text: string;
      vector: string;
    }>;

    return rows
      .map((row) => {
        const parsed = JSON.parse(row.vector) as number[];
        const score = cosineSimilarity(queryVector, parsed);
        return {
          source: "semantic" as const,
          score,
          ts: row.ts,
          ref: row.ref ?? row.id,
          snippet: row.text.slice(0, 240)
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(1, limit));
  } finally {
    db.close();
  }
}
