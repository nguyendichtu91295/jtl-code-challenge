# Frontend challenge implementation plan

Date: 2026-10-17
Status: Planned and broken into PENDING tasks; awaiting explicit user confirmation before execution. No setup started.

## Goal

Deliver the required user and todo application within roughly 2–4 hours of implementation effort. Prioritize independent feature packages, predictable state ownership, and correct optimistic todo creation over extra features.

## Background and current behavior

- The frontend folder currently contains challenge instructions, AGENTS.md, and .ai guidance only. There is no application, package manifest, or existing test setup.
- Sources: `instructions.md`, `../README.md`, `AGENTS.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.ai/deployment.md`.
- React, TypeScript, Vite, Turborepo, TanStack Router, TanStack Query, Jotai, and TailwindCSS are mandatory.
- All changes stay inside this frontend folder. The parent README is reference material only.
- The user requested a plan and an explicit record of decisions needed from them. Confirmed choices and remaining proposals are distinguished below.

## Scope

- Create users by username and view a user by ID.
- Create todos with title and assignee ID; list todos for a selected user.
- Optimistically display new todos immediately, reconcile successful creates, and roll back failed creates.
- Provide meaningful validation, loading, empty, missing-user, and recoverable error states.
- Use semantic HTML, associated labels and errors, visible focus, keyboard-operable controls, and pending/error announcements.
- Provide a small seeded fake API, explicit cache ownership, and deliberate Jotai usage.
- Deliver a short architectural README, local install/run instructions, performance and testing reflections, and ongoing AI journey evidence.
- Deliver a deployed version using the reference Vercel approach in `.ai/deployment.md`, with release checks and production URL recorded. This is planned work only until execution is requested.

## Out of scope

Authentication, real backend, editing/deleting/completing todos, pagination, CI/CD pipeline implementation, elaborate design, exhaustive coverage, and extensive Turborepo caching configuration. Simultaneous cross-tab synchronization and a full storage migration framework are also out of scope.

## Confirmed decisions and remaining questions

Confirmed on 2026-10-17 after the follow-up discussion: use shadcn/ui with Tailwind, persist confirmed data to localStorage with an in-memory fallback, and use library-free form validation. npm is confirmed for simplicity and sufficient workspace support for this project. Username uniqueness against the current dataset is now confirmed. Username length 1–40 and title length 1–200 after trimming are confirmed, with visible field guidance. Username uniqueness is case-sensitive.

| ID | Decision | Recommended default and reason | Alternative / impact |
| --- | --- | --- | --- |
| D1 — confirmed | Refresh persistence | In-memory fake API store backed by best-effort localStorage snapshots. | Handle unavailable storage, corrupt data, quota errors, and private-session lifetime; remain usable in memory. |
| D2 — confirmed | Routing | `/users` for creation/selection, `/users/$userId` for user detail, `/todos` for the selected user's todos; root redirects to `/users`. | No individual todo-detail route. Use the confirmed mobile-first, functional UI direction. |
| D3 — confirmed | Package manager | npm workspaces, one root package-lock.json; chosen for simplicity and sufficient functionality for this project. | Turborepo coordinates scripts; npm handles dependencies and linking. Use matching version ranges for internal dependencies, not workspace:*; the managers are not identical in all features. |
| D4 — resolved UI constraint | How should rollback be verified? | No failure/demo controls in the product UI. Use deterministic test-layer failure injection and document verification in developer documentation. | If manual failure injection is needed, configure it outside the rendered UI. Avoid random failures. |
| D5 — confirmed | Validation policy | Trim leading/trailing whitespace; username 1–40 characters, unique with case-sensitive comparison; title 1–200 characters; assignee must exist. Show visible length guidance beside inputs. | `Alice` and `alice` are distinct; ` Alice ` conflicts with `Alice`. Preserve internal spaces. User IDs remain the identity. |

Confirmed UI choice: use a small set of shadcn/ui primitives with Tailwind; the routing in D2 is confirmed; implement the layout within the agreed mobile-first, functional UI direction.

