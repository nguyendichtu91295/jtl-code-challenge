# Task

## Goal

Verify input focus, the unified list and 50-task usability on mobile and desktop.

## Scope

VALIDATION. Follow plan `.ai/plans/003-task-list-polish.md`, `.ai/ai_workflow.md` and `.ai/coding_convention.md`. Execute only when requested and dependency task-015-unified-task-list is DONE. Work stays inside the frontend root.

## Target Files

Development/test fixture area if needed; affected components only for scoped corrections; README.md; ai-journey/; task execution records.

## Steps

Run full checks and document actual results. Create deterministic development-only fixtures with 50 mixed-status tasks, including a 200-character prose title and a 200-character unbroken string. Use an isolated local origin or a temporary fixture harness without changing existing user storage; never add bulk fixtures or test controls to production seeds/UI. Record fixture method and remove temporary harnesses before release.

In a real browser at 375×812 and desktop around 1280px, inspect username Dialog and task-title focus, error/disabled states, focus restoration and help-text spacing. Verify the single list, left toggles, status color/shape, all counted filters on one row, distinct zero-result states, and row disappearance/focus after a filtered toggle. Confirm task creation from Done is visible via All and counts agree after create/status/undo.

With 50 records, verify normal page scrolling reaches the final task, no horizontal overflow, full long titles wrap, touch targets remain 44px and toggling is responsive. Add a quick 320px overflow check. No time-based performance claims without measurements. Reuse lower-level tests for injected failures and storage migration. Update README and AI journey to describe the final unified-list behavior and user override of earlier grouping. Record screenshots/observations and known warnings separately from automated results.

## Validation

Run npm run typecheck, npm run lint, npm run test, npm run build. All must pass; inspect browser results as above. Rerun affected checks only if fixes change inputs. Missing browser/fixture evidence must be recorded as a blocker rather than a pass.

## Setup and failure handling

No setup anticipated. Identify any newly required setup explicitly; maximum three total attempts per unresolved operation, initial plus two retries, counted across tools/sessions/task splits. Record diagnosis and attempts. Third failure: mark FAILED, stop and wait for explicit confirmation. Non-setup failure follows the local no-automatic-retry rule.
