import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const [major, minor] = process.versions.node.split(".").map(Number);
const nodeSupported = (major === 20 && minor >= 19) || major >= 22;
let npmVersion = "unknown";
try {
  npmVersion = execFileSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["--version"],
    {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    },
  ).trim();
} catch {
  // Keep the fallback when npm is unavailable.
}

const viteInstalled = [
  path.join(root, "node_modules", "vite", "package.json"),
  path.join(root, "client", "node_modules", "vite", "package.json"),
].some(fs.existsSync);

console.log("Noble Fits local-development doctor\n");
console.log(`Node: ${process.versions.node} ${nodeSupported ? "✓" : "✗"}`);
console.log(`npm:  ${npmVersion}`);
console.log(
  `Frontend dependencies installed: ${viteInstalled ? "yes ✓" : "no ✗"}`,
);
console.log(
  `Workspace configured: ${fs.existsSync(path.join(root, "client", "package.json")) ? "yes ✓" : "no ✗"}`,
);

if (!nodeSupported) {
  console.error(
    "\nNode is not supported by Vite 8. Use Node 20.19+ or Node 22.12+.",
  );
  process.exitCode = 1;
}

if (!viteInstalled) {
  console.log("\nNext step: npm install");
} else {
  console.log("\nReady. Start the frontend with: npm run dev");
  console.log("Optional full stack (requires server env): npm run dev:full");
}
