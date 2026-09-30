#!/usr/bin/env node
/**
 * Targeted refresh for projects scaffolded from an older v3 blueprint.
 *
 * Existing projects are never updated when the blueprint moves. This applies
 * the fixes that are safe to apply to code the project already owns, and
 * nothing else: it never touches `src/pages`, the vendored BoardUI folders
 * (`src/components/{base,application,foundations}`), `DESIGN.md`, routes or
 * data. Every patch is idempotent (re-running changes nothing) and each is
 * detected by its CSS, not by a version number, so a project that already has
 * the fix (or a hand-written equivalent) is left alone.
 *
 * Patches today
 *   switch-fix   react-aria toggles: a positioned label (clicking a Switch no
 *                longer scrolls the whole app off screen) and BoardUI's 4px unit
 *                on the Switch track (the thumb sits on the track's edge at the
 *                3.5px grid). Appended to `src/styles/brand.css`.
 *
 * Usage (no dependencies; run it from the blueprint checkout or a clone)
 *   node scripts/ui-refresh.mjs --target <path-to-ui>   apply
 *   node scripts/ui-refresh.mjs --target <path-to-ui> --check     exit 1 if a patch is due
 *   node scripts/ui-refresh.mjs --target <path-to-ui> --dry-run   show, write nothing
 *
 * `--target` defaults to the current directory. The platform already shallow-
 * clones the blueprint ref for `add-ui`; the same clone can run this against a
 * worktree's `ui/`.
 *
 * Exit codes: 0 done / up to date · 1 `--check` and a patch is due · 2 usage
 * error (not a ui-v3 project, missing file).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const target = resolve(value("--target") ?? process.cwd());
const CHECK = flag("--check");
const DRY = flag("--dry-run");

const fail = (msg) => {
  console.error(`ui-refresh: ${msg}`);
  process.exit(2);
};

const pkgPath = join(target, "package.json");
if (!existsSync(pkgPath)) fail(`no package.json in ${target} — pass --target <path-to-ui>`);
let pkg;
try {
  pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
} catch (e) {
  fail(`package.json in ${target} is not valid JSON (${e.message})`);
}
if (pkg?.timbal?.blueprint !== "ui-v3") {
  fail(`${target} is not a ui-v3 project ("timbal.blueprint" is ${JSON.stringify(pkg?.timbal?.blueprint)}) — nothing to refresh`);
}

/* ------------------------------------------------------------- patches */

// Each rule is detected on its own selector so a project that has one of the
// two (or an equivalent) gets only what is missing.
const SWITCH_RULES = [
  {
    detect: 'label:has(> span > input:is([type="checkbox"], [type="radio"]))',
    css: `/* react-aria toggles (Switch, SwitchCard, Checkbox, CheckboxCard, Radio,
   RadioCard) render \`<label><span visually-hidden><input></span>…</label>\`.
   The hidden input is \`position: absolute\`; with no positioned ancestor it is
   laid out against the document at its static position, deep below the
   \`h-dvh\` shell, so the document grows taller than the viewport and clicking
   the control (which focuses the input) scrolls the document: the whole app
   slides off screen and the page reads as blank. A positioned label keeps the
   input on its control. In \`@layer base\` so \`absolute\`/\`fixed\`/\`sticky\`
   utilities on the control still win. */
@layer base {
  label:has(> span > input:is([type="checkbox"], [type="radio"])) {
    position: relative;
  }
}`,
  },
  {
    detect: 'label:has(> span > input[role="switch"])',
    css: `/* BoardUI's Switch mixes spacing units (\`h-6\`, \`top-0.5\`, \`translate-x-3\`)
   with fixed pixels (\`w-[42px]\`, \`size-[18px]\`, \`left-[3px]\`). At a 3.5px unit
   the md track shrinks to 21px while its 18px thumb does not, so the thumb sits
   on the bottom edge. The track keeps BoardUI's own 4px unit, which restores
   the Figma geometry for every size (sm 28×16, md 42×24, lg 56×32). */
@layer base {
  label:has(> span > input[role="switch"]) span[aria-hidden="true"] {
    --spacing: 0.25rem;
  }
}`,
  },
];

const patches = [
  {
    id: "switch-fix",
    file: "src/styles/brand.css",
    apply(source) {
      const missing = SWITCH_RULES.filter((r) => !source.includes(r.detect));
      if (!missing.length) return null;
      const block = missing.map((r) => r.css).join("\n\n");
      return `${source.replace(/\s*$/, "")}\n\n${block}\n`;
    },
  },
];

/* ----------------------------------------------------------------- run */

let due = 0;
let skipped = 0;
for (const patch of patches) {
  const path = join(target, patch.file);
  if (!existsSync(path)) {
    console.log(`ui-refresh: ${patch.id}: skipped — ${patch.file} not found`);
    skipped++;
    continue;
  }
  const before = readFileSync(path, "utf8");
  const after = patch.apply(before);
  if (after === null) {
    console.log(`ui-refresh: ${patch.id}: already applied`);
    continue;
  }
  due++;
  if (CHECK || DRY) {
    console.log(`ui-refresh: ${patch.id}: due — would append to ${patch.file}`);
  } else {
    writeFileSync(path, after);
    console.log(`ui-refresh: ${patch.id}: applied — appended to ${patch.file}`);
  }
}

if (!due) console.log(skipped ? "ui-refresh: nothing to do (see skipped above)" : "ui-refresh: up to date");
else if (CHECK) process.exit(1);
