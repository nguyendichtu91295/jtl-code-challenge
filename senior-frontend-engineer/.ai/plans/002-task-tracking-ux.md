# Task tracking and UX follow-up plan

Date: 2026-10-17
Status: Complete. Tasks 008–013 DONE; task 011 test issue fixed, responsive/browser validation passed, and production release verified.

## Goal

Make the user list the starting point, provide a compact user-creation flow, and let each user own the view and creation flow for their tasks.

## Background and current behavior

- The current app seeds `alex`, `morgan`, and `sam` from `packages/shared/src/seed.ts`; they are local fake API data, not users fetched from a remote service. Created records are best-effort persisted to localStorage.
- `/users` currently lists and creates users. `/todos` relies on a globally selected user, and its empty-state action sends the user to `/users`. Task creation currently lives on the standalone Tasks route and requires an assignee.
- Tasks currently have no status field or completion action. A user's tasks render as one flat list with generic empty-state copy.
- The shared challenge requires creating users, viewing a user by ID, creating ToDoItems assigned to a user, and listing ToDoItems assigned to a given user.

## Confirmed product direction

- Use black for the primary accent color. For Done status, use a subtle green treatment: green-50 background (`#f0fdf4`), green-200 border (`#bbf7d0`), green-800 text (`#166534`), and a green-700 icon (`#15803d`). Keep task titles black. Doing stays neutral grey-black.
- Make `/users` the first screen. Keep the user list primary; start the smaller user-creation flow from a button on that screen.
- Remove the standalone `/todos` route and its Tasks entry button. Remove the redundant Users navigation button as well. Keep the root redirect to `/users`.
- Show a left-arrow “Back to users” link above the user-detail heading, targeting `/users`. User approved trying this placement; verify that it reads naturally in the mobile and desktop UI.
- After successful user creation, close the dialog and stay on `/users`. Show the newly created user in the list with Doing 0 and Done 0; preserve the dialog and draft when creation fails.
- Tasks always belong to a user. Start task creation from that user's detail view, with the viewed user assigned automatically. There is no unassigned task flow and no standalone task-creation page.
- Track two statuses: `doing` and `done`. New tasks start as `doing`; users can mark a task done and undo it back to doing.
- Pair each status with an icon. Keep the status and action clear to assistive technology and do not rely on color alone.
- Show each user's Doing and Done task counts on the user list, including zero counts.
- On a user detail view, show that user's tasks in separate, clearly labeled Doing and Done sections, with task creation available there.
- Use distinct copy for empty sections so “no tasks” and existing tasks/completed tasks cannot be confused.
- Skip success toasts for user fetching; use inline loading, empty, and error states.

## Proposal

- Above the user-detail heading, show a left-arrow icon with the visible label “Back to users”, linked explicitly to `/users`. This provides a reliable destination after refresh or direct entry; avoid relying only on browser history, which could return to an unrelated site. Use a semantic link with a mobile-friendly touch target. This presentation is approved for implementation and visual validation.

- The `/users` list is the overview. A clear “Add user” button opens a compact, accessible shadcn `Dialog`. The overlay keeps the list layout fixed and avoids content shifting; make the dialog fit the mobile viewport and support keyboard focus/escape behavior.
- Show counts with explicit labels, for example `Doing 2` and `Done 1`, rather than ambiguous task totals. Counts reflect the same data used by user detail.
- Make `/users/$userId` the task workspace for that person: show their detail, their Doing and Done lists, and a “Create task” action. The form assigns new work to this user automatically; do not route away to choose an assignee.
- Compose the user detail and todo feature at the `apps/web` route layer so `packages/users` and `packages/todos` remain independent. Remove the `/todos` route and both Tasks and Users navigation buttons, as confirmed.
- Add `status: "doing" | "done"` to tasks, defaulting new tasks to `doing`. A task action says “Mark done”; a done task action says “Undo” and returns it to Doing.
- Give Doing and Done sections counts and different empty copy, such as “No tasks in progress” and “No completed tasks yet.” Keep visible status text alongside icons or provide accessible names.
- Do not show a toast for routine successful user fetching. The list appearing communicates success; retain inline loading, empty, and error states. Revisit mutation toasts only if inline feedback proves insufficient.
- Replace blue primary, active-navigation, and focus accents with black or neutral dark tones. Use the confirmed subtle green palette for Done only. Preserve visible focus, contrast, and semantic error feedback.
- Seed users come from `packages/shared/src/seed.ts`; they are local examples. Defer additional user-list copy about sample data until that content is discussed further.

