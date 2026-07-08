import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * HeroMetricCard — the "Networth 2025 vs 2026" reference: a gradient
 * banner card with a headline metric, an edge-to-edge chart, and an
 * optional translucent footer strip (stats + a ProportionBar).
 *
 * Use ONE per screen, at the top of a dashboard, for the single number
 * that matters most. Everything inside is white-on-gradient — pass a
 * chart designed for dark surfaces (see DemoComparisonChart in
 * chart-demos, built exactly for this slot).
 *
 * The gradient comes from DNA chart tokens (indigo → violet by default) so
 * it re-themes with the palette; override via className
 * (`from-chart-* to-chart-*`) when a reference calls for another blend.
 */
function HeroMetricCard({
  title,
  context,
  value,
  valueCaption,
  chart,
  footer,
  className,
}: {
  title: string;
  /** Muted continuation of the title, e.g. "2025 vs 2026". */
  context?: string;
  /** The headline metric, e.g. "$753,914". */
  value: React.ReactNode;
  /** Small caption under the value, e.g. "End of year". */
  valueCaption?: string;
  /** Edge-to-edge chart slot (rendered full-bleed, no side padding). */
  chart?: React.ReactNode;
  /** Translucent footer strip — stats row, legend, ProportionBar. */
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-slot="hero-metric-card"
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-chart-6 to-chart-2 pt-5 text-white shadow-[0_8px_24px_-8px_color-mix(in_srgb,black_25%,transparent)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-5">
        <div className="flex min-w-0 items-baseline gap-2">
          <h3 className="text-lg font-medium tracking-tight">{title}</h3>
          {context ? (
            <span className="truncate text-lg font-medium tracking-tight text-white/60">
              {context}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <span className="text-[1.75rem] leading-none font-medium tracking-tight tabular-nums">
            {value}
          </span>
          {valueCaption ? (
            <span className="mt-1 text-sm text-white/70">{valueCaption}</span>
          ) : null}
        </div>
      </div>
      {chart ? <div className="mt-4 w-full">{chart}</div> : null}
      {footer ? (
        // No backdrop-blur here: backdrop-filter escapes the parent's
        // overflow-hidden rounding and renders square bottom corners.
        // rounded-b-[inherit] keeps the strip clipped to the card radius.
        <div className="mt-2 rounded-b-[inherit] bg-white/15 px-5 py-4">
          {footer}
        </div>
      ) : null}
      {!footer ? <div className="pb-5" /> : null}
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * ProportionBar — segmented distribution bar (the "Tax Position" strip):
 * each segment is a rounded pill sized by its share of the total, colored
 * from the DNA chart palette. Works on white cards and on the hero
 * gradient alike.
 * ------------------------------------------------------------------------- */

interface ProportionSegment {
  id: string;
  label: string;
  value: number;
  /** Chart palette slot 1–8. Defaults to position order. */
  tone?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

// Static map — colors must stay token classes (lint: no dynamic literals).
const TONE_BG: Record<number, string> = {
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
  5: "bg-chart-5",
  6: "bg-chart-6",
  7: "bg-chart-7",
  8: "bg-chart-8",
};

function segmentTone(segment: ProportionSegment, index: number): string {
  return TONE_BG[segment.tone ?? (index % 8) + 1];
}

function ProportionBar({
  segments,
  className,
}: {
  segments: ProportionSegment[];
  className?: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div
      data-slot="proportion-bar"
      role="img"
      aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(", ")}
      className={cn("flex h-2.5 w-full items-stretch gap-1", className)}
    >
      {segments.map((segment, i) => (
        <div
          key={segment.id}
          className={cn("min-w-2 rounded-full", segmentTone(segment, i))}
          style={{ flexGrow: segment.value / total, flexBasis: 0 }}
        />
      ))}
    </div>
  );
}

/** Inline dot legend for a ProportionBar — label + formatted value per segment. */
function ProportionLegend({
  segments,
  formatValue = (v) => String(v),
  className,
}: {
  segments: ProportionSegment[];
  formatValue?: (value: number) => string;
  className?: string;
}) {
  return (
    <div
      data-slot="proportion-legend"
      className={cn("flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm", className)}
    >
      {segments.map((segment, i) => (
        <span key={segment.id} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className={cn("size-2 rounded-full", segmentTone(segment, i))}
          />
          <span className="opacity-80">{segment.label}</span>
          <span className="font-medium tabular-nums">
            {formatValue(segment.value)}
          </span>
        </span>
      ))}
    </div>
  );
}

export { HeroMetricCard, ProportionBar, ProportionLegend };
export type { ProportionSegment };
