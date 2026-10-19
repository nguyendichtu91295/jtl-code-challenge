# Execution Result

## Status

DONE

## Summary

Prepared a Vercel project for direct CLI deployments from this frontend workspace. Confirmed the coding-challenge team and the repository remote default branch (`master`). No Git integration is connected, so releases use the authenticated Vercel CLI and do not push or trigger a second deployment.

## Changes

- Added `vercel.json` with Vite, `npm ci`, `npm run build`, `apps/web/dist`, and an SPA fallback rewrite.
- Added `.vercelignore` to omit AI journey/planning records, challenge instructions, local env files, caches, dependencies, tests, and prebuilt output from Vercel uploads.
- Linked this workspace to `coding-challenge/jtl-frontend-challenge` (project ID `prj_tSruMXLhAFzimMwsCLaAuFtLk6dS`).
- Effective project settings: Vite, Node 22.x, install `npm ci`, build `npm run build`, output `apps/web/dist`, root directory auto-detected as the CLI working directory (frontend workspace). No Git repository is attached.
- Disabled SSO protection for this project only so its Vercel production URL can be publicly accessed. No account-wide setting was changed.
- Kept `.vercel/` and env files ignored. The CLI generated `.env.local` during linking; it was removed without displaying its contents.

## Validation

- `npx --yes vercel@latest whoami` — authenticated as the expected Vercel user.
- `npx --yes vercel@latest teams ls --json` — confirmed the `coding-challenge` team.
- `npx --yes vercel@latest project ls --scope coding-challenge --json` — confirmed no existing project for this app; reused neither unrelated project.
- `git ls-remote --symref origin HEAD` and `git ls-remote --heads origin` — remote HEAD points to `master`; it is the only remote branch.
- `npx --yes vercel@latest project inspect jtl-frontend-challenge --scope coding-challenge --json` — confirmed effective build/install/framework/output/root settings.
- `npx --yes vercel@latest project protection jtl-frontend-challenge --scope coding-challenge --json` — confirmed SSO protection is disabled for this project.
- `npm run build` — passed.
- `npx --yes vercel@latest deploy --dry --json --scope coding-challenge --project jtl-frontend-challenge` — passed; Vercel detected Vite and selected only the frontend workspace (50 files, about 216 KB). AI planning, tests, caches, dependencies, and build output were excluded.
- `git check-ignore -v .vercel/project.json .env.local` — confirmed local project metadata and env files are ignored; no generated env file remains.

## Errors

- Vercel project creation first used unsupported `--no-interactive`; corrected to `--non-interactive` on the second attempt and creation succeeded.
- Initial local dry-run resolved the configured monorepo path relative to the already narrowed frontend path. A repository-root dry-run worked but included sibling projects. `.` was rejected as an explicit root-directory value; resetting root-directory to Vercel auto-detection then produced the correct frontend-only dry-run.
- The first SSO-protection command used unsupported `--yes`; the corrected command succeeded.

## Notes

Kind: SETUP. No operation reached three failed attempts. No deployment was published in this task; task 007 owns release. The direct CLI release scope avoids committing or pushing the current uncommitted workspace. The verified Git remote default remains `master`, but this Vercel project is not connected to Git.

## Setup attempt log

- Vercel CLI install/version operation: attempt 1 succeeded (`npx --yes vercel@latest --version`).
- Project creation: attempt 1 failed due unsupported `--no-interactive`; attempt 2 used supported `--non-interactive` and succeeded.
- Project linking/settings: linking succeeded. Root-directory verification surfaced a mismatch; an explicit `.` setting was rejected, then `--auto-detect root-directory` succeeded and the direct-workspace dry-run passed. No third failure.
- Public-access configuration: attempt 1 used unsupported `--yes`; attempt 2 removed that flag and disabled SSO protection successfully.
