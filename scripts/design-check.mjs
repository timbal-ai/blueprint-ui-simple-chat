#!/usr/bin/env node
/**
 * design-check — the anti-sameness gate.
 *
 *   bun run design:check
 *
 * Fails (exit 1) when DESIGN.md's direction table still has placeholders, i.e.
 * screens are being built without a recorded decision on shell / entry screen /
 * density / template / tone — or when the entry screen or starting template is
 * the KPI dashboard without a written reason (the one screen every generated
 * app drifts to). It also reads the code: the page(s) mounted on the `index`
 * route in src/App.tsx are resolved and scanned for `StatCards` / `stat-cards`
 * (one level of local imports deep). A stat-tile strip on `/` while DESIGN.md
 * says the entry is a list / board / record / editor / schedule / conversation
 * is the same drift with a different label, and fails the same way. It also
 * fails when a page under a shell prints its own <h1>: the shell header already
 * shows the title, so the screen opens on the same word twice.
 * Warns (exit 0) only when DESIGN.md names a non-blue accent while
 * src/styles/brand.css still ships the default ramp (blue is the expected
 * default; it needs no justification), or when `/` is still Placeholder.tsx.
 *
 * Run it before you build screens; CI runs it too.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const design = readFileSync(resolve(ROOT, "DESIGN.md"), "utf8");
const brand = existsSync(resolve(ROOT, "src/styles/brand.css"))
  ? readFileSync(resolve(ROOT, "src/styles/brand.css"), "utf8")
  : "";

const REQUIRED = ["Product", "Shell", "Entry", "Accent", "Density", "Start from", "Tone"];
const problems = [];
const decisions = {};

for (const axis of REQUIRED) {
  const row = design.split("\n").find((l) => l.startsWith(`| ${axis} `));
  if (!row) {
    problems.push(`DESIGN.md: missing "${axis}" row in the Direction table`);
    continue;
  }
  const cells = row.split("|").map((c) => c.trim());
  const decision = cells[2] ?? "";
  const why = cells[3] ?? "";
  decisions[axis] = { decision, why };
  if (!decision || /^_.*_$/.test(decision) || /^_/.test(decision)) {
    problems.push(`DESIGN.md: "${axis}" is still a placeholder — decide it before building screens`);
  }
}

// The KPI dashboard (stat tiles + trend chart + table) is the default every
// generated app converges on. It is allowed — with a reason in the "Why" cell.
for (const axis of ["Entry", "Start from"]) {
  const d = decisions[axis];
  if (!d) continue;
  if (/dashboard|overview|kpi/i.test(d.decision) && !/^_/.test(d.decision) && (!d.why || /^_/.test(d.why))) {
    problems.push(
      `DESIGN.md: "${axis}" is the KPI dashboard with an empty "Why" — that is the screen every project ships by default. ` +
        `Either name the brief's metrics that justify it, or open on the product's primary object (list, board, record, editor, schedule, conversation).`,
    );
  }
}

// ── The code side: what does `/` actually render? ─────────────────────────────
// DESIGN.md can say "list + detail" while the page opens on four stat tiles.
// Resolve every `<Route index element={…}>` in src/App.tsx to its page file
// and look for StatCards there (and in the files it imports from src/pages).

const WRAPPERS = new Set(["AuthGuard", "Suspense", "Fragment", "Navigate", "SessionProvider"]);
const DASHBOARD_RE = /dashboard|kpi|metric|overview|stat/i;

/** `@/x` → src/x; relative → from the importing file. Tries .tsx/.ts and /index. */
function resolveImport(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = resolve(ROOT, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null;
  for (const candidate of [base, `${base}.tsx`, `${base}.ts`, resolve(base, "index.tsx"), resolve(base, "index.ts")]) {
    if (/\.tsx?$/.test(candidate) && existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Map local identifier → import specifier for one file (default + named imports). */
function importsOf(src) {
  const map = new Map();
  const re = /import\s+(?:(\w+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) {
    const [, def, named, spec] = m;
    if (def) map.set(def, spec);
    if (named) {
      for (const part of named.split(",")) {
        const name = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (name) map.set(name, spec);
      }
    }
  }
  return map;
}

/** Components rendered by `<Route index element={…}>` (innermost non-wrapper tag). */
function indexRouteComponents(appSrc) {
  const out = [];
  const re = /<Route\b[^>]*\bindex\b[^>]*\belement=\{/g;
  let m;
  while ((m = re.exec(appSrc))) {
    // Walk the balanced braces of the element prop.
    let depth = 1;
    let i = m.index + m[0].length;
    const start = i;
    while (i < appSrc.length && depth > 0) {
      if (appSrc[i] === "{") depth++;
      else if (appSrc[i] === "}") depth--;
      i++;
    }
    const expr = appSrc.slice(start, i - 1);
    const tags = [...expr.matchAll(/<([A-Z]\w*)/g)].map((t) => t[1]).filter((t) => !WRAPPERS.has(t));
    if (tags.length) out.push(tags.at(-1));
  }
  return out;
}

function usesStatCards(src) {
  return /components\/application\/dashboard\/stat-cards|<StatCards\b/.test(src);
}

function entryUsesStatTiles() {
  const appPath = resolve(ROOT, "src/App.tsx");
  if (!existsSync(appPath)) return null;
  const appSrc = readFileSync(appPath, "utf8");
  const appImports = importsOf(appSrc);
  const hits = [];
  for (const name of indexRouteComponents(appSrc)) {
    if (name === "Placeholder") {
      console.warn("design-check: warning — `/` still renders Placeholder.tsx. Replace it with the entry screen and delete the file.");
      continue;
    }
    const spec = appImports.get(name);
    const file = spec ? resolveImport(spec, appPath) : null;
    if (!file) continue;
    const src = readFileSync(file, "utf8");
    if (usesStatCards(src)) {
      hits.push(file);
      continue;
    }
    // One level deeper: the page's own local imports under src/pages.
    for (const [, childSpec] of importsOf(src)) {
      const child = resolveImport(childSpec, file);
      if (child && child.includes("/src/pages/") && usesStatCards(readFileSync(child, "utf8"))) {
        hits.push(child);
        break;
      }
    }
  }
  return hits;
}

// ── Duplicate page headers ────────────────────────────────────────────────────
// Under SidebarShell / TopbarShell the shell prints the title (and the nav
// item's description). A page that also renders an <h1> shows the title twice.
// Pages set what the shell can't know through <PageHeader> instead.
function pagesWithOwnHeading() {
  const appPath = resolve(ROOT, "src/App.tsx");
  if (!existsSync(appPath)) return [];
  const appSrc = readFileSync(appPath, "utf8");
  if (!/\b(SidebarShell|TopbarShell)\b/.test(appSrc)) return [];
  const pagesDir = resolve(ROOT, "src/pages");
  if (!existsSync(pagesDir)) return [];
  const skip = /\/(templates|examples)\/|\/(Home|Placeholder|NotFound)\.tsx$/;
  const hits = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.tsx$/.test(entry.name) && !skip.test(full) && /<h1[\s>]/.test(readFileSync(full, "utf8"))) hits.push(full);
    }
  };
  walk(pagesDir);
  return hits;
}

for (const file of pagesWithOwnHeading()) {
  problems.push(
    `${file.replace(ROOT + "/", "")} renders its own <h1> inside a shell. The shell header already shows the page title ` +
      `(and the nav item's \`description\`); the page shows it twice. Remove the heading — use <PageHeader title description actions /> ` +
      `from @/components/timbal/shells for what only the page knows.`,
  );
}

const statTilePages = entryUsesStatTiles() ?? [];
if (statTilePages.length) {
  const entry = decisions.Entry ?? { decision: "", why: "" };
  const declaredDashboard = DASHBOARD_RE.test(entry.decision) && entry.why && !/^_/.test(entry.why);
  if (!declaredDashboard) {
    problems.push(
      `The entry route renders StatCards (${statTilePages.map((p) => p.replace(ROOT + "/", "")).join(", ")}) ` +
        `but DESIGN.md's "Entry" says "${entry.decision || "?"}". A KPI strip above the primary object is the layout every ` +
        `generated app converges on. Either remove the stat tiles from "/" (they belong on a metrics screen the brief asked for) ` +
        `or record "KPI dashboard" as the Entry with the brief's reason in the Why cell.`,
    );
  }
}

// Comments stripped first: brand.css ships the violet re-tint as a commented-out example.
const brandCode = brand.replace(/\/\*[\s\S]*?\*\//g, "");
const accentSet = /^\s*--color-accent-500:\s*var\(--color-(?!blue-)/m.test(brandCode) || /^\s*--color-accent-500:\s*(oklch|#|rgb|hsl)/m.test(brandCode);
const accentRow = design.split("\n").find((l) => l.startsWith("| Accent "));
const accentDecision = accentRow ? (accentRow.split("|")[2] ?? "").trim().toLowerCase() : "";

if (problems.length) {
  console.error("design-check failed:\n  " + problems.join("\n  "));
  console.error("\nDESIGN.md is the contract: fill the Direction table (shell, entry screen, accent, density, template-or-compose, tone) and make the code match it. See registry/INDEX.md → Direction menu and registry/screens.md → entry screens.");
  process.exit(1);
}

if (!accentSet && !/blue/.test(accentDecision)) {
  console.warn(
    "design-check: warning — src/styles/brand.css still uses the default blue accent ramp while DESIGN.md says " +
      `"${accentDecision || "?"}". Set the eleven --color-accent-* stops (see brand.css) or record why blue is right.`,
  );
}

console.log("design-check: direction recorded" + (accentSet ? ", accent customised." : "."));
