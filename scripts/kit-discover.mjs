#!/usr/bin/env node
/**
 * Print the kit discovery index for agents and humans.
 *
 *   bun run kit:discover
 *   bun run kit:discover -- "invoice review"
 *
 * Reads src/components/discovery.ts (the authoritative intent map).
 */

const query = process.argv.slice(2).join(" ").trim();

const {
  DISCOVERY_ORDER,
  DO_NOT_BUILD,
  INTENT_INDEX,
  matchIntents,
  BLOCKS_CATALOG,
  PAGES_CATALOG,
} = await import("../src/components/discovery.ts");

const lines = [];

lines.push("# Kit discovery\n");
lines.push("Read `src/components/discovery.ts` before writing UI code.\n");

lines.push("## Workflow\n");
DISCOVERY_ORDER.forEach((step, i) => {
  lines.push(`${i + 1}. ${step}`);
});
lines.push("");

if (query) {
  const hits = matchIntents(query);
  lines.push(`## Matches for "${query}"\n`);
  if (hits.length === 0) {
    lines.push("_No intent hits — read full INTENT_INDEX in discovery.ts_\n");
  } else {
    for (const hit of hits) {
      lines.push(`### ${hit.target} (${hit.kind})`);
      lines.push(`- **Import:** \`${hit.importFrom}\``);
      lines.push(`- **Exports:** ${hit.exports.join(", ")}`);
      lines.push(`- **Instead of:** ${hit.insteadOf}`);
      lines.push("");
    }
  }
} else {
  lines.push("## Page templates (fork first)\n");
  for (const [key, entry] of Object.entries(PAGES_CATALOG)) {
    lines.push(`- **${key}** — ${entry.purpose.slice(0, 120)}…`);
    lines.push(`  \`${entry.importFrom}\``);
  }
  lines.push("");

  lines.push("## Intent index (sample — full list in discovery.ts)\n");
  for (const entry of INTENT_INDEX.slice(0, 12)) {
    lines.push(
      `- **${entry.target}** (${entry.kind}): ${entry.triggers.slice(0, 3).join(", ")}…`,
    );
    lines.push(`  → \`${entry.importFrom}\` · not: ${entry.insteadOf}`);
  }
  lines.push(`\n_…and ${INTENT_INDEX.length - 12} more intents in discovery.ts_\n`);

  lines.push("## Do not build\n");
  for (const row of DO_NOT_BUILD) {
    lines.push(`- ❌ ${row.wrong} → ✅ ${row.use} (\`${row.importFrom}\`)`);
  }
  lines.push("");

  lines.push(`## Blocks catalog: ${Object.keys(BLOCKS_CATALOG).length} entries`);
  lines.push(`## Pages catalog: ${Object.keys(PAGES_CATALOG).length} entries`);
  lines.push("\n_Tip: `bun run kit:discover -- \"your feature\"` to search intents._");
}

console.log(lines.join("\n"));
