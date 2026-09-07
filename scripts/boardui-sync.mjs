#!/usr/bin/env node
/**
 * boardui-sync — vendor the whole BoardUI design system (free + Pro) into src/.
 *
 *   bun run boardui:sync            # full sync (needs `npx boardui login <key>` once per machine)
 *   bun run boardui:sync -- --check # list drift vs the pinned version without writing
 *
 * Rules this script encodes:
 *  - Vendored files are NEVER hand-edited. Next.js imports are absorbed by
 *    src/shims/* through vite/tsconfig aliases, so `--overwrite` is always safe.
 *  - Items we do not ship are deleted after the CLI resolves them transitively
 *    (BoardUI site chrome, the Vercel-AI chat starter, the Next route handler).
 *  - BoardUI's globals.css header (its own `@import "tailwindcss"` and the dark
 *    variant) is stripped because src/index.css and the Timbal runtime stylesheet
 *    already provide both. Everything else in the file is upstream verbatim.
 *  - The BoardUI agent skill references are refreshed into registry/ so the
 *    catalog the agent reads is the one BoardUI publishes.
 *  - The pinned CLI version lives in package.json → "timbal.boardui".
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, cpSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "src");
const pkgPath = join(ROOT, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const VERSION = pkg.timbal?.boardui ?? "latest";
const CHECK = process.argv.includes("--check");

/** Everything installable. Free items resolve their own foundations. */
const FREE = [
  // foundations
  "theme", "typography", "globals", "cx", "use-dismiss-on-outside-press", "use-count-up", "chevrons", "logo",
  // base
  "button", "icon-button", "link-button", "button-group", "close-button", "input", "checkbox", "checkbox-card",
  "radio", "radio-card", "switch", "switch-card", "select", "slider", "social-button", "dropdown", "divider",
  "file-upload", "tabs", "table", "tooltip", "badge", "chip", "status-dot", "avatar", "breadcrumb", "pagination",
  "carousel", "input-otp", "segmented-control", "announcement", "notification", "kbd", "date-picker",
  "date-range-picker", "meeting-scheduler",
  // application (free)
  "theme-toggle", "agent-thinking", "agent-log", "composer-loader", "sidebar", "settings-modal", "auth-card",
  "notification-center", "data-table", "stat-cards", "revenue-chart-card", "orders-chart-card",
  "important-alerts-card", "patient-info-card",
];
const PRO = [
  "web-search", "task-list", "composer", "composer-panel", "composer-attachments", "agent-progress",
  "agent-limits-card", "questionnaire", "calendar", "earnings-chart-card", "line-chart-card", "contributions-card",
  "radar-chart-card", "radial-chart-card", "funnel-chart-card", "sankey-chart-card", "stage-bars-card",
  "bar-list-card", "area-chart-card", "combo-chart-card", "scatter-chart-card", "heatmap-chart-card", "steps-card",
  "sleep-score-card", "activity-rings-card", "most-active-days-card",
  "template-home-dashboard", "template-marketing", "template-finance", "template-hr", "template-medical-profile",
  "template-ai-chat", "template-ai-profile", "template-ai-image-generation",
];

/** Pulled transitively by the CLI but not part of the blueprint. */
const EXCLUDE = [
  "src/components/application/docs",        // boardui.com component previews
  "src/components/application/landing/hero-rays",      // marketing hero shaders
  "src/components/application/landing/pro-logo-mark.tsx",
  // NOTE: landing/liquid-glass* + tuning/* stay — ai-chat-composer depends on them.
  "src/components/application/templates",   // "buy Pro" prompt cards
  "src/components/application/agent-chat",  // Vercel AI chat starter — Timbal runtime is the engine
  "src/components/application/app-shell",   // chat-starter frame (Next usePathname) — we ship timbal/shells
  "src/app",                                // Next.js pages + api route
  "src/lib/og.ts",
  "public/carousel",                        // auth-card demo artwork (1.3 MB)
];

/** Vendored dirs that get wiped before a sync so renamed/removed upstream files don't linger. */
const VENDORED = [
  "src/components/base",
  "src/components/application",
  "src/components/foundations",
];

