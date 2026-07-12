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
 * npm dependencies are inferred from imports; `@/components/ui/*` imports
 * become registryDependencies so `shadcn add` resolves the graph.
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "public", "r");

const SOURCES = [
  { dir: "src/components/ui", type: "registry:ui", targetDir: "components/ui" },
  { dir: "src/components/app", type: "registry:component", targetDir: "components/app" },
  { dir: "src/components/blocks", type: "registry:block", targetDir: "components/blocks" },
  { dir: "src/components/pages", type: "registry:block", targetDir: "components/pages" },
  { dir: "src/components/chat", type: "registry:component", targetDir: "components/chat" },
  { dir: "src/hooks", type: "registry:hook", targetDir: "hooks", only: ["use-mobile.ts"] },
];

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

/** `@/components/ui/foo` and `@/hooks/use-bar` imports → registry item names. */
function registryDepsOf(source, selfName) {
  const deps = new Set();
  for (const m of source.matchAll(/from\s+["']@\/(?:components\/(?:ui|app|blocks|chat|pages)|hooks)\/([a-z0-9-]+)["']/g)) {
    if (m[1] !== selfName) deps.add(m[1]);
  }
  return [...deps].sort();
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

mkdirSync(OUT, { recursive: true });

const items = [];
for (const { dir, type, targetDir, only } of SOURCES) {
  const abs = join(ROOT, dir);
  let files;
  try {
    files = readdirSync(abs).filter((f) => /\.(tsx?|ts)$/.test(f));
  } catch {
    continue;
  }
  if (only) files = files.filter((f) => only.includes(f));

  for (const file of files) {
    const name = basename(file).replace(/\.tsx?$/, "");
    const source = readFileSync(join(abs, file), "utf8");
    const item = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      type,
      title: name.replace(/-/g, " "),
      description: `Timbal blueprint ${type.replace("registry:", "")}: ${name}. Token-wired to the project design DNA.`,
      dependencies: npmDepsOf(source),
      registryDependencies: registryDepsOf(source, name),
      files: [
        {
          path: `${targetDir}/${file}`,
          content: source,
          type,
          target: `src/${targetDir}/${file}`,
        },
        ...libFilesOf(source).map(([libName, libSource]) => ({
          path: `lib/${libName}.ts`,
          content: libSource,
          type: "registry:lib",
          target: `src/lib/${libName}.ts`,
        })),
      ],
    };
    writeFileSync(join(OUT, `${name}.json`), JSON.stringify(item, null, 2) + "\n");
    items.push({
      name,
      type,
      title: item.title,
      description: item.description,
      files: [{ path: `${targetDir}/${file}`, type }],
    });
  }
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "timbal-blueprint",
  homepage: "https://timbal.ai",
  items: items.sort((a, b) => a.name.localeCompare(b.name)),
};
writeFileSync(join(ROOT, "public", "r", "registry.json"), JSON.stringify(index, null, 2) + "\n");

console.log(`registry: wrote ${items.length} items to public/r/`);
