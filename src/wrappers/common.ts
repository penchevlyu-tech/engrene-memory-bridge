import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function resolveMemoryBridgeBin(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, "../cli/bin.js");
}

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag) || args.some((arg) => arg.startsWith(`${flag}=`));
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const exact = args.find((arg) => arg.startsWith(`${flag}=`));
  if (exact) {
    return exact.slice(flag.length + 1);
  }
  const idx = args.indexOf(flag);
  if (idx >= 0) {
    return args[idx + 1];
  }
  return undefined;
}

function runMemoryBridge(args: string[]): void {
  const binPath = resolveMemoryBridgeBin();
  const child = spawnSync(process.execPath, [binPath, ...args], {
    stdio: "inherit"
  });
  if (typeof child.status === "number") {
    process.exit(child.status);
  }
  process.exit(1);
}

function runMemoryBridgeAndContinue(args: string[]): void {
  const binPath = resolveMemoryBridgeBin();
  const child = spawnSync(process.execPath, [binPath, ...args], {
    stdio: "inherit"
  });
  if (child.status !== 0) {
    process.exit(child.status ?? 1);
  }
}

export function runWrapper(tool: "codex" | "claude" | "kiro", argv: string[]): void {
  const [action, ...rest] = argv;
  const asJson = hasFlag(rest, "--json");
  const workspace = getFlagValue(rest, "--workspace");

  if (!action || action === "--help" || action === "-h") {
    process.stdout.write(
      `mb-${tool}\n\nUsage:\n  mb-${tool} pre [--workspace <path>] [--json]\n  mb-${tool} post --intent <intent> --summary <summary> [--actions a,b] [--artifacts a,b] [--tags a,b] [--workspace <path>] [--json]\n`
    );
    return;
  }

  if (action === "pre") {
    const args = ["resume", "--for", tool];
    if (workspace) {
      args.push("--workspace", workspace);
    }
    if (asJson) {
      args.push("--json");
    }
    runMemoryBridge(args);
    return;
  }

  if (action === "post") {
    const intent = getFlagValue(rest, "--intent");
    const summary = getFlagValue(rest, "--summary");

    if (!intent || !summary) {
      process.stderr.write("mb post requires --intent and --summary\n");
      process.exit(1);
    }

    const args = ["log", "--tool", tool, ...rest];
    if (workspace && !hasFlag(rest, "--workspace")) {
      args.push("--workspace", workspace);
    }

    runMemoryBridgeAndContinue(args);

    const handoffArgs = ["handoff", "build"];
    if (workspace) {
      handoffArgs.push("--workspace", workspace);
    }
    if (asJson) {
      handoffArgs.push("--json");
    }
    runMemoryBridge(handoffArgs);
    return;
  }

  process.stderr.write(`Unknown action for mb-${tool}: ${action}\n`);
  process.exit(1);
}
