import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const env = {
  ...process.env,
  VITE_CATALOG_SOURCE: "local",
  VITE_STRIPE_PUBLISHABLE_KEY: "pk_test_replace_me",
  CYPRESS_BASE_URL: "http://127.0.0.1:4173",
};
// Editor terminals sometimes inherit this flag, which prevents Electron launching.
delete env.ELECTRON_RUN_AS_NODE;

const run = (script) =>
  new Promise((resolve, reject) => {
    const child = spawn(npm, ["run", script], { env, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} failed (${code}).`)),
    );
  });

try {
  await run("build");
  await run("test:e2e:run");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
