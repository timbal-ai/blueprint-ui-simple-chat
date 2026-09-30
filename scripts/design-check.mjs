#!/usr/bin/env node
/**
 * design-check — the anti-sameness gate.
 *
 *   bun run design:check     (also the second half of `bun run lint`, and
 *   bun run dna:check         the name the platform's timbal-ui skill calls)
 *
 * Fails (exit 1) when:
 *  - DESIGN.md's Direction table still has placeholders once `/` renders a real
 *    screen. A fresh scaffold (`/` still on Placeholder.tsx) only warns, so the
 *    blueprint itself lints clean.
 *  - Entry / Start from is the KPI dashboard with an empty "Why".
 *  - The entry screen — the page on the `index` route of src/App.tsx, following
 *    a `<Navigate to>` and two levels of local imports — renders a stat-tile
 *    strip while DESIGN.md's Entry is not a dashboard with a reason: BoardUI
 *    `StatCards`, the legacy runtime app kit's `MetricRow` / `StatTile` / …, or
 *    hand-rolled tiles (a `.map()` of display-size numbers in a 3+ column grid).
 *  - Project code imports the legacy runtime app kit (`AppShell`, `Page`,
 *    `MetricRow`, anything from `@timbal-ai/timbal-react/app` or `/studio`
 *    outside src/components/timbal). This blueprint's shells, DataTable and
 *    WorkQueue replace it; mixing the two ships two design systems.
 *  - A page under a shell prints its own <h1> (the shell header already does).
 *  - A header description (nav item `description`, `<PageHeader description>`)
 *    runs past one line, or a page hard-codes a paragraph of explanation.
 *    Detail is revealed on demand (Sheet, Popover, Tooltip), not printed.
 * Warns (exit 0) when DESIGN.md names a non-blue accent while
 * src/styles/brand.css still ships the default ramp.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import ts from "typescript";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = resolve(ROOT, "src");
const APP = resolve(SRC, "App.tsx");
const rel = (file) => relative(ROOT, file);
const design = readFileSync(resolve(ROOT, "DESIGN.md"), "utf8");
const brand = existsSync(resolve(SRC, "styles/brand.css")) ? readFileSync(resolve(SRC, "styles/brand.css"), "utf8") : "";

const REQUIRED = ["Product", "First job", "Shell", "Entry", "Accent", "Density", "Start from", "Tone"];
const problems = [];
const warnings = [];

/** One line of header copy at 1280px, and the point where page copy becomes a wall. */
const DESCRIPTION_MAX = 90;
const PARAGRAPH_MAX = 180;

/* ------------------------------------------------------------ source utils */

const VENDORED = /\/src\/components\/(base|application|foundations)\//;
const OURS = /\/src\/components\/timbal\//;

const sources = new Map();
function sourceOf(file) {
  if (!sources.has(file)) {
    const text = readFileSync(file, "utf8");
    sources.set(file, { text, sf: ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX) });
  }
  return sources.get(file);
}

function walk(node, fn) {
  fn(node);
  ts.forEachChild(node, (child) => walk(child, fn));
}

function projectFiles(dir = SRC, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (!VENDORED.test(`${full}/`) && entry.name !== "shims") projectFiles(full, out);
    } else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

/** `@/x` → src/x; relative → from the importing file. Tries .tsx/.ts and /index. */
function resolveImport(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = resolve(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec);
  else return null;
  for (const candidate of [base, `${base}.tsx`, `${base}.ts`, resolve(base, "index.tsx"), resolve(base, "index.ts")]) {
    if (/\.tsx?$/.test(candidate) && existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

/** Imports of a file: [{ spec, names: [local names] }]. */
function importsOf(file) {
  const { sf } = sourceOf(file);
  const out = [];
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt) || !ts.isStringLiteral(stmt.moduleSpecifier)) continue;
    const names = [];
    const clause = stmt.importClause;
    if (clause?.name) names.push(clause.name.text);
    if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
      for (const el of clause.namedBindings.elements) names.push((el.propertyName ?? el.name).text);
    }
    out.push({ spec: stmt.moduleSpecifier.text, names });
  }
  return out;
}

const tagOf = (el) => el.tagName.getText();
function attrOf(el, name) {
  for (const a of el.attributes.properties) {
    if (ts.isJsxAttribute(a) && a.name.getText() === name) return a;
  }
  return null;
}

