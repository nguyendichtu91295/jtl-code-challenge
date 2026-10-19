# Task: 002-data-persistence

## Goal

Build the seeded fake API and resilient persistence foundation.

## Scope

IMPLEMENTATION. Read `AGENTS.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.ai/plans/001-frontend-challenge.md`. Work only inside the frontend root; preserve existing changes. This task is PENDING and must not execute until the user confirms execution. Keep execution status and markers synchronized, record actual checks, and update AI journey evidence. Do not mark DONE without successful required validation. Non-setup failures stop the queue and require user confirmation to retry. Any tooling/install/setup encountered has a cap of three total attempts per unresolved operation (initial plus two retries), tracked across commands/tools/sessions; after the third failure mark FAILED, stop, and wait for confirmation. No automatic reset of that counter.

## Dependencies and sequencing

task-001-workspace-setup. The preceding task must be DONE so its contracts, behavior, or release inputs are validated before continuing.

## Target Files

packages/shared/src mock transport, seed, storage adapter, errors and tests; feature API/type modules as needed.

## Steps

1. Define typed user and todo transport contracts and API wrappers without cross-feature imports. Separate seed data from UI; add controllable latency/failure injection for tests only.
2. Keep the authoritative runtime dataset in memory. Read a namespaced versioned localStorage snapshot once; validate shape, IDs, username uniqueness and assignee references. Fall back safely for missing/corrupt/unsupported data. Never clear unrelated storage.
3. After successful mutations persist confirmed data best-effort. Catch access/parsing/quota/write failures; continue serving memory data and expose persistence status for a plain-language UI notice. No incognito detection or cross-tab sync.
4. Create users after trimming only leading/trailing whitespace, enforcing 1–40 characters and case-sensitive uniqueness against the current dataset. Check and insert without an asynchronous gap after simulated latency. Alice and alice differ; ' Alice ' conflicts with Alice.
5. Create todos with trimmed titles of 1–200 characters and existing assignee IDs. Provide list-by-user and user-by-ID reads with typed errors. Failed requests must not mutate/persist records. No optimistic temporary records enter storage.
6. Add focused adapter/API tests for persistence failure and domain consistency; avoid a migration framework.

## Validation

Run npm run test, npm run typecheck, npm run lint, npm run build. Test valid restoration, malformed JSON/schema/version, unavailable storage and failed writes; assert successful in-memory mutations remain successful. Test trimmed/case-sensitive duplicates including concurrent creation, assignee existence, and failure before persistence.
