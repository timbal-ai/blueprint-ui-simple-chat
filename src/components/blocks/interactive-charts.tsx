import * as React from "react";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { chartToneVar, type ChartTone } from "@/lib/chart-tone";
import { SURFACE_SHADOW, controlSurfaceClass } from "@/lib/control-surface";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Interactive chart kit — the consumer-grade, touch-friendly visuals
 * (Apple-Health / fitness-app grammar): tracked bars with a selectable day,
 * concentric activity rings, a segmented score ring with breakdown rows,
 * a contributions heatmap, and a month calendar of mini rings.
 *
 * These are NOT Recharts recipes (see blocks/chart-demos for those): they
 * are hand-tuned SVG/flex visuals for the cases where the plot IS the
 * product — gradient capped bars on tone-tinted ghost tracks, rings with
 * rounded caps, intensity grids, chart legends with big numbers. All
 * colors flow through DNA tokens via the shared `ChartTone` scale
 * (`--chart-1..8` + status tones) — never pass raw hex.
 *
 * Compose them inside ChartCard or a plain Card; pair with
 * `ChartPeriodPager` (‹ 29 Jun – 5 Jul ›) and `ChartRangeTabs`
 * (Weekly / Monthly / Yearly) for the interactive chrome.
 */

/* ---------------------------------------------------------------------------
 * Tones — every visual in this kit picks color through the shared scale in
 * `@/lib/chart-tone` (`chartToneVar`): --chart-1..8 + status tones.
 * ------------------------------------------------------------------------- */

/**
 * One-frame mount latch: values render at 0 on first paint and sweep to
 * their real size on the next frame (bars grow, rings draw in). The CSS
 * transitions on each element do the actual animation; reduced-motion
 * users just see the transition collapse to its end state faster.
 */
function useSweepIn(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return mounted;
}

/* ---------------------------------------------------------------------------
 * ChartPeriodPager — the ‹ 29 Jun – 5 Jul › pill.
 * ------------------------------------------------------------------------- */

