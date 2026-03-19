import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binPath = path.resolve(here, "../../src/cli/bin.js");
const codexWrapper = path.resolve(here, "../../src/wrappers/mb-codex.js");
const claudeWrapper = path.resolve(here, "../../src/wrappers/mb-claude.js");
const workspace = path.resolve(process.cwd(), "../..");

function run(scriptPath: string, args: string[]): { status: number | null; stdout: string; stderr: string } {
  const out = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: workspace,
    encoding: "utf8"
  });
  return {
    status: out.status,
    stdout: out.stdout,
    stderr: out.stderr
  };
}

function ensureOk(label: string, runResult: { status: number | null; stderr: string }): void {
  if (runResult.status !== 0) {
    throw new Error(`${label} failed: ${runResult.stderr}`);
  }
}

async function main(): Promise<void> {
  ensureOk("init", run(binPath, ["init", "--workspace", workspace]));

  ensureOk(
    "mb-codex post",
    run(codexWrapper, [
      "post",
      "--workspace",
      workspace,
      "--intent",
      "Smoke real workspace",
      "--summary",
      "Session started from codex",
      "--actions",
      "TODO: verify resume from claude",
      "--artifacts",
      "tools/memory-bridge/tests/integration/smoke-real-workspace.test.ts",
      "--tags",
      "smoke"
    ])
  );

  const resumeFromClaude = run(claudeWrapper, ["pre", "--workspace", workspace, "--json"]);
  ensureOk("mb-claude pre", resumeFromClaude);

  const handoffPath = path.join(workspace, ".memory-bridge", "handoff.md");
  const handoff = await fs.readFile(handoffPath, "utf8");

  const report = {
    smoke: "ok",
    workspace,
    handoffContainsPending: /pending|todo/i.test(handoff),
    resumeRaw: resumeFromClaude.stdout.slice(0, 600)
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
