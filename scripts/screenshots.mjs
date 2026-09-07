#!/usr/bin/env node
/**
 * screenshots — shoot every route at 1280 and 375 px (light + dark) so a
 * change can be reviewed visually before it ships.
 *
 *   bun run screenshots                    # boots `vite` on :5199, shoots, exits
 *   bun run screenshots -- --fake          # also boots scripts/fake-api.mjs so chat has data (CI)
 *   bun run screenshots -- --preview       # serve the built dist/ (vite preview) instead of the dev server (CI)
 *   bun run screenshots -- --base http://localhost:5173   # against a running server
 *   bun run screenshots -- --routes /,/chat              # subset
 *
 * Output: screenshots/<route>-<width>[-dark].png (folder is git-ignored).
 * Requires playwright + chromium: `bun add -d playwright && bunx playwright install chromium`.
 * Console errors and page errors are collected and printed; the process exits 1
 * when a route throws (network 5xx from a missing /api backend is ignored).
 */
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const OUT = resolve(arg("--out", "screenshots"));
const PORT = 5199;
let base = arg("--base", "");
const ROUTES = (
  arg(
    "--routes",
    [
      "/",
      "/chat",
      "/templates/dashboard",
      "/templates/finance",
      "/templates/hr",
      "/templates/marketing",
      "/templates/medical",
      "/templates/calendar",
      "/templates/ai-profile",
      "/templates/ai-chat",
      "/templates/ai-image-generation",
      "/examples/shell-sidebar",
      "/examples/shell-sidebar/settings",
      "/examples/shell-sidebar/chat",
      "/examples/shell-topbar",
      "/examples/shell-topbar/chat",
    ].join(","),
  )
).split(",");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("playwright is not installed: bun add -d playwright && bunx playwright install chromium");
  process.exit(1);
}

const children = [];
const FAKE_PORT = 5301;
const useFake = args.includes("--fake");

/** Spawn a child, keep its output for diagnostics, and forward it when `--verbose`. */
function start(cmd, argv, env, label) {
  // `detached` puts the child in its own process group so shutdown can kill the
  // whole tree (`npx` → `vite` grandchild), not just the wrapper.
  const child = spawn(cmd, argv, {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...env },
    detached: process.platform !== "win32",
  });
  child.log = "";
  const tap = (d) => {
    child.log += String(d);
    if (args.includes("--verbose")) process.stdout.write(`[${label}] ${d}`);
  };
  child.stdout.on("data", tap);
  child.stderr.on("data", tap);
  child.on("error", (e) => (child.log += `\n[spawn error] ${e.message}`));
  children.push(child);
  return child;
}

/** Poll until the URL answers (any HTTP status), or throw with the child's output. */
async function waitFor(url, child, label, timeoutMs = 90000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      await fetch(url, { signal: AbortSignal.timeout(2000) });
      return;
    } catch {
      if (child.exitCode !== null) break;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error(
    `${label} did not start at ${url} (exit code ${child.exitCode}).\n--- ${label} output ---\n${child.log || "(no output)"}`,
  );
}

const shutdown = () => {
  for (const c of children) {
    if (c.exitCode !== null || !c.pid) continue;
    try {
      if (process.platform !== "win32") process.kill(-c.pid, "SIGTERM");
      else c.kill();
    } catch {
      c.kill();
    }
  }
};
process.on("exit", shutdown);
process.on("SIGINT", () => {
  shutdown();
  process.exit(130);
});

if (!base) {
  const env = { VITE_TEMPLATES: "true" };
  if (useFake) {
    const fake = start("node", ["scripts/fake-api.mjs"], { FAKE_API_PORT: String(FAKE_PORT) }, "fake-api");
    await waitFor(`http://localhost:${FAKE_PORT}/api/workforce`, fake, "fake-api", 20000);
    env.VITE_API_PROXY_TARGET = `http://localhost:${FAKE_PORT}`;
  }
  // `npx vite` rather than `bun run dev --`: no dependency on bun being on the
  // PATH of the spawning process, and no stdout indirection through bun.
  // `--preview` serves the production build (no dep optimisation, no HMR socket):
  // deterministic and fast on CI; `server.proxy` still applies to /api.
  const viteArgs = args.includes("--preview") ? ["vite", "preview"] : ["vite"];
  const vite = start("npx", [...viteArgs, "--port", String(PORT), "--strictPort", "--host", "127.0.0.1"], env, "vite");
  base = `http://127.0.0.1:${PORT}`;
  await waitFor(`${base}/`, vite, "vite");
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const failures = [];
const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "-"));

for (const route of ROUTES) {
  for (const width of [1280, 375]) {
    for (const dark of [false, true]) {
      const ctx = await browser.newContext({ viewport: { width, height: width < 500 ? 812 : 800 } });
      const page = await ctx.newPage();
      const name = `${slug(route)}-${width}${dark ? "-dark" : ""}`;
      page.on("pageerror", (e) => failures.push(`${name}: ${e.message.slice(0, 160)}`));
      page.on("console", (m) => {
        const t = m.text();
        if (m.type() === "error" && !/status of (404|500|502)|Failed to load resource|proxy error/.test(t)) {
          failures.push(`${name}: console ${t.slice(0, 160)}`);
        }
      });
      if (dark) await page.addInitScript(() => window.localStorage.setItem("boardui-theme", "dark"));
      try {
        // `load` + a settle wait rather than `networkidle`: the dev server's HMR
        // socket and streaming endpoints can keep the network busy forever.
        await page.goto(base + route, { waitUntil: "load", timeout: 30000 });
        if (dark) await page.evaluate(() => document.documentElement.classList.add("dark"));
        await page.waitForFunction(() => document.fonts.ready.then(() => true), null, { timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(args.includes("--preview") ? 900 : 1500);
        await page.screenshot({ path: `${OUT}/${name}.png` });
        console.log("shot", name);
      } catch (e) {
        failures.push(`${name}: ${String(e.message).slice(0, 160)}`);
      }
      await ctx.close();
    }
  }
}

await browser.close();
shutdown();
if (failures.length) {
  console.error("\nFailures:\n  " + [...new Set(failures)].join("\n  "));
  process.exit(1);
}
console.log(`\nOK — ${ROUTES.length * 4} screenshots in ${OUT}`);
// Explicit exit: the servers' pipes would otherwise keep the event loop alive.
process.exit(0);
