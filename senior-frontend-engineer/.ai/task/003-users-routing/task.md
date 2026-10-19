# Task: 003-users-routing

## Goal

Implement user creation, selection and detail routes with accessible mobile-first UI.

## Scope

IMPLEMENTATION. Read `AGENTS.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.ai/plans/001-frontend-challenge.md`. Work only inside the frontend root; preserve existing changes. This task is PENDING and must not execute until the user confirms execution. Keep execution status and markers synchronized, record actual checks, and update AI journey evidence. Do not mark DONE without successful required validation. Non-setup failures stop the queue and require user confirmation to retry. Any tooling/install/setup encountered has a cap of three total attempts per unresolved operation (initial plus two retries), tracked across commands/tools/sessions; after the third failure mark FAILED, stop, and wait for confirmation. No automatic reset of that counter.

## Dependencies and sequencing

task-002-data-persistence. The preceding task must be DONE so its contracts, behavior, or release inputs are validated before continuing.

## Target Files

packages/users/src components/hooks/api/types/validation; apps/web routes/pages/navigation; shared selected-user atom and UI primitives.

## Steps

1. Implement /users, /users/$userId, /todos and root redirect to /users via TanStack Router. /todos may have a functional empty shell until the next task. Do not add a todo-detail route.
2. Implement Query-backed user list and detail hooks with sensible keys, loading/empty/error/retry/not-found states. The route ID is authoritative for user detail.
3. Implement create-user form with pure typed validation, 1–40 characters after trimming, and persistent accessible helper text: '1–40 characters. Case-sensitive; must be unique.' Map API uniqueness conflicts to the username field, preserve drafts on errors and prevent duplicate pending submissions.
4. Validate on submit and revalidate errored fields on change; focus first invalid input. Associate labels/help/errors and announce pending/error state. Reset submitted draft only on success; update list/detail caches consistently.
5. Use Jotai for selected user ID only; Query owns server collections. Provide explicit selection/navigation actions. App composition owns connections between features.
6. Use shadcn/Tailwind with mobile-first responsive layout and functional product copy only. Surface persistence-unavailable feedback in plain language without technical explanations.

## Validation

Run npm run test, npm run typecheck, npm run lint, npm run build. Add focused validation/form tests for boundaries, whitespace, duplicate conflict and draft preservation; inspect route IDs and selection ownership. Final real-browser layout/keyboard checks occur in task 005.
