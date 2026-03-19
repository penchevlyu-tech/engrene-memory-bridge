# Contributing

## Scope

This project is interoperability-first. Keep file contracts stable and backward-compatible.

## Local setup

```bash
npm install
npm test
npm run smoke:local
```

## Language policy

- Use **English** in code comments, docs, issues, and PR descriptions.
- Keep user-facing command output clear and concise.

## Adding support for a new IDE/CLI

1. Add wrapper in `src/wrappers/mb-<tool>.ts`.
2. Register binary in `package.json#bin`.
3. Wrapper must implement:
   - `pre` -> `memory-bridge resume --for <tool>`
   - `post` -> `memory-bridge log ...` + `memory-bridge handoff build`
4. Add/adjust integration tests to cover cross-tool continuity.
5. Update `INTEGRATIONS.md` with usage notes.

## Coding rules

- Keep commands deterministic.
- Never persist raw secrets.
- Do not break `--json` outputs.
- Preserve local-first behavior (no cloud sync in v1).

## Test expectations

Minimum coverage:

- schema validation
- context fallback behavior
- redaction behavior
- JSONL parser robustness
- init idempotency
- cross-tool flow
- concurrent log safety

## Pull request checklist

- [ ] Tests green (`npm test`)
- [ ] Smoke passed (`npm run smoke:local`)
- [ ] SPEC updated if contract changed
- [ ] README updated if CLI UX changed
- [ ] INTEGRATIONS updated if tool workflows changed
