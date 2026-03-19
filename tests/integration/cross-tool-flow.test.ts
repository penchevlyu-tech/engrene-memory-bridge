import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { makeTempWorkspace } from "../helpers.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.resolve(here, "../../src/cli/bin.js");
const codexWrapper = path.resolve(here, "../../src/wrappers/mb-codex.js");
const claudeWrapper = path.resolve(here, "../../src/wrappers/mb-claude.js");

function run(scriptPath: string, args: string[], cwd: string) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: "utf8"
  });
}

test("mb-codex -> mb-claude -> resume keeps context", async () => {
  const workspace = await makeTempWorkspace("mb-flow-");

  const init = run(binPath, ["init", "--workspace", workspace], workspace);
  assert.equal(init.status, 0, init.stderr);

  const codexPost = run(
    codexWrapper,
    [
      "post",
      "--workspace",
      workspace,
      "--intent",
      "Implement memory bridge core",
      "--summary",
      "Core commands created",
      "--actions",
      "TODO: add integration tests",
      "--artifacts",
      "tools/memory-bridge/src/cli/bin.ts",
      "--tags",
      "m1"
    ],
    workspace
  );
  assert.equal(codexPost.status, 0, codexPost.stderr);

  const claudePost = run(
    claudeWrapper,
    [
      "post",
      "--workspace",
      workspace,
      "--intent",
      "Harden security",
      "--summary",
      "Added redaction checks",
      "--actions",
      "pending: validate doctor output",
      "--artifacts",
      "tools/memory-bridge/src/core/doctor.ts",
      "--tags",
      "m2"
    ],
    workspace
  );
  assert.equal(claudePost.status, 0, claudePost.stderr);

  const resume = run(
    binPath,
    ["resume", "--for", "codex", "--workspace", workspace, "--json"],
    workspace
  );
  assert.equal(resume.status, 0, resume.stderr);

  const parsed = JSON.parse(resume.stdout) as {
    snapshot: {
      objective: string;
      pending: string[];
    };
  };

  assert.equal(parsed.snapshot.objective, "Harden security");
  assert.equal(parsed.snapshot.pending.some((item) => /todo|pending/i.test(item)), true);

  const sessionsDir = path.join(workspace, ".memory-bridge", "sessions");
  const files = await fs.readdir(sessionsDir);
  const raw = await fs.readFile(path.join(sessionsDir, files[0]!), "utf8");
  assert.equal(raw.includes('"tool":"codex"'), true);
  assert.equal(raw.includes('"tool":"claude"'), true);
});