## Scope

- User-list-first navigation and a button-triggered compact user-creation flow.
- Per-user Doing/Done overview counts and detailed task sections.
- Task creation from a user detail only, automatically assigned to that user.
- Doing/Done persistence, status changes, undo, icons, and distinct empty states.
- Black primary accents across shared UI and navigation.
- Tests for status transitions, persistence, optimistic create/rollback compatibility, required assignment, user isolation, per-user counts, and empty states.

## Out of scope

- Unassigned tasks or a standalone task-creation page.
- Toast for successful user fetching.
- Authentication, a real backend, task deletion/editing, extra status states, or automatic Git deployment.

## Target files or areas

- `packages/shared/src/types.ts`, `seed.ts`, `fakeApi.ts`, and their tests for task status, migration-safe snapshot validation, status updates, and counts by assignee.
- `packages/todos/src/validation.ts`, `components/CreateTodoForm.tsx`, `components/TodoList.tsx`, and relevant hooks/tests for user-bound creation, status mutation/undo, grouping, and empty states.
- `packages/users/src/components/UserPages.tsx`, `UserList.tsx`, and `CreateUserForm.tsx` for the primary list, counts, and button-triggered compact user creation.
- `apps/web/src/App.tsx` for `/users` as landing and app-layer composition of user detail with todo features; remove `/todos` and both top-level navigation buttons; provide the detail-to-overview return link.
- `apps/web/src/index.css` and shared UI components for black accents, accessible focus, and status presentation.
- `README.md`, `.ai/task/` execution records, and `ai-journey/` after implementation is authorized.

## Implementation approach and sequencing

- Keep feature packages independent. The app composes user detail with the todo workspace and supplies task summaries to the user overview through typed props. Users must not import todos or vice versa.
- Add shared task status types and a batched per-user summary API/query; do not issue one request per user. Explicit zero counts apply only once summaries load; show loading/error/retry instead of falsely displaying zero on failure.
- Preserve the existing storage key `jtl-people-tasks:v1`, read and validate version-1 snapshots, normalize their tasks to `doing`, and write version-2 snapshots on confirmed mutations. Never reset valid existing users/tasks merely because status is missing in a legacy snapshot. Validate version-2 status values. Retain memory fallback when storage access fails.
- Keep optimistic creation, adding `doing` to pending records. Reconcile or remove only the affected temporary item. Keep summary counts coherent with pending creation and rollback; derive pending contributions from mutation state rather than persisting them. Confirmed summaries are refreshed after mutations settle, without double counting confirmed and pending records.
- Status updates use confirmed results rather than optimistic movement: disable the affected row while saving, keep it in its original section until success, then update that item and summaries. On failure retain its original state and show a retryable inline error. Disable status actions on temporary tasks. Avoid whole-cache rollback or refetches that erase concurrent pending creates.
- Route user ID is authoritative for task creation and queries. Remove obsolete selected-user navigation state if unused. Retain Jotai for the existing cross-cutting persistence-status concern (fake API reports storage availability; application banner subscribes); do not invent a duplicate route-state owner.
- Use a shared shadcn-style Radix Dialog for Add user. Keep form validation local, preserve case-sensitive trimmed username uniqueness (1–40 characters), and title limits (1–200), with visible help text. Keep successful creation on `/users`; failed submissions retain the draft.
- Render the fixed assignee visibly in task creation without a selector. An inline title form inside user detail is sufficient; the confirmed Dialog decision applies to user creation.
- Apply black accents and exact approved green hex tokens. Use Lucide CircleDashed for Doing and CircleCheck for Done, accompanied by status text; Undo remains available on every confirmed Done task.
- Remove `/todos` and both header navigation buttons. Old `/todos` URLs use the existing not-found handling; no new redirect route is required. Keep root redirect and an explicit semantic Back to users link, including on missing-user/error screens.

