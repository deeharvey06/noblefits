# Frontend architecture and style guide

This frontend uses React function components, hooks, Redux/Saga, React Router, and colocated SCSS. ESLint, the React Hooks rules, Stylelint, and Prettier are the code-style baseline. Keep the existing visual design and accessibility behavior when refactoring.

## Module boundaries

```text
src/
  api/                       Domain services and vendor/network adapters
    httpClient.js            Shared HTTP transport and normalized errors
    authApi.js               Session, sign-in, registration, password recovery
    catalogApi.js            Remote catalog reads
    paymentApi.js            Payment endpoint and request contract
    firebaseClient.js        Firebase implementation details
  app/                       Application startup and integration tests
  config/                    Application configuration
    routes.js                Route constants, builders, category navigation
  hooks/                     Hooks shared by multiple features
  utils/                     Pure helpers, including formatting and search matching
  services/                  Browser services, including recent-search storage
  components/<feature>/      Reusable feature UI, hooks, helpers, tests, SCSS
    navigation/AppLink.jsx   App-owned router link wrappers
    stripeButton/            Payment UI, hook, and Stripe wrapper
  pages/<feature>/           Page composition and its private components/hooks
  design-system/             Shared UI primitives and their styles
  redux/                     State, selectors, actions, and async orchestration
```

Organize shared code by responsibility: reusable hooks in `hooks`, pure functions in `utils`, browser integrations in `services`, and application settings in `config`. Place UI wrappers in the relevant `components` directory. Keep single-feature hooks beside their UI (`useSignIn`, `usePayment`, `useProductDetails`). Do not import another feature's UI module just to reuse a pure function. The existing design system remains the shared primitive library; do not create duplicate button or field implementations.

## Imports and navigation

Use `@/` imports for JavaScript modules and assets. Vite, Jest, and the editor resolve the alias to `src`. Keep stylesheet imports local to their owning component or feature.

```jsx
import { AppLink } from "@/components/navigation/AppLink";
import { collectionPath } from "@/config/routes";
import "./collectionCard.scss";

const CollectionCard = ({ collection }) => (
  <AppLink to={collectionPath(collection.routeName)}>
    {collection.title}
  </AppLink>
);
```

Use `ROUTES`, `collectionPath`, `productPath`, and `searchPath` for application destinations. Route builders encode dynamic values. Header, footer, and category tiles share the same destinations. Local fragment identifiers such as `#payment` and data-provided image URLs do not need route constants.

Use `AppLink` and `AppNavLink` for navigation links. Router hooks and routing infrastructure can remain explicit. Stripe UI and hooks belong inside the shared payment wrapper. Vendor HTTP and Firebase imports belong inside `api`. ESLint enforces these import boundaries.

## Components and hooks

- Use PascalCase component filenames and `.jsx` for JSX. Use `useSomething.js` for hooks and descriptive camelCase names for pure helpers.
- Give each component one coherent UI responsibility. Pages compose sections; hooks expose feature state and user actions. Avoid arbitrary line limits and components that only wrap a single static element without adding meaning.
- Prefer named exports for hooks/helpers and default exports for feature components, matching the existing codebase.
- Destructure props and use meaningful names. Prefer early returns for loading, unavailable, and error states.
- Keep feature SCSS in the same directory as its UI. Shared tokens and primitive styles belong to the design system. Do not introduce inline styles or new hard-coded colors to bypass the token system.
- Keep event handlers in the component or its feature hook. Call mutations from submit/click handlers, never by observing an event-related state flag in an effect.
- Derive filtered products, totals, validation flags, and availability from current inputs during render. Use `useMemo` for reusable catalog indexing or substantial pure transformations, not for trivial arithmetic.
- Prefer a keyed feature boundary when all local state should reset for a new entity. Product details are keyed by collection/product ID so image selection, quantity, and confirmation reset together.
- Classes are unnecessary for ordinary UI. The existing error boundary remains a class because React's error-boundary lifecycle requires it.

## Loading data and effects

`bootstrapApplication(store)` starts authentication restoration and catalog loading once per store before the React tree renders. Sagas own remote calls and keep the existing bundled-catalog fallback. `useCatalog` only subscribes to state and exposes an explicit retry action; rendering a new page does not start another request. This suits the current small storefront, whose header search and home page both use the catalog. Larger or parameterized remote datasets should use a route loader or a query cache rather than expanding eager startup loading.

Search results are computed from the loaded catalog. Recent searches are saved when a search or suggestion is submitted. `useRecentSearches` subscribes to same-tab notifications and browser storage events through `useSyncExternalStore`; opening a drawer does not trigger a state-refresh effect. Visiting a bookmarked query alone does not add it to history.

Reserve effects for synchronization with systems outside React: focus management, scroll locking, document titles, subscriptions, and timer cleanup. Always clean up resources. Do not use effects to compute data, chain user actions, or keep duplicate pieces of React state synchronized. These conventions follow [React's effect guidance](https://react.dev/learn/you-might-not-need-an-effect) and [external-store subscription guidance](https://react.dev/reference/react/useSyncExternalStore).

## API layer

The service layout follows chapters 3 and 4 of the supplied _React — The Road to Enterprise_ PDF, especially section 4.1, “Implementing an API layer.” Its architectural pattern is adapted to this project's JavaScript, Redux/Saga, and explicit startup loading. The book's example component-fetch effects are not required by this implementation.

The flow is:

```text
UI event → feature hook → domain API method → HTTP client or Firebase adapter
Application startup → Redux action → saga → domain API method → store → hook → UI
```

Keep endpoint strings, request shapes, and vendor response handling inside the API layer. Services must not import React, Redux, or UI modules. Authentication methods return application profiles; Firebase user objects and document snapshots stay internal, and profile timestamps become ISO strings before reaching Redux. Preserve auth error codes for the existing controlled error messages.

The HTTP client uses one [configured Axios instance](https://axios-http.com/docs/instance), unwraps response data, and exposes `ApiError` with status, code, and cancellation information. It does not expose request configuration or vendor error objects. It accepts standard `AbortSignal` options. Add other HTTP methods when needed rather than speculating about future endpoints.

`submitPayment({ amount, token })` preserves the server's `/payment` contract. Amounts are positive integer cents. The feature hook prevents concurrent submissions and catches both tokenization and payment failures. Only a successful payment records a receipt and clears the cart. Do not automatically retry payment mutations. Client guards do not replace server-side payment idempotency.

## Verification

From the repository root:

```bash
npm run validate
```

This runs lint, formatting, feature validators, tests, and the production build. Feature validators inspect colocated UI and hooks together so splitting a component does not require duplicating logic to satisfy a string check.

Tests should verify observable behavior and service contracts: form events, navigation, catalog fallback, search-history synchronization, product state reset, payment failures, duplicate submission prevention, and profile normalization. Mock external services at their API boundary; do not submit real payments or create real accounts in automated tests.

Copy `client/.env.example` to `client/.env.local` for local configuration. Blank Firebase values use the existing public demo configuration. A real Stripe publishable test key is needed to exercise the card-entry integration; unit and integration tests use mocks.
