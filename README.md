# Noble Fits

## Local development — start here

This repository is an npm workspace. **Run install from the project root, not from `client/`.**

### Requirements

- Node.js 20.19+ or 22.12+ (Node 22 LTS recommended)
- npm 10+

If you use nvm:

```bash
nvm use
```

### First-time setup

From the folder that contains this README and the root `package.json`:

```bash
npm install
npm run doctor
```

`npm install` installs both the Express/server dependencies and the Vite frontend workspace dependencies.

### Start the frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend can run by itself. Only checkout payment requests require the Express server.

### Start frontend + Express server

Create a root `.env` containing your server-side Stripe test secret if you want to exercise payments:

```text
STRIPE_SECRET_KEY=sk_test_...
```

Then run:

```bash
npm run dev:full
```

The Vite frontend runs on port 3000 and proxies `/payment` to Express on port 5000.

### Client environment

Copy the example file when you want to configure Stripe/Firebase client values:

```bash
cp client/.env.example client/.env.local
```

At minimum, Stripe payment UI requires a valid publishable key:

```text
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Commands

Run these from the **project root**:

```bash
npm run dev          # frontend only (recommended for normal UI work)
npm run dev:full     # frontend + Express server
npm run build        # production frontend build
npm run preview      # preview built frontend
npm run lint
npm run lint:fix
npm run test
npm run test:watch
npm run validate
npm run doctor
```

You can also use:

```bash
npm run vite
```

as an alias for the frontend dev server.

> `npm vite` is not valid npm syntax. Use `npm run dev` or `npm run vite`.

### If you see `vite: command not found`

You have not installed the frontend workspace dependencies yet. From the root:

```bash
rm -rf node_modules client/node_modules
npm install
npm run dev
```

On Windows PowerShell, delete `node_modules` folders manually (or use `Remove-Item -Recurse -Force`) before reinstalling.

### Lockfile

Commit `package-lock.json` with dependency changes. Use `npm ci` for reproducible installs in CI.

### Vite 8 + JSX

React files that contain JSX use the `.jsx` extension. This is intentional: Vite 8 uses Oxc for JavaScript parsing and dependency scanning, and `.js` files are treated as plain JavaScript. The project validator will fail if JSX is added back into a `.js` source file.

### Code quality and tests

Run all commands from the repository root:

| Command                 | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `npm run lint`          | Check JavaScript/JSX with ESLint and SCSS/CSS with Stylelint |
| `npm run lint:fix`      | Apply available lint fixes                                   |
| `npm run format`        | Format supported project files with Prettier                 |
| `npm run format:check`  | Check formatting without changing files                      |
| `npm test`              | Run Jest unit and component tests with Testing Library       |
| `npm run test:watch`    | Watch unit tests during development                          |
| `npm run test:coverage` | Generate unit-test coverage in `client/coverage`             |
| `npm run test:e2e`      | Start Vite, run Cypress headlessly, and stop Vite            |
| `npm run cypress:open`  | Open Cypress (start `npm run dev` separately)                |

`npm install` / `npm ci` runs Husky's `prepare` script to activate the
pre-commit hook. On commit, lint-staged runs ESLint and Stylelint autofixes
and Prettier on staged files, then includes the fixes in the commit. Unresolved
lint errors or warnings stop the commit. Tests run separately to keep commits
fast. Local hooks can be bypassed; CI should run the checks independently.

Jest uses jsdom, Babel for JSX, and Testing Library's DOM matchers. Unit tests
live next to source files as `*.test.js` or `*.test.jsx`. Cypress browser tests
live in `cypress/e2e`. If the Cypress binary is missing, run `npx cypress install`.
Cypress needs a supported desktop/browser environment. If it reports `bad option: --smoke-test`, unset `ELECTRON_RUN_AS_NODE` before running Cypress.

For CI, run `npm ci`, `npm run lint`, `npm run format:check`, `npm test`,
`npm run build`, and `npm run test:e2e`. Set `HUSKY=0` in CI to skip installing
local Git hooks.
