# engrene-memory-bridge

![Engrene Logo](https://engrene.com/wp-content/uploads/2025/11/Logo-Engrene.jpeg)

Local-first memory bridge for AI workflows.

`engrene-memory-bridge` keeps project memory in simple files (`.memory-bridge/*`) so different tools (IDEs, CLIs, agents) can share the same context without a proprietary plugin.

## Main value

Use this when you want one tool session to continue from another tool session.

In practice, this means:

- IDE A logs work.
- IDE/CLI B resumes from that exact context.
- Teams can switch tools without losing project continuity.

## Core idea

Every tool reads and writes the same memory contract:

- `resume` before work
- `log` after work
- `handoff build` to consolidate state

This is how context survives tool switching.

## Why use this instead of an MCP memory server?

- No vendor lock-in: memory is plain files in your repository, not tied to one runtime.
- Tool interoperability: any IDE/CLI can read and write the same contract.
- Local-first privacy: data stays local by default, with redaction and optional encryption.
- Auditability: you can inspect exactly what was stored and why.
- Resilience: workflows continue even if a remote memory service is unavailable.

## What gets stored?

Memory Bridge stores operational memory, not full raw transcripts by default.

- Session events: intent, actions, artifacts, summary, tags.
- Decision events: key technical decisions and impact.
- Handoff: a compact current-state summary for the next tool/person.

This keeps memory useful and compact. You get the important context without dumping everything.

## Popular tools that already work

### Official wrappers (ready now)

- Codex (`mb-codex`)
- Claude (`mb-claude`)
- Kiro (`mb-kiro`)

### Works via contract (manual commands or hooks)

These are commonly used and can integrate with Memory Bridge through terminal commands and/or tool instructions:

- Cursor
- VS Code (including extensions like Continue/Cline)
- Windsurf
- JetBrains IDEs
- Gemini CLI
- GitHub Copilot CLI
- Aider
- Replit
- Firebase Studio (via terminal/task scripts)

If a tool can run shell commands or supports pre/post task scripts, it can use the same memory contract.

## Install

```bash
npm install -g memory-bridge
# or (if unscoped name is unavailable)
# npm install -g @engrene/memory-bridge
```

## 1-minute setup

Inside any project root:

```bash
memory-bridge init
```

This creates:

- `.memory-bridge/config.json`
- `.memory-bridge/project-context.md`
- `.memory-bridge/decisions.jsonl`
- `.memory-bridge/sessions/<yyyy-mm-dd>.jsonl`
- `.memory-bridge/handoff.md`

It also adds `.memory-bridge/` to your `.gitignore`.

## Daily workflow (for users)

### Step 1: Resume context before asking your IDE/agent

```bash
memory-bridge resume --for codex
```

Use that output as session context.

### Step 2: Work normally in your IDE/CLI

Implement changes as usual.

### Step 3: Log what happened

```bash
memory-bridge log \
  --tool codex \
  --intent "Implement MFA hardening" \
  --summary "Added guard + tests" \
  --actions "TODO: load test,update docs" \
  --artifacts "apps/api/src/auth/auth.service.ts,apps/api/src/tests/auth-mfa.unit.test.ts" \
  --tags "security,mfa"
```

### Step 4: Build handoff for the next tool/person

```bash
memory-bridge handoff build
```

### Step 5: Continue in another tool

```bash
memory-bridge resume --for claude
```

## What should users ask the IDE/agent?

If your IDE does not support hooks, users can copy this instruction template:

```text
Before answering, use the latest Memory Bridge context for this project.
If available, read `.memory-bridge/handoff.md` and recent session/decision events.
After implementing, summarize intent/actions/artifacts so I can run memory-bridge log.
```

If hooks are supported, automate it (recommended).

## Official wrappers

Wrappers already enforce the pre/post flow:

- `mb-codex`
- `mb-claude`
- `mb-kiro`

Examples:

```bash
mb-codex pre --json
mb-codex post \
  --intent "Refactor upload flow" \
  --summary "Done" \
  --actions "TODO: e2e" \
  --artifacts "apps/api/src/documents/documents.service.ts"
```

## Security

### Redaction (enabled by default)

Sensitive patterns are redacted before persistence (API keys, tokens, passwords, private keys, `.env`-style secrets).

### Optional encryption

Enable on init:

```bash
memory-bridge init --encryption
```

Set key in local environment:

```bash
export MEMORY_BRIDGE_KEY="your-local-passphrase"
```

Encrypted targets: sessions, decisions, handoff.

## Search

Text search:

```bash
memory-bridge search "mfa guard"
```

Semantic search (optional local index):

```bash
memory-bridge init --semantic
memory-bridge search "retention policy" --mode semantic
```

Index file: `.memory-bridge/vector.sqlite`

## JSON mode for automation

All commands support `--json`.

```bash
memory-bridge resume --for codex --json
memory-bridge doctor --json
```

## Docs

- [Specification](./SPEC.md)
- [Integration guide](./INTEGRATIONS.md)
- [Contributing](./CONTRIBUTING.md)
- [Release checklist](./RELEASE_CHECKLIST.md)

## Development

```bash
npm install
npm test
npm run smoke:local
```

## License

MIT

## Contact

For support, integrations, or partnerships: `lenine@engrene.com`
