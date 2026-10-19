# Toolchain used

## Planning phase — 2026-10-17

- Codex assistant: repository inspection, requirements summary, implementation plan, and evidence documentation. Exact model version was not independently verified in this session.
- `functions.exec` with `exec_command`: local document reads and file inventory (`cat`, `rg`, `ls`, `pwd`).
- `apply_patch`: creation of the plan and AI journey Markdown files.
- Repository workflow: `.ai/ai_workflow.md`, together with `.ai/coding_convention.md` and `.ai/deployment.md`.
- No external MCP servers, browser automation, specialized skills, or sub-agents were used in the initial planning phase.

Add tools only when actually used in subsequent work.

## Follow-up decision research — 2026-10-17

- `web.run` through `functions.exec`: checked official shadcn/ui, npm, pnpm, and MDN documentation for the decision discussion. Package-manager findings did not establish a selection.
- References: [shadcn monorepos](https://ui.shadcn.com/docs/monorepo), [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces/), [pnpm workspaces](https://pnpm.io/workspaces), [pnpm dependency layout](https://pnpm.io/symlinked-node-modules-structure), [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [MDN storage limits](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria).
- `exec_command` with Python: targeted updates to the existing plan and evidence files; no application changes.


## Workspace setup — 2026-10-17

- Node.js v24.21.0, npm 11.19.0, npm workspaces, and Turborepo 2.11.9 for setup and task orchestration.
- React 19.3.1, Vite 8.3.4, TypeScript 5.9, Tailwind CSS 4 with @tailwindcss/vite, TanStack Query/Router, Jotai, ESLint 10, Vitest 4, Testing Library, and jsdom were installed. Actual locked versions are recorded in package-lock.json.
- ESLint support policy was checked at https://eslint.org/version-support after npm resolved a deprecated ESLint 9 line; upgraded to ESLint 10 with plugin peer compatibility confirmed from npm metadata.
- Static verification and dev server checks were run as recorded in .ai/task/001-workspace-setup/execution.md. The test command found no behavior test files at setup stage.

- Task 002: Vitest ran six focused fake API/persistence tests successfully; Turbo typecheck/lint/build also passed.

- Task 003: Vitest passed five username/form cases; Turbo typecheck, lint and Vite production build passed.

- Task 004: Vitest passed six todo tests; Turbo typecheck, lint and Vite production build passed.

- Task 005: all 17 shared/users/todos tests, typecheck, lint and build passed; browser checks were performed with Chrome CUA at 320/375/768/1280px.


## Deployment setup — 2026-10-17

- Used Vercel CLI 64.5.0 through `npx` and official Vercel documentation to verify the `coding-challenge` team and prepare project `jtl-frontend-challenge`.
- `git ls-remote --symref origin HEAD` confirmed remote HEAD is `master`, the only branch. This Vercel project is intentionally CLI-deployed and is not connected to Git; no branch push occurred.
- Vercel dry-run detected Vite and selected the frontend workspace. `.vercelignore` excludes AI journey/planning evidence, caches, tests, local env files, and prior build output.
- Project-only SSO protection was disabled to allow public access.

- Task 007 used Vercel CLI 64.5.0 to publish production. Deployment reached READY; HTTP and browser checks are recorded in `.ai/task/007-release/execution.md`.


## Task tracking and UX planning — 2026-10-17

- Read the local `record-plan` skill and followed `.ai/ai_workflow.md` for durable plan placement under `.ai/plans/`.
- Used `functions.exec` to inspect challenge requirements and the current task/data flow. No external tools, browser, or implementation were used.


## User-first task breakdown — 2026-10-17

Follow-up task planning used the local .ai/ai_workflow.md, repository/source inspection through exec_command, and Python for Markdown task authoring. No dependency installation, application tests, browser checks or deployment ran during this planning step.


## Follow-up execution — 2026-10-17

Continuous execution used npm, TypeScript, ESLint, Vitest, Turbo/Vite and local filesystem tools. Setup succeeded on first attempts. Browser inventory was inspected but no browser app validation was run before task 011 failed. No sub-agents used.


## Task 011 investigation and fix — 2026-10-17

Task 011 retry used Vitest, Testing Library, TanStack Router memory history, npm run typecheck and npm run lint. Focused App tests: 4 passed; targeted feature/app tests: 19 passed; typecheck passed; lint passed with two Fast Refresh warnings. jsdom reports Radix scrollTo diagnostics.


## Validation and release — 2026-10-17

Task 012/013: npm run typecheck/lint/test/build (29 tests passed); Chrome browser QA with 375×812 viewport and desktop default; Vercel CLI 64.5.0 (`whoami`, project inspect, deployment list, help, dry run and production deploy); Python urllib HTTP and asset verification; official Vercel CLI docs used to confirm current production deploy behavior.


## Unified list planning — 2026-10-17

Planning used repository documentation and existing source/test inspection through exec_command, then Python to author Markdown plan/task/evidence files. No application tests, installation, browser validation or deployment ran during this planning step.


## Task 014 — Input focus — 2026-10-17

Ran `npm run typecheck` and `npm run lint` (both passed; lint retains two existing Fast Refresh warnings). Inspected the username dialog and task-title field in local Chrome at a narrow viewport. An initial Turbo dev command rejected `--host`; using the existing `@jtl/web` workspace dev script started the local app. No dependencies or setup changed.


## Task 015 — Unified task list — 2026-10-17

Ran `npx vitest run packages/todos/src apps/web/src` (6 files, 19 tests), `npm run typecheck`, and `npm run lint`; all passed. Lint retains two existing Fast Refresh warnings. The targeted test run printed jsdom `scrollTo()` diagnostics. No dependencies or setup changed.


## Task 016 — Browser and full validation — 2026-10-17

Ran `npm run typecheck`, `npm run lint`, `npm run test` (9 files, 34 tests), and `npm run build` after removing the temporary fixture; all passed. Lint has two existing Fast Refresh warnings; jsdom reports existing `scrollTo()` diagnostics. Chrome QA used `http://127.0.0.1:5174` to isolate local storage; the temporary route rendered 50 records and was removed. The available Chrome surface stayed about 318px wide and exposed no viewport override; the `iab` surface was unavailable. Exact 375×812 and ~1280px views remain unverified, so task 016 is FAILED per its missing-evidence rule.

Explicit fresh-tab retry: restarted the local Vite server after the first new-tab navigation found it stopped. Used the documented browser viewport capability to set and measure 375×812 mobile, 1280×800 desktop and 320×812 narrow widths. Mobile stacked form/list and kept all filters on one row; desktop showed two columns; all measurements showed no horizontal overflow. Reset the viewport override. Task 016 is DONE when combined with its prior 50-record fixture and full-check evidence.

## Task 017 — Corrected production release — 2026-10-17

Verified Vercel CLI 64.5.0, project identity/settings, remote `master` default and direct deployment path. Full `npm run typecheck`, `lint`, `test`, and `build` passed after the focused mobile grid sizing fix; lint keeps two existing warnings, tests show existing jsdom `scrollTo()` diagnostics. Dry run selected 51 files and excluded plans, journey, tests, dependencies, caches and build output. The first production deployment revealed a 2px mobile overflow with existing long titles; added an explicit one-column flexible grid track and published corrected deployment `dpl_8tRQsdE7oiTv8iZit1yBB3y35qQE`, READY and aliased to the existing production domain. Final public routes and asset content types returned 200; root redirected to `/users`, direct user detail loaded, `/todos` displayed Page not found, and at 375×812 the detail page had zero horizontal overflow. No production data was modified.


## Plan 004 — 2026-10-18

Used repository file reads and source search to inspect username display sites, shared exports and task row geometry. Followed .ai/ai_workflow.md to write a plan and four PENDING task records, then linked them in the AI journey. No application code, dependencies, browser checks or deployment changed in this planning turn.


## Tasks 018–021 — 2026-10-18

Used source inspection/editing, npm workspace checks (34 passing tests), and Chrome CUA/browser viewport control at 320, 375 and 1280px. Read-only DOM geometry measured 44px status targets, zero icon/first-line center differences and no document overflow. Real Tab/Enter testing verified filtered-row focus restoration and empty-filter fallback. Disposable fixture was guarded against overwriting storage on isolated port 5186 and removed before build. Vercel CLI 64.5.0 identity/project checks and dry run preceded one production deployment; Python HTTP checks verified HTML/JS/CSS responses. Deployment dpl_6hP9ZtmVTkewpijv9iXT5f16rtJK is READY; screenshot and exact source input evidence are in task 021. No production data changes or setup operations.
