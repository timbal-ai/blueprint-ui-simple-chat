#!/usr/bin/env node
/**
 * Build a shadcn-compatible registry from the project-owned components.
 *
 * Emits `public/r/<name>.json` (registry-item schema) plus a `registry.json`
 * index, so any Timbal project — or any shadcn project — can pull a vetted
 * component with the standard tooling:
 *
 *   npx shadcn@latest add https://<host>/r/data-table.json
 *
 * Covers the whole project-owned tree: shadcn-shaped `ui/*`, the block kit,
 * page templates, the BoardUI `base/*` primitives and `application/*` Pro
 * cards (scanned recursively), foundations, hooks, and utils. npm
 * dependencies are inferred from imports; `@/components/**` + `@/hooks/*` +
 * `@/utils/*` imports become registryDependencies so `shadcn add` resolves
 * the graph; `@/lib/*` helpers are bundled into each item.
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "r");

const SOURCES = [
  { dir: "src/components/ui", type: "registry:ui", targetDir: "components/ui" },
  { dir: "src/components/app", type: "registry:component", targetDir: "components/app" },
  { dir: "src/components/blocks", type: "registry:block", targetDir: "components/blocks" },
  { dir: "src/components/pages", type: "registry:block", targetDir: "components/pages" },
  { dir: "src/components/chat", type: "registry:component", targetDir: "components/chat" },
  // BoardUI kit — nested one-folder-per-component trees, scanned recursively.
  { dir: "src/components/base", type: "registry:ui", targetDir: "components/base", recursive: true },
  { dir: "src/components/application", type: "registry:block", targetDir: "components/application", recursive: true },
  { dir: "src/components/foundations", type: "registry:component", targetDir: "components/foundations", recursive: true },
  { dir: "src/hooks", type: "registry:hook", targetDir: "hooks" },
  { dir: "src/utils", type: "registry:lib", targetDir: "utils" },
];

/** All .ts/.tsx files under `abs` (optionally recursive), as relative paths. */
function listFiles(abs, recursive) {
  const out = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (recursive) walk(full);
      } else if (/\.(tsx?|ts)$/.test(entry)) {
        out.push(relative(abs, full));
      }
    }
  };
  walk(abs);
  return out.sort();
}

/** Import specifiers that map to npm dependencies (bare package roots). */
function npmDepsOf(source) {
  const deps = new Set();
  for (const m of source.matchAll(/from\s+["']([^"'.][^"']*)["']/g)) {
    const spec = m[1];
    if (spec.startsWith("@/")) continue;
    if (spec === "react" || spec.startsWith("react/")) continue;
    if (spec.startsWith("react-dom")) continue;
    const parts = spec.split("/");
    deps.add(spec.startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0]);
  }
  return [...deps].sort();
}

/**
 * Internal `@/…` component/hook/util imports → the LAST path segment, which
 * is how registry item names are derived below. Resolved to final item names
 * (collision-suffixed) after all items are collected.
 */
function internalDepsOf(source) {
  const deps = new Set();
  const re =
    /from\s+["']@\/(?:components\/(?:ui|app|blocks|chat|pages|base|application|foundations)(?:\/[a-z0-9-]+)*|hooks|utils)\/([a-z0-9-]+)["']/g;
  for (const m of source.matchAll(re)) deps.add(m[1]);
  return deps;
}

/**
 * `@/lib/*` helper imports (chart-tone, control-surface, page-inset, …)
 * are project files with no registry item of their own — bundle them INTO
 * the item so `shadcn add` produces working code. `utils` (cn) is skipped:
 * every shadcn project already ships it. Follows one level of lib→lib
 * imports transitively.
 */
function libFilesOf(source) {
  const found = new Map();
  const visit = (src) => {
    for (const m of src.matchAll(/from\s+["']@\/lib\/([a-z0-9-]+)["']/g)) {
      const name = m[1];
      if (name === "utils" || found.has(name)) continue;
      let libSource;
      try {
        libSource = readFileSync(join(ROOT, "src", "lib", `${name}.ts`), "utf8");
      } catch {
        continue;
      }
      found.set(name, libSource);
      visit(libSource);
    }
  };
  visit(source);
  return [...found.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/* Pass 1 — collect every file so names can be deduped deterministically
   (e.g. blocks/catalog vs pages/catalog, ui/button vs base/buttons/button). */
const candidates = [];
for (const { dir, type, targetDir, recursive } of SOURCES) {
  const abs = join(ROOT, dir);
  for (const rel of listFiles(abs, recursive)) {
    const base = basename(rel).replace(/\.tsx?$/, "");
    if (base === "index") continue; // barrels are not standalone items
    candidates.push({ abs: join(abs, rel), rel, base, type, targetDir });
  }
}

const baseCounts = new Map();
for (const c of candidates) baseCounts.set(c.base, (baseCounts.get(c.base) ?? 0) + 1);

/** Unique item name: plain basename, or `<parent-segment>-<basename>` on collision. */
function itemNameFor(c) {
  if (baseCounts.get(c.base) === 1) return c.base;
  const parent = basename(dirname(join(c.targetDir, c.rel)));
  const prefixed = `${parent}-${c.base}`;
  return prefixed === c.base ? c.base : prefixed;
}

const nameByBase = new Map(); // basename → item name(s), for dep resolution
for (const c of candidates) {
  c.name = itemNameFor(c);
  if (!nameByBase.has(c.base)) nameByBase.set(c.base, c.name);
}

/* Pass 2 — emit items. */
mkdirSync(OUT, { recursive: true });
const items = [];
for (const c of candidates) {
  const source = readFileSync(c.abs, "utf8");
  const registryDependencies = [...internalDepsOf(source)]
    .filter((dep) => dep !== c.base && nameByBase.has(dep))
    .map((dep) => nameByBase.get(dep))
    .sort();
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: c.name,
    type: c.type,
    title: c.name.replace(/-/g, " "),
    description: `Timbal blueprint ${c.type.replace("registry:", "")}: ${c.name}. Token-wired to the project design DNA.`,
    dependencies: npmDepsOf(source),
    registryDependencies,
    files: [
      {
        path: `${c.targetDir}/${c.rel}`,
        content: source,
        type: c.type,
        target: `src/${c.targetDir}/${c.rel}`,
      },
      ...libFilesOf(source).map(([libName, libSource]) => ({
        path: `lib/${libName}.ts`,
        content: libSource,
        type: "registry:lib",
        target: `src/lib/${libName}.ts`,
      })),
    ],
  };
  writeFileSync(join(OUT, `${c.name}.json`), JSON.stringify(item, null, 2) + "\n");
  items.push({
    name: c.name,
    type: c.type,
    title: item.title,
    description: item.description,
    files: [{ path: `${c.targetDir}/${c.rel}`, type: c.type }],
  });
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "timbal-blueprint",
  homepage: "https://timbal.ai",
  items: items.sort((a, b) => a.name.localeCompare(b.name)),
};
writeFileSync(join(ROOT, "public", "r", "registry.json"), JSON.stringify(index, null, 2) + "\n");

console.log(`registry: wrote ${items.length} items to public/r/`);