/** The static text of a string-ish attribute or expression (template holes dropped). */
function staticText(node) {
  if (!node) return null;
  if (ts.isJsxAttribute(node)) {
    if (!node.initializer) return null;
    return staticText(node.initializer);
  }
  if (ts.isJsxExpression(node)) return node.expression ? staticText(node.expression) : null;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isTemplateExpression(node)) return node.head.text + node.templateSpans.map((s) => s.literal.text).join("");
  return null;
}

/* ------------------------------------------------------------- DESIGN.md */

const decisions = {};
const directionProblems = [];
for (const axis of REQUIRED) {
  const row = design.split("\n").find((l) => l.startsWith(`| ${axis} `));
  if (!row) {
    directionProblems.push(`DESIGN.md: missing "${axis}" row in the Direction table`);
    continue;
  }
  const cells = row.split("|").map((c) => c.trim());
  const decision = cells[2] ?? "";
  const why = cells[3] ?? "";
  decisions[axis] = { decision, why };
  if (!decision || /^_/.test(decision)) {
    directionProblems.push(`DESIGN.md: "${axis}" is still a placeholder — decide it before building screens`);
  }
}

// The KPI dashboard (stat tiles + trend chart + table) is the default every
// generated app converges on. It is allowed — with a reason in the "Why" cell.
for (const axis of ["Entry", "Start from"]) {
  const d = decisions[axis];
  if (!d) continue;
  if (/dashboard|overview|kpi/i.test(d.decision) && !/^_/.test(d.decision) && (!d.why || /^_/.test(d.why))) {
    directionProblems.push(
      `DESIGN.md: "${axis}" is the KPI dashboard with an empty "Why" — that is the screen every project ships by default. ` +
        `Either name the brief's metrics that justify it, or open on the product's primary object (list, board, record, editor, schedule, conversation, or a WorkQueue for a product with several modules).`,
    );
  }
}

/* ---------------------------------------------------- the entry screen `/` */

// DESIGN.md can say "list + detail" while the page opens on four stat tiles.
// Resolve `<Route index element={…}>` in src/App.tsx (through a <Navigate>)
// to its page file and scan it plus its local imports.

const WRAPPERS = new Set(["AuthGuard", "Suspense", "Fragment", "SessionProvider", "ErrorBoundary"]);
const DASHBOARD_RE = /dashboard|kpi|metric|overview|stat/i;
const LEGACY_METRICS = new Set(["MetricRow", "MetricTile", "StatTile", "MetricChartCard", "StatOverview", "StatGrid", "HeroMetricCard"]);
const LEGACY_KIT = new Set([
  ...LEGACY_METRICS,
  "AppShell", "AppShellSidebarTrigger", "Page", "Section", "StudioSidebar", "SurfaceCard", "FilteredDataTable",
  "DataTable", "FilterBar", "ChartPanel", "InfoCard", "AlertCard", "DescriptionList", "Kanban", "AppCopilot",
  "EmptyState", "FormSection", "FieldRow", "SettingsSection", "PageHeader",
]);
const RUNTIME = /^@timbal-ai\/timbal-react(\/.*)?$/;
const BIG_NUMBER = /\btext-(display-\d|title-1|large-title)-|\btext-[3-6]xl\b/;

const normalizePath = (p) => (p ?? "").replace(/\/\*$/, "").replace(/^\/+|\/+$/g, "");

/** Every <Route> in App.tsx: { index, path, component, navigate }. */
function appRoutes() {
  if (!existsSync(APP)) return [];
  const { sf } = sourceOf(APP);
  const routes = [];
  walk(sf, (n) => {
    if (!(ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) || tagOf(n) !== "Route") return;
    const element = attrOf(n, "element");
    let component = null;
    let navigate = null;
    if (element?.initializer) {
      walk(element.initializer, (m) => {
        if (!(ts.isJsxSelfClosingElement(m) || ts.isJsxOpeningElement(m))) return;
        const name = tagOf(m);
        if (name === "Navigate") navigate = staticText(attrOf(m, "to"));
        else if (!component && /^[A-Z]/.test(name) && !WRAPPERS.has(name)) component = name;
      });
    }
    routes.push({ index: Boolean(attrOf(n, "index")), path: staticText(attrOf(n, "path")), component, navigate });
  });
  return routes;
}

/** The component names `/` renders, after one <Navigate> hop. */
function entryComponents() {
  const routes = appRoutes();
  const out = [];
  for (const route of routes.filter((r) => r.index)) {
    let target = route;
    if (!target.component && target.navigate) {
      const to = normalizePath(target.navigate.split("?")[0]);
      target = routes.find((r) => !r.index && normalizePath(r.path) === to) ?? target;
    }
    if (target.component) out.push(target.component);
  }
  return out;
}

