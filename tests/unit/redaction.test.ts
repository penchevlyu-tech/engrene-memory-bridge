import assert from "node:assert/strict";
import test from "node:test";

import { redactUnknown } from "../../src/core/redaction.js";

test("redactUnknown hides common sensitive patterns", () => {
  const payload = {
    summary: "token=abc12345678901234567890",
    nested: {
      key: "api_key: sk-1234567890abcdefghijklmnopqrstuv",
      privateKey: "-----BEGIN PRIVATE KEY-----\\nAAA\\n-----END PRIVATE KEY-----"
    }
  };

  const out = redactUnknown(payload);
  const serialized = JSON.stringify(out);

  assert.equal(serialized.includes("sk-123"), false);
  assert.equal(serialized.includes("BEGIN PRIVATE KEY"), false);
  assert.match(serialized, /\[REDACTED/);
});
