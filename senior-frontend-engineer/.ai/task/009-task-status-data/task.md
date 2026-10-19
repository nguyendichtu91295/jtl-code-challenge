# Task

## Goal

Add durable Doing/Done tracking without losing existing saved records.

## Scope

FEATURE. Shared model, fake API, batched summary data and tests; preserve required assignees and existing validation.

Follow `.ai/ai_workflow.md`, `.ai/coding_convention.md` and plan `.ai/plans/002-task-tracking-ux.md`. Work only inside the frontend root. Execute only after requested and dependency task-008-dialog-dependency-setup is DONE.

## Target Files

packages/shared/src/types.ts; seed.ts; fakeApi.ts; fakeApi.test.ts; index.ts; packages/todos/src/api/todosApi.ts; hooks/useTodos.ts and existing typed fixtures.

## Steps

1. Add status doing | done. Seed and newly created tasks default to doing; update optimistic records/fixtures to remain type-safe.
2. Keep storage key jtl-people-tasks:v1. Validate legacy version-1 snapshots and normalize missing statuses to doing. Write version-2 snapshots with validated statuses on confirmed changes. Preserve IDs, titles, assignees and created users. Keep memory-only fallback for unavailable/throwing storage.
3. Add typed status update by task ID, validate status and task existence, and persist only confirmed results. Add an API-level failure seam or test mock without product failure controls.
4. Add one batched per-user Doing/Done summary API, including zero counts for known users; expose via todos API. Do not create user-feature dependencies.
5. Test migration, round-trip status/undo, unknown IDs/invalid status, user isolation, correct counts and unavailable storage. Retain all existing validation and optimistic-create behavior.

## Validation

Run npx vitest run packages/shared/src/fakeApi.test.ts packages/todos/src/hooks/useTodos.test.tsx and npm run typecheck. Expect legacy data retained, no pending data persisted, valid status round trips, correct user counts and existing optimistic tests passing.

Record results in execution.md. Non-setup failure stops the queue without automatic retries. Any setup operation has three total attempts maximum across tools/sessions; after the third failure stop and await explicit user confirmation.
