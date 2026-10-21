# Task

## Goal

Verify the export cleanup leaves the workspace correctly typed, linted, tested, buildable, and free of in-scope unused export findings.

## Scope

Run Knip's export/type report and all standard workspace checks after task 023 is DONE. Inspect any remaining export/type findings and distinguish genuine leftovers from tool limitations. Do not expand into dependency cleanup; report those separately if they remain.

## Target Files

- `apps/web` and `packages/*` source and package entry points (read-only validation)
- `.ai/task/024-verify-export-cleanup/execution.md`

## Steps

1. Confirm task 023 is DONE.
2. Run `npm run knip -- --include exports,types` and inspect the complete result.
3. Run typecheck, lint, test, and build.
4. Record each command and result. If a check fails, record the failure and stop; do not silently broaden the cleanup.

## Validation

- `npm run knip -- --include exports,types` has no unintended unused exports/types.
- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run test` passes.
- `npm run build` passes.
