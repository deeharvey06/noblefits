# Noble Fits — Visual Direction

## Direction: Editorial Modernism

Noble Fits should feel like a modern fashion retailer with the restraint of an editorial publication: confident typography, product-first imagery, disciplined spacing, clear commerce actions, and almost no decorative UI for its own sake.

The interface should not look like a SaaS dashboard, a component-library demo, or a generic marketplace template. The merchandise is the visual identity. UI chrome exists to frame products, make discovery effortless, and make purchase decisions clear.

### Brand qualities

- Editorial, not ornamental
- Contemporary, not trend-dependent
- Premium, not precious
- Confident, not loud
- Product-led, not UI-led
- Accessible, not minimal at the expense of clarity

## Core visual rule

**If an interface treatment competes with product imagery, remove or reduce the treatment.**

Color, shadow, radius, animation, and decorative surfaces should be used only when they improve hierarchy, state recognition, or interaction clarity.

---

## 1. Color Strategy

The primary interface palette is neutral and warm so varied product photography remains the strongest source of color.

### Foundation

- **Ink** — near-black primary text, key borders, primary CTA backgrounds
- **Ivory** — warm page background
- **Paper** — clean product/content surfaces
- **Stone** — secondary surfaces, quiet dividers, disabled states
- **Saddle** — restrained accent for focus, selected details, editorial emphasis

### Semantic commerce colors

Success, warning, error, information, sale, and discount colors are reserved for actual state or commerce meaning. They are not decorative accents.

### Usage rules

- Prefer Ink + Ivory + product photography for the majority of the experience.
- Use Saddle sparingly; it should never become a large background wash across unrelated sections.
- Do not introduce per-page accent colors.
- Do not place gradients behind product imagery.
- Do not use weak gray-on-gray combinations for important actions or pricing.
- Sale/error colors must communicate a real state, not create artificial urgency.

---

## 2. Typography

Typography carries more of the brand expression than decorative effects.

### Editorial display / headings

Use the system editorial serif stack for major page headings, campaign statements, collection names, and selective merchandising moments.

Desired character: refined, fashion-editorial, human, high contrast.

### UI / body

Use the neutral sans-serif stack for navigation, product details, pricing, controls, forms, checkout, and utility content.

Desired character: precise, quiet, highly readable.

### Hierarchy rules

- Display type is reserved for moments that deserve attention; not every card title becomes serif.
- Product names remain concise and easy to scan.
- Prices should be visually immediate and use tabular numerals where alignment matters.
- Navigation and buttons use compact uppercase or tracked labels only where it improves structure.
- Never rely on font size alone: weight, spacing, line length, and grouping establish hierarchy together.
- Avoid giant headline treatments that create empty hero space without merchandising value.

---

## 3. Spacing and Layout Rhythm

The layout should feel composed rather than sparse.

### Base rhythm

Use the existing 4px spacing scale. Favor consistent combinations instead of one-off values.

### Page rhythm

- Tight spacing inside product-information groups
- Moderate spacing between related controls
- Generous spacing between major merchandising sections
- Strong alignment to shared content gutters
- Clear vertical rhythm from heading → context → products → next section

Whitespace is purposeful when it improves scanability or gives photography room. It should not create large dead zones.

### Content width

- Product grids can use the full content container.
- Forms and long text should use narrower readable measures.
- Checkout should prioritize comprehension over visual width.
- Large desktop layouts should not stretch product cards until imagery loses proportion.

---

## 4. Product Imagery

Product imagery is the strongest visual asset in Noble Fits.

### Rules

- Give images more area than interface chrome.
- Use consistent aspect ratios within the same merchandising context.
- Avoid heavy overlays over product photography.
- Avoid large text blocks covering products.
- Use image zoom/crop effects subtly and only when pointer interaction supports them.
- Mobile must never require hover to reveal essential product information or purchase actions.
- Preserve source imagery faithfully; do not add fake badges, ratings, stock states, or marketing claims.

### Image hierarchy

1. Product image
2. Product name
3. Price
4. Real commerce state, if one exists
5. Secondary actions

---

## 5. Merchandising Hierarchy

Every page should answer a shopping question quickly.

### Home

Lead with a strong merchandising decision—not a giant empty marketing hero. Categories, collections, or featured product imagery should immediately tell users what they can shop.

### Collection / product listing

Scanning speed matters. Product cards should feel quiet and consistent so users compare products rather than component styling.

### Product detail, if later approved

The purchase decision should dominate: image → title → price → options → primary action → supporting information.

### Cart / checkout

Reduce editorial styling and increase transactional clarity. Product identity, quantity, price, totals, and next action should be unmistakable.

---

## 6. Surfaces, Borders, Radius, and Depth

### Surfaces

Do not put every section inside a card. Use page background, whitespace, alignment, and thin dividers first.

### Borders

Use 1px neutral borders to structure controls, dropdowns, cart/checkout regions, and meaningful divisions.

### Radius

