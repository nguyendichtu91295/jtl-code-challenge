# Frontend Take-Home

## Live app

Production URL: [jtl-frontend-challenge.vercel.app](https://jtl-frontend-challenge.vercel.app)

## Run locally

From this directory, install dependencies and start the app:

```sh
npm ci
npm run dev
```

Open the Vite URL printed in the terminal.

## Main features

This app manages users and their assigned tasks. The user list shows each user's Doing and Done counts. From a user's detail page, you can view their tasks, filter by status, and create another task for them.

There is no standalone task-creation page. Tasks must have an assignee, so creation starts from that user's detail page.

The interface is mobile-first and adapts to larger screens.

## Monorepo structure

- `apps/web` — the SPA, routing, providers, and feature composition.
- `packages/users` — user pages, forms, query hooks, and API access.
- `packages/todos` — task UI, query hooks, and API access.
- `packages/shared` — shared domain types, fake API and persistence, Jotai state, and UI components.

The feature packages export TypeScript source and do not have their own Vite configs or build commands. The web app's Vite build bundles the features it imports. Root Turbo commands run the workspace build, lint, typecheck, and test scripts.

## Technical choices

- **React, TypeScript, and Vite** provide the single-page app and its build.
- **TanStack Router** handles the user list and user detail routes.
- **TanStack Query** manages API-shaped data, caching, and mutations.
- **Optimistic updates** are used for task creation: a pending task appears immediately and is removed if creation fails. User creation and task status changes update the cache after the fake API succeeds.
- **Jotai** stores only whether persistence is `available` or `memory-only`. The fake API keeps records in memory and best-effort saves them to localStorage so they can survive a refresh when storage is available.
- **Tailwind CSS** styles the app, and **lucide-react** provides icons. Shared shadcn-style UI components are built with Tailwind and Radix primitives.

## Separation and accessibility

Components handle presentation and local interaction. Hooks manage query and mutation behavior, while API modules own data access.

Forms use semantic labels connected to their inputs. Task status controls are buttons that can be reached with Tab and activated with Space or Enter.

## Form validation

Validation is library-free because the rules are small:

- **Username:** trim surrounding spaces, require 1–40 characters, and check uniqueness against the current data set. Comparison is case-sensitive.
- **Task title:** trim surrounding spaces and require 1–200 characters. A 200-character title is valid.

## AI workflow

- [`.ai/ai_workflow.md`](.ai/ai_workflow.md) describes the planning, task breakdown, execution, and validation workflow.
- [`.ai/coding_convention.md`](.ai/coding_convention.md) records the coding conventions used for the project.
- [`.ai/deployment.md`](.ai/deployment.md) records deployment and release checks.
- [`.ai/plans/`](.ai/plans/) contains the project plans; [`.ai/task/`](.ai/task/) contains their task breakdowns and execution records.
- [`ai-journey/`](ai-journey/README.md) contains key prompts, decisions, tools, and reflections on the AI-assisted work.