Implementation choices: use small pure validation functions instead of a form/schema dependency; use typed API errors; keep server data in Query and selection in Jotai. Explain these trade-offs in the README.

## Deployment direction — confirmed, execution deferred

- The user wants a deployed version. Follow `.ai/deployment.md`: Vercel under the reference `coding-challenge` team, verifying the actual account/team and intended project before publishing.
- Explicit current instruction: **record the plan and confirmations only; do not configure, install, link a project, or deploy now**. Deployment is agreed scope for a later execution stage, not an instruction to begin setup in this planning turn.
- During later deployment setup, inspect any existing intended project/integration before creating anything. Resolve the project name, account/team access, repository and the confirmed `master` production branch if Git integration is used, application root, package-manager-specific install/build commands, output path, and public access settings. Ask for user input only where these cannot be safely established.
- Keep configuration and local metadata inside the frontend project boundary. Add ignore rules before generating credentials-related files or local deployment metadata. Do not modify unrelated projects or account-wide settings.
- Account for the repository root being above the frontend workspace and Vite output under `apps/web/dist`; establish the exact host root/build/output combination from the implemented workspace, rather than copying generic Vite settings blindly.
- Configure SPA fallback so direct visits and refreshes on `/users`, `/users/<id>`, and `/todos` load the application, while real assets are served normally.
- Before publishing, run the applicable install/type/lint/test/build checks and review the release inputs. Avoid duplicate releases if an existing Git integration already deploys them.
- Verify readiness, public HTTP access, HTML and referenced assets, and direct-route loading after deployment. Record the final URL and validation results in README, task execution notes, and AI journey evidence.
- Document that localStorage data belongs to the deployed origin and browser; local development data does not automatically transfer to the hosted version.
- Deployment configuration, account/project linking, and initial build settings are **SETUP**, subject to the three-total-attempt cap per failed setup operation. At the cap, stop and await confirmation. Publishing/availability verification is release work; existing failed-task rules apply.

## Target files and areas

```text
package.json, package-lock.json                 # npm workspace manifests and root lockfile
turbo.json, tsconfig.json, eslint.config.js      # minimal shared tooling
.gitignore
apps/web/                                      # Vite app, routes, composition, styling
packages/users/src/                            # components, hooks, api, types, validation
packages/todos/src/                            # components, hooks, api, types, validation
packages/shared/src/                           # query setup, selection, transport/storage, UI primitives
README.md
.ai/plans/001-frontend-challenge.md
.ai/task/                                          # task records created after plan approval
ai-journey/                                    # prompts, tools, decisions, plan/task links
```

Each package gets a manifest and explicit public entry point. Exact filenames can be refined during task creation; preserve these responsibility boundaries.

## Implementation approach

### Package boundaries and composition

- `apps/web` imports feature public APIs and shared infrastructure; owns TanStack routes, app providers, navigation, and page composition.
- `packages/users` owns user types, validation, API wrappers, query keys/hooks, and user UI.
- `packages/todos` owns todo types, validation, API wrappers, query keys/hooks, and todo UI.
- Neither feature imports the other, including deep imports. Enforce this with lint import restrictions and inspect package dependencies.
- The web app obtains user options through a users hook and passes them into the todo form using the form's small typed option contract. Todo code does not fetch through the users package.
- Shared holds Query client setup, selected-user atom, transport errors, and the fake transport/store needed by both feature APIs. It imports neither feature. Keep its API primitive and typed; feature business logic stays in its feature package.
- Fake seed data lives separately from components. The fake transport checks that an assignee exists; feature hooks own query/mutation behavior.

### Persistence and browser compatibility

