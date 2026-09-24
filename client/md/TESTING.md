# Testing and portfolio readiness

## Test strategy

Tests are selected around behavior and failure risk rather than a target of 100% source coverage. Run commands from the repository root.

| Layer                        | Tools                                 | What is verified                                                                                                                                        |
| ---------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pure logic and services      | Jest                                  | Catalog matching/filtering, routes, cart arithmetic, history storage, API response/error contracts                                                      |
| React and Redux integration  | Testing Library + real reducers/sagas | Form submission, protected routes, session restoration, login/registration/logout, search, checkout receipt/cart clearing, product navigation           |
| Resilience and accessibility | Testing Library                       | Controlled errors, password-reset privacy, malformed persistence, image recovery, dialog isolation, keyboard actions, form error associations           |
| Test-payment server          | Node test runner                      | Input validation, absent/test/live key handling, amount/token contract, safe provider-error responses                                                   |
| Browser journeys             | Cypress on a production build         | Catalog navigation, filters/sorting, bag persistence across reload, search/history, 404s, anonymous account routes, mobile drawers/focus, failed images |

Networked authentication and Stripe APIs are mocked at the API boundary in integration tests. The real Redux actions, reducers, sagas, routing, and UI execute. The browser suite does not ignore uncaught application exceptions or submit real account/payment mutations.

## Commands and coverage gates

```bash
npm run validate
npm run test:e2e
```

`validate` runs formatting, JavaScript/style lint, feature validators, Jest with coverage, the production build, and Node server tests. Coverage thresholds in `client/jest.config.cjs` prevent regressions:

- Overall: 65% statements, 50% branches, 60% functions, 70% lines.
- Payment submission hook: 95% statements/lines, 90% branches, 100% functions.
- Cart arithmetic: 90% statements, 65% branches, 100% functions, 95% lines.

These are minimum regression gates, not claims that every scenario is covered. Coverage includes unexercised application code, including vendor-facing adapters. Jest evaluates global thresholds after subtracting files with explicit per-file thresholds. Review the generated HTML report (`client/coverage/lcov-report/index.html`) when changing a feature.

`npm test` runs the frontend and server suites without coverage. Use `npm run test:coverage` for the frontend report and `npm run test:server` for isolated backend contracts.

## Browser test isolation

`npm run test:e2e` sets `VITE_CATALOG_SOURCE=local`, disables Stripe card entry, builds the app, starts Vite preview on `127.0.0.1:4173`, runs Cypress, and stops preview. Each browser test starts with isolated browser state. Tests wait for observable UI conditions, not arbitrary delays. This follows [Cypress's testing guidance](https://docs.cypress.io/app/core-concepts/best-practices).

The local catalog option is also useful when presenting the portfolio without a working catalog service. It does not disable authentication or bypass protected routes. Browser tests verify the anonymous account flow; authenticated flows are covered with mocked APIs and real sagas in Jest.

The command replaces the current build with a demo build. Rebuild with your deployment environment before publishing. Regular `npm run cypress:open` targets the development server at port 3000; start `npm run dev` separately and set `VITE_CATALOG_SOURCE=local` for the same catalog fixtures.

## CI and evidence

`.github/workflows/ci.yml` runs on pushes and pull requests using Node 24 and `npm ci`. It runs validation and the browser suite, then uploads coverage and browser screenshots even after a failed test. The workflow does not deploy anything or require service secrets. It has been prepared locally; a hosted Actions run requires pushing the changes to GitHub.

Screenshots in `docs/screenshots` show the demo UI. Cypress regenerates its evidence under `cypress/screenshots`, which is ignored by Git. There are no screenshot-diff assertions; the browser checks focus on behavior, visibility, mobile overflow, and keyboard focus.

## Boundaries that still need a configured environment

- Real Google OAuth, Firebase email delivery, Firebase security rules, and cross-device accounts require a project you control. Automated tests do not create real users or send email.
- Stripe Elements tokenization and a complete provider round trip need your own test keys. The server refuses live Stripe keys; tests use injected payment clients.
- Server HTTP tests start Express on a temporary loopback port with payments disabled. Payment-provider contract tests use injected clients. Browser tests exercise the built frontend via Vite preview, not a hosted deployment.
- The browser suite runs in Electron on desktop/mobile viewport sizes. It does not certify physical iOS/Android devices, all browser engines, or screen-reader behavior.
- Accessibility source checks and interaction tests are useful safeguards, not a complete accessibility audit.
- No live portfolio URL or hosting account is configured here. Verify SPA routing, Firebase authorized domains, and environment values on the selected host before sharing a deployment.

## Regressions found during the audit

- Restored carts could accept an infinite quantity or convert an invalid stored price into zero. Invalid prices are now rejected and quantities normalized before calculating totals.
- Jest's absolute-import alias matched SVG imports before the asset mock. Asset/style mocks now take precedence, allowing full-shell integration tests.
- The payment server previously assumed a configured key and valid request data. It now supports unconfigured demo startup, validates request input, restricts keys to test mode, and returns controlled errors.
