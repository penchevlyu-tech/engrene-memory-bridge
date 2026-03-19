import assert from "node:assert/strict";
import test from "node:test";

import { initWorkspace, loadConfig } from "../../src/core/config.js";
import { buildContextSnapshot } from "../../src/core/context.js";
import { appendSessionEvent } from "../../src/core/store.js";
import { makeTempWorkspace } from "../helpers.js";

test("context snapshot falls back gracefully when history is missing", async () => {
  const workspace = await makeTempWorkspace("mb-context-");
  await initWorkspace({
    workspace,
    enableEncryption: false,
    enableSemanticSearch: false,
    disableRedaction: false
  });

  const { config } = await loadConfig(workspace);
  const result = await buildContextSnapshot(workspace, config);

  assert.match(result.snapshot.objective, /No explicit objective|Describe the current milestone/i);
  assert.ok(result.snapshot.warnings.length >= 1);
});

test("latest session intent overrides fallback objective", async () => {
  const workspace = await makeTempWorkspace("mb-context2-");
  await initWorkspace({
    workspace,
    enableEncryption: false,
    enableSemanticSearch: false,
    disableRedaction: false
  });

  const { config } = await loadConfig(workspace);
  await appendSessionEvent(workspace, config, {
    ts: new Date().toISOString(),
    tool: "codex",
    workspace,
    branch: "main",
    intent: "Ship memory bridge core",
    actions: ["implemented init/log/resume"],
    artifacts: ["src/cli/bin.ts"],
    summary: "core done",
    tags: ["m1"]
  });

  const result = await buildContextSnapshot(workspace, config);
  assert.equal(result.snapshot.objective, "Ship memory bridge core");
});
