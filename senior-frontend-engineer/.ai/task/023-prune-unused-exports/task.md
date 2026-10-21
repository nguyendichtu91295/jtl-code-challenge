# Task

## Goal

Reduce the internal package entry points to the exports consumed by current workspace clients and remove the confirmed orphan helper.

## Scope

Use current cross-workspace imports as the supported API. Keep `@jtl/shared` symbols required by `apps/web`, `packages/users`, and `packages/todos`; keep `UsersPage` and `UserDetailPage` from `@jtl/users`; keep `TodoWorkspace`, `todoQueryKeys`, and `useTodoCounts` from `@jtl/todos`. Remove other unused re-exports from those package barrels. Remove `getPendingTodoIds` from its implementation and barrel because it has no callers. Remove export modifiers from package-local `userQueryKeys` and validation limits that are not imported outside their modules. Remove only the `router` export modifier in `apps/web/src/App.tsx`; preserve the local router instance and module registration.

Do not remove implementation functions/types used inside their package or by tests. Do not remove dependencies in this task.

## Target Files

- `apps/web/src/App.tsx`
- `packages/shared/src/index.ts`
- `packages/users/src/index.ts`
- `packages/todos/src/index.ts`
- `packages/todos/src/hooks/useTodos.ts`
- `packages/users/src/hooks/useUsers.ts`
- `packages/users/src/validation.ts`
- `packages/todos/src/validation.ts`

## Steps

1. Confirm cross-workspace package imports and retain every consumed symbol.
2. Trim the three package barrels to the public symbols listed in Scope.
3. Delete the unused `getPendingTodoIds` helper and its re-export.
4. Make the app router instance local without changing router setup or behavior.
5. Hand off to task 024 for full validation.

## Validation

- Inspect all imports from `@jtl/shared`, `@jtl/users`, and `@jtl/todos` to ensure retained exports resolve.
- `npm run typecheck` for focused compile verification.
