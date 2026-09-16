# Noble Fits Accessibility Audit — Phase 13

## Target

Noble Fits targets WCAG 2.2 Level AA where practical for the current frontend architecture. This phase is an implementation audit, not a formal accessibility certification. Automated browser/assistive-technology testing still needs to be run in an environment where the client dependencies can be installed.

## Semantic structure

- Every routed page is contained by the application `<main>` landmark.
- The global header, primary/category/mobile navigation, footer navigation, breadcrumbs, product articles, filters, forms, fieldsets and checkout sections use native semantic elements.
- The skip link targets `#main-content`.
- Route changes update the document title, announce the new page through a polite live region and move programmatic focus to the main landmark after client-side navigation.
- Product-listing cards use H2 headings beneath the page H1; cards inside H2-led merchandising sections continue to use H3.

## Keyboard navigation and focus

- Native buttons/links are used for actions and navigation; there are no user-facing clickable `div` or `span` controls.
- Global `:focus-visible` treatment uses a high-contrast focus color.
- Shared button, icon-button, input, choice and search focus treatment uses the same opaque focus ring.
- Dialogs and drawers trap focus, support Escape, restore focus to the opening control and render in a portal so the application background can be marked inert while the modal is open.
- The shopping-bag preview supports Escape dismissal and restores focus to the bag trigger.
- Tabs support Arrow Left/Right, Home and End.
- Tooltips appear on hover and keyboard focus, expose `aria-describedby`, remain hoverable and can be dismissed with Escape.

## Accessible names, labels and errors

- Shared inputs/selects/textareas use programmatic `<label for>` relationships.
- Required fields retain the native `required` state.
- Invalid fields use `aria-invalid`, `aria-describedby` and `aria-errormessage` tied to the visible error message.
- Password-confirmation mismatch is attached directly to the Confirm password field rather than only announced as a form-level error.
- Icon-only controls have explicit accessible names.
- Quantity controls are named groups with named increase/decrease actions and a live value.
- Every source `<img>` has an `alt` attribute; intentionally decorative imagery uses empty alt text.
- Price output exposes the visible amount plus a screen-reader label without replacing the amount with `aria-label`.
- Rating output uses a single labelled image-role representation so stars are not read individually.

## Contrast and non-color cues

Phase 13 adjusts shared semantic tokens so normal muted text passes 4.5:1 against both the page background and white surfaces, while the strong control border and focus indicator meet at least 3:1 against adjacent light surfaces.

State is not communicated by color alone:

- active navigation has a border/underline treatment plus `aria-current` where supplied by `NavLink`;
- checked checkboxes show a checkmark in addition to a fill change;
- errors include text messages and invalid semantics in addition to red borders;
- checkout progress includes step text and symbols;
- availability/status information is written as text;
- sale pricing uses `<del>` and screen-reader wording rather than red color alone.

## Dialogs, drawers and menus

- Shared Dialog and Drawer use `role="dialog"`, `aria-modal="true"`, labelled titles, focus containment, Escape-to-close, focus restoration and background inerting.
- Header Menu and Search triggers expose `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls`.
- The mobile menu remains native navigation inside the drawer rather than an ARIA menu widget, so ordinary Tab/Shift+Tab navigation is expected.

## Screen-reader behavior

- Route transitions have a hidden polite status announcement.
- Loading, error, payment, quantity, cart-total and search-result updates use appropriate status/alert/live-region semantics.
- Decorative icons and images are hidden from the accessibility tree when equivalent text already names the control.
- Modal background content is hidden/inert while a dialog/drawer is active.

## Touch targets

- `--touch-target-min` remains 44px.
- The compact control height is also 44px in Phase 13, so shared small buttons/icon buttons no longer drop below the project's touch-target baseline.
- Inline text links rely on the WCAG target-size spacing/inline-text exceptions where appropriate.

## Reduced motion and high contrast

- The global `prefers-reduced-motion: reduce` rule collapses animations/transitions and disables smooth scrolling.
- Shared spinners/skeletons additionally disable animation in reduced-motion mode.
- A `forced-colors: active` treatment preserves control boundaries and focus indicators in Windows/high-contrast modes.

## Route coverage reviewed

- Home
- Shop / collection listings
- Search and global search drawer
- Product detail
- Bag / checkout
- Sign in / registration
- Password recovery
- Account
- Global header, footer, cart preview, breadcrumbs, dialogs and drawers

## Known limitations / follow-up

- This source audit cannot replace manual testing with VoiceOver, NVDA, JAWS, TalkBack or keyboard-only browser sessions.
- Automated axe-style browser auditing was not executed because npm dependencies could not be installed in the current execution environment.
- Stripe Elements owns the internals of its secure card iframe. Noble Fits labels and error/status content around that field, while Stripe remains responsible for the iframe's internal accessible implementation.
- A formal WCAG conformance claim should only be made after browser-level testing across representative routes/states and assistive technologies.
