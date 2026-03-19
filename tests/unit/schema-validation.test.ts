import assert from "node:assert/strict";
import test from "node:test";

import { validateDecisionEvent, validateSessionEvent } from "../../src/core/schema.js";

test("validateSessionEvent accepts contract-compliant payload", () => {
  const valid = {
    ts: new Date().toISOString(),
    tool: "codex",
    workspace: "/tmp/project",
    branch: "main",
    intent: "Implement feature",
    actions: ["edited file"],
    artifacts: ["src/a.ts"],
    summary: "done",
    tags: ["mvp"]
  };

  assert.equal(validateSessionEvent(valid), true);
});

test("validateSessionEvent rejects missing required field", () => {
  const invalid = {
    ts: new Date().toISOString(),
    tool: "codex"
  };

  assert.equal(validateSessionEvent(invalid), false);
});

test("validateDecisionEvent accepts contract-compliant payload", () => {
  const valid = {
    id: "DEC-1",
    ts: new Date().toISOString(),
    title: "Use atomic writes",
    context: "Concurrent logs",
    decision: "Lock + rename",
    impact: "No file corruption",
    supersedes: []
  };

  assert.equal(validateDecisionEvent(valid), true);
});

test("validateDecisionEvent rejects malformed supersedes", () => {
  const invalid = {
    id: "DEC-2",
    ts: new Date().toISOString(),
    title: "Bad payload",
    context: "x",
    decision: "y",
    impact: "z",
    supersedes: "DEC-1"
  };

  assert.equal(validateDecisionEvent(invalid), false);
});
