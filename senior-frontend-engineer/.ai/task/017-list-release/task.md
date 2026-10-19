# Task

## Goal

Publish the validated list refinement to the existing production app.

## Scope

RELEASE. Follow plan `.ai/plans/003-task-list-polish.md`, `.ai/ai_workflow.md` and `.ai/coding_convention.md`. Execute only when requested and dependency task-016-list-validation is DONE. Work stays inside the frontend root.

## Target Files

.ai/deployment.md; vercel.json; .vercelignore; README.md; ai-journey/; this task execution record.

## Steps

Execute only when the user requests deployment or execution of this queue. Read .ai/deployment.md and previous task 013 release evidence. Verify intended account/team and existing coding-challenge/jtl-frontend-challenge project; do not create another project. Existing URL is https://jtl-frontend-challenge.vercel.app.

Inspect current CLI help and project settings: npm ci, npm run build, apps/web/dist, frontend workspace root, SPA fallback. Review a dry run and confirm credentials, env, local metadata, caches, fixtures/harnesses, tests and build output are excluded appropriately. Reuse task 016 validation if release inputs are unchanged.

Deploy through the existing direct CLI path after validation; monitor READY and alias. Verify public HTML and JS/CSS responses/types, /users and direct detail loading, filter/status UI on production and a brief responsive smoke. Avoid mutating existing production user records. Record URL, deployment ID, verified behavior and any limitations. No setup expected; if new setup is required enforce three total attempts across tools/sessions and stop at failure cap.

## Validation

Record dry-run inputs, remote build/READY, HTTP asset checks and production browser evidence. Mark DONE only after verification. Non-setup release failure stops without automatic retry.

## Setup and failure handling

No setup anticipated. Identify any newly required setup explicitly; maximum three total attempts per unresolved operation, initial plus two retries, counted across tools/sessions/task splits. Record diagnosis and attempts. Third failure: mark FAILED, stop and wait for explicit confirmation. Non-setup failure follows the local no-automatic-retry rule.
