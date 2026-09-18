import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const viteCandidates = [
  path.join(root, "node_modules", "vite", "package.json"),
  path.join(root, "client", "node_modules", "vite", "package.json"),
];

if (!viteCandidates.some((candidate) => fs.existsSync(candidate))) {
  console.error("\n[setup] Frontend dependencies are not installed.");
  console.error("[setup] From the project root, run: npm install");
  console.error("[setup] Then start the frontend with: npm run dev\n");
  process.exit(1);
}