/** The page file plus its local imports (two levels), vendored and timbal/ excluded. */
function entryFiles(component) {
  const spec = importsOf(APP).find((imp) => imp.names.includes(component))?.spec;
  const page = spec ? resolveImport(spec, APP) : null;
  if (!page) return [];
  const seen = new Set([page]);
  let frontier = [page];
  for (let depth = 0; depth < 2; depth++) {
    const next = [];
    for (const file of frontier) {
      for (const imp of importsOf(file)) {
        const child = resolveImport(imp.spec, file);
        if (child && !seen.has(child) && !VENDORED.test(child) && !OURS.test(child)) {
          seen.add(child);
          next.push(child);
        }
      }
    }
    frontier = next;
  }
  return [...seen];
}

/** Why this file reads as a stat-tile strip, or null. */
function statStripIn(file) {
  const { text, sf } = sourceOf(file);
  if (/components\/application\/dashboard\/stat-cards|<StatCards\b/.test(text)) return "BoardUI `StatCards`";
  for (const imp of importsOf(file)) {
    const legacy = RUNTIME.test(imp.spec) ? imp.names.filter((n) => LEGACY_METRICS.has(n)) : [];
    if (legacy.length) return `the legacy runtime kit's \`${legacy.join("`, `")}\``;
  }
  if (!/\bgrid-cols-[3-6]\b/.test(text)) return null;
  let found = null;
  walk(sf, (n) => {
    if (found || !ts.isCallExpression(n) || !ts.isPropertyAccessExpression(n.expression) || n.expression.name.text !== "map") return;
    const callback = n.arguments[0];
    if (!callback || !(ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))) return;
    walk(callback, (m) => {
      if (found || !ts.isJsxAttribute(m) || m.name.getText() !== "className" || !m.initializer) return;
      walk(m.initializer, (s) => {
        if (!found && (ts.isStringLiteralLike(s) || ts.isTemplateHead(s) || ts.isTemplateMiddle(s) || ts.isTemplateTail(s)) && BIG_NUMBER.test(s.text)) {
          found = "hand-rolled stat tiles (a mapped list of display-size numbers in a multi-column grid)";
        }
      });
    });
  });
  return found;
}

const entry = entryComponents();
const scaffold = entry.includes("Placeholder");
if (scaffold) {
  warnings.push("`/` still renders Placeholder.tsx. Replace it with the entry screen (registry/screens.md) and delete the file.");
}

const statStrips = [];
for (const component of entry.filter((c) => c !== "Placeholder")) {
  for (const file of entryFiles(component)) {
    const why = statStripIn(file);
    if (why) statStrips.push(`${rel(file)} (${why})`);
  }
}
if (statStrips.length) {
  const d = decisions.Entry ?? { decision: "", why: "" };
  const declaredDashboard = DASHBOARD_RE.test(d.decision) && d.why && !/^_/.test(d.why);
  if (!declaredDashboard) {
    problems.push(
      `The entry route renders a stat-tile strip: ${statStrips.join("; ")}. DESIGN.md's "Entry" says "${d.decision || "?"}". ` +
        `A KPI row above the primary object is the layout every generated app converges on. Open "/" on the object the user works on ` +
        `(a product with several modules opens on a WorkQueue of what needs them — /examples/workspace); put counts in the header's ` +
        `description line, and move tiles to a metrics route the brief asked for. Or record "KPI dashboard" as the Entry with the brief's reason in the Why cell.`,
    );
  }
}

/* ------------------------------------------------------ whole-project scans */

const files = projectFiles();
const shellApp = existsSync(APP) && /\b(SidebarShell|TopbarShell)\b/.test(sourceOf(APP).text);
const PAGE_SKIP = /\/src\/pages\/(templates|examples)\/|\/(Home|Placeholder|NotFound)\.tsx$/;

