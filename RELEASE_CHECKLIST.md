# Release Checklist

## Pre-release
- [ ] `npm test` passed
- [ ] `npm run smoke:local` passed
- [ ] `README.md` updated
- [ ] `SPEC.md` updated for contract changes
- [ ] `CONTRIBUTING.md` updated if contributor workflow changed

## Versioning
- [ ] Bump `package.json` version
- [ ] Tag release (`vX.Y.Z`)

## Publish
- [ ] Verify package name availability (`memory-bridge` or scoped alternative)
- [ ] `npm publish --access public`
- [ ] Create GitHub release notes

## Post-release
- [ ] Validate install in clean environment
- [ ] Validate binaries: `memory-bridge`, `mb-codex`, `mb-claude`, `mb-kiro`
- [ ] Run quick bootstrap in sample repo (`init`, `log`, `resume`, `handoff build`)
