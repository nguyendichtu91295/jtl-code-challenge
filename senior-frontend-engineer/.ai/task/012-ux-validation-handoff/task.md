# Task

## Goal

Validate the complete user-first flow and update handoff evidence.

## Scope

VALIDATION. Focused regression fixes within approved scope, responsive/keyboard checks and documentation; no publishing.

Follow `.ai/ai_workflow.md`, `.ai/coding_convention.md` and plan `.ai/plans/002-task-tracking-ux.md`. Work only inside the frontend root. Execute only after requested and dependency task-011-user-first-flow is DONE.

## Target Files

README.md; ai-journey/README.md; prompts.md; decisions.md; toolchain.md; affected app/component tests; task execution records.

## Steps

1. Run the complete available checks once and record actual results; rerun affected checks only after changes or unresolved failures.
2. Use a real browser for a small flow at mobile (~375px) then desktop (~1280px): / opens users, Add user dialog keyboard/focus/escape works without shifting the list, create closes and stays on /users, row shows counts, detail has a clear Back to users link, fixed-user task creation appears immediately, Mark done and Undo move between sections and reconcile overview counts.
3. Verify direct detail entry/reload/back, persisted statuses after refresh, long titles/usernames, narrow viewport overflow and dialog fit. Inspect black accents, exact subtle-green status treatment and visible focus. Verify old /todos is no longer a product route or navigation entry.
4. Use lower-level tests for injected failures, legacy storage migration and overlapping mutations; do not add product failure controls. Verify storage fallback remains usable. Record browser checks separately from unit results; do not claim browser validation if tooling is blocked.
5. Update short README architecture/Jotai/validation trade-offs and AI journey links, prompts and decisions. Preserve original evidence and explain that user-first behavior supersedes optional-assignee proposals. Record release readiness without marking deployment complete.

## Validation

Run npm run typecheck, npm run lint, npm run test, npm run build. Expect all passing, mobile/desktop flow and keyboard checks recorded with actual observations, no cross-feature dependency, no data loss and no regressions in required optimistic creation.

Record results in execution.md. Non-setup failure stops the queue without automatic retries. Any setup operation has three total attempts maximum across tools/sessions; after the third failure stop and await explicit user confirmation.
