# Task: 007-release

## Goal

Publish the app and verify the deployed version before recording completion.

## Scope

RELEASE. This task began as PENDING; the user later authorized execution of the full task queue with “continue no stop.” Read `AGENTS.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.ai/plans/001-frontend-challenge.md`. Work only inside the frontend root; preserve existing changes. Execute only when the user authorizes this task or the task queue. Keep execution status and markers synchronized, record actual checks, and update AI journey evidence. Do not mark DONE without successful required validation. Non-setup failures stop the queue and require user confirmation to retry. Any tooling/install/setup encountered has a cap of three total attempts per unresolved operation (initial plus two retries), tracked across commands/tools/sessions; after the third failure mark FAILED, stop, and wait for confirmation. No automatic reset of that counter.

## Dependencies and sequencing

task-006-deployment-setup. The preceding task must be DONE so its contracts, behavior, or release inputs are validated before continuing.

## Target Files

Intended Vercel deployment; README.md production URL; ai-journey release evidence; this execution record.

## Steps

1. Only execute after user authorization includes release scope and task 006 is DONE. Inspect exact release inputs and intended project/remote/master branch. Reuse unchanged passing checks; run affected checks for new changes.
2. Publish using the verified release method and current CLI documentation. If Git integration already triggers the deployment, do not create a duplicate. Never force-push or overwrite remote work; if pushing is needed, inspect remote state and only include reviewed authorized files.
3. Monitor readiness and deployment logs; verify that the release corresponds to intended inputs. A failed release stops the queue; do not automatically restart a FAILED task. Any newly encountered setup operation still follows the three-attempt cap.
4. Verify public HTTP responses and redirects, delivered HTML, referenced JavaScript/CSS response status and content types, and direct-route responses for /users, /users/<known-id>, /todos. On a fresh origin use an existing seeded user ID for detail validation.
5. Confirm route refresh and basic deployed user/todo flow in the browser, preserving the mobile-first review scope. HTTP alone is not visual/interaction evidence. Record any blocking gap accurately.
6. Record actual URL, effective deployment identity, validation commands/results and browser checks. Explain origin-scoped storage in developer documentation only. Mark DONE only after release verification succeeds.

## Validation

Use current verified deployment CLI commands and record them verbatim without credentials. Use curl -I / curl -fsS against the actual URL/routes/assets (or equivalent HTTP tools), checking redirects and content types. Run a focused deployed browser smoke check. Re-run npm run typecheck/lint/test/build only when release input changes warrant it. Verify README links to the real working deployment.
