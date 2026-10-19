# Task

## Goal

Update the existing deployed app with the verified user-first experience.

## Scope

RELEASE. Release only when deployment or execution of this queue is requested. Reuse existing deployment; do not create a second project.

Follow `.ai/ai_workflow.md`, `.ai/coding_convention.md` and plan `.ai/plans/002-task-tracking-ux.md`. Work only inside the frontend root. Execute only after requested and dependency task-012-ux-validation-handoff is DONE.

## Target Files

.ai/deployment.md; vercel.json; .vercelignore; local deployment metadata (never commit/publish credentials); README.md; ai-journey/; this task execution.md.

## Steps

1. Read deployment rules and task 007 evidence; verify current intended Vercel identity/project and release inputs before publishing. Existing target is coding-challenge/jtl-frontend-challenge at https://jtl-frontend-challenge.vercel.app. Treat it as evidence to verify, not permission to alter unrelated projects.
2. Reuse frontend-root deployment with npm ci, npm run build, apps/web/dist output and SPA rewrite. Verify actual effective settings and current CLI help. Do not change Git integration or branch; master is the confirmed production branch when applicable.
3. Review excluded files and ensure credentials, env files, local metadata, dependencies and generated build output are not uploaded as source. Reuse task 012 checks if release inputs are unchanged; rerun affected checks if changed.
4. Publish through the existing authorized release path, monitor ready state and inspect failures. Any newly required setup operation follows the three-total-attempt cap across sessions; log each attempt, stop on third failure and await explicit confirmation. Non-setup release failure stops without automatic retries.
5. Verify public HTTP/HTML/script/style responses and correct content types, direct /users and known user-detail refresh. Use a short live browser smoke check for route/detail/status flow; HTTP alone is not interaction validation.
6. Record actual URL, deployment identifier, effective settings and checks. Mark DONE only after verification; preserve secrets and existing work.

## Validation

Reuse passing task 012 checks for unchanged inputs. Record production HTTP and asset checks plus focused browser results; confirm the deployed UI includes this release. A blocked or failed release stays FAILED, never reported as deployed.

Record results in execution.md. Non-setup failure stops the queue without automatic retries. Any setup operation has three total attempts maximum across tools/sessions; after the third failure stop and await explicit user confirmation.
