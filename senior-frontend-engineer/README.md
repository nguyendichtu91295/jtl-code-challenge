# People & Tasks

A small React and TypeScript app for creating users and tracking their assigned tasks. The web app owns routes and composes independent user and todo feature packages; shared domain types, fake API, persistence, query setup and UI primitives live in `packages/shared`.

The `/users` overview shows each person's Doing and Done counts. Add user opens a Dialog; a successful create closes it and stays on the overview. A user's detail route (`/users/:userId`) contains fixed-assignee task creation and one task list with All, Doing and Done filters. Each task begins in Doing and its leading status icon toggles it to Done or back; the title wraps in full on narrow screens. Todo creation remains optimistic: a pending task appears immediately and only its own row is removed if creation fails.

TanStack Query owns server-shaped records and per-user task caches. Jotai holds the cross-cutting storage availability status shown when browser storage is unavailable. The fake API best-effort persists confirmed records to a versioned localStorage snapshot; old snapshots migrate missing task status to Doing without losing saved users or tasks. Invalid/unavailable storage falls back to seed/in-memory data. Private browsing may clear saved data when the session ends. Storage is origin-specific, with no cross-tab synchronization.

Username validation trims surrounding spaces, is case-sensitive, checks uniqueness against the current dataset, and accepts 1–40 characters. Task titles accept 1–200 characters. Both forms show limits and retain drafts after request failures.

## Run locally

Use Node.js 20.19+ and npm 11 from this directory:

```sh
npm ci
npm run dev
```

The app opens at the Vite URL printed in the terminal. Check the workspace with `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`. npm workspaces links local packages; Turborepo runs package scripts and dependency order; Vite serves and bundles the SPA.

## Performance and production testing

Task queries are scoped by user. The overview fetches one batched task-count summary and reuses any already loaded detail cache for immediate updates. The app is small enough that route-level code splitting would add little value; lazy routes can be introduced if it grows. Tests cover validation, storage migration/fallback, status persistence, optimistic create/rollback and overlap, user isolation, dialog behavior, direct routes and task status transitions. Browser checks cover the responsive user-to-task flow and keyboard use.

## Deployment

Production: [jtl-frontend-challenge.vercel.app](https://jtl-frontend-challenge.vercel.app). Vercel uses Node 22, `npm ci`, `npm run build`, `apps/web/dist`, and SPA fallback rewrites. Latest user-first release is READY at https://jtl-frontend-challenge-5lduuyrd2-coding-challenge.vercel.app (deployment `dpl_HTyn3aHCRytStxp1gK8FbggRLTuj`). Releases use the Vercel CLI under the `coding-challenge` team; Git is not connected to the project.
