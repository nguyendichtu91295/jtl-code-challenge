# Input focus and unified task list

Date: 2026-10-17
Status: Tasks 014–017 DONE.

## Goal

Simplify task detail into one readable list, make status changes available through a leading icon, and keep inputs and long task lists usable on mobile.

## Background and current behavior

The user supplied a screenshot showing the heavy input focus treatment and repeated Doing badges below tasks already grouped under Doing. Current shared Input changes its border on focus while global CSS adds a 3px outline with a 2px offset, producing multiple visible contours. The precise visual fix must be checked in a real browser; this is not yet evidence of an input width calculation error.

TodoList currently partitions all records into Doing and Done sections. Each row repeats a status pill and has a separate right-side Mark done/Undo button. TodoWorkspace renders an inline create card before the task card on mobile and beside it on desktop. All tasks render without pagination; 50 tasks make the document longer.

## Confirmed decisions

- Fix focus styling consistently for every product input, including username in the Dialog and task title in detail. Keep a clearly visible keyboard focus indicator without the heavy overlapping/double outline.
- Replace the two status sections with a single task list.
- Each task has a clickable status icon on the left to toggle Doing/Done. Remove the redundant status pill and separate right-side action button.
- Keep primary styling black. Doing uses a neutral CircleDashed; Done uses green CircleCheck and the existing subtle green palette where needed. Icon shape and accessible state/name convey status beyond color.
- Place a compact All / Doing / Done segmented filter immediately below a Tasks heading and above the list. Every option shows its count. Selected is black with white text; unselected options use neutral styling and clear boundaries. At mobile width all three share one full-width row.
- Keep overview Doing/Done counts on user rows.
- Render all 50 tasks with normal page scrolling and filters; no pagination, virtual scrolling or separately scrolling list panel.
- Long titles remain fully visible, wrapping onto multiple lines. Do not truncate, clamp or add ellipses. Unbroken text must wrap within the available width. Keep the left status control fixed-size and easy to tap; retain the 200-character limit.

These decisions supersede the separate Doing/Done sections in plan 002; that completed plan remains historical evidence.

## Scope and target areas

- `packages/shared/src/ui/Input.tsx`, `apps/web/src/index.css`: shared focus ownership and existing focus selector interaction.
- `packages/todos/src/components/TodoList.tsx`, `TodoWorkspace.tsx`, `CreateTodoForm.tsx`: row layout, local filter state, counts and creation visibility.
- Todo and app integration tests that currently assert grouped sections or action names.
- README, AI journey and local task execution records.
- Final release to the existing Vercel project after validation and execution authorization.

## Implementation approach

1. Use one deliberate input focus treatment, e.g. a 2px black inset focus ring with no external input outline. Preserve visible focus for buttons and links; do not broadly disable global focus. Check rounded corners and spacing beside help/error text.
2. Keep a single semantic list. Use a native button for the leading icon, with a minimum 44×44px hit area, visible keyboard focus and an accessible name conveying the action and title. CircleCheck means Done; CircleDashed means Doing. Align the control near the first line of a wrapped title. Keep task titles black.
3. Use local filter state owned by the task workspace/list, default All, reset on user change. This is not server data or cross-cutting state; preserve Jotai's existing persistence availability concern. Use a labeled group of buttons with aria-pressed; filtering one list does not need tab panels.
4. Counts derive from the complete current user's task cache, before filtering, including pending creates. Do not introduce another stored task collection or per-filter fetch. Retain current order when toggling within All; do not auto-sort by status.
5. Preserve confirmed status updates, per-row pending protection and inline failure feedback. Disable temporary/pending rows. After successful status change in Doing/Done, the row may leave the filter; keep the selected filter and move focus to the next available status control, then previous if needed, or the selected filter if the list becomes empty. Do not steal focus if the user has already moved elsewhere.
6. On a valid task submission, select All so the optimistic row is included even if Done was selected. Invalid submission keeps the filter. Preserve draft on failure, targeted rollback, successful reconciliation and correct overview counts. Do not introduce automatic scrolling unless needed by demonstrated usability issues.
7. Empty copy reflects the selected filter: no tasks yet, no tasks in progress, or no completed tasks. Always keep the filter control available.
8. Use flexible title width with min-width:0 and overflow-wrap:anywhere as needed. Rows grow vertically; the status control must not shrink. Test spoken labels, 200-character prose and a 200-character unbroken string at 375px.

