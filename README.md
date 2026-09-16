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

The previous ZIP contained an old npm-v6 `package-lock.json` from the pre-Vite project. It was removed because it did not describe the modern frontend workspace. A fresh `npm install` with npm 10 will generate the correct workspace-aware lockfile; commit that new lockfile for reproducible CI/deployments.

### Vite 8 + JSX

React files that contain JSX use the `.jsx` extension. This is intentional: Vite 8 uses Oxc for JavaScript parsing and dependency scanning, and `.js` files are treated as plain JavaScript. The project validator will fail if JSX is added back into a `.js` source file.
