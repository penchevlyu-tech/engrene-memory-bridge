# Windows Helpers

These scripts provide a ready workflow for Windows terminals.

## Files

- `mb.ps1`: single entrypoint via `npx` (no global install required)
- `mb.cmd`: cmd wrapper around `mb.ps1`
- `mb-pre.ps1`: runs `memory-bridge resume --for <tool>`
- `mb-post.ps1`: runs `memory-bridge log ...` then `memory-bridge handoff build`
- `mb-pre.cmd`: cmd wrapper around `mb-pre.ps1`
- `mb-post.cmd`: cmd wrapper around `mb-post.ps1`

## Recommended (no global install)

PowerShell:

```powershell
.\scripts\windows\mb.ps1 init
.\scripts\windows\mb.ps1 doctor
.\scripts\windows\mb.ps1 resume --for codex
```

cmd:

```cmd
scripts\windows\mb.cmd init
scripts\windows\mb.cmd doctor
scripts\windows\mb.cmd resume --for codex
```

## PowerShell usage

```powershell
.\scripts\windows\mb-pre.ps1 -Tool codex

.\scripts\windows\mb-post.ps1 `
  -Tool codex `
  -Intent "Fix login bug" `
  -Summary "Added token validation" `
  -Actions "TODO: add e2e" `
  -Artifacts "src/auth.ts" `
  -Tags "auth,fix"
```

## cmd usage

```cmd
scripts\windows\mb-pre.cmd -Tool codex
scripts\windows\mb-post.cmd -Tool codex -Intent "Fix login bug" -Summary "Added token validation" -Actions "TODO: add e2e" -Artifacts "src/auth.ts" -Tags "auth,fix"
```
