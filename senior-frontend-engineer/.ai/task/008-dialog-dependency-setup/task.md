# Task

## Goal

Prepare only the dependencies needed by the approved Dialog and status icons.

## Scope

SETUP. Workspace dependency declarations and installation; no product flow changes or deployment setup.

Follow `.ai/ai_workflow.md`, `.ai/coding_convention.md` and plan `.ai/plans/002-task-tracking-ux.md`. Work only inside the frontend root. Execute only after requested and dependency task-007-release is DONE.

## Target Files

packages/shared/package.json; packages/todos/package.json; package-lock.json; existing package scripts.

## Steps

1. Inspect installed versions and workspace imports. Use npm throughout; preserve existing package versions and unrelated dependencies.
2. Declare @radix-ui/react-dialog in shared. Declare lucide-react directly wherever imported (shared Dialog close icon and todos status icons), using the compatible existing web version where possible. Do not rely on hoisting as a dependency declaration.
3. Install and update the lockfile; verify dependency resolution and the existing build/check baseline.
4. Record each setup operation and attempt. Maximum three total attempts (initial + two retries), counted across tools/sessions/task splits. Diagnose before retrying. Third failure: FAILED, stop queue, wait for explicit confirmation. Stop earlier if information/authorization is missing.

## Validation

Run npm ls --workspaces --depth=0, npm run typecheck, npm run lint, npm run test, npm run build. Expect no missing/invalid dependencies and all baseline checks passing. Record pre-existing failures rather than hiding them.

Record results in execution.md. Non-setup failure stops the queue without automatic retries. Any setup operation has three total attempts maximum across tools/sessions; after the third failure stop and await explicit user confirmation.
