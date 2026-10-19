# Task

## Goal

Publish the verified identity and alignment refinement to the existing production app.

## Scope

RELEASE. Follow .ai/plans/004-user-identity-alignment.md, .ai/ai_workflow.md and .ai/coding_convention.md. Work stays inside the frontend root. Execute only when requested and dependencies are DONE.

## Target Files

.ai/deployment.md; vercel.json and .vercelignore inspection; ai-journey/; task execution records.

## Steps

Execute only when the user requests deployment or execution of this queue. Read .ai/deployment.md and task 017 release evidence. Verify the intended account/team and existing coding-challenge/jtl-frontend-challenge project (https://jtl-frontend-challenge.vercel.app); do not create a new project. Inspect current CLI help, effective settings, direct CLI versus Git deployment state and exact dry-run inputs. Expected settings: npm ci, npm run build, apps/web/dist, frontend workspace root and SPA fallback. Exclude credentials/env, local metadata, caches, dependencies, tests, fixtures and prebuilt output. Reuse task 020 checks if inputs are unchanged. Deploy through the existing authorized path, monitor READY and alias. Verify public HTML and script/style responses and types, root/users/direct detail, and production mobile avatar/alignment smoke without mutating existing user records. Record deployment ID, URL, findings and limitations. Restore temporary viewport overrides. Stop and record a failed release/validation rather than automatically retrying.

## Validation

Dry run must contain only intended frontend release inputs. Remote build must reach READY with the existing alias. Public routes/assets and production browser smoke must pass. Update plan/AI journey/task status only after verification.

## Setup and failure handling

No setup anticipated. If required, identify and record it separately. Maximum three total attempts per unresolved setup operation, initial plus two retries across commands/tools/sessions/task splits. Diagnose before retrying; after the third failed attempt mark FAILED, stop and await explicit confirmation. Non-setup failed tasks require explicit retry authorization.
