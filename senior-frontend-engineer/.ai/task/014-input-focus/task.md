# Task

## Goal

Fix the focus treatment consistently for all product inputs.

## Scope

FEATURE. Follow plan `.ai/plans/003-task-list-polish.md`, `.ai/ai_workflow.md` and `.ai/coding_convention.md`. Execute only when requested and dependency task-013-ux-release is DONE. Work stays inside the frontend root.

## Target Files

packages/shared/src/ui/Input.tsx; apps/web/src/index.css; consumers in CreateUserForm and CreateTodoForm.

## Steps

Inspect shared Input and global :focus-visible interaction. Implement one clear black focus treatment inside the field bounds (prefer a 2px inset ring), suppressing only the redundant input outline. Preserve keyboard focus indicators for all other controls, input rounded corners, help/error spacing and disabled styling. Both username and task-title inputs must use the shared solution. No dependency setup expected; do not add class-name-only tests.

## Validation

Run npm run typecheck and npm run lint. Inspect both fields with keyboard focus in a browser; the full mobile/desktop and error-state checks are completed in task 016.

## Setup and failure handling

No setup anticipated. Identify any newly required setup explicitly; maximum three total attempts per unresolved operation, initial plus two retries, counted across tools/sessions/task splits. Record diagnosis and attempts. Third failure: mark FAILED, stop and wait for explicit confirmation. Non-setup failure follows the local no-automatic-retry rule.