- Keep runtime data in the fake API's in-memory store. Query caches API results; components do not synchronize localStorage through effects or duplicate collections in React state.
- On initialization, safely read a versioned snapshot containing users and todos. Validate the parsed shape, IDs, and assignee references before accepting it. Use seed data for missing, malformed, or unsupported snapshots; avoid a migration framework for this challenge.
- Guard storage access, JSON parsing, and writes with error handling. An exposed `localStorage` property does not guarantee usable storage.
- After a successful API mutation, update memory and attempt to persist the confirmed snapshot. Storage failure must not turn an otherwise successful in-memory mutation into a failed request. Show a non-blocking persistence-unavailable notice.
- Persist confirmed records only. Optimistic temporary todos stay in Query's cache; simulated failed requests must neither change the fake store nor persist records.
- Private browsing may allow storage for the session and clear it when that session ends. Do not attempt incognito detection or promise persistence after a private session closes.
- Document refresh behavior, storage fallback, version handling, and the absence of cross-tab synchronization. Use a namespaced key and never clear unrelated origin storage.

### Routes and state ownership

- Requirement check: `instructions.md` explicitly requires a user detail view by ID, but only todo creation and a per-user todo list. A todo detail view is not required and is out of scope. Route paths in the challenge are examples, not mandated URLs; the user has confirmed the three-page structure above.

- Use required TanStack Router with typed route params and explicit not-found handling.
- `/users/$userId` uses the route ID as the authority for detail data, independent of the selected-user atom. Invalid/unknown IDs render a useful missing-user state.
- Jotai owns the current user selection used by navigation, the todo page filter, and the todo form's default assignee. Store the ID only, not a duplicate user object or collection.
- Query owns all server users and todos. Use user-specific todo keys, such as `['todos', 'by-user', userId]`, and disable queries when selection is absent.
- User creation invalidates the user list and seeds or invalidates its detail cache. Selecting/viewing a user establishes the todo selection through an explicit navigation action.
- When a todo assignee differs from the current filter, switch the selected user to the submitted assignee so the newly created item is visible immediately. Capture the assignee in mutation variables; subsequent selection changes must not redirect cache updates to another user.

### Optimistic todo creation

1. Validate and capture the submitted draft and assignee. Prevent duplicate submissions while this form's request is pending.
2. Cancel in-flight queries for that assignee's todo list so a stale response cannot overwrite the optimistic entry.
3. Insert a temporary item with a unique client ID and pending marker in that assignee's cache. Retain existing cached items; handle a missing cache as an empty list.
4. On success, replace the matching temporary entry with the API item without duplication. Reset the submitted draft only on success.
5. On error, remove only that mutation's temporary entry, preserve unrelated data and the form draft, and display an inline retryable error.
6. Invalidate the affected assignee's query after settlement to reconcile authoritative data. Prevent reconciliation from erasing other pending creates if overlapping mutations are possible; either guard invalidation until the last matching mutation settles or serialize per-assignee submissions.

Document the chosen concurrency policy. Changing selection or leaving a page must not corrupt another user's cache. Inject failures deterministically through tests or developer configuration outside the rendered UI; the fake API must fail before persisting.

### Forms, errors, and presentation

- Confirmed layout requirement: mobile first, then progressively enhance for tablet and desktop. Start with a single-column layout and full-width form controls where appropriate; introduce additional columns or wider navigation only when space supports them. Preserve all core actions at every viewport size, allow readable wrapping, avoid horizontal page overflow, and provide comfortable touch targets. Desktop uses the same features and state model.
- Confirmed UI requirement: a purely functional product interface. Do not display coding-challenge, demo, take-home, evaluation, architectural, or implementation-explanation copy. Do not add demo badges, failure switches, tooling descriptions, or reviewer instructions to the UI.
- Keep only useful task controls and user-facing feedback: labels, validation, loading/empty/error states, and recovery actions. Necessary storage-failure feedback should use plain language such as “Changes cannot be saved on this device,” without explaining localStorage or the mock API.
- Put architecture, trade-offs, fake API/persistence details, and failure-verification instructions in README, plans, tests, and AI journey evidence, not in application pages.

