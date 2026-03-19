# Integrating with Any IDE or CLI

This guide explains exactly how to make `memory-bridge` work with any developer tool.

## Integration contract

For any tool `<tool>`:

1. **Pre-hook** (before prompt/task):
   - `memory-bridge resume --for <tool>`
2. **Post-hook** (after task):
   - `memory-bridge log ...`
   - `memory-bridge handoff build`

This is the full interoperability model.

## What this enables

This contract is specifically designed for cross-tool continuity:

- Session A in Tool X writes memory.
- Session B in Tool Y reads and continues from it.
- No tool-specific memory backend is required.

## Popular tool matrix

### Official wrapper support

- Codex: `mb-codex`
- Claude: `mb-claude`
- Kiro: `mb-kiro`

### Common tools with contract-based support

Use Option A (manual) or Option C (native hooks/scripts):

- Cursor
- VS Code (Continue/Cline and similar)
- Windsurf
- JetBrains IDEs
- Gemini CLI
- GitHub Copilot CLI
- Aider
- Replit
- Firebase Studio

Requirement: the tool must allow shell commands and/or task hooks.

## Option A: Manual (works everywhere)

Use this when your IDE has no hook support.

### Before starting work

```bash
memory-bridge resume --for <tool>
```

### After finishing work

```bash
memory-bridge log --tool <tool> --intent "..." --summary "..." --actions "a,b" --artifacts "x,y" --tags "t1,t2"
memory-bridge handoff build
```

## Option B: Wrapper-based (recommended)

Use built-in wrappers:

- `mb-codex pre|post`
- `mb-claude pre|post`
- `mb-kiro pre|post`

Example:

```bash
mb-claude pre
mb-claude post --intent "Fix auth race" --summary "Locking added" --actions "TODO: benchmark" --artifacts "src/auth.ts"
```

## Option C: Native hooks (if your IDE supports them)

Map these commands:

- **On session/task start**: `memory-bridge resume --for <tool> --json`
- **On task completion**:
  - `memory-bridge log --tool <tool> ... --json`
  - `memory-bridge handoff build --json`

## User prompt template for IDEs

When users want consistent behavior, use this instruction in IDE/system prompt:

```text
Always start by reading Memory Bridge context for this workspace.
Use current objective, decisions, pending items, and next steps from `.memory-bridge`.
When done, provide a concise execution summary so it can be persisted via memory-bridge log.
```

## Team policy recommendation

For team-wide consistency, enforce this policy in docs/onboarding:

1. Run `memory-bridge init` once per repository.
2. Never commit `.memory-bridge/*` runtime files.
3. Always run pre/post contract when changing tools.
4. Keep `project-context.md` updated with stable constraints.

## Troubleshooting

### Missing or partial resume data

Run:

```bash
memory-bridge doctor
```

`resume` is intentionally fault-tolerant and returns partial context with warnings.

### Encryption enabled but resume cannot decrypt

Set local key:

```bash
export MEMORY_BRIDGE_KEY="your-local-passphrase"
```

### No semantic results

Enable semantic mode and build data:

```bash
memory-bridge init --semantic
memory-bridge search "query" --mode semantic
```
