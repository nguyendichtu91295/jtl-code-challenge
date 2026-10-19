# Shared user identity and task alignment

Date: 2026-10-18
Status: Tasks 018–021 DONE; production verified.

## Goal

Pair every displayed username with a consistent neutral avatar and align each task status icon with the title's first line.

## Background

UserList renders usernames as plain spans; UserDetailPage renders one in its h2; CreateTodoForm renders one after “Assigned to”. These are the three current display sites. The create-user input contains editable text, not a displayed user identity.

TodoRow currently uses a 44px status button with a -2px top margin next to a 24px text line. This leaves the icon center below the first line center. Existing long-title wrapping and explicit mobile grid track must be preserved.

## Confirmed scope

- All displayed usernames use one shared UserIdentity component: avatar plus username. Future display sites follow this rule.
- Neutral circular avatar, light grey background and grey-black person icon, using existing Lucide icons. Same icon for all users; no photos or initials.
- Size variants for user rows, detail heading and compact “Assigned to” identity. Avatar is decorative, noninteractive and does not add an accessible name or tab stop.
- Username input remains a normal editable text field.
- Task status icon centers on the first text line, including multiline titles; preserve a 44×44px hit target, Doing/Done colors and behavior.
- Existing production app is the release target after validation and execution authorization.

## Target files

- New `packages/shared/src/ui/UserIdentity.tsx` (existing `@jtl/shared/ui/*` export covers it).
- `packages/users/src/components/UserList.tsx` and `UserPages.tsx`.
- `packages/todos/src/components/CreateTodoForm.tsx` and `TodoList.tsx`.
- Existing component/app tests where accessible names or structure require adjustment.
- `.ai/` task records and `ai-journey/` evidence.

## Implementation approach

1. Keep UserIdentity presentation-only with typed username and size props. Centralize icon, colors, dimensions and spacing in this component. Suggested defaults: 24px avatar for compact, 32px for list, 40px for heading; these are implementation defaults, not additional user decisions. Inherit surrounding text styling. Use inline-compatible span markup so h2 and paragraph semantics remain valid.
2. Keep avatar nonshrinking; allow username text to shrink and wrap, including an unbroken 40-character name. Preserve full names and existing accessible button/heading labels. Both feature packages import from shared, never from one another.
3. Replace all three username display sites. Inspect source again for additional displays and adopt the shared component if found. Do not decorate arbitrary task text that happens to mention a username.
4. Replace the task button's negative margin with deliberate row geometry. Preferred starting point: 44px top-aligned button, 24px line height and 10px top padding on the title, giving both the same first-line center. Check actual SVG center and line-box center in a browser. Keep multiline text aligned to the first line, not the center of the whole paragraph. Preserve focus ring clearance and row/error spacing.
5. Keep current filters, pending/disabled states, status mutation and focus restoration unchanged in behavior.

## Setup identification and failure policy

No SETUP task or dependency installation is anticipated. Existing React, Tailwind and Lucide are sufficient. If setup becomes necessary, identify it separately and record each operation, diagnosis and attempt. Maximum three total attempts per unresolved setup operation (initial plus two retries), across tools/sessions/tasks. After the third failure mark FAILED, stop and await explicit user confirmation. Failed non-setup tasks are not automatically retried.

## Sequence

| Task | Kind | Dependency | Result |
| --- | --- | --- | --- |
| 018-user-identity | IMPLEMENTATION | None | Shared identity at every username display |
| 019-status-alignment | IMPLEMENTATION | 018 | Status icons centered against the first title line |
| 020-identity-validation | VALIDATION | 019 | Automated and focused responsive evidence |
| 021-identity-release | RELEASE | 020 | Existing production deployment updated and verified |

The sequence keeps execution serial under the local harness. Tasks 001–017 remain historical completed work. Task publication is not implementation or deployment execution.

## Validation

Run `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` for the final change. Reuse existing behavioral tests; update assertions only when markup changes require it, keeping username accessible-name coverage. Do not add tests that merely assert CSS classes.

Real-browser validation is needed for the reported alignment and mobile wrapping. Use the documented browser viewport capability, measure actual viewport dimensions and document observations at 375×812 and 1280×800, plus a 320px overflow check. Check all three identity sites with short and 40-character unbroken usernames; verify no horizontal overflow, username visibility, stable avatar sizes, counts and focus outlines. Inspect one-line and 200-character wrapped/unbroken task titles, Doing and Done icons, and 44px status buttons. Compare icon center to the first line box center rather than relying only on screenshots. Exercise keyboard toggle/filter focus on disposable local data. Existing automated tests cover mutation errors and pending behavior.

Use isolated local storage or a temporary development fixture; do not modify production records or add QA data to permanent seeds. Record fixture method, remove temporary harnesses before the final build and dry run. Missing required browser evidence is a blocker, not a pass. Preserve known warnings separately from failures.

Release follows `.ai/deployment.md`: verify existing project/account/settings and exact dry-run inputs, deploy only on execution authorization, confirm READY, public routes and asset types, and inspect production identities/alignment on mobile without mutating records.

## Risks and open questions

No product decisions remain open. Added avatar width can squeeze counts or long names on narrow screens; allow wrapping without truncation or overflow. Decorative SVG must not duplicate the username for screen readers. Task title padding may alter row height, so check single-line/multiline spacing and keyboard focus visually.

## Out of scope

Avatar uploads, remote images, initials, per-user colors, profile editing, data/schema/persistence changes, new dependencies, routing changes, task behavior changes and wider visual redesign.

## Validation findings — 2026-10-18

The 320px visual check showed the avatar and counts squeezed usernames into a narrow column. Added a 160px preferred basis to user identity so counts wrap onto the next row when needed. Desktop remains one row.

Real keyboard testing exposed an existing filtered-toggle focus bug: the cache update can unmount the task row before its per-call success callback executes. Awaiting mutateAsync keeps the parent focus notification alive after row unmount. A delayed-response regression assertion and real Tab/Enter checks cover this path; focus reaches the next task or the selected empty filter. This is a scoped accessibility correction required by task 020, with no data-model changes.

Measured all status controls at 44×44px and icon center minus first-line center at 0px, including 200-character prose and unbroken titles. Checked 375×812, 1280×800 and 320×812; no horizontal overflow after the row layout correction. Temporary fixture used isolated local port 5186 and was removed before final checks.

## Release — 2026-10-18

All checks passed (34 tests), followed by one successful production deployment, dpl_6hP9ZtmVTkewpijv9iXT5f16rtJK. Live user identities and Andy's direct detail were verified at mobile/desktop sizes with no horizontal overflow and zero icon-to-first-line center delta. Public routes and asset content types passed. Task 021 contains the exact input set and production screenshot. No setup or dependency changes were needed.