- Use two small pure functions, `validateCreateUser` and `validateCreateTodo`, returning typed field errors; keep form state local and limit constants in the owning feature. No form/schema library is needed for two forms and three fields.
- Username: trim, reject empty/whitespace, and enforce the agreed maximum. Title: trim, reject empty/whitespace, and enforce the agreed maximum. Assignee: require selection and verify existence in the fake API. This is six basic field checks plus the API existence check; username uniqueness is an additional confirmed dataset check.
- Show persistent helper text associated with each input: username “1–40 characters. Case-sensitive; must be unique.” and title “1–200 characters.” Guidance must be visible before errors, not placeholder-only. This is functional form guidance, permitted by the product-only UI rule.
- Validate on submit, then revalidate an errored field as it changes. Focus the first invalid field. Keep request failures separate from field errors and preserve the draft on failure.
- The fake API enforces username uniqueness against its current authoritative user dataset, including seed/restored users and users created in this session. Check immediately before insertion, with no asynchronous gap between checking and inserting, so concurrent requests cannot create duplicates. A form-side check may give early feedback, but a stale Query cache must not be the final authority. Return a typed conflict mapped to the username field (for example, “This username is already taken”), preserving the draft. Compare trimmed usernames exactly without lowercasing or case folding: `Alice` and `alice` are different; ` Alice ` and `Alice` conflict. Interpret trimming as removing leading/trailing whitespace, preserving internal spaces.
- The fake API also enforces assignee existence. Share pure rules where appropriate without cross-feature imports.
- Separate components, focused stateful hooks, and API modules. Components consume hooks rather than calling services directly.
- Associate field errors with inputs; announce mutation status without relying on color alone.
- Preserve failed drafts, allow recovery from query errors, distinguish empty lists from loading, and prevent invalid assignee submission.
- Use only needed shadcn/ui primitives (for example Button, Input, Label, Card) through a shared UI entry point; no dependency from shared UI back to features. Apply Tailwind consistently with readable spacing, responsive layout, and keyboard focus styles. shadcn does not replace validation or accessible field/error wiring.

## Dependencies and sequencing

The scope slices below are implemented as the task breakdown linked below. All tasks are PENDING; creation is not authorization to execute.

### Setup boundary and retry policy

Slice 1 is **SETUP**: workspace/package-manager configuration, app/package scaffolding, dependency installation, providers/tooling wiring, and establishing runnable dev/build/typecheck/lint/test commands. Adding the test runner and storage-test harness configuration is also setup, even if encountered in a later slice. User/todo behavior, persistence logic, UI implementation, and behavioral tests are implementation work.

Task creation must label setup scopes explicitly and distinguish setup checks from feature validation. For each failed setup operation, allow at most **three total attempts** (initial attempt plus two retries). Diagnose and record each attempt and corrective change in `execution.md`; do not reset the counter by changing commands/tools, sessions, or splitting tasks. Stop earlier if user input is needed.

After the third failure, mark the setup task FAILED, stop execution and the queue, summarize all attempts and the unresolved cause, and **wait for explicit user confirmation** before another attempt or workaround. Do not continue dependent work. This bounded retry rule applies during an authorized RUNNING setup task; it does not authorize automatically restarting a FAILED task or retrying feature tasks.


| Order | Slice | Dependency | Approximate effort |
| --- | --- | --- | --- |
| 1 — SETUP | Resolve decisions; scaffold workspace, providers, lint boundaries, and build scripts | Overall plan approval | 30–40 min |
| 2 | Fake transport, resilient persistence, seeded users, user creation/detail, and routes | 1 | 30–40 min |
| 3 | Todo feature, selection integration, optimistic create/rollback, failure verification outside the UI | 2 | 45–60 min |
| 4 | Focused checks, accessibility/layout review, README/reflections, AI evidence | 3 | 30–45 min |
| 5 — DEPLOYMENT SETUP | Verify hosting identity/project; configure workspace build paths, ignored metadata, and SPA fallback | 4 and resolved deployment details | 15–30 min |
| 6 — RELEASE | Publish, verify public access/assets/direct routes, record URL and results | 5 | 15–30 min |

Deployment adds roughly 30–60 minutes beyond the original core implementation estimate; keep this visible when timeboxing. Keep evidence updated throughout each slice. If time runs short, reduce visual polish and discuss any further scope reduction with the user before compromising required package boundaries or rollback correctness.

