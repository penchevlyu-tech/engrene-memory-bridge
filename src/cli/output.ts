export function printOutput(payload: unknown, asJson: boolean): void {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
    return;
  }
  if (typeof payload === "string") {
    process.stdout.write(payload.endsWith("\n") ? payload : `${payload}\n`);
    return;
  }
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

export function fail(message: string, asJson: boolean, code = 1): never {
  if (asJson) {
    process.stderr.write(`${JSON.stringify({ ok: false, error: message })}\n`);
  } else {
    process.stderr.write(`${message}\n`);
  }
  process.exit(code);
}
