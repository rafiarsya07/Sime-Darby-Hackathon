// Builds the static GitHub Pages copy into ../demo (the repo root),
// so it is served at https://rafiarsya07.github.io/Sime-Darby-Hackathon/demo/
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "..", "demo");
const env = { ...process.env, PAGES_BASE: process.env.PAGES_BASE ?? "/Sime-Darby-Hackathon/demo" };

const run = spawnSync("npx", ["next", "build"], { cwd: root, env, stdio: "inherit", shell: process.platform === "win32" });
if (run.status !== 0) process.exit(run.status ?? 1);

if (existsSync(target)) rmSync(target, { recursive: true, force: true });
cpSync(join(root, "out"), target, { recursive: true });
console.log(`\nCopied the static site to ${target}`);
