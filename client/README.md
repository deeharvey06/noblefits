# Noble Fits Frontend

The frontend is managed as the `client` npm workspace from the repository root.

## Start locally

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Do not run `npm vite`; npm custom scripts require `npm run <script>`. The supported Vite aliases are:

```bash
npm run dev
npm run vite
```

For all setup, environment, build, test, lint, and full-stack instructions, see the root `README.md`.

## Vite 8 JSX convention

React modules that contain JSX use the `.jsx` extension. Do not put JSX in `.js` files: Vite 8 uses Oxc for dependency scanning/transforms and parses `.js` as JavaScript. The modernization validator enforces this convention.

## Frontend conventions

Follow the [frontend architecture and style guide](md/FRONTEND_STYLE_GUIDE.md) for module boundaries, absolute imports, hooks, routes, API services, and testing.
