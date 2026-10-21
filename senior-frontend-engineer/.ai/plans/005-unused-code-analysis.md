# Unused Code Analysis with Knip

## Goal

Try Knip as a repository-level tool for identifying unused code and dependencies across the npm workspaces.

## Background and current behavior

The repository has `apps/web` and internal `packages/*` workspaces. An exported helper, `getPendingTodoIds`, appears to be re-exported but have no consumers. ESLint and TypeScript checks do not provide a full cross-workspace unused-export report.

## Scope

- Setup: install Knip as a root development dependency and add a root script/config suitable for the current workspace layout.
- Run Knip in report-only mode; inspect and summarize findings.
- Do not automatically delete or rewrite code. Any cleanup requires reviewing findings first.

## Out of scope

- Enforcing Knip in CI.
- Automatically fixing or removing findings.
- Changing application behavior.

## Target files or areas

- Root `package.json`, `package-lock.json`
- Root `knip.json` (if configuration is needed)
- `apps/web` and `packages/*` source and manifests (analysis only)
- `.ai/task/022-knip-analysis/`

## Implementation approach

Install Knip at the npm workspace root, use its npm-workspace discovery, and run a report that includes entry-point exports. Review public package API findings before suggesting cleanup.

## Dependencies and sequencing

One setup task: install/configure Knip. Then run analysis and inspect output in that same task.

## Validation

- `npm exec knip -- --help` confirms the installed CLI runs.
- `npm run knip` analyzes the app and all internal packages.
- Confirm whether `getPendingTodoIds` is reported and review other findings for likely false positives.

## Open questions and risks

Static analysis may miss dynamic imports or runtime conventions and can report intentional public exports. Findings are candidates for review, not instructions to delete code.
