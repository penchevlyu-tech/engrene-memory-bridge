# Windows Helpers

These scripts provide a ready pre/post workflow for Windows terminals.

## Files

- `mb-pre.ps1`: runs `memory-bridge resume --for <tool>`
- `mb-post.ps1`: runs `memory-bridge log ...` then `memory-bridge handoff build`
- `mb-pre.cmd`: cmd wrapper around `mb-pre.ps1`
- `mb-post.cmd`: cmd wrapper around `mb-post.ps1`

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

