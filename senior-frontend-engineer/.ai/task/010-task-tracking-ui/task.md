# Task

## Goal

Provide a reusable user-bound task workspace with status actions and reliable counts.

## Scope

FEATURE. Todo hooks/components and focused tests; app-level route removal is task 011.

Follow `.ai/ai_workflow.md`, `.ai/coding_convention.md` and plan `.ai/plans/002-task-tracking-ux.md`. Work only inside the frontend root. Execute only after requested and dependency task-009-task-status-data is DONE.

## Target Files

packages/todos/src/hooks/useTodos.ts and tests; api/todosApi.ts; components/CreateTodoForm.tsx; TodoList.tsx; TodosPage.tsx; index.ts; status presentation components as needed.

## Steps

1. Expose a workspace accepting a required user ID and display name. Title form displays the fixed assignee and cannot deselect/reassign them. Keep 1–200 character guidance, trimmed validation, pending protection, and draft retention on failure. Maintain temporary adapter compatibility with existing callers until task 011.
2. Render Doing and Done sections with counts and distinct empty copy. Use CircleDashed and CircleCheck with visible labels; task titles remain black. Doing is grey-black; Done background #f0fdf4, border #bbf7d0, text #166534, icon #15803d.
3. Preserve immediate optimistic create, doing default, targeted rollback and user isolation. Block status changes on pending tasks.
4. Status actions are Mark done and persistent Undo. Disable the affected row while saving; move it only after success; preserve original state and show retryable inline error on failure. Update only the returned item, never overwrite unrelated pending creates.
5. Expose a batched summary query for app composition. Include pending-create contributions without double counting or persisting them, remove them on failure, reconcile summaries after settlement. Coordinate invalidation with concurrent creates/status changes so pending rows are not erased.
6. Test fixed assignment, grouping/empty copy, status success/failure/undo, pending controls, overlapping create/status behavior, rollback and summary reconciliation.

## Validation

Run npx vitest run packages/todos/src and npm run typecheck. Tests must demonstrate that a failed mutation does not remove another task and overview totals reconcile with detail state. No browser automation needed for isolated cache logic.

Record results in execution.md. Non-setup failure stops the queue without automatic retries. Any setup operation has three total attempts maximum across tools/sessions; after the third failure stop and await explicit user confirmation.