Task records have been created with `basic_info.md`, `task.md`, and `execution.md`, all PENDING. Execution must wait for explicit user confirmation.

## Validation commands and expected results

The npm scripts below are planned, not implemented or passing today. Root scripts delegate appropriate tasks to Turborepo; package scripts use Vite, ESLint, TypeScript, and the test runner. No commands run during this planning phase.

| Command / check | Expected result |
| --- | --- |
| `npm install` initially, then `npm ci` with the committed lockfile | Workspace dependencies resolve and clean installation is reproducible. |
| `npm run typecheck` | All app/package TypeScript checks pass with no errors. |
| `npm run lint` | Code passes lint, including prohibited cross-feature imports. |
| `npm run test` | Focused behavior tests pass: immediate optimistic insertion, successful replacement, failure removal/draft preservation, missing-cache handling, and user-switch cache isolation. Exercise the actual mutation hook with an isolated Query client and controlled API promises. |
| `npm run build` | Turborepo builds the Vite app successfully and emits `apps/web/dist`. |
| `npm run dev` | App starts using the documented local command. |
| Username uniqueness checks | Reject a username already in seed/restored/current-session data; preserve the draft and show a username error. Concurrent duplicate requests allow only one insertion. Accept `Alice` and `alice` as distinct; reject ` Alice ` when `Alice` exists. Check whitespace-only and length boundaries, and visible accessible helper text. |
| Storage checks | Reload restores confirmed data; blocked access, write failure, malformed JSON, invalid snapshot shape/version fall back safely; failed optimistic creates are never persisted. Use controlled storage adapter tests. |
| Manual browser smoke check | Create/select user, load user detail directly, submit todo, observe immediate pending item, observe successful reconciliation, inject failure through test/developer configuration outside the UI, observe rollback and retained draft, retry successfully. Check mobile layout first (including a narrow 320px viewport), then tablet and desktop widths. Verify no horizontal page overflow, readable wrapping, usable touch targets, and accessible navigation/forms at each size; also check keyboard navigation, labels/focus, and missing-user route. |
| Documentation and dependency inspection | Required reflections and evidence exist; no feature depends on another; README matches actual scripts and persistence/failure behavior; rendered pages contain no challenge/demo/explanatory copy or failure controls. |

Use a small Vitest/React Testing Library setup for the high-risk mutation behavior; avoid exhaustive or implementation-mirroring tests. List broader production testing recommendations in the reflection instead of implementing them all.

Browser automation is not planned by default: type/lint/build checks, hook integration tests, and a focused manual browser pass cover this scope. Real layout, keyboard behavior, and direct navigation require the manual pass. If manual browser access is unavailable, record that gap explicitly; passing builds do not establish visual or interaction correctness.

Record commands, outcomes, and any skipped checks in task execution records and link them from AI journey evidence. Do not claim implementation complete without validation.

## Deliverables and documentation

- A roughly half-page README explaining the package split, composition boundary, Query/Jotai ownership, validation choice, optimistic mutation behavior, and fake API trade-offs.
- Local prerequisites and install/run/build commands.
- Performance reflection: 2–3 sentences or bullets covering cache behavior, query scoping, re-renders, and whether code splitting is warranted for this app.
- Production testing reflection: 2–3 sentences or bullets covering validation/API contracts, mutation races and rollback, routing, accessibility, and a small end-to-end flow.
- AI journey containing the actual plan, key prompts, toolchain used, decisions/overrides, and links to later task and validation records. Record only real tool usage and real user decisions.

## Open questions and risks

- D1 persistence, shadcn/Tailwind, and library-free validation are confirmed. Mobile-first responsive layout is confirmed; D5 limits, visible guidance, and case-sensitive uniqueness are confirmed; D2 routing is confirmed; D4 is resolved by keeping failure injection outside the product UI; D3 npm workspaces is confirmed for simplicity.
- Shared infrastructure can become a dumping ground; keep its exports minimal and inspect dependency direction.
- Refetches, selection changes, and concurrent mutations can overwrite optimistic state; validate against captured assignee IDs and controlled asynchronous responses.
- Persistence is best-effort: communicate storage failure and private-session limitations. Do not persist optimistic records or imply multi-tab consistency.
- Dependency versions and runtime requirements must be verified during scaffolding against the actual environment and official documentation where needed.
- Deployment is not required by the challenge but is now user-confirmed scope. Hosting access/project identity and exact build configuration remain to be verified during later setup; do not start that work during planning.

