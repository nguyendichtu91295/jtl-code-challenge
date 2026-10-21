# Task

## Goal

Try Knip as a root-level unused code and dependency analyzer for this npm-workspaces repo.

## Scope

This is a setup task: add Knip as a root dev dependency, configure a command that analyzes the app and internal packages, and run it once. Record findings for review. Do not remove code or dependencies as part of this task.

## Target Files

- Root `package.json` and `package-lock.json`
- Root `knip.json` if needed
- `.ai/task/022-knip-analysis/*`

## Steps

1. Install Knip at the workspace root.
2. Configure workspace entries and include entry exports so unused exports from package entry points can be detected.
3. Add a root `knip` script.
4. Run Knip and inspect findings, including `getPendingTodoIds`.
5. Record commands, findings, and limitations in `execution.md`.

## Validation

- `npm exec knip -- --help`
- `npm run knip`
- Confirm whether the target helper is identified; classify findings before proposing cleanup.
