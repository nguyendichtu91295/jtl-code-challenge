# Task

## Goal

Replace grouped task sections with a single list, status toggles and counted filters.

## Scope

FEATURE. Follow plan `.ai/plans/003-task-list-polish.md`, `.ai/ai_workflow.md` and `.ai/coding_convention.md`. Execute only when requested and dependency task-014-input-focus is DONE. Work stays inside the frontend root.

## Target Files

packages/todos/src/components/TodoList.tsx, TodoWorkspace.tsx, CreateTodoForm.tsx; associated component tests; apps/web/src/App.test.tsx if affected.

## Steps

Replace Doing/Done sections, per-row pills and right action buttons with one semantic list under Tasks. Each row starts with a 44×44px native icon button: CircleDashed neutral for Doing; CircleCheck green for Done; accessible action/title label, visible focus and useful hover title. Keep full black titles, multiline and unbroken-text wrapping, with fixed-size top-aligned control.

Place All/Doing/Done in a labeled segmented button group below Tasks and above the list. Show all three counts from the unfiltered user cache; selected black/white, others neutral. Use aria-pressed. Mobile options share a single full-width row. Default All; local state resets on user change; keep task order stable. Do not add per-filter fetches, duplicate collections or new dependencies.

Reuse confirmed status mutations, per-row pending disable and inline failure feedback. No status mutation for temporary rows. A failed request preserves state/filter. In a filtered list, after success removes a focused row, move focus to the next available status button, previous if needed, or selected filter if empty; do not move focus if the user has moved elsewhere.

Select All only when a valid task submission starts so an optimistic create is included even from Done. Invalid submissions keep selection. Preserve drafts on failure, targeted rollback, persistence and overview totals. Use distinct empty copy for All, Doing and Done. Keep page scrolling and render all 50 records without pagination/virtualization.

Update meaningful tests for filter counts/membership, filtered toggle/focus, pending/error behavior, creation from Done, user reset/isolation and existing optimistic regressions. Retain stable router test setup; do not weaken assertions just to remove grouped-section expectations.

## Validation

Run npx vitest run packages/todos/src apps/web/src, npm run typecheck, and npm run lint. Check that prior optimistic rollback/status/cache tests remain passing. Real geometry and volume checks belong to task 016.

## Setup and failure handling

No setup anticipated. Identify any newly required setup explicitly; maximum three total attempts per unresolved operation, initial plus two retries, counted across tools/sessions/task splits. Record diagnosis and attempts. Third failure: mark FAILED, stop and wait for explicit confirmation. Non-setup failure follows the local no-automatic-retry rule.
