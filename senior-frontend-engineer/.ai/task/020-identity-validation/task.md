# Task

## Goal

Verify avatar consistency, accessible names and task alignment on mobile and desktop.

## Scope

VALIDATION. Follow .ai/plans/004-user-identity-alignment.md, .ai/ai_workflow.md and .ai/coding_convention.md. Work stays inside the frontend root. Execute only when requested and dependencies are DONE.

## Target Files

Affected components only for scoped corrections; temporary development fixture if necessary; ai-journey/; task execution records.

## Steps

Read plan 004 and previous task 017 overflow evidence. Use an isolated local origin or disposable development fixture, including short and 40-character unbroken usernames plus one-line, 200-character prose and unbroken task titles with both statuses. Check user rows, detail heading and Assigned to identity; all visible usernames must use the same avatar pattern. Measure 375×812, 1280×800 and 320px viewports using the documented browser viewport capability. Inspect full-name wrapping, counts, no horizontal overflow, nonshrinking avatars, 44px controls, first-line icon center alignment, focus outlines and row/error spacing. Verify headings/button names have one username and decorative icons add no focus stop or spoken label. Exercise keyboard status toggle and filtered focus restoration on disposable local data. Record actual evidence and fixture method; remove fixtures before final build and reset viewport override. Do not modify existing production data. Missing browser evidence blocks completion.

## Validation

Run npm run typecheck, npm run lint, npm run test and npm run build after fixture removal. Record all results and existing warnings accurately. Record browser dimensions and icon/line-box geometry, screenshots or observations; only mark DONE when checks pass. Update AI journey with findings.

## Setup and failure handling

No setup anticipated. If required, identify and record it separately. Maximum three total attempts per unresolved setup operation, initial plus two retries across commands/tools/sessions/task splits. Diagnose before retrying; after the third failed attempt mark FAILED, stop and await explicit confirmation. Non-setup failed tasks require explicit retry authorization.
