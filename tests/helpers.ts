import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function makeTempWorkspace(prefix = "mb-test-"): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function readFileSafe(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
