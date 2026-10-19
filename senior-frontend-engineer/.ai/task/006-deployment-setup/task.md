# Task: 006-deployment-setup

## Goal

Prepare the intended Vercel project and SPA deployment configuration.

## Scope

SETUP. This task began as PENDING; the user later authorized execution of the full task queue with “continue no stop.” Read `AGENTS.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.ai/plans/001-frontend-challenge.md`. Work only inside the frontend root; preserve existing changes. Execute only when the user authorizes this task or the task queue. Keep execution status and markers synchronized, record actual checks, and update AI journey evidence. Do not mark DONE without successful required validation. Non-setup failures stop the queue and require user confirmation to retry. Any tooling/install/setup encountered has a cap of three total attempts per unresolved operation (initial plus two retries), tracked across commands/tools/sessions; after the third failure mark FAILED, stop, and wait for confirmation. No automatic reset of that counter.

## Dependencies and sequencing

task-005-validation-handoff. The preceding task must be DONE so its contracts, behavior, or release inputs are validated before continuing.

## Target Files

.gitignore; frontend-local vercel.json if needed; ignored local deployment metadata; README deployment notes; this execution record.

## Steps

1. Read .ai/deployment.md and current official CLI help/documentation. Verify intended Vercel account and coding-challenge team; inspect existing intended project/integration to avoid duplicates. Resolve project name/access only from evidence or user input.
2. Use master as the user-confirmed default/production branch. Planning observed local main; inspect actual local/remote identity before release. Do not rename/switch/reset/push branches blindly or overwrite user work. Keep all writes inside the frontend boundary.
3. Determine host root from repository layout (Git root above frontend workspace), npm ci install, npm run build through Turbo, and output apps/web/dist relative to selected host root. Verify actual commands from task 001 and effective dashboard/config precedence.
4. Add ignore rules before generating local metadata. Configure/link only the intended project during authorized execution; no secrets in committed files. Set SPA fallback for direct route loads without intercepting real assets. Public access must match the intended public app; do not modify unrelated/account-wide settings.
5. Record effective settings and release method. This task prepares deployment; publication belongs to task 007. Account/project linking and build configuration are SETUP with the three-total-attempt cap; log each corrective attempt and stop awaiting confirmation at the cap.

## Validation

Run npm ci and npm run build if release inputs or install/configuration changed; reuse unaffected recorded checks. Inspect effective host root/install/build/output/master settings and SPA fallback. Use current CLI help for read-only settings checks; record exact executed commands. No publish command in this task. Verify configuration and ignored metadata contain no exposed secrets.
