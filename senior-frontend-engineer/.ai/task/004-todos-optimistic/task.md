# Task: 004-todos-optimistic

## Goal

Implement per-user todos and resilient optimistic creation.

## Scope

IMPLEMENTATION. Read `AGENTS.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.ai/plans/001-frontend-challenge.md`. Work only inside the frontend root; preserve existing changes. This task is PENDING and must not execute until the user confirms execution. Keep execution status and markers synchronized, record actual checks, and update AI journey evidence. Do not mark DONE without successful required validation. Non-setup failures stop the queue and require user confirmation to retry. Any tooling/install/setup encountered has a cap of three total attempts per unresolved operation (initial plus two retries), tracked across commands/tools/sessions; after the third failure mark FAILED, stop, and wait for confirmation. No automatic reset of that counter.

## Dependencies and sequencing

task-003-users-routing. The preceding task must be DONE so its contracts, behavior, or release inputs are validated before continuing.

## Target Files

packages/todos/src components/hooks/api/types/validation and integration tests; apps/web todo composition.

## Steps

1. App composition fetches user options through users hooks and passes typed options to todo UI. Never import users from todos. Query owns lists keyed by assignee; Jotai owns selected user ID.
2. Implement title/assignee form and list with loading/empty/error/retry states. Trim title to 1–200 characters; display '1–200 characters.' helper text and a labeled required assignee. Preserve draft on failure, focus validation errors, and disable duplicate pending submissions.
3. Capture assignee in mutation variables and switch visible selection to that assignee on submission if necessary. Cancel its in-flight list query, then insert a unique pending temporary item even if cache is absent.
4. Replace only the matching temporary entry on success. On failure remove only that entry, preserve unrelated data and draft, and show retryable inline feedback. Invalidate only the affected assignee after settlement. Choose and document guarded invalidation or per-assignee serialization so other pending mutations survive reconciliation.
5. Selection changes/navigation during requests must not redirect updates to the wrong cache. Persist only successful API records. Failure injection lives in tests/developer configuration, never a visible demo control.
6. Add integration tests against real hooks with isolated Query clients and controlled API promises. Cover pending insertion, success replacement/no duplicates, rollback/draft preservation, absent cache, selection switches and the chosen concurrency policy.

## Validation

Run npm run test, npm run typecheck, npm run lint, npm run build. Required mutation tests must pass and demonstrate immediate pending insertion before promise settlement and no persisted record on simulated failure. Inspect package dependencies for forbidden feature coupling.
