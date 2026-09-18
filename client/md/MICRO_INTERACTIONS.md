# Phase 14 — Micro-interactions

## Motion principles

Noble Fits uses motion only when it explains a state change, confirms an action, or preserves spatial context. Motion is not used as decoration. Product photography, typography, and merchandising remain the visual focus.

Interactive transitions use the existing design-system timing scale:

- `--duration-fast: 120ms` for direct hover/focus/pressed feedback.
- `--duration-standard: 180ms` for state changes and confirmation feedback.
- `--duration-slow: 220ms` for spatial transitions such as drawers and product-image zoom.

Small motion distances (`0.25rem` and `0.5rem`) keep movement restrained.

## Button feedback

Buttons retain immediate pressed feedback. Product-card Add to Bag actions now briefly change to **Added to bag** and use a short success-state animation. The confirmation is presentation-only; the existing Redux cart action and cart calculations are unchanged.

## Cart updates

The bag count performs one short scale pulse when the numeric count changes. The mini-cart uses a short opacity/position entrance when opened. Cart totals and item quantities remain immediate and are not animated through counting effects.

## Drawers and dialogs

Shared drawers now slide from their actual edge over 220ms while the backdrop fades over 180ms. Dialogs use a restrained 180ms fade plus a small vertical/scale change. Closing is animated before unmounting, and existing focus trapping, inert background behavior, Escape handling, scroll locking, and focus restoration remain intact.

## Navigation

Header, category, and mobile navigation state changes use 120ms color/border/background transitions. Navigation does not animate page content or delay route changes.

## Product imagery

Product cards and homepage/category imagery retain the subtle 1.5% image scale over 220ms. PDP thumbnail selection uses short border/opacity feedback, and changing the active PDP image crossfades over 180ms. There are no large parallax effects, automatic carousels, or decorative image motion.

## Filters and search

Changing catalog filters/sort order remounts only the results grid and gives the new result set a subtle 180ms fade/4px rise. Submitted Search results use the same restrained refresh treatment. Inputs and filter controls themselves remain immediately responsive.

## Loading states

The existing spinner and skeleton animations remain continuous loading indicators rather than interaction transitions. They are intentionally slower than the 120–220ms interaction window because their purpose is to communicate ongoing work, not a single state transition.

## Success feedback

Shared success notifications enter over 180ms. Product-card Add to Bag feedback is held long enough to be readable, but the actual animation itself remains 180ms. The PDP and checkout retain their existing accessible textual success messaging.

## Reduced motion

`prefers-reduced-motion: reduce` remains authoritative. Global CSS reduces animation/transition duration to effectively zero, disables smooth scrolling, and the overlay presence code removes the 220ms exit wait when reduced motion is requested. Motion never gates functionality or hides information.

## Intentionally not animated

The following remain immediate by design:

- route changes and page focus management;
- prices and monetary totals;
- quantity values;
- form validation text;
- checkout progress text;
- authentication state changes;
- critical errors;
- product availability text.

This avoids motion where speed, comprehension, or accessibility is more important than visual continuity.
