# Task: 001-workspace-setup

## Goal

Establish the npm/Turborepo frontend workspace and minimal runnable tooling.

## Scope

SETUP. Read `AGENTS.md`, `.ai/ai_workflow.md`, `.ai/coding_convention.md`, and `.ai/plans/001-frontend-challenge.md`. Work only inside the frontend root; preserve existing changes. This task is PENDING and must not execute until the user confirms execution. Keep execution status and markers synchronized, record actual checks, and update AI journey evidence. Do not mark DONE without successful required validation. Non-setup failures stop the queue and require user confirmation to retry. Any tooling/install/setup encountered has a cap of three total attempts per unresolved operation (initial plus two retries), tracked across commands/tools/sessions; after the third failure mark FAILED, stop, and wait for confirmation. No automatic reset of that counter.

## Dependencies and sequencing

None. Start only after explicit execution confirmation.

## Target Files

Root manifests/lockfile, turbo.json, tsconfig.json, eslint.config.js, .gitignore; apps/web; package manifests and public entry points under packages/users, packages/todos, packages/shared; Vitest configuration.

## Steps

1. Inspect installed Node/npm and choose compatible supported dependency versions, checking official documentation where necessary. Record prerequisites; do not install tooling globally without need.
2. Create npm workspaces for apps/* and packages/* with one package-lock.json and matching internal version ranges, not workspace:*. Add ignore rules before generated dependencies/build/local metadata.
3. Scaffold React/TypeScript/Vite and minimal Turbo dev/build/lint/typecheck/test scripts. Set task ordering and outputs accurately. Feature packages may expose source consumed by Vite; do not invent redundant package builds just for caching.
4. Configure TanStack Router/Query, Jotai providers, Tailwind, and only necessary shadcn shared primitives. Keep shared free of feature imports; no users-to-todos or todos-to-users imports. Enforce package and deep-import boundaries through ESLint restrictions.
5. Set up a small Vitest/React Testing Library harness for later meaningful behavior tests. Keep the baseline test command runnable without claiming absent tests verify behavior.
6. Establish minimal mobile-first functional shell; no demo/challenge/explanation copy. Do not implement feature behavior in this task.

## Validation

Run npm install, then npm ci to verify the lockfile. Run npm run typecheck, npm run lint, npm run build, and the configured test command (record if no tests exist yet). Start npm run dev, confirm the dev server starts, then stop it. Expect apps/web/dist from build. Inspect manifests and lint restrictions for independent feature boundaries.
