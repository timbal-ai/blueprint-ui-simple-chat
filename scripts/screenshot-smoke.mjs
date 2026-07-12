#!/usr/bin/env node
/**
 * Screenshot smoke check — renders the /gallery route (every project-owned
 * component in its states) at desktop + mobile widths, in light + dark, and
 * fails on console errors, uncaught page errors, or missing render.
 *
 * Layout regressions (cropped table headers, overflow, blank sections) become
 * visible artifacts on every PR instead of shipping unseen.
 *
 * Usage:
 *   VITE_GALLERY=true npm run build
 *   node scripts/screenshot-smoke.mjs [--out screenshots] [--port 4173]
 *
 * Requires playwright (installed in CI): `npm i -D playwright && npx playwright install chromium`
 */

import { mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const outDir = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "screenshots");
const port = Number(args.includes("--port") ? args[args.indexOf("--port") + 1] : 4173);

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];
const MODES = ["light", "dark"];
const ROUTES = [
  { path: "/gallery", name: "invoices" },
  { path: "/gallery/blocks", name: "blocks" },
  { path: "/gallery/pages/customer", name: "customer-detail" },
  { path: "/gallery/pages/workspace", name: "workspace-detail" },
  { path: "/gallery/chat", name: "embedded-chat" },
  { path: "/gallery/primitives/forms", name: "forms" },
  { path: "/gallery/primitives/overlays", name: "overlays" },
  { path: "/gallery/primitives/data", name: "data" },
  { path: "/gallery/charts", name: "charts" },
];

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`preview server did not come up at ${url}`);
}

async function main() {
  const { chromium } = await import("playwright");
  mkdirSync(outDir, { recursive: true });

  const preview = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], {
    stdio: "inherit",
    env: { ...process.env },
  });
  const kill = () => {
    if (!preview.killed) preview.kill("SIGTERM");
  };
  process.on("exit", kill);

  const base = `http://localhost:${port}`;
  await waitForServer(base);

  const browser = await chromium.launch();
  const failures = [];

  for (const mode of MODES) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: mode === "dark" ? "dark" : "light",
      });
      // next-themes reads this key before first paint.
      await context.addInitScript(
        ([key, value]) => localStorage.setItem(key, value),
        ["timbal-theme", mode],
      );
      const page = await context.newPage();

      const consoleErrors = [];
      page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        // The preview server has no Timbal backend — failed /api/* loads
        // (workforce list for the AI pill, etc.) are expected here, not bugs.
        const url = msg.location()?.url ?? "";
        if (url.includes("/api/") || msg.text().includes("/api/")) return;
        consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

      for (const route of ROUTES) {
        const label = `${route.name}/${vp.name}/${mode}`;
        await page.goto(`${base}${route.path}`, { waitUntil: "networkidle" });
        const mounted = await page
          .waitForSelector("[data-slot=sidebar-wrapper]", { timeout: 10_000 })
          .then(() => true)
          .catch(() => false);
        // Let fonts + entrance transitions settle before the shot.
        await page.waitForTimeout(800);

        const file = `${outDir}/${route.name}-${vp.name}-${mode}.png`;
        await page.screenshot({ path: file, fullPage: true });
        console.log(`shot ${file}`);

        if (!mounted) failures.push(`${label}: page did not mount`);
        for (const e of consoleErrors.splice(0)) failures.push(`${label}: ${e}`);

        // Horizontal page overflow at mobile width = a layout bug.
        if (vp.name === "mobile") {
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
          if (overflow > 1) {
            failures.push(`${label}: page overflows horizontally by ${overflow}px`);
          }
        }
      }

      await context.close();
    }
  }

  await browser.close();
  kill();

  if (failures.length > 0) {
    console.error("\nScreenshot smoke FAILED:");
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("\nScreenshot smoke passed.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