## Setup identification

Task 008 is SETUP: declare the missing Dialog primitive dependency and direct Lucide dependencies in their consuming workspace packages, update the npm lockfile, and verify the existing baseline. No package-manager or deployment reconfiguration is planned. Shared Dialog UI implementation belongs to task 011.

Each unresolved setup operation has at most **three total attempts**, including the initial attempt, counted across tools, sessions, and tasks. Diagnose and record each attempt. After the third failure mark FAILED, stop the queue, and await explicit user confirmation. Stop earlier for missing authorization or decisions. Non-setup failures stop without automatic retries.

## Task breakdown

Execute sequentially only after execution is requested. Existing tasks 001–007 remain unchanged.

| Task | Kind | Deliverable | Depends on |
| --- | --- | --- | --- |
| [008](../task/008-dialog-dependency-setup/task.md) | SETUP | Dialog/icon dependency declarations and baseline | 007 |
| [009](../task/009-task-status-data/task.md) | FEATURE | Status API, safe persistence migration, batched counts | 008 |
| [010](../task/010-task-tracking-ui/task.md) | FEATURE | Fixed-user tasks, Doing/Done, actions and cache consistency | 009 |
| [011](../task/011-user-first-flow/task.md) | FEATURE | Dialog, overview counts, detail composition, routing and black theme | 010 |
| [012](../task/012-ux-validation-handoff/task.md) | VALIDATION | Regression checks, focused browser QA, handoff evidence | 011 |
| [013](../task/013-ux-release/task.md) | RELEASE | Publish validated changes to the existing deployment | 012 |

Planning does not authorize publishing. Task 013 runs only when deployment or execution of this queue is requested, following `.ai/deployment.md`.

## Open questions and risks

No blocking product questions remain. Dependency versions and existing deployment identity must be verified during execution. Main risks are losing old saved records, stale counts or overlapping mutation races, dialog keyboard/mobile usability, and accidental cross-feature imports. Tasks below explicitly validate these risks. Existing seed users remain; no explanatory demo/challenge copy or user-fetch success toast is added.

## Validation

- Unit/API tests: new tasks default to `doing`; status changes persist; undo restores `doing`; task assignee is required and set from the user detail; per-user counts are accurate; old snapshots load; optimistic creation still reconciles or rolls back correctly.
- Component tests: the list is primary; user creation stays closed until its button is activated; successful creation closes the dialog, displays the new user with zero counts, and keeps `/users`; failed creation retains the dialog and draft; counts are accurate; task creation from detail uses the correct user and does not navigate away; Doing/Done sections have accurate counts and distinct empty copy; status controls and icons have accessible names.
- Run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build`.
- Verify that `/users` is the entry screen, the redundant navigation buttons are absent, and the detail return link works after direct entry and refresh.
- Browser checks only for interaction, navigation, and responsive behavior not established by component tests.

## Decision status

Product decisions are settled for task breakdown. User creation uses a shadcn `Dialog`; successful user fetches do not show a toast. Validate spacing and the approved “Back to users” placement on mobile and desktop during implementation.


## Status color decision — 2026-10-17

The user approved a subtle green for Done: green-50 background (`#f0fdf4`), green-200 border (`#bbf7d0`), green-800 label text (`#166534`), and green-700 icon (`#15803d`). Keep task titles black; Doing remains grey-black.