function ChartPeriodPager({
  label,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  className,
}: {
  label: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        controlSurfaceClass,
        "inline-flex h-8 shrink-0 items-center gap-0.5 rounded-full px-1",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Previous period"
        disabled={prevDisabled}
        onClick={onPrev}
        className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5"
      >
        <ChevronLeftIcon />
      </button>
      <span className="px-1.5 text-[13px] font-medium tabular-nums text-foreground">
        {label}
      </span>
      <button
        type="button"
        aria-label="Next period"
        disabled={nextDisabled}
        onClick={onNext}
        className="flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * ChartRangeTabs — the Weekly / Monthly / Yearly text toggle. The active
 * option floats on a white pill; the rest stay muted text.
 * ------------------------------------------------------------------------- */

function ChartRangeTabs({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly string[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex shrink-0 items-center gap-1", className)}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(option)}
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              active
                ? cn("bg-card font-medium text-foreground", SURFACE_SHADOW)
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * TrackedBarChart — the Beacon-style capped bars: gradient-filled rounded
 * bars (lighter at the top, with an inset top sheen) rising inside
 * tone-tinted ghost tracks. Each datum may carry a `track` value (total /
 * target) so the pale track shows the headroom above the fill; without it
 * the track runs full height. Click a bar to select it (outlined +
 * deepened fill) and drive a header readout. No Y-axis numbers ever — the
 * tooltip carries the magnitude, per the house chart grammar.
 * ------------------------------------------------------------------------- */

interface TrackedBarDatum {
  /** X-axis label under the bar (Mon, Jan…). */
  label: string;
  value: number;
  /**
   * Optional second value (total / target / capacity) — the pale ghost
   * track renders to THIS height, showing value-vs-total per bar (the
   * "people with objectives out of everyone" grammar). Omit for a
   * full-height track.
   */
  track?: number;
}

function TrackedBarChart({
  data,
  max,
  tone = 7,
  height = "13rem",
  trackTint = "tone",
  selectable = true,
  selectedIndex,
  defaultSelectedIndex,
  onSelect,
  formatValue = (v) => v.toLocaleString(),
  className,
}: {
  data: TrackedBarDatum[];
  /** Ceiling. Defaults to the max value/track (that bar fills the plot). */
  max?: number;
  tone?: ChartTone;
  /**
   * MINIMUM plot height. The chart also fills its parent (`h-full`), so
   * inside a stretched card (equal-height grid row) the bars grow with the
   * card instead of leaving dead space below.
   */
  height?: string;
  /** Ghost-track color: tone-tinted (the reference) or neutral gray. */
  trackTint?: "tone" | "muted";
  /** When false, bars are static (tooltip only, no selection). */
  selectable?: boolean;
  /** Controlled selection — pair with onSelect. */
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelect?: (index: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}) {
  const [internal, setInternal] = React.useState(defaultSelectedIndex ?? -1);
  const selected = selectedIndex ?? internal;
  const ceiling =
    max ?? Math.max(...data.map((d) => Math.max(d.value, d.track ?? 0)), 1);
  const color = chartToneVar(tone);
  const trackColor =
    trackTint === "muted"
      ? "var(--muted)"
      : `color-mix(in oklab, ${color} 13%, var(--card))`;
  const mounted = useSweepIn();

  return (
    <div
      className={cn(
        // h-full fills block parents (ChartCard plot area); flex-1 grows in
        // flex-column card bodies — minHeight below is the floor either way.
        "flex h-full w-full flex-1 items-stretch justify-between gap-2",
        className,
      )}
      style={{ minHeight: height }}
    >
      {data.map((d, i) => {
        const ratio = Math.min(Math.max(d.value / ceiling, 0), 1);
        const trackRatio =
          d.track != null ? Math.min(Math.max(d.track / ceiling, 0), 1) : 1;
        const isSelected = selectable && selected === i;
        const base = isSelected
          ? `color-mix(in oklab, ${color} 82%, black)`
          : color;
        const delay = `${Math.min(i * 45, 350)}ms`;
        const Bar = (
          <button
            type="button"
            aria-pressed={selectable ? isSelected : undefined}
            aria-label={`${d.label}: ${formatValue(d.value)}`}
            onClick={
              selectable
                ? () => {
                    setInternal(i);
                    onSelect?.(i);
                  }
                : undefined
            }
            className={cn(
              "group flex min-w-0 flex-1 flex-col items-center gap-2 outline-none",
              !selectable && "cursor-default",
            )}
          >
            {/* Plot column — hover lifts the whole bar from its base. */}
            <span className="relative w-full max-w-10 flex-1 origin-bottom transition-transform duration-200 ease-out group-hover:scale-[1.03]">
              {/* Ghost track — pale tone tint sized to the `track` value.
                  Carries the selection / hover / focus outline so the ring
                  always hugs the visible shape. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 bottom-0 rounded-xl transition-[height,box-shadow] duration-700 ease-out-strong",
                  "group-hover:ring-1 group-hover:ring-foreground/15 group-hover:ring-offset-2 group-hover:ring-offset-card",
                  isSelected && "ring-1 ring-foreground/25 ring-offset-2 ring-offset-card",
                  "group-focus-visible:ring-2 group-focus-visible:ring-ring/50 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-card",
                )}
                style={{
                  height: `${(mounted ? trackRatio : 0) * 100}%`,
                  transitionDelay: delay,
                  backgroundColor: trackColor,
                }}
              />
              {/* Gradient fill: lighter tone at the top → full tone, plus an
                  inset top sheen (the "textured" cap). Height-only
                  transition + per-bar delay: bars cascade in on mount and
                  ripple when a range toggle swaps the dataset. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 bottom-0 overflow-hidden rounded-xl transition-[height] duration-700 ease-out-strong",
                  "shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_45%,transparent),inset_0_8px_12px_-6px_color-mix(in_srgb,white_35%,transparent)]",
                )}
                style={{
                  height: `${(mounted ? ratio : 0) * 100}%`,
                  transitionDelay: delay,
                  backgroundImage: `linear-gradient(to bottom, color-mix(in oklab, ${base} 62%, white), ${base} 72%)`,
                }}
              >
                {/* Hover deepen — instant, independent of the height delay. */}
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-foreground/0 transition-colors duration-200 group-hover:bg-foreground/8"
                />
              </span>
            </span>
            <span className="text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
              {d.label}
            </span>
          </button>
        );
        return (
          <Tooltip key={`${d.label}-${i}`}>
            <TooltipTrigger asChild>{Bar}</TooltipTrigger>
            <TooltipContent>
              {d.label}: {formatValue(d.value)}
              {d.track != null ? ` of ${formatValue(d.track)}` : null}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * ActivityRings — concentric progress rings (outer → inner), rounded caps,
 * gray tracks. The Apple-fitness "Move / Exercise / Stand" visual.
 * ------------------------------------------------------------------------- */

interface ActivityRing {
  value: number;
  max?: number;
  tone?: ChartTone;
  label?: string;
}

function ActivityRings({
  rings,
  size = 160,
  thickness,
  gap,
  className,
}: {
  /** Outer ring first. 2–4 rings read best. */
  rings: ActivityRing[];
  /** Outer diameter in px. */
  size?: number;
  /** Stroke width. Defaults proportional to size. */
  thickness?: number;
  /** Space between rings. Defaults proportional to thickness. */
  gap?: number;
  className?: string;
}) {
  const t = thickness ?? Math.max(3, Math.round(size / 8.5));
  const g = gap ?? Math.max(1, Math.round(t / 4));
  const c = size / 2;
  const defaultTones: ChartTone[] = [4, "success", 5, 2];
  const mounted = useSweepIn();

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={rings
        .map((r) => `${r.label ?? "ring"}: ${Math.round((r.value / (r.max ?? 1)) * 100)}%`)
        .join(", ")}
      // Hover: the whole cluster scales up a touch — playful, GPU-only.
      className={cn(
        "shrink-0 transition-transform duration-300 ease-out-strong hover:scale-[1.05]",
        className,
      )}
    >
      {rings.map((ring, i) => {
        const r = c - t / 2 - i * (t + g);
        if (r <= 0) return null;
        const ratio = Math.min(Math.max(ring.value / (ring.max ?? 1), 0), 1);
        const color = chartToneVar(ring.tone ?? defaultTones[i % defaultTones.length]);
        return (
          <g key={i}>
            <circle cx={c} cy={c} r={r} fill="none" strokeWidth={t} className="stroke-muted" />
            {ratio > 0 ? (
              // Draws in clockwise on mount, outer ring first.
              <circle
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={t}
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${(mounted ? ratio : 0) * 100} 100`}
                transform={`rotate(-90 ${c} ${c})`}
                className="transition-[stroke-dasharray] duration-700 ease-out"
                style={{ transitionDelay: `${i * 120}ms` }}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * SegmentedScoreRing — one ring built from colored segments (share ∝
 * value) with airy gaps, and free center content (the big score). Pair
 * with ScoreBreakdownList so each segment gets a labeled row.
 * ------------------------------------------------------------------------- */

interface ScoreSegment {
  value: number;
  tone: ChartTone;
  label?: string;
}

function SegmentedScoreRing({
  segments,
  size = 148,
  thickness = 13,
  gapDegrees = 22,
  children,
  className,
}: {
  segments: ScoreSegment[];
  size?: number;
  thickness?: number;
  /** Breathing room between segments — the airy look needs generous gaps. */
  gapDegrees?: number;
  /** Center content — typically the big score number. */
  children?: React.ReactNode;
  className?: string;
}) {
  const c = size / 2;
  const r = c - thickness / 2;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const gapLen = (gapDegrees / 360) * 100;
  const usable = Math.max(100 - gapLen * segments.length, 0);
  const mounted = useSweepIn();

  let cursor = gapLen / 2;
  const arcs = segments.map((segment) => {
    const len = (segment.value / total) * usable;
    const start = cursor;
    cursor += len + gapLen;
    return { ...segment, start, len };
  });

  return (
    <div
      className={cn(
        "group/score-ring relative inline-flex shrink-0",
        "transition-transform duration-300 ease-out-strong hover:scale-[1.05]",
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={segments.map((s) => `${s.label ?? "segment"}: ${s.value}`).join(", ")}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {arcs.map((arc, i) => (
          // Each segment grows from its own start point on mount, staggered.
          <circle
            key={i}
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={chartToneVar(arc.tone)}
            strokeWidth={thickness}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${mounted ? arc.len : 0} ${100 - (mounted ? arc.len : 0)}`}
            strokeDashoffset={-arc.start}
            transform={`rotate(-90 ${c} ${c})`}
            className="transition-[stroke-dasharray,stroke-dashoffset] duration-700 ease-out"
            style={{ transitionDelay: `${i * 100}ms` }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * ScoreBreakdownList — hairline-separated rows: tone dot + label, value
 * pinned right. The companion of SegmentedScoreRing.
 * ------------------------------------------------------------------------- */

interface ScoreBreakdownItem {
  id: string;
  label: React.ReactNode;
  value: React.ReactNode;
  tone: ChartTone;
}

function ScoreBreakdownList({
  items,
  className,
}: {
  items: ScoreBreakdownItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2.5 px-3.5 py-2.5">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: chartToneVar(item.tone) }}
          />
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">
            {item.label}
          </span>
          <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * MetricLegendList — the Beacon-style legend under a chart: hairline-
 * separated rows where each status carries a gradient tone pill (same
 * gradient as the bars), the label + count, a BIG number with a muted
 * caption, and an optional trailing action (View). Two muted column
 * headers ("Status" / "Metrics as of today") sit above.
 * ------------------------------------------------------------------------- */

interface MetricLegendItem {
  id: string;
  tone: ChartTone;
  /** Status name — "On track". */
  label: React.ReactNode;
  /** Muted count in parens after the label — "(2)". */
  count?: React.ReactNode;
  /** The big number — "50%". */
  value: React.ReactNode;
  /** Muted caption under the value — "On track", "Since Sep 23". */
  caption?: React.ReactNode;
  /** Trailing slot — a `View` Button, a menu… */
  action?: React.ReactNode;
}

function MetricLegendList({
  items,
  columns = ["Status", "Metrics as of today"],
  className,
}: {
  items: MetricLegendItem[];
  /** The two muted column headers. Pass null to hide the header row. */
  columns?: [React.ReactNode, React.ReactNode] | null;
  className?: string;
}) {
  const grid = "grid grid-cols-[minmax(0,1fr)_minmax(7rem,auto)_auto] items-center gap-x-4";
  return (
    <div className={cn("flex flex-col", className)}>
      {columns ? (
        <div className={cn(grid, "border-b border-border pb-2.5")}>
          <span className="text-sm text-muted-foreground">{columns[0]}</span>
          <span className="text-sm text-muted-foreground">{columns[1]}</span>
          <span />
        </div>
      ) : null}
      <div className="flex flex-col divide-y divide-border">
        {items.map((item) => {
          const color = chartToneVar(item.tone);
          return (
            <div key={item.id} className={cn(grid, "py-3")}>
              <span className="flex min-w-0 items-center gap-2.5">
                {/* Same gradient + top sheen as the bars — legend and plot
                    visibly share one paint. */}
                <span
                  aria-hidden
                  className="h-6 w-2 shrink-0 rounded-full shadow-[inset_0_1px_0_0_color-mix(in_srgb,white_45%,transparent)]"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, color-mix(in oklab, ${color} 62%, white), ${color} 72%)`,
                  }}
                />
                <span className="truncate text-sm text-foreground">{item.label}</span>
                {item.count != null ? (
                  <span className="shrink-0 text-sm text-muted-foreground">
                    ({item.count})
                  </span>
                ) : null}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[1.45rem] leading-tight font-medium tracking-tight tabular-nums text-foreground">
                  {item.value}
                </span>
                {item.caption ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {item.caption}
                  </span>
                ) : null}
              </span>
              <span className="justify-self-end">{item.action}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * ContributionHeatmap — the GitHub-style intensity grid (activity per day,
 * grid-flow-col, 7 rows). Intensity mixes the tone into the muted track so
 * both light and dark mode stay legible.
 * ------------------------------------------------------------------------- */

interface HeatmapDatum {
  /** Tooltip line, e.g. "9 contributions on Mar 25". */
  label?: string;
  count: number;
}

function ContributionHeatmap({
  data,
  max,
  tone = 2,
  columnLabels,
  className,
}: {
  /** Sequential days, chunked top-to-bottom into 7-row columns. */
  data: HeatmapDatum[];
  /** Intensity ceiling. Defaults to the max count. */
  max?: number;
  tone?: ChartTone;
  /** Sparse labels under the grid, keyed by week (column) index. */
  columnLabels?: Record<number, string>;
  className?: string;
}) {
  const ceiling = max ?? Math.max(...data.map((d) => d.count), 1);
  const color = chartToneVar(tone);
  const weekCount = Math.ceil(data.length / 7);

  return (
    // Labels live INSIDE the scroll container so they stay aligned with
    // their week columns when the grid overflows on narrow screens.
    <div className={cn("min-w-0 overflow-x-auto", className)}>
      <div className="flex flex-col gap-1.5">
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {data.map((d, i) => {
            const ratio = Math.min(d.count / ceiling, 1);
            const cell = (
              // Hover: the cell pops above its neighbors with an outline.
              <span
                className="relative aspect-square min-w-3 flex-1 rounded-[3px] transition-transform duration-150 ease-out hover:z-10 hover:scale-125 hover:ring-1 hover:ring-foreground/25"
                style={{
                  backgroundColor:
                    d.count <= 0
                      ? "var(--muted)"
                      : `color-mix(in oklab, ${color} ${Math.round(25 + ratio * 75)}%, var(--muted))`,
                }}
              />
            );
            return d.label ? (
              <Tooltip key={i}>
                <TooltipTrigger asChild>{cell}</TooltipTrigger>
                <TooltipContent>{d.label}</TooltipContent>
              </Tooltip>
            ) : (
              <React.Fragment key={i}>{cell}</React.Fragment>
            );
          })}
        </div>
        {columnLabels ? (
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: weekCount }, (_, w) => (
              <span
                key={w}
                className="overflow-visible text-xs whitespace-nowrap text-muted-foreground"
              >
                {columnLabels[w] ?? ""}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * RingCalendar — a month grid where every day carries mini activity rings.
 * Click a day to select it (outlined tile).
 * ------------------------------------------------------------------------- */

interface RingCalendarDay {
  day: number;
  /** Progress 0–1 per ring, outer first. Empty array renders faded tracks. */
  rings: number[];
}

function RingCalendar({
  days,
  tones = [4, "success", 5],
  selectedDay,
  onSelectDay,
  className,
}: {
  days: RingCalendarDay[];
  /** Tone per ring index, outer first. */
  tones?: ChartTone[];
  selectedDay?: number;
  onSelectDay?: (day: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-7 gap-1", className)}>
      {days.map((d) => {
        const isSelected = selectedDay === d.day;
        return (
          <button
            key={d.day}
            type="button"
            aria-pressed={isSelected}
            aria-label={`Day ${d.day}`}
            onClick={() => onSelectDay?.(d.day)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border border-transparent px-1 py-1.5 transition-colors",
              "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              isSelected && "border-border bg-card",
            )}
          >
            <span className="text-sm tabular-nums text-foreground">{d.day}</span>
            <ActivityRings
              size={26}
              thickness={3}
              gap={1.5}
              rings={tones.map((tone, i) => ({
                value: d.rings[i] ?? 0,
                max: 1,
                tone,
              }))}
            />
          </button>
        );
      })}
    </div>
  );
}

export {
  ActivityRings,
  ChartPeriodPager,
  ChartRangeTabs,
  ContributionHeatmap,
  MetricLegendList,
  RingCalendar,
  ScoreBreakdownList,
  SegmentedScoreRing,
  TrackedBarChart,
};
export type {
  ActivityRing,
  ChartTone,
  HeatmapDatum,
  MetricLegendItem,
  RingCalendarDay,
  ScoreBreakdownItem,
  ScoreSegment,
  TrackedBarDatum,
};