function sh(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  return execSync(cmd, { cwd: ROOT, stdio: opts.capture ? "pipe" : "inherit", encoding: "utf8", ...opts });
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

// ── 1. wipe vendored trees ──────────────────────────────────────────────────
if (!CHECK) {
  for (const rel of VENDORED) rmSync(join(ROOT, rel), { recursive: true, force: true });
}

// ── 2. install everything ───────────────────────────────────────────────────
const names = [...FREE, ...PRO].join(" ");
const flags = CHECK ? "-y" : "--overwrite -y";
const depsBefore = JSON.stringify(pkg.dependencies);
try {
  sh(`npx -y boardui@${VERSION} add ${names} ${flags} -d src`);
} catch (e) {
  console.error("\nboardui add failed. Pro items need `npx boardui login <key>` on this machine.");
  process.exit(1);
}

// ── 3. drop what we don't ship ──────────────────────────────────────────────
for (const rel of EXCLUDE) rmSync(join(ROOT, rel), { recursive: true, force: true });

// The CLI adds @tailwindcss/postcss for Next projects; Vite uses @tailwindcss/vite.
const after = JSON.parse(readFileSync(pkgPath, "utf8"));
let touched = false;
for (const dep of ["@tailwindcss/postcss", "ai", "zod", "@ai-sdk/react", "@ai-sdk/openai", "@ai-sdk/anthropic", "@ai-sdk/google"]) {
  if (after.dependencies?.[dep] && !JSON.parse(depsBefore)[dep]) {
    delete after.dependencies[dep];
    touched = true;
  }
}
if (touched) writeFileSync(pkgPath, JSON.stringify(after, null, 2) + "\n");

// ── 4. strip the globals.css header (tailwind + dark variant come from index.css / runtime) ──
const globalsPath = join(SRC, "styles/globals.css");
if (existsSync(globalsPath)) {
  const src = readFileSync(globalsPath, "utf8");
  const stripped = src
    .replace(/^@import "tailwindcss";\s*\n/m, "")
    .replace(/^@custom-variant dark[^\n]*\n/m, "");
  const header =
    "/* BoardUI globals — vendored by scripts/boardui-sync.mjs. The upstream\n" +
    " * `@import \"tailwindcss\"` and `@custom-variant dark` lines are stripped here\n" +
    " * because src/index.css imports Tailwind once and @timbal-ai/timbal-react/styles.css\n" +
    " * already registers the `dark` variant. Do not hand-edit; re-run boardui:sync. */\n";
  writeFileSync(globalsPath, header + stripped);
}

// ── 5. refresh the BoardUI agent skill references into registry/ ────────────
const skillTmp = join(ROOT, "node_modules/.tmp/boardui-skill");
rmSync(skillTmp, { recursive: true, force: true });
mkdirSync(skillTmp, { recursive: true });
sh(`npx -y boardui@${VERSION} skill -p ${skillTmp} --force`);
const registry = join(ROOT, "registry");
mkdirSync(registry, { recursive: true });
for (const f of ["components.md", "patterns.md", "theming.md", "motion.md"]) {
  const from = join(skillTmp, "references", f);
  if (existsSync(from)) cpSync(from, join(registry, f));
}

// ── 6. sanity: no kept file imports an excluded path; no `next/` import escapes the shims ──
const kept = walk(join(SRC, "components")).filter((p) => /\.(tsx?|css)$/.test(p));
const problems = [];
for (const file of kept) {
  // Ignore template literals: ai-chat's code panel embeds mock source as strings.
  const text = readFileSync(file, "utf8").replace(/`[\s\S]*?`/g, "``");
  const specifiers = [...text.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);
  for (const ex of ["application/docs/", "application/landing/hero-rays", "application/landing/pro-logo-mark", "application/templates/", "application/agent-chat/", "application/app-shell/", "@/lib/og", "@/app/"]) {
    if (specifiers.some((s) => s.includes(ex))) problems.push(`${file.replace(ROOT + "/", "")} imports excluded ${ex}`);
  }
  const nextImports = specifiers.filter((s) => s === "next" || s.startsWith("next/"));
  for (const n of nextImports) {
    if (!["next/image", "next/link", "next/navigation"].includes(n)) problems.push(`${file.replace(ROOT + "/", "")} imports ${n} (no shim)`);
  }
}
if (problems.length) {
  console.error("\nSync produced files the blueprint cannot build:\n  " + problems.join("\n  "));
  process.exit(1);
}

// ── 7. record the version actually installed ────────────────────────────────
const installed = sh(`npx -y boardui@${VERSION} --version`, { capture: true }).trim();
const final = JSON.parse(readFileSync(pkgPath, "utf8"));
final.timbal = { ...(final.timbal ?? {}), blueprint: "ui-v3", boardui: installed };
writeFileSync(pkgPath, JSON.stringify(final, null, 2) + "\n");

console.log(`\nBoardUI ${installed} vendored. Next: bun install && bun run registry:build && bun run build`);
