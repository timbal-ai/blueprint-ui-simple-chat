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
 * app drifts to). Warns (exit 0) only when DESIGN.md names a non-blue accent
 * while src/styles/brand.css still ships the default ramp (blue is the expected
 * default; it needs no justification).
 *
 * Run it before you build screens; CI runs it too.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

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

const accentSet = /^\s*--color-accent-500:\s*var\(--color-(?!blue-)/m.test(brand) || /^\s*--color-accent-500:\s*(oklch|#|rgb|hsl)/m.test(brand);
const accentRow = design.split("\n").find((l) => l.startsWith("| Accent "));
const accentDecision = accentRow ? (accentRow.split("|")[2] ?? "").trim().toLowerCase() : "";

if (problems.length) {
  console.error("design-check failed:\n  " + problems.join("\n  "));
  console.error("\nFill the Direction table in DESIGN.md (shell, entry screen, accent, density, template-or-compose, tone). See registry/INDEX.md → Direction menu.");
  process.exit(1);
}

if (!accentSet && !/blue/.test(accentDecision)) {
  console.warn(
    "design-check: warning — src/styles/brand.css still uses the default blue accent ramp while DESIGN.md says " +
      `"${accentDecision || "?"}". Set the eleven --color-accent-* stops (see brand.css) or record why blue is right.`,
  );
}

console.log("design-check: direction recorded" + (accentSet ? ", accent customised." : "."));
