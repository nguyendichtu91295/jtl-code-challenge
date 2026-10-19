# Decisions and judgment

## Confirmed user direction

- 2026-10-17: Inspect the frontend challenge and identify decisions needed from the user.
- 2026-10-17: Use `.ai/ai_workflow.md` to create a plan and record open decisions.

## Confirmed follow-up choices

- Use shadcn/ui alongside Tailwind, limited to needed shared primitives; retain responsibility for accessibility and error wiring.
- User overrode the original in-memory-only proposal: keep runtime data in memory and persist confirmed data to localStorage, with safe initialization, version/shape validation, and graceful memory-only fallback.
- Account for blocked storage, quota/write failures, corrupt snapshots, and private-session cleanup without detecting incognito mode. Do not persist optimistic temporary records. Cross-tab synchronization is outside this time box.
- Use library-free validation for two forms and three fields: required/length checks for username and title, required assignee plus API existence check. Validate on submit, revalidate errored fields on change, focus the first error, and preserve failed drafts.

- Username uniqueness is confirmed: check against the current fake API dataset, including restored and newly created users, and reject duplicates before insertion. Surface conflicts beside the username field and preserve input. Case-sensitive matching after trimming is confirmed: `Alice` and `alice` are distinct, while ` Alice ` conflicts with `Alice`. Preserve internal spaces.

- UI must be purely functional: no coding-challenge/demo labels, implementation explanations, reviewer instructions, or visible failure-injection controls. Keep necessary labels, state feedback, and recovery actions. Technical explanations and failure verification belong in developer documentation/tests. This overrides the earlier AI proposal for a visible “fail next creation” control.

- Mobile-first responsive design is confirmed. Design and validate small screens first, then enhance layouts for tablet and desktop without removing core actions. Check wrapping, overflow, touch targets, and navigation at representative viewport widths.

- Planning must explicitly identify setup work. A failed setup operation permits at most three total attempts (initial plus two retries), with recorded diagnostics. After the third failure, stop the task/queue and wait for explicit user confirmation; switching tools or sessions does not reset the count. Recorded in `.ai/ai_workflow.md` and the implementation plan.

- Input limits confirmed: username 1–40 characters and title 1–200 after trimming. Display persistent, accessible helper text beside fields; do not rely on placeholders or errors alone.
- Challenge requirement rechecked: user detail by ID is required; todo detail is not. User confirmed `/users` for creation/selection, `/users/$userId` for detail, and `/todos` for per-user todos, with root redirecting to `/users`. No todo-detail route.

- A deployed version is confirmed scope using Vercel under the `coding-challenge` team. The later “continue no stop” request authorized running the queued setup and release tasks. Setup now uses a new `jtl-frontend-challenge` Vercel project and direct CLI deploys from this workspace; the verified Git remote default is `master`, but the project has no Git integration and no push is planned. Project SSO protection is disabled so the deployed app can be public.

## Settled choices and execution state

- Core application decisions are settled. User chose npm workspaces for simpler setup and sufficient functionality for this project. Use one root package-lock.json; Turborepo coordinates build/lint/check tasks. npm does not support the pnpm workspace:* protocol, so internal packages use matching version ranges.
- The seven task records are complete: tasks 001–007 are DONE, including deployment setup and release.
- The public production URL is https://jtl-frontend-challenge.vercel.app; task 007 recorded HTTP asset/route checks and browser smoke evidence.

## AI contribution and review

AI translated the challenge into a proposed package structure, state ownership model, mutation lifecycle, sequence, and validation strategy. The plan explicitly considers cache isolation when selection changes and removal of only the failed optimistic item.

Implementation and deployment were validated through unit tests, typecheck, lint, production build, browser checks, and public HTTP checks. A mobile overflow found during browser review was corrected. During Vercel setup, CLI flag and path assumptions needed correction; execution logs record each error and successful correction. No setup operation exceeded the three-attempt limit.

- 2026-10-17: User changed the intended repository default branch from main to master. Remote verification confirms `master` is the sole branch and remote HEAD; no local rename or push was needed. The user later authorized execution of the task queue.

- Workflow records live under `.ai/plans/` and `.ai/task/` per user request. AI journey evidence stays in the challenge-required root `ai-journey/` folder and links to those records.

- Task 001 setup is complete with Node 24/npm 11, npm workspaces, Turbo, Vite 8 and supported ESLint 10. No setup operation failed; the metadata lookup timeout was informational only.

- Task 002 implemented and validated the safe, versioned localStorage snapshot fallback and authoritative fake API. Six focused shared-package tests pass.

- Task 003 implemented route navigation in apps/web and passed five focused user tests plus typecheck/lint/build.

- Task 004 added focused optimistic create/rollback and overlapping mutation behavior. Six todo tests and typecheck/lint/build passed.

- Task 005 completed the README/reflections, manual browser validation and final checks. Responsive widths and user/todo flows passed after fixing a 320px overflow. Seventeen feature/shared tests pass.

- Task 006 verified the Vercel team, created and linked the project, prepared SPA/build settings, excluded planning and generated files from the upload, and disabled project SSO protection. A dry-run selected only the frontend workspace.

- Task 007 published deployment `dpl_HtoCwSqbTx7fpa7Z6hCf5nL9ggbx` to https://jtl-frontend-challenge.vercel.app. HTTP assets/routes and a production browser smoke flow passed.


## Task tracking and UX follow-up — 2026-10-17