## Planning validation

- Read the challenge, parent README, and all three local guidance files.
- Inspected the frontend folder and confirmed no application or existing tooling to preserve.
- Checked this plan against required stack, feature boundaries, optimistic rollback, accessibility, deliverables, and the local workflow sections.
- No dependency installation, application source changes, setup, or application tests were performed. Task records were created at the user's explicit request.

## Revision history

- 2026-10-17: Initial plan proposed in-memory-only data and provisional npm commands.
- 2026-10-17: User requested recording the follow-up discussion except for package-manager selection. Added shadcn, resilient localStorage persistence, and validation details; removed provisional npm selection and retained unresolved product policies as proposals.

- 2026-10-17: User confirmed dataset-backed username uniqueness; recorded authoritative fake-API enforcement and focused validation. Exact limits and case-sensitivity remain unresolved.

- 2026-10-17: User required a purely functional UI without challenge/demo/explanatory content. Removed the proposed visible failure control; keep failure injection and technical explanations in tests/developer documentation.

- 2026-10-17: User confirmed mobile-first design, with responsive enhancement for tablet and desktop. Added layout expectations and mobile-first viewport validation.

- 2026-10-17: User required explicit setup identification during planning and a maximum of three total attempts for failed setup operations, followed by a mandatory stop awaiting confirmation. Added the rule to the local workflow and this plan.

- 2026-10-17: User accepted input limits with visible guidance and chose case-sensitive username uniqueness after trimming. Rechecked challenge: user detail is required; todo detail is not. Earlier case-insensitive proposals are superseded.

- 2026-10-17: User confirmed `/users`, `/users/$userId`, and `/todos`, with root redirecting to `/users` and no todo-detail page. At that point package-manager selection remained open; it was subsequently resolved below.

- 2026-10-17: User requested a deployed version and explicitly deferred all configuration/setup. Added deployment direction, later setup/release slices, SPA routing and release validation; no hosting actions taken.

- 2026-10-17: User chose npm for simplicity and sufficient functionality for this project. Plan now specifies npm workspaces, package-lock.json, npm commands, and Turborepo orchestration. Core decisions are settled; overall plan approval/task creation and later hosting-detail verification remain. No setup executed.

## Executable task breakdown

All tasks run sequentially. Read each task's dependency and execution record before starting. No task may start until the user confirms execution.

| Task | Kind | Depends on |
| --- | --- | --- |
| [001 Workspace and tooling](../task/001-workspace-setup/task.md) | SETUP | None |
| [002 Fake API and persistence](../task/002-data-persistence/task.md) | IMPLEMENTATION | 001 |
| [003 Users and routing](../task/003-users-routing/task.md) | IMPLEMENTATION | 002 |
| [004 Todos and optimistic creation](../task/004-todos-optimistic/task.md) | IMPLEMENTATION | 003 |
| [005 Validation and handoff](../task/005-validation-handoff/task.md) | VALIDATION / DOCUMENTATION | 004 |
| [006 Deployment configuration](../task/006-deployment-setup/task.md) | SETUP | 005 |
| [007 Publish and verify](../task/007-release/task.md) | RELEASE | 006 |

- User-confirmed repository default/production branch is `master`. Read-only inspection during planning reported the current local branch as `main`; no branch mutation or remote verification was performed. Reconcile intended release identity during deployment setup, without overwriting local work.
- 2026-10-17: User requested updating the branch direction and creating the task breakdown using the local workflow, with execution held until confirmation.

- 2026-10-17: User moved planning/task records under `.ai/plans/` and `.ai/task/`; workflow paths and evidence links updated. All tasks remain PENDING.
