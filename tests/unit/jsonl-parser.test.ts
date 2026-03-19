import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { readJsonl } from "../../src/core/fs-utils.js";
import { makeTempWorkspace } from "../helpers.js";

test("readJsonl parses valid lines and reports invalid lines", async () => {
  const workspace = await makeTempWorkspace("mb-jsonl-");
  const filePath = path.join(workspace, "sample.jsonl");
  await fs.writeFile(filePath, '{"a":1}\ninvalid\n{"b":2}\n', "utf8");

  const result = await readJsonl(filePath);

  assert.equal(result.records.length, 2);
  assert.equal(result.warnings.length, 1);
});
