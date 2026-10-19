# Coding conventions

Adapted from the shared conventions in `bpm-counter`, with feature-specific behavior removed.

## Structure and responsibilities

- Inspect the frontend challenge's required stack and package boundaries before choosing a structure.
- Group related components, hooks, API functions, types, and validation by feature. Use shared modules for genuinely shared logic.
- Keep presentation, business logic, and data access separate.
- Prefer small components split by responsibility. Extract a component when it has a clear responsibility, is reusable, or makes its parent easier to read; avoid splitting tiny markup unnecessarily.
- Separate stateful behavior into focused hooks. Keep simple form state inside its component unless its logic justifies a hook.
- Keep API calls in dedicated API modules and mock seed data in separate mock modules. Components access data through hooks rather than calling services directly.
- When mock latency is useful, simulate it in the mock API layer.

## State and data flow

- Give each state one owner; avoid duplicate collections or competing sources of truth across hooks, components, and caches.
- Keep observer setup and cleanup in a focused hook; it should signal when more data is needed rather than owning another collection.
- Use local state and explicit props for local concerns. Follow the challenge's required data-fetching and shared-state tools for server data and cross-cutting concerns.
- Make mutation results explicit through typed callbacks or the chosen query cache. Follow the feature's required optimistic update and rollback behavior when applicable.

## Types and naming

- Define explicit domain, input, and component-prop types; avoid `any`.
- Use PascalCase for component names and filenames, `useSomething` for hooks, `handleSubmit`-style names for event handlers, and `onCreated`-style names for callback props.
- Keep validation in pure functions, with shared constants for domain limits. Derive limits and boundary behavior from the current requirements.

## Loading and errors

- Provide clear loading, empty, and error states where applicable.
- Provide retry actions for recoverable loading failures.
- Show submission errors beside the form and preserve the draft on failure.
- Prevent accidental duplicate submissions while a request is pending.
- Update displayed data consistently after mutations, including rollback when optimistic updates fail.
