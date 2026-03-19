import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

import type { BridgeConfig } from "../types/events.js";
import { validateEncryptedEnvelope, type EncryptedEnvelope } from "./schema.js";

function resolveKey(config: BridgeConfig): Buffer | undefined {
  if (!config.encryption.enabled) {
    return undefined;
  }
  const envVar = config.encryption.keyEnvVar || "MEMORY_BRIDGE_KEY";
  const passphrase = process.env[envVar];
  if (!passphrase) {
    return undefined;
  }
  const salt = Buffer.from(config.encryption.saltBase64, "base64");
  return scryptSync(passphrase, salt, 32);
}

function encryptRaw(plainText: string, key: Buffer, kind: EncryptedEnvelope["kind"]): EncryptedEnvelope {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    _encrypted: true,
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64"),
    kind,
    ts: new Date().toISOString()
  };
}

function decryptRaw(envelope: EncryptedEnvelope, key: Buffer): string {
  const iv = Buffer.from(envelope.iv, "base64");
  const tag = Buffer.from(envelope.tag, "base64");
  const data = Buffer.from(envelope.data, "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}

export function encryptionEnabled(config: BridgeConfig): boolean {
  return Boolean(config.encryption.enabled);
}

export function encryptionReady(config: BridgeConfig): boolean {
  if (!encryptionEnabled(config)) {
    return true;
  }
  return Boolean(resolveKey(config));
}

export function encryptJsonIfNeeded(
  payload: unknown,
  kind: EncryptedEnvelope["kind"],
  config: BridgeConfig
): unknown {
  if (!encryptionEnabled(config)) {
    return payload;
  }
  const key = resolveKey(config);
  if (!key) {
    throw new Error(
      `Encryption is enabled, but ${config.encryption.keyEnvVar} is not set in the environment.`
    );
  }
  const plainText = JSON.stringify(payload);
  return encryptRaw(plainText, key, kind);
}

export function decryptJsonIfNeeded<T>(
  payload: unknown,
  config: BridgeConfig,
  warnings: string[]
): T | undefined {
  if (!validateEncryptedEnvelope(payload)) {
    return payload as T;
  }
  if (!encryptionEnabled(config)) {
    warnings.push("Encrypted record found while encryption is disabled in config.");
    return undefined;
  }
  const key = resolveKey(config);
  if (!key) {
    warnings.push(
      `Encrypted record skipped because ${config.encryption.keyEnvVar} is not set in the environment.`
    );
    return undefined;
  }
  try {
    const plainText = decryptRaw(payload, key);
    return JSON.parse(plainText) as T;
  } catch {
    warnings.push("Encrypted record could not be decrypted (wrong key or corrupted data).");
    return undefined;
  }
}

export function encryptTextIfNeeded(text: string, config: BridgeConfig): string {
  if (!encryptionEnabled(config)) {
    return text;
  }
  const key = resolveKey(config);
  if (!key) {
    throw new Error(
      `Encryption is enabled, but ${config.encryption.keyEnvVar} is not set in the environment.`
    );
  }
  const envelope = encryptRaw(text, key, "handoff");
  return `${JSON.stringify(envelope, null, 2)}\n`;
}

export function decryptTextIfNeeded(
  text: string | undefined,
  config: BridgeConfig,
  warnings: string[]
): string | undefined {
  if (text === undefined) {
    return undefined;
  }
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) {
    return text;
  }
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!validateEncryptedEnvelope(parsed) || parsed.kind !== "handoff") {
      return text;
    }
    if (!encryptionEnabled(config)) {
      warnings.push("Encrypted handoff found while encryption is disabled in config.");
      return undefined;
    }
    const key = resolveKey(config);
    if (!key) {
      warnings.push(
        `Encrypted handoff skipped because ${config.encryption.keyEnvVar} is not set in the environment.`
      );
      return undefined;
    }
    return decryptRaw(parsed, key);
  } catch {
    return text;
  }
}