Items 1 and 3–7 include implementation defaults chosen to make the approved design concrete; they are not additional user quotations.

## Setup identification and retries

No SETUP task is anticipated: existing React, Tailwind, Lucide and Query dependencies are sufficient. Do not install a filter/virtualization/form library. If tooling or dependency setup becomes necessary, identify it explicitly and log attempts. Each unresolved setup operation allows three total attempts (initial plus two retries), across tools, sessions and task splits. Diagnose before retrying. After the third failed attempt mark FAILED, stop the queue and await explicit confirmation. Non-setup failure follows the local stop/no-automatic-retry rule.

## Task breakdown and dependencies

| Task | Kind | Depends on | Deliverable |
| --- | --- | --- | --- |
| [014](../task/014-input-focus/task.md) | FEATURE | 013 | Consistent input focus |
| [015](../task/015-unified-task-list/task.md) | FEATURE | 014 | Leading status toggle, unified list and filters |
| [016](../task/016-list-validation/task.md) | VALIDATION | 015 | 50-task/mobile/long-text checks and handoff |
| [017](../task/017-list-release/task.md) | RELEASE | 016 | Existing production deployment updated and verified |

Tasks 001–013 remain unchanged. Task 017 was gated on validation task 016 and required release authorization. Both gates were satisfied during execution; the release is recorded below and in task 017.

## Validation

- Focused component/integration checks: filter membership/counts from mixed records; zero counts and distinct empties; native keyboard toggle; pending controls; failed status change preserves row/state; completed changes update counts; filtered row removal retains usable focus; creation from Done becomes visible; rollback preserves unrelated tasks; switching users resets filter and never mixes records.
- Reuse existing migration/persistence/cache tests; update obsolete section assertions rather than weakening them. Do not add tests that simply repeat Tailwind class names.
- Full gate: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.
- Focused real-browser checks are necessary for the reported focus geometry, keyboard focus after row removal, mobile wrapping and 50-row scrolling. Inspect both inputs at 375px and desktop, normal/error/disabled states, and focus restoration from Dialog.
- Use deterministic development-only fixtures with 50 mixed-status tasks including 200-character prose and an unbroken title. Keep fixtures out of production seed data and product controls. Use an isolated local origin or explicit test fixture harness; do not alter the user's existing production storage. Record how fixtures were loaded and remove temporary harnesses before release.
- At 375×812 and desktop around 1280px: all filter buttons fit on one row, counts stay visible, no horizontal overflow, full long titles readable, 44px status controls do not shrink, last task reachable with document scrolling. Check All/Doing/Done plus empty filters and status toggles. At 320px add a quick overflow check.
- Final public release: verify existing target/settings, dry-run source set, remote READY, public HTML/assets and direct user detail, then a small production browser smoke check.

## Risks and open questions

No blocking product questions remain. Risks: removing visible action text can reduce discoverability; retain clear icon states and action labels/tooltips. Filtered changes can remove focused controls; manage focus deliberately. Fifty rows can still require substantial scrolling; validate the agreed filters and full-title design without expanding scope to search/pagination. Earlier work left two non-blocking Fast Refresh lint warnings and jsdom scrollTo diagnostics; record accurately if still present.

## Out of scope

Search, pagination, virtualization, nested list scrolling, drag sorting, task editing/deletion, new status values, changing user-first routing, backend/persistence schema changes and changing overview counters.


## Execution update — 2026-10-17

Tasks 014 and 015 completed. Task 016 automated checks passed and the narrow browser run verified list behavior, but required 375×812 and ~1280px desktop evidence could not be captured because the available browser surface has no viewport override. Task 016 is FAILED per the missing-evidence rule; task 017 remains pending. See task execution records for commands and browser observations.

Retry on 2026-10-17 (explicit user request): a fresh Chrome tab exposed the documented browser viewport capability. Exact 375×812 mobile, 1280×800 desktop and 320×812 overflow checks passed; no horizontal overflow was measured. Task 016 is DONE. Task 017 was subsequently completed; see release update below.

## Release update — 2026-10-17

Task 017 deployed to the existing production project. Production smoke testing with existing long task titles found a 2px overflow at 375px; `TodoWorkspace` now declares a single flexible mobile grid track. Full checks and a second production deployment passed. Final production detail measured no horizontal overflow at 375×812; `/users` and direct detail load, root redirects to users, and `/todos` shows Page not found. See task 017 execution record for deployment ID and HTTP checks.
