# Noble Fits — Frontend Production Readiness

This pass hardens the Phase 14 frontend without changing backend commerce contracts.

## Production hardening completed

- Proper 404 experiences at the application and nested `/shop/*` levels.
- Root + route error boundaries with retry/reset behavior and no external error artwork dependency.
- Deploy-safe lazy route loading that reloads once after a stale chunk failure, then falls back to the error boundary instead of looping.
- Successful Stripe responses now preserve a completion screen and clear the paid local cart to reduce accidental repeat purchases.
- Redux Persist now stores cart data only; transient open/closed cart UI is reset on reload and persisted items are sanitized on rehydration.
- Authentication session-check failures are separated from interactive sign-in failures.
- New Firebase user timestamps use Firestore server timestamps.
- Removed the unused client-side collection seeding/write helper.
- Stripe placeholder keys are treated as unconfigured instead of being passed to Stripe.js.
- Firebase client configuration can be overridden per environment through `VITE_FIREBASE_*` variables while preserving the existing public web config as the default.
- Core remote merchandising images now degrade to a layout-preserving accessible fallback instead of a broken-image icon.
- Direct frontend dependency versions and npm version are pinned; `.npmrc` enforces exact saves and engine compatibility.
- Vite production source maps are explicitly disabled and build validation runs before `vite build`.
- Added `npm run production:validate` to guard the hardening decisions above.

## Deployment configuration

Copy `.env.example` to the appropriate Vite environment file or configure the same variables in the hosting platform.

Required for real checkout:

- `VITE_STRIPE_PUBLISHABLE_KEY`

Optional Firebase project overrides:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Never expose `STRIPE_SECRET_KEY` or other server credentials through `VITE_*` variables.

## Production blockers outside the frontend boundary

The frontend can be hardened independently, but the storefront should **not process real money** until the backend payment architecture is upgraded. The current server trusts a client-supplied amount and creates legacy Stripe Charges without an order record or idempotency strategy. A production payment backend should calculate the amount from server-trusted product/order data, create one server-owned payment object per checkout, use idempotency, and persist the resulting order/payment state.

Firebase Security Rules also need to be reviewed in the Firebase project itself; they are not present in this repository.

## Verification

Run:

```bash
npm install
npm run validate
```

`npm run validate` executes every custom design/UX/accessibility validator, production-readiness validation, ESLint, Vitest, and the Vite production build.

A committed `client/package-lock.json` should be generated and reviewed from a networked development/CI environment. This execution environment could not reach npm long enough to resolve the dependency tree, so the lockfile and full toolchain run could not be produced here.
