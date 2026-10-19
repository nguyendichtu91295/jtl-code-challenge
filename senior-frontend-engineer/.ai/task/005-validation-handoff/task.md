# Task: 005-validation-handoff

## Goal

Validate required flows and prepare submission documentation/evidence.

## Scope

VALIDATION / DOCUMENTATION. Read `AGENTS.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.ai/plans/001-frontend-challenge.md`. Work only inside the frontend root; preserve existing changes. This task is PENDING and must not execute until the user confirms execution. Keep execution status and markers synchronized, record actual checks, and update AI journey evidence. Do not mark DONE without successful required validation. Non-setup failures stop the queue and require user confirmation to retry. Any tooling/install/setup encountered has a cap of three total attempts per unresolved operation (initial plus two retries), tracked across commands/tools/sessions; after the third failure mark FAILED, stop, and wait for confirmation. No automatic reset of that counter.

## Dependencies and sequencing

task-004-todos-optimistic. The preceding task must be DONE so its contracts, behavior, or release inputs are validated before continuing.

## Target Files

README.md; ai-journey/*; task execution records; small fixes in affected feature/UI files when evidence requires them.

## Steps

1. Run the relevant final static/behavior/build checks and record actual results, fixing scoped issues and rerunning only affected checks.
2. Perform manual browser validation mobile-first at 320px and representative tablet/desktop widths: no horizontal overflow, readable wrapping, comfortable touch targets and usable navigation/forms. Verify keyboard operation, labels/help/errors, first-error focus, loading/empty/retry and not-found states.
3. Exercise create/select/view user, direct-route refresh, per-user todo creation, immediate pending state, success and rollback/draft retention, using only test/developer failure configuration outside rendered UI. Verify refresh persistence and memory fallback. If manual browser access is unavailable, record the gap and stop rather than claiming completion. No broad browser automation by default; focused behavior tests plus manual visual/keyboard checks are proportionate.
4. Inspect dependency boundaries and user-facing copy: no challenge/demo/architecture explanations or failure switches. Functional field guidance remains required.
5. Write approximately half-page architectural README plus install/run commands and 2–3 sentences/bullets each for performance and production testing reflections. Explain package split, npm/Turbo roles, Query/Jotai ownership, validation, storage limitations and concurrency policy. Deployment URL follows in task 007.
6. Update actual prompts/toolchain/user overrides and link the plan plus all task/execution records from ai-journey. Keep planned and completed checks distinct.

## Validation

Run npm run typecheck, npm run lint, npm run test, npm run build; reuse unchanged passing evidence where appropriate. Run npm run dev for the focused manual flow, then stop it. Verify documentation links/scripts and required reflections. Record viewport and manual-flow results; no application-complete claim if required validation remains unavailable.