The default visual language is crisp. Small radius is acceptable for controls where it improves tactility; avoid large soft cards and pill-shaped containers as a default.

### Shadows

Shadows are reserved for true elevation: dropdowns, drawers, menus, overlays, and floating transactional UI. Static content should generally not require shadow.

---

## 7. Calls to Action

Primary commerce actions must look intentional and unmistakable.

### Primary CTA

- Ink background
- High-contrast light text
- Strong rectangular silhouette
- Clear hover/focus/pressed states
- Full-width where mobile ergonomics benefit

### Secondary CTA

Prefer border/text treatments rather than another filled brand color.

### Rules

- One visually dominant action per decision area whenever possible.
- Never hide Add to Cart behind hover.
- Disabled actions must look disabled and remain readable.
- Do not use pill buttons for standard commerce actions.
- Avoid multiple equally loud CTAs competing in one region.

---

## 8. Navigation and Shell Direction

The shell should feel lighter than the merchandise.

- Brand is clear but not oversized.
- Primary navigation is easy to scan.
- Cart and account actions remain consistently available.
- Desktop navigation stays restrained and horizontal.
- Mobile navigation is deliberately designed for touch rather than shrinking the desktop header.
- Sticky behavior is acceptable when it improves shopping continuity, but it should consume minimal vertical space.
- Footer hierarchy should be quiet, structured, and useful—not a decorative mega-section.

---

## 9. Forms and Transactional UI

Forms should feel precise and trustworthy.

- Persistent visible labels
- Clear input boundaries
- High-contrast text
- Obvious keyboard focus
- Inline error relationship to the affected field
- 44px minimum intended touch target
- Minimal decoration
- No floating-label gimmicks unless they improve clarity

Checkout should become visually quieter than browsing pages so completion remains the priority.

---

## 10. Motion and Micro-interactions

Motion should communicate response and orientation, not personality by itself.

### Appropriate

- Button state feedback
- Cart count/update feedback
- Menu/drawer entrance and exit
- Subtle product-image hover treatment on pointer devices
- Loading/skeleton transitions
- Focus/selection state transitions

### Timing

Use the existing 120ms / 180ms / 220ms system durations.

### Avoid

- Parallax for ordinary catalog content
- Long decorative transitions
- Floating cards
- Animated gradients
- Constant motion
- Large spring/bounce effects

Always respect `prefers-reduced-motion`.

---

## 11. Mobile Direction

Mobile is a primary shopping surface, not a compressed desktop layout.

### Requirements

- Essential actions are always visible without hover.
- Touch targets are at least 44px where practical.
- Header and navigation are purpose-built for thumb use.
- Product grids preserve usable imagery and readable product information.
- Filters/drawers, if present in later phases, should prioritize one-hand use.
- Cart rows should reflow instead of forcing desktop table behavior.
- Primary purchase/checkout actions can become full-width when appropriate.
- Sticky controls must not obscure content or browser/system UI.
- Horizontal scrolling is avoided unless intentionally required by a merchandising carousel.

---

## 12. Component Styling Rules

### Product cards

- Image-first
- Minimal container chrome
- No default shadow
- No default enclosing card border unless needed for state
- Product name and price aligned consistently
- CTA visible and touch-accessible

### Section headings

- Editorial serif for the title
- Optional small utility link/action in sans-serif
- Strong baseline alignment
- Consistent spacing above and below

### Buttons

- Rectangular
- Strong contrast
- Small/no radius
- Clear focus ring
- Motion limited to color/opacity/very subtle transform if needed

### Inputs

- Clean border
- Visible label
- No unnecessary inset effects
- Semantic error/success states only when real

### Drawers / dropdowns

- Flat neutral surface
- Strong edge or subtle elevation
- Clear close action
- Keyboard/focus management in implementation phases

---

## 13. Anti-pattern Checklist

Do not introduce:

- Gradient-heavy page sections
- Glass cards or frosted overlays
- Rounded-card grids
- Pill-shaped everything
- Decorative dashboard widgets
- Giant empty hero sections
- Oversized marketing copy that pushes products below the fold
- Multiple unrelated accent colors
- Weak gray CTAs
- Hover-only essential actions
- Animations longer than necessary for feedback
- Fake social proof, discounts, scarcity, ratings, shipping claims, or stock messaging

---

## 14. Visual Priority Order

When making a design decision, optimize in this order:

1. Product clarity
2. Shopping-task clarity
3. Accessibility
4. Information hierarchy
5. Mobile usability
6. Brand character
7. Decorative polish

A visually fashionable treatment should be rejected if it harms any of the first five priorities.

---

## 15. Phase Boundary

This phase defines the visual language for the whole product. It does **not** add new ecommerce capabilities and does not alter Redux, Firebase, Firestore, Stripe, pricing, product data, authentication behavior, routing, or backend contracts.

Subsequent page/component phases should use this document and `DESIGN_SYSTEM.md` as their design constraints.
