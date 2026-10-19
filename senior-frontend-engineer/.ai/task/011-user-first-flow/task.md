# Task

## Goal

Make users the entry point with compact creation and task details in context.

## Scope

FEATURE. User UI, app composition/routing, shared Dialog, neutral theme and integration tests.

Follow `.ai/ai_workflow.md`, `.ai/coding_convention.md` and plan `.ai/plans/002-task-tracking-ux.md`. Work only inside the frontend root. Execute only after requested and dependency task-010-task-tracking-ui is DONE.

## Target Files

packages/shared/src/ui/Dialog.tsx and existing UI primitives; packages/users/src/components/UserPages.tsx; UserList.tsx; CreateUserForm.tsx and tests; apps/web/src/App.tsx; index.css; packages/shared/src/selectedUserIdAtom.ts and exports.

## Steps

1. Build an accessible shared shadcn-style Radix Dialog with title, description, close control, focus handling and mobile viewport fit. Add user button opens it; no inline user form remains on the list.
2. On create success close the dialog, stay on /users, show the new user with Doing 0 / Done 0 and restore focus. Failure retains dialog and draft. Preserve 1–40 character guidance and trimmed, case-sensitive uniqueness. Prevent duplicate submits; ensure a pending request cannot unexpectedly close a newly reopened dialog.
3. App obtains batched todo summaries and passes typed values/loading/error/retry props to users. Show explicit labeled counts including zeros only when known. Users and todos must never import each other.
4. Compose the resolved user detail with the task workspace in apps/web. Only render task creation for an existing resolved user; route user ID owns assignment. Handle loading/error/missing users explicitly.
5. Remove /todos and its Tasks entry and the redundant Users header button. Keep root redirect to /users. Provide a semantic left-arrow Back to users link above the detail heading, targeting /users even after direct entry/reload and on error screens. Remove obsolete transitional adapters from task 010.
6. Remove unused selected-user state, retaining Jotai persistenceStatusAtom as the meaningful cross-cutting storage-availability concern. Keep server records in Query.
7. Replace blue primary/focus accents with black/neutral styles while retaining visible focus and semantic errors. Keep mobile-first responsive layout, no challenge/demo/explanation copy, no fetch-success toast, and preserve seed users.
8. Add focused integration tests for dialog success/failure, route-owned assignment across users, counts and back navigation; keep tests independent of visual pixel details.

## Validation

Run npx vitest run packages/users/src packages/todos/src apps/web/src and npm run typecheck and npm run lint. Verify no cross-feature imports or obsolete /todos links via source inspection. Real layout and keyboard checks follow in task 012.

Record results in execution.md. Non-setup failure stops the queue without automatic retries. Any setup operation has three total attempts maximum across tools/sessions; after the third failure stop and await explicit user confirmation.
