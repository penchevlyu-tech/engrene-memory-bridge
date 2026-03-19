import { execSync } from "node:child_process";

export function currentGitBranch(workspace: string): string {
  try {
    const out = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: workspace,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    return out || "unknown";
  } catch {
    return "unknown";
  }
}
