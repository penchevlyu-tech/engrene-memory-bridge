import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { makeTempWorkspace } from "../helpers.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.resolve(here, "../../src/cli/bin.js");
const geminiWrapper = path.resolve(here, "../../src/wrappers/mb-gemini.js");

function run(scriptPath: string, args: string[], cwd: string) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: "utf8"
  });
}

test("mb-gemini post writes events that resume can read", async () => {
  const workspace = await makeTempWorkspace("mb-gemini-");

  const init = run(binPath, ["init", "--workspace", workspace], workspace);
  assert.equal(init.status, 0, init.stderr);

  const post = run(
    geminiWrapper,
    [
      "post",
      "--workspace",
      workspace,
      "--intent",
      "Investigate flaky tests",
      "--summary",
      "Collected flaky traces",
      "--actions",
      "TODO: isolate race condition",
      "--artifacts",
      "tests/e2e/flaky.spec.ts",
      "--tags",
      "qa"
    ],
    workspace
  );
  assert.equal(post.status, 0, post.stderr);

  const resume = run(binPath, ["resume", "--for", "claude", "--workspace", workspace, "--json"], workspace);
  assert.equal(resume.status, 0, resume.stderr);

  const parsed = JSON.parse(resume.stdout) as { snapshot: { objective: string } };
  assert.equal(parsed.snapshot.objective, "Investigate flaky tests");

  const sessionsDir = path.join(workspace, ".memory-bridge", "sessions");
  const files = await fs.readdir(sessionsDir);
  const raw = await fs.readFile(path.join(sessionsDir, files[0]!), "utf8");
  assert.equal(raw.includes('"tool":"gemini"'), true);
});
