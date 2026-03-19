export interface ParsedArgs {
  positionals: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]!;
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }

    const normalized = token.slice(2);
    if (normalized.includes("=")) {
      const [rawKey, ...rest] = normalized.split("=");
      const key = (rawKey || "").trim();
      const value = rest.join("=");
      flags[key] = value;
      continue;
    }

    const key = normalized.trim();
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      flags[key] = next;
      i += 1;
      continue;
    }
    flags[key] = true;
  }

  return { positionals, flags };
}

export function getStringFlag(parsed: ParsedArgs, name: string, fallback?: string): string | undefined {
  const value = parsed.flags[name];
  if (typeof value === "string") {
    return value;
  }
  if (value === true) {
    return "true";
  }
  return fallback;
}

export function getBoolFlag(parsed: ParsedArgs, name: string, fallback = false): boolean {
  const value = parsed.flags[name];
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
  }
  return fallback;
}

export function getListFlag(parsed: ParsedArgs, name: string): string[] {
  const raw = getStringFlag(parsed, name, "") || "";
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
