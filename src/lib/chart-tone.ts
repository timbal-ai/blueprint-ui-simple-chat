/**
 * ChartTone — the one color scale for hand-drawn visuals (the interactive
 * chart kit, legend dots, intensity grids): the DNA chart series 1–8 plus
 * the status tones. Resolving through here keeps every visual
 * token-referential — raw hex/oklch never enters a component.
 */

type ChartTone =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "selection";

/** Resolve a tone to its CSS token — the only color entry point. */
function chartToneVar(tone: ChartTone): string {
  return typeof tone === "number" ? `var(--chart-${tone})` : `var(--${tone})`;
}

export { chartToneVar };
export type { ChartTone };
