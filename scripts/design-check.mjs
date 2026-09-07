#!/usr/bin/env node
/**
 * design-check — the anti-sameness gate.
 *
 *   bun run design:check
 *
 * Fails (exit 1) when DESIGN.md's direction table still has placeholders, i.e.
 * screens are being built without a recorded decision on shell / accent /
 * density / template / tone. Warns (exit 0) when the accent ramp in
 * src/styles/brand.css is still the default — allowed, but it must be deliberate.
 *
 * The platform's stop hook runs this on every turn that touches ui/**; run it
 * locally before you build screens.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const design = readFileSync(resolve(ROOT, "DESIGN.md"), "utf8");
const brand = existsSync(resolve(ROOT, "src/styles/brand.css"))
  ? readFileSync(resolve(ROOT, "src/styles/brand.css"), "utf8")
  : "";

const REQUIRED = ["Product", "Shell", "Accent", "Density", "Start from", "Tone"];
const problems = [];

for (const axis of REQUIRED) {
  const row = design.split("\n").find((l) => l.startsWith(`| ${axis} `));
  if (!row) {
    problems.push(`DESIGN.md: missing "${axis}" row in the Direction table`);
    continue;
  }
  const cells = row.split("|").map((c) => c.trim());
  const decision = cells[2] ?? "";
  if (!decision || /^_.*_$/.test(decision) || /^_/.test(decision)) {
    problems.push(`DESIGN.md: "${axis}" is still a placeholder — decide it before building screens`);
  }
}

const accentSet = /^\s*--color-accent-500:\s*var\(--color-(?!blue-)/m.test(brand) || /^\s*--color-accent-500:\s*(oklch|#|rgb|hsl)/m.test(brand);
const accentRow = design.split("\n").find((l) => l.startsWith("| Accent "));
const accentDecision = accentRow ? (accentRow.split("|")[2] ?? "").trim().toLowerCase() : "";

if (problems.length) {
  console.error("design-check failed:\n  " + problems.join("\n  "));
  console.error("\nFill the Direction table in DESIGN.md (shell, accent, density, template-or-compose, tone). See registry/INDEX.md → Direction menu.");
  process.exit(1);
}

if (!accentSet && !/blue/.test(accentDecision)) {
  console.warn(
    "design-check: warning — src/styles/brand.css still uses the default blue accent ramp while DESIGN.md says " +
      `"${accentDecision || "?"}". Set the eleven --color-accent-* stops (see brand.css) or record why blue is right.`,
  );
}

console.log("design-check: direction recorded" + (accentSet ? ", accent customised." : "."));
