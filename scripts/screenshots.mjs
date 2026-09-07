#!/usr/bin/env node
/**
 * screenshots — shoot every route at 1280 and 375 px (light + dark) so a
 * change can be reviewed visually before it ships.
 *
 *   bun run screenshots                    # boots `vite` on :5199, shoots, exits
 *   bun run screenshots -- --base http://localhost:5173   # against a running server
 *   bun run screenshots -- --routes /,/login             # subset
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
      "/login",
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

let server;
if (!base) {
  server = spawn("bun", ["run", "dev", "--", "--port", String(PORT), "--strictPort"], {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, VITE_TEMPLATES: "true" },
  });
  base = `http://localhost:${PORT}`;
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error("vite did not start")), 30000);
    server.stdout.on("data", (d) => {
      if (String(d).includes("Local:")) {
        clearTimeout(t);
        res();
      }
    });
  });
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
        await page.goto(base + route, { waitUntil: "networkidle", timeout: 30000 });
        if (dark) await page.evaluate(() => document.documentElement.classList.add("dark"));
        await page.waitForTimeout(700);
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
server?.kill();
if (failures.length) {
  console.error("\nFailures:\n  " + [...new Set(failures)].join("\n  "));
  process.exit(1);
}
console.log(`\nOK — ${ROUTES.length * 4} screenshots in ${OUT}`);
