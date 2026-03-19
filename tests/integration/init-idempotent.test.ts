import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { makeTempWorkspace, pathExists } from "../helpers.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.resolve(here, "../../src/cli/bin.js");

function run(args: string[], cwd: string) {
  return spawnSync(process.execPath, [binPath, ...args], {
    cwd,
    encoding: "utf8"
  });
}

test("init is idempotent", async () => {
  const workspace = await makeTempWorkspace("mb-init-");

  const first = run(["init", "--workspace", workspace, "--json"], workspace);
  assert.equal(first.status, 0, first.stderr);

  const second = run(["init", "--workspace", workspace, "--json"], workspace);
  assert.equal(second.status, 0, second.stderr);

  assert.equal(await pathExists(path.join(workspace, ".memory-bridge", "config.json")), true);
  assert.equal(await pathExists(path.join(workspace, ".memory-bridge", "project-context.md")), true);
  assert.equal(await pathExists(path.join(workspace, ".memory-bridge", "decisions.jsonl")), true);
  assert.equal(await pathExists(path.join(workspace, ".memory-bridge", "handoff.md")), true);
});
