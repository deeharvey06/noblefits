import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const children = [];
let shuttingDown = false;

function start(command, args, label) {
  const child = spawn(command, args, {
    stdio: "inherit",
    env: { ...process.env, FORCE_COLOR: process.env.FORCE_COLOR || "1" },
  });
  child.__label = label;
  children.push(child);
  return child;
}

function stopAll(signal = "SIGTERM") {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

const server = start(process.execPath, ["--watch", "server.js"], "server");
const client = start(npm, ["run", "dev", "--workspace=client"], "client");

for (const child of [server, client]) {
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    console.error(
      `\n[dev] ${child.__label} exited (${signal || code || 0}). Stopping the other process.`,
    );
    stopAll();
    process.exitCode = code ?? 1;
  });
}

process.on("SIGINT", () => {
  stopAll("SIGINT");
  setTimeout(() => process.exit(130), 50).unref();
});
process.on("SIGTERM", () => {
  stopAll("SIGTERM");
  setTimeout(() => process.exit(143), 50).unref();
});
