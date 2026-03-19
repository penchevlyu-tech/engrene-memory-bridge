import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { makeTempWorkspace } from "../helpers.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.resolve(here, "../../src/cli/bin.js");

function runAsync(args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [binPath, ...args], {
      cwd,
      stdio: "ignore"
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`child exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

test("concurrent log writes do not corrupt jsonl", async () => {
  const workspace = await makeTempWorkspace("mb-concurrent-");

  await runAsync(["init", "--workspace", workspace], workspace);

  const count = 20;
  await Promise.all(
    Array.from({ length: count }, (_, idx) => {
      return runAsync(
        [
          "log",
          "--workspace",
          workspace,
          "--tool",
          idx % 2 === 0 ? "codex" : "claude",
          "--intent",
          `intent-${idx}`,
          "--summary",
          `summary-${idx}`,
          "--actions",
          `action-${idx}`
        ],
        workspace
      );
    })
  );

  const day = new Date().toISOString().slice(0, 10);
  const sessionFile = path.join(workspace, ".memory-bridge", "sessions", `${day}.jsonl`);
  const raw = await fs.readFile(sessionFile, "utf8");
  const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== "");

  assert.equal(lines.length, count);
  for (const line of lines) {
    const parsed = JSON.parse(line) as { tool: string; summary: string };
    assert.match(parsed.tool, /codex|claude/);
    assert.match(parsed.summary, /summary-/);
  }
});
