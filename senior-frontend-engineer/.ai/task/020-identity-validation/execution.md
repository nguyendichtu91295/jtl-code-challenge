# Execution Result

## Status

DONE

## Summary

Validated shared identities and first-line task icon alignment on mobile and desktop. Corrected narrow user-list name squeezing and an existing filtered-toggle focus callback issue found in real keyboard testing.

## Changes

UserList identity gets a preferred 160px basis so counts wrap on narrow screens. TodoList awaits mutateAsync before the parent success notification so cache-driven row unmount cannot suppress focus restoration. Existing TodoList focus test now uses a delayed response. Temporary apps/web/qa-identity.html fixture was removed.

## Validation

- Isolated origin http://127.0.0.1:5186, guarded fixture refusing to overwrite existing storage; two disposable users (Andy and 40 unbroken W characters), each with a short title, 200-character prose and 200-character unbroken title, mixed statuses. No production data changed.
- Browser at 375×812, 1280×800 and 320×812: no horizontal overflow; full names and titles wrap; avatars remain 32px in list, 40px heading, 24px Assigned to, all decorative. Heading and user-button accessible names contain the username without icon labels. Short-name Assigned to remains inline; long-name identity wraps cleanly.
- All task controls measured 44×44px; SVG center minus first text-line center was 0px for all three title lengths at all widths. Status colors/shapes preserved.
- Real Tab/Enter on Done filter: undo removes row, moves focus to next status button; undoing the final row focuses Done 0. Initial keyboard check exposed missing focus, fixed before repeating successfully. Avatar introduces no focus stop.
- Final npm run typecheck, npm run lint, npm run test and npm run build passed after fixture removal: 34 tests in 9 files. Two existing Fast Refresh warnings; existing jsdom scrollTo diagnostics. No new dependency/setup.

## Errors

A read-only measurement initially used parseFloat, unavailable in the browser evaluation scope; replaced it with numeric conversion of CSS pixel strings. This did not affect app code or data. Narrow identity squeezing and focus restoration findings were corrected and reverified.

## Notes

No setup; attempts 0. Viewport override reset. Disposable fixture data remains only on isolated local port 5186. No fixture source remains in the release.