for (const file of files) {
  if (OURS.test(file)) continue;
  const { text, sf } = sourceOf(file);
  const isPage = file.includes("/src/pages/") && !file.includes("/src/pages/templates/");

  // Legacy runtime app kit: a second design system.
  for (const imp of importsOf(file)) {
    if (!RUNTIME.test(imp.spec)) continue;
    const subpath = /\/(app|studio)$/.test(imp.spec);
    const legacy = subpath ? imp.names : imp.names.filter((n) => LEGACY_KIT.has(n));
    if (legacy.length) {
      problems.push(
        `${rel(file)} imports ${legacy.map((n) => `\`${n}\``).join(", ")} from "${imp.spec}" — the legacy runtime app kit. ` +
          `This blueprint is BoardUI: shells from @/components/timbal/shells (SidebarShell, TopbarShell, PageHeader), ` +
          `DataTable and WorkQueue from @/components/timbal, cards from @/components/application, AssistantPill for the copilot (registry/INDEX.md).`,
      );
    }
  }

  // Under a shell the header prints the title; a page <h1> repeats it.
  if (shellApp && isPage && !PAGE_SKIP.test(file) && /<h1[\s>]/.test(text)) {
    problems.push(
      `${rel(file)} renders its own <h1> inside a shell. The shell header already shows the page title ` +
        `(and the nav item's \`description\`); the page shows it twice. Remove the heading — use <PageHeader title description actions /> ` +
        `from @/components/timbal/shells for what only the page knows.`,
    );
  }

  // Copy budgets: one-line descriptions, no hard-coded explanation walls.
  if (!isPage && !file.endsWith("/src/App.tsx")) continue;
  walk(sf, (n) => {
    if (ts.isObjectLiteralExpression(n)) {
      const props = new Map(
        n.properties.filter((p) => ts.isPropertyAssignment(p) && p.name && ts.isIdentifier(p.name)).map((p) => [p.name.text, p.initializer]),
      );
      const description = props.has("path") && props.has("label") ? staticText(props.get("description")) : null;
      if (description && description.length > DESCRIPTION_MAX) {
        problems.push(
          `${rel(file)}: nav item "${staticText(props.get("label")) ?? "?"}" has a ${description.length}-character description. ` +
            `It is the one line under the page title (≤ ${DESCRIPTION_MAX}): say what the screen is for, or show live values through <PageHeader description>.`,
        );
      }
    }
    if ((ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) && tagOf(n) === "PageHeader") {
      const description = staticText(attrOf(n, "description"));
      if (description && description.length > DESCRIPTION_MAX) {
        problems.push(
          `${rel(file)}: <PageHeader description> is ${description.length} characters of fixed copy. One line (≤ ${DESCRIPTION_MAX}): ` +
            `live values ("3 overdue · $11,119 outstanding"), not an explanation. How a number is computed goes behind an info Popover or Tooltip.`,
        );
      }
    }
    if (ts.isJsxText(n)) {
      const copy = n.text.replace(/\s+/g, " ").trim();
      if (copy.length > PARAGRAPH_MAX) {
        const { line } = sf.getLineAndCharacterOfPosition(n.getStart());
        problems.push(
          `${rel(file)}:${line + 1} hard-codes a ${copy.length}-character paragraph ("${copy.slice(0, 60)}…"). ` +
            `Screens reveal detail on demand: cut it to one line, or move it into the record's Sheet, a Popover or a Tooltip (registry/screens.md → progressive disclosure).`,
        );
      }
    }
  });
}

/* ------------------------------------------------------------------ report */

if (scaffold && directionProblems.length) {
  warnings.push(`DESIGN.md's Direction table is not filled yet (${directionProblems.length} rows) — required before "/" renders a real screen.`);
} else problems.unshift(...directionProblems);

// Comments stripped first: brand.css ships the violet re-tint as a commented-out example.
const brandCode = brand.replace(/\/\*[\s\S]*?\*\//g, "");
const accentSet = /^\s*--color-accent-500:\s*var\(--color-(?!blue-)/m.test(brandCode) || /^\s*--color-accent-500:\s*(oklch|#|rgb|hsl)/m.test(brandCode);
const accentRow = design.split("\n").find((l) => l.startsWith("| Accent "));
const accentDecision = accentRow ? (accentRow.split("|")[2] ?? "").trim().toLowerCase() : "";
if (!accentSet && accentDecision && !/^_/.test(accentDecision) && !/blue/.test(accentDecision)) {
  warnings.push(
    `src/styles/brand.css still uses the default blue accent ramp while DESIGN.md says "${accentDecision}". ` +
      "Set the eleven --color-accent-* stops (see brand.css) or record why blue is right.",
  );
}

for (const w of warnings) console.warn(`design-check: warning — ${w}`);

if (problems.length) {
  console.error("design-check failed:\n  " + problems.join("\n  "));
  console.error(
    "\nDESIGN.md is the contract: fill the Direction table and make the code match it. " +
      "See registry/INDEX.md → Direction menu and registry/screens.md → entry screens and progressive disclosure.",
  );
  process.exit(1);
}

console.log("design-check: " + (scaffold ? "fresh scaffold, nothing built yet." : "direction recorded" + (accentSet ? ", accent customised." : ".")));
