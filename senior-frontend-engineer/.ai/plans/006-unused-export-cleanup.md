# Unused Export Cleanup

## Goal

Remove exports that are not part of the app's current workspace contract, then verify the app and workspace packages still typecheck, lint, test, and build.

## Background and current behavior

Knip 6.42.1 is installed at the root and runs through `npm run knip`. Its first report found 25 unused exports and 9 unused exported types. Many findings are package-barrel re-exports that are only used inside their feature package; the web app imports user pages and a small Todo API surface. Knip also identified `getPendingTodoIds`, which has no references beyond its declaration and barrel export.

## Scope

- Remove `getPendingTodoIds` from `packages/todos/src/hooks/useTodos.ts` and its barrel.
- Reduce `@jtl/shared`, `@jtl/users`, and `@jtl/todos` barrel exports to symbols consumed by other workspaces.
- Remove export modifiers from package-local query keys and validation limits that are not consumed outside their modules.
- Remove the unused `router` export from `apps/web/src/App.tsx` while keeping the local router instance used by `App` and TanStack Router's module registration.
- Re-run Knip's export/type analysis and the repository's lint, typecheck, test, and build checks.

Keep package-internal exports in implementation files when another file in that same package or its tests use them. Preserve all cross-workspace imports found in `apps/web` and feature packages.

## Out of scope

- Changing app behavior or feature implementation.
- Removing or moving dependencies reported by Knip.
- Auto-fixing Knip findings or adding Knip to CI.
- Removing public package APIs for hypothetical consumers outside this private monorepo.

## Target files or areas

- `apps/web/src/App.tsx`
- `packages/shared/src/index.ts`
- `packages/users/src/index.ts`
- `packages/todos/src/index.ts`
- `packages/todos/src/hooks/useTodos.ts`
- `.ai/task/023-prune-unused-exports/`
- `.ai/task/024-verify-export-cleanup/`

## Implementation approach

Use current workspace imports as the contract. Retain shared exports required by app and feature packages; retain user page exports consumed by the app; retain Todo exports consumed by the app (`TodoWorkspace`, `todoQueryKeys`, and `useTodoCounts`). Remove other unused barrel re-exports while leaving implementations that remain package-internal. Delete `getPendingTodoIds` because it has no callers. Keep the app router value local and validate TanStack route typing.

## Dependencies and sequencing

1. Prune confirmed-unused exports and the orphan helper.
2. Run the Knip export/type report plus the standard workspace checks after the code change.

This is not setup work; Knip is already installed.

## Validation

- `npm run knip -- --include exports,types` should report no unused exports/types in the current workspace.
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

## Open questions and risks

- Knip can report intended APIs as unused when the only potential consumers are outside the repository. All current workspace packages are private, so the planned public surface follows current in-repo consumers. If these packages are later published, their supported API should be deliberately expanded and documented.
- The `router` export is referenced by the local TanStack module registration type. Removing only the export modifier should preserve that type relationship; typecheck will verify it.
- Full Knip output may continue to include the previously reported dependency findings, which are outside this cleanup scope.