- User confirmed black primary accents, blank/optional assignee at task creation, doing/done tracking with undo, status icons, clear per-user Doing and Done sections, and deferring the Users listing/creation redesign.
- Toast for successful user fetch remains a proposal; recommend inline loading/list/error states instead of a routine success toast.
- The source seed users are `alex`, `morgan`, and `sam` in `packages/shared/src/seed.ts`; user requested leaving the listing/creation discussion for later.
- Recorded a proposed Unassigned section on `/todos` and left its exact placement as the one open decision before task creation.


## User-first task tracking — 2026-10-17

- User confirmed `/users` as the first screen, a button-triggered smaller create-user flow, Doing/Done counts per user, and each user's task list and task creation from that user's detail.
- This supersedes the earlier proposed optional assignee and Unassigned section. Tasks must remain assigned to the user whose detail is open; no standalone task-creation flow.
- The user selected a shadcn Dialog for create-user to avoid layout shift. A success toast for routine user-fetch completion remains unconfirmed; recommendation: no toast.

- User selected a shadcn `Dialog` for the button-triggered create-user flow to avoid shifting the user list. Ensure the dialog remains usable on mobile and keyboard-accessible.

- User approved the Done palette: green-50 `#f0fdf4` background, green-200 `#bbf7d0` border, green-800 `#166534` label, green-700 `#15803d` icon; task title remains black and Doing stays grey-black.

- User confirmed removal of `/todos`, its Tasks entry button, and the redundant Users navigation button. User detail must provide return navigation. Proposed a left-arrow “Back to users” link targeting `/users`, reliable after direct entry or refresh.

- User approved trying the “Back to users” link above user detail, subject to mobile/desktop UI validation. Successful user creation must close the dialog and remain on `/users`.

- User confirmed skipping success toasts for user fetching. Product decisions for plan 002 are settled for task breakdown.


## User-first task breakdown — 2026-10-17

Planning refinement: one explicit dependency SETUP task precedes feature work, with the three-total-attempt cap. Existing saved v1 data must migrate without resetting users/tasks. Route params own assignment; existing persistence-status Jotai state remains cross-cutting. Batched counts avoid per-user requests; status moves after confirmed success while task creation remains optimistic. These are implementation choices supporting the approved product decisions, not new user approvals. A release task is planned for the existing deployed version and runs only when release/queue execution is requested.


## Follow-up execution — 2026-10-17

Implementation uses disabled Query observers of existing task-detail caches for overview counts plus one batched summary request, avoiding separate pending-count arithmetic. Legacy snapshots migrate without losing saved users/tasks. Follow-up execution stopped at task 011 after three app integration failures; routing test isolation/loading remains to investigate. No deployment performed.


## Task 011 investigation and fix — 2026-10-17

Task 011 test root cause: shared initialized TanStack Router retained its previous route when tests replaced memory history via router.update. The test row names also relied on whitespace across nested content spans. Each test now builds a new router with its desired history, and row assertions match stable usernames. Explicit retry passed all targeted tests.


## Validation and release — 2026-10-17

Task 012 passed at 375×812 mobile and desktop. Verified dialog focus/Escape, create-stay-on-list, detail/back, task status/undo, counts and localStorage persistence. Task 013 published deployment dpl_HTyn3aHCRytStxp1gK8FbggRLTuj to the existing production domain after inspecting project settings and a dry run; production browser smoke did not mutate data.


## Unified list planning — 2026-10-17

The user approved consistent focus styling for all inputs; one task list with a leading clickable status icon; removal of redundant section/pill/action repetition; All/Doing/Done filters with counts under Tasks, black selected state and one full-width mobile row; normal page scrolling for 50 tasks; full multiline task titles including wrapping unbroken strings, with fixed-size status touch targets. This supersedes plan 002 grouping. Plan 003 separately labels implementation defaults (All by default, stable order, focus management, selecting All on valid creation).


## Task 014 implementation — 2026-10-17

Both product inputs now use one two-pixel black focus border within the field bounds; input outlines are suppressed by the input-specific global rule. The shared focus rule remains in place for buttons and other controls.


## Task 015 implementation — 2026-10-17

Implemented the approved single list and counted filters. The selected filter belongs to the user workspace, resets when its keyed user changes, and valid task creation selects All after validation. Filtered status updates restore focus to the next visible task, then the previous task, then the selected filter when necessary; focus is left alone if the user moves it while the request is pending.


## Task 016 validation boundary — 2026-10-17

The temporary 50-task fixture was served on isolated local port 5174, then removed before final build. Browser observations verified wrapping, scrolling, filters, status/focus behavior and task creation from Done. On an explicit fresh-tab retry, the documented viewport control enabled exact 375×812 mobile, 1280×800 desktop and 320×812 overflow checks; all passed without horizontal overflow. Task 016 is DONE; deployment task 017 remains pending.


## Shared user identity — 2026-10-18

User confirmed every displayed username uses a shared neutral circular avatar with a person icon, including future display sites. UserIdentity belongs to the shared package so users and todos remain independent. The avatar is decorative; editable username input remains plain. Size variants are implementation defaults. Task status icons align with the first line of the title while retaining 44px tap targets and full multiline wrapping. These are approved design decisions, not implemented results.


## Identity implementation and browser findings — 2026-10-18

UserIdentity is the shared presentation component for every username display; its decorative avatar sizes are 24px compact, 32px list and 40px heading. Browser validation drove a narrow-screen row correction so task counts wrap below the identity instead of squeezing names. A real keyboard check also caught an existing mutation-callback lifetime issue in filtered task lists; awaiting the mutation before notifying the parent preserves focus after the row unmounts. Measured icon alignment is centered on the first line with 44px controls.
