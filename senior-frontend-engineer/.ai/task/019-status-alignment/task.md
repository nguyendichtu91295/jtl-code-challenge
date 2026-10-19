# Task

## Goal

Align task status icon centers to the first title line while retaining usable controls.

## Scope

IMPLEMENTATION. Follow .ai/plans/004-user-identity-alignment.md, .ai/ai_workflow.md and .ai/coding_convention.md. Work stays inside the frontend root. Execute only when requested and dependencies are DONE.

## Target Files

packages/todos/src/components/TodoList.tsx; existing TodoList tests only if markup assertions need changes.

## Steps

Replace the current -2px status-button margin with deliberate first-line geometry. Use a nonshrinking 44×44px top-aligned native button; with a 24px title line-height, 10px title top padding is a starting point for shared center alignment. Verify visually in task 020. Preserve full long/unbroken title wrapping, neutral Doing and green Done icons, labels/tooltips, pending/disabled states, keyboard focus rings, error spacing, filters and filtered-toggle focus restoration. Do not vertically center against the entire multiline paragraph or shrink the tap target.

## Validation

Run npm run typecheck, npm run lint and npm run test --workspace=@jtl/todos. Existing status/filter/focus/error behavior must pass. Avoid CSS-class-only tests; defer geometry proof to task 020.

## Setup and failure handling

No setup anticipated. If required, identify and record it separately. Maximum three total attempts per unresolved setup operation, initial plus two retries across commands/tools/sessions/task splits. Diagnose before retrying; after the third failed attempt mark FAILED, stop and await explicit confirmation. Non-setup failed tasks require explicit retry authorization.
