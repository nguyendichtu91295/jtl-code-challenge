# AI journey

## Plan and execution evidence

- [Task tracking and UX follow-up plan](../.ai/plans/002-task-tracking-ux.md) — records the approved user-first flow and implementation approach; follow-up tasks 008–013 are DONE. Task 011 test isolation/assertion failures were fixed on explicit user request; task 012 browser checks passed and task 013 production deployment was verified.

- [Frontend implementation plan](../.ai/plans/001-frontend-challenge.md) — draft created on 2026-10-17 using the repository's local workflow.
- Seven task records were created. Tasks 001 (workspace setup) and 002 (fake API/persistence) are DONE; tasks 003 (users/routing) is DONE; tasks 004 (todos/optimistic mutations) is DONE; task 005 (validation/handoff) is DONE; tasks 006 (deployment setup) and 007 (release) are DONE; production is available at [jtl-frontend-challenge.vercel.app](https://jtl-frontend-challenge.vercel.app). See links below.
- [Key prompts](prompts.md)
- [Toolchain](toolchain.md)
- [Decisions and judgment](decisions.md)

This evidence is maintained during the work. Proposed choices are not recorded as approved decisions, and planned checks are not recorded as passing results.

## Unused code analysis

[Plan 005](../.ai/plans/005-unused-code-analysis.md) records the Knip trial. Task 022 installed Knip at the workspace root and ran the report; see its [task](../.ai/task/022-knip-analysis/task.md) and [execution result](../.ai/task/022-knip-analysis/execution.md). The report found `getPendingTodoIds` unused, along with other exports and dependency findings that need review before cleanup.

[Plan 006](../.ai/plans/006-unused-export-cleanup.md) records the unused-export cleanup. Tasks 023–024 are DONE; Knip export/type analysis and the standard workspace checks passed. See the [implementation result](../.ai/task/023-prune-unused-exports/execution.md) and [verification result](../.ai/task/024-verify-export-cleanup/execution.md).

## Task records

- [001-workspace-setup](../.ai/task/001-workspace-setup/task.md) — [status](../.ai/task/001-workspace-setup/basic_info.md), [execution](../.ai/task/001-workspace-setup/execution.md)
- [002-data-persistence](../.ai/task/002-data-persistence/task.md) — [status](../.ai/task/002-data-persistence/basic_info.md), [execution](../.ai/task/002-data-persistence/execution.md)
- [003-users-routing](../.ai/task/003-users-routing/task.md) — [status](../.ai/task/003-users-routing/basic_info.md), [execution](../.ai/task/003-users-routing/execution.md)
- [004-todos-optimistic](../.ai/task/004-todos-optimistic/task.md) — [status](../.ai/task/004-todos-optimistic/basic_info.md), [execution](../.ai/task/004-todos-optimistic/execution.md)
- [005-validation-handoff](../.ai/task/005-validation-handoff/task.md) — [status](../.ai/task/005-validation-handoff/basic_info.md), [execution](../.ai/task/005-validation-handoff/execution.md)
- [006-deployment-setup](../.ai/task/006-deployment-setup/task.md) — [status](../.ai/task/006-deployment-setup/basic_info.md), [execution](../.ai/task/006-deployment-setup/execution.md)
- [007-release](../.ai/task/007-release/task.md) — [status](../.ai/task/007-release/basic_info.md), [execution](../.ai/task/007-release/execution.md)

## User-first follow-up tasks (008–010 DONE; 011 FAILED; 012–013 PENDING)

- [008-dialog-dependency-setup](../.ai/task/008-dialog-dependency-setup/task.md) — [status](../.ai/task/008-dialog-dependency-setup/basic_info.md), [execution](../.ai/task/008-dialog-dependency-setup/execution.md)
- [009-task-status-data](../.ai/task/009-task-status-data/task.md) — [status](../.ai/task/009-task-status-data/basic_info.md), [execution](../.ai/task/009-task-status-data/execution.md)
- [010-task-tracking-ui](../.ai/task/010-task-tracking-ui/task.md) — [status](../.ai/task/010-task-tracking-ui/basic_info.md), [execution](../.ai/task/010-task-tracking-ui/execution.md)
- [011-user-first-flow](../.ai/task/011-user-first-flow/task.md) — [status](../.ai/task/011-user-first-flow/basic_info.md), [execution](../.ai/task/011-user-first-flow/execution.md)
- [012-ux-validation-handoff](../.ai/task/012-ux-validation-handoff/task.md) — [status](../.ai/task/012-ux-validation-handoff/basic_info.md), [execution](../.ai/task/012-ux-validation-handoff/execution.md)
- [013-ux-release](../.ai/task/013-ux-release/task.md) — [status](../.ai/task/013-ux-release/basic_info.md), [execution](../.ai/task/013-ux-release/execution.md)


## Input focus and unified list follow-up

[Plan 003](../.ai/plans/003-task-list-polish.md) records approved decisions and implementation defaults. Tasks 014–017 are DONE. The production release is available at [jtl-frontend-challenge.vercel.app](https://jtl-frontend-challenge.vercel.app); task 017 records the deployment and responsive smoke evidence.

- [014-input-focus](../.ai/task/014-input-focus/task.md) — [status](../.ai/task/014-input-focus/basic_info.md), [execution](../.ai/task/014-input-focus/execution.md)
- [015-unified-task-list](../.ai/task/015-unified-task-list/task.md) — [status](../.ai/task/015-unified-task-list/basic_info.md), [execution](../.ai/task/015-unified-task-list/execution.md)
- [016-list-validation](../.ai/task/016-list-validation/task.md) — [status](../.ai/task/016-list-validation/basic_info.md), [execution](../.ai/task/016-list-validation/execution.md)
- [017-list-release](../.ai/task/017-list-release/task.md) — [status](../.ai/task/017-list-release/basic_info.md), [execution](../.ai/task/017-list-release/execution.md)


## User identity and task alignment — complete

[Plan 004](../.ai/plans/004-user-identity-alignment.md) records the approved avatar rule and first-line task-icon alignment. Tasks 018–021 are DONE; the shared avatar and alignment changes are deployed. [Production screenshot](../.ai/task/021-identity-release/production-desktop.jpg) and release evidence are recorded in task 021.

- [018-user-identity](../.ai/task/018-user-identity/task.md) — [status](../.ai/task/018-user-identity/basic_info.md), [execution](../.ai/task/018-user-identity/execution.md)
- [019-status-alignment](../.ai/task/019-status-alignment/task.md) — [status](../.ai/task/019-status-alignment/basic_info.md), [execution](../.ai/task/019-status-alignment/execution.md)
- [020-identity-validation](../.ai/task/020-identity-validation/task.md) — [status](../.ai/task/020-identity-validation/basic_info.md), [execution](../.ai/task/020-identity-validation/execution.md)
- [021-identity-release](../.ai/task/021-identity-release/task.md) — [status](../.ai/task/021-identity-release/basic_info.md), [execution](../.ai/task/021-identity-release/execution.md)
