# Task

## Goal

Implement a shared avatar-and-username identity at every display site.

## Scope

IMPLEMENTATION. Follow .ai/plans/004-user-identity-alignment.md, .ai/ai_workflow.md and .ai/coding_convention.md. Work stays inside the frontend root. Execute only when requested and dependencies are DONE.

## Target Files

New packages/shared/src/ui/UserIdentity.tsx; packages/users/src/components/UserList.tsx and UserPages.tsx; packages/todos/src/components/CreateTodoForm.tsx; affected existing tests.

## Steps

Create a typed, stateless shared UserIdentity component with a neutral circular avatar, existing Lucide person icon and username. Centralize neutral colors/spacing and compact/list/heading sizes (suggested 24/32/40px avatar). Use inline-compatible markup, a decorative aria-hidden icon and no extra focus target. Preserve heading/button semantics and accessible names. Allow full 40-character unbroken usernames to wrap; avatar must not shrink. Replace username displays in user list, user detail heading and Assigned to text; search for any additional displayed usernames. Keep the create-user input plain. Keep feature packages independent by importing shared. Do not add dependencies, image loading, new user fields or storage changes. Record the reusable display rule in AI journey.

## Validation

Run npm run typecheck and npm run lint. Run npm run test --workspace=@jtl/users and npm run test --workspace=@jtl/web for accessible-name/navigation regressions, plus the existing CreateTodoForm tests if markup assertions change. Inspect all username display usages and shared package imports. Full visual validation is task 020.

## Setup and failure handling

No setup anticipated. If required, identify and record it separately. Maximum three total attempts per unresolved setup operation, initial plus two retries across commands/tools/sessions/task splits. Diagnose before retrying; after the third failed attempt mark FAILED, stop and await explicit confirmation. Non-setup failed tasks require explicit retry authorization.
