"use client";

import { useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { Chip } from "@/components/base/badges/chip";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → "Contributions this year" (node 3842:4786).
 *
 *   header    "Contributions this year" (Body 1/Medium) + "$7,462"
 *             (Title 1/Medium) + Chip bold/lime "+14.8%"
 *   stats     4 white cards (radius/2lg, shadow/card — same recipe as the
 *             hire cards on RecentHiresCard), value (Body 1/Medium) over
 *             label (Body 2/Medium secondary). Figma insets this row 8px
 *             from the card edge vs. 16px for everything else (`-mx-2` on
 *             top of the card's `p-4`), so it reads slightly wider.
 *   activity  "Activity" label + Weekly/Monthly/Yearly SegmentedControl
 *   grid      37 columns × 7 rows, 13px cells, 4px gap (`gap-1`), radius/md.
 *             neutral/300 = no activity that day. Colored cells use the
 *             `accent` family, darker = more activity: 200 (least) → 400 →
 *             500 → 600 → 700 (most). No axis labels — the Figma frame
 *             doesn't have any.
 *
 * `accent` exists so /dev/contributions-colors can preview other color
 * families on the *real* component — every option's classes are spelled out
 * literally in TIER_CLASSES so Tailwind includes them in the build regardless
 * of which one is picked at runtime.
 */

const STATS = [
  { value: "9B", label: "Lifetime tokens" },
  { value: "562.7M", label: "Peak tokens" },
  { value: "12h 54m", label: "Longest task" },
  { value: "62 days", label: "Top streak" },
];

const GRID_COLUMNS = 37;
const GRID_ROWS = 7;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const ACCENTS = ["emerald", "green", "teal", "cyan", "blue", "indigo", "violet", "rose", "amber"] as const;
export type Accent = (typeof ACCENTS)[number];

/** Tiers 200 → 700 (least → most activity) per accent, spelled out so Tailwind keeps them all. */
const TIER_CLASSES: Record<Accent, string[]> = {
  emerald: ["bg-emerald-200", "bg-emerald-400", "bg-emerald-500", "bg-emerald-600", "bg-emerald-700"],
  green: ["bg-green-200", "bg-green-400", "bg-green-500", "bg-green-600", "bg-green-700"],
  teal: ["bg-teal-200", "bg-teal-400", "bg-teal-500", "bg-teal-600", "bg-teal-700"],
  cyan: ["bg-cyan-200", "bg-cyan-400", "bg-cyan-500", "bg-cyan-600", "bg-cyan-700"],
  blue: ["bg-blue-200", "bg-blue-400", "bg-blue-500", "bg-blue-600", "bg-blue-700"],
  indigo: ["bg-indigo-200", "bg-indigo-400", "bg-indigo-500", "bg-indigo-600", "bg-indigo-700"],
  violet: ["bg-violet-200", "bg-violet-400", "bg-violet-500", "bg-violet-600", "bg-violet-700"],
  rose: ["bg-rose-200", "bg-rose-400", "bg-rose-500", "bg-rose-600", "bg-rose-700"],
  amber: ["bg-amber-200", "bg-amber-400", "bg-amber-500", "bg-amber-600", "bg-amber-700"],
};

/**
 * Deterministic per-cell hash (SSR-safe — no Math.random/Date.now, so server
 * and client render identically). A plain linear seed like `row*7 + col*13`
 * reads as visibly diagonal/striped; this mixes the bits (multiply, xor-shift,
 * multiply, xor-shift — a small hash-combine) so the result looks properly
 * scattered instead of patterned.
 */
function hashCell(row: number, col: number) {
  let h = row * 374761393 + col * 668265263;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

/** Activity tier 0 (none) → 5 (most), from the cell hash. */
function tierFor(row: number, col: number) {
  const seed = hashCell(row, col) % 20;
  if (seed < 6) return 0;
  if (seed < 11) return 1;
  if (seed < 15) return 2;
  if (seed < 18) return 3;
  if (seed < 19) return 4;
  return 5;
}

/** A plausible contribution count for the tooltip — deterministic, scaled by tier. */
const COUNT_BANDS: [number, number][] = [
  [0, 0],
  [1, 4],
  [5, 9],
  [10, 15],
  [16, 24],
  [25, 40],
];
function countFor(row: number, col: number) {
  const [lo, hi] = COUNT_BANDS[tierFor(row, col)];
  if (hi === 0) return 0;
  return lo + ((hashCell(row, col) >>> 3) % (hi - lo + 1));
}

/**
 * Map a cell to a date in the current year. Cells run column-major (each
 * column a "week", left→right through the year) so the label lines up with the
 * Jan→Dec axis: the first cell is Jan 1, the last is Dec 31.
 */
const YEAR = new Date().getFullYear();
function dateLabelFor(row: number, col: number, columns: number) {
  const cellIndex = col * GRID_ROWS + row;
  const dayOfYear = Math.round((cellIndex / (columns * GRID_ROWS - 1)) * 364);
  const d = new Date(Date.UTC(YEAR, 0, 1 + dayOfYear));
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** "12 contributions on April 26" / "No contributions on April 26". */
function tooltipLabel(row: number, col: number, columns: number) {
  const count = countFor(row, col);
  const date = dateLabelFor(row, col, columns);
  if (count === 0) return `No contributions on ${date}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${date}`;
}

/** Literal per-width classes so Tailwind keeps them (mobile fixed 13px cells
 *  that overflow-scroll, flexible 1fr tracks from `sm`). */
const COLUMN_CLASSES: Record<number, string> = {
  37: "grid-cols-[repeat(37,13px)] sm:grid-cols-[repeat(37,minmax(0,1fr))]",
  38: "grid-cols-[repeat(38,13px)] sm:grid-cols-[repeat(38,minmax(0,1fr))]",
};

export interface ContributionDatum {
  count: number;
  /** Tooltip line — "3 hiring events on Apr 2". Defaults to a count line. */
  label?: string;
}

/** Map a real count onto the 5-tier color ramp (0 = the grey track). */
function tierForCount(count: number, max: number) {
  if (count <= 0) return 0;
  return 1 + Math.min(4, Math.floor((count / Math.max(max, 1)) * 5));
}

/**
 * The bare heatmap grid — accent color ramp + a tooltip per cell.
 * Extracted so other cards (the AI profile template, dashboards) render
 * the exact same pattern instead of hardcoding cells.
 *
 * Two modes: with no `data` it renders the Figma demo (hash-scattered
 * tiers over `columns` weeks); pass `data` (sequential days, chunked
 * top-to-bottom into 7-row columns) to drive it from real counts.
 */
export function ContributionsGrid({
  data,
  max,
  columns,
  accent = "violet",
  animateIn = false,
  className,
}: {
  /** Sequential days, column-major (7 rows per week column). */
  data?: ContributionDatum[];
  /** Intensity ceiling for `data` mode. Defaults to the max count. */
  max?: number;
  /** Week columns. Defaults to data length / 7, or the 37-column demo. */
  columns?: number;
  accent?: Accent;
  /** Pop the colored cells in softly on mount, in scattered (hashed) order. */
  animateIn?: boolean;
  className?: string;
}) {
  const tiers = ["bg-chart-track", ...TIER_CLASSES[accent]];
  const cols = columns ?? (data ? Math.ceil(data.length / GRID_ROWS) : GRID_COLUMNS);
  const ceiling = data ? (max ?? Math.max(...data.map((d) => d.count), 1)) : 0;

  const cellFor = (row: number, col: number) => {
    if (!data) return { label: tooltipLabel(row, col, cols), tier: tierFor(row, col) };
    const d = data[col * GRID_ROWS + row];
    if (!d) return null;
    return {
      label: d.label ?? `${d.count} contribution${d.count === 1 ? "" : "s"}`,
      tier: tierForCount(d.count, ceiling),
    };
  };

  return (
    <div
      className={cx("grid gap-1", COLUMN_CLASSES[cols], className)}
      // Arbitrary widths fall back to flexible tracks (the literal class map
      // only covers the Figma 37/38-column variants).
      style={
        COLUMN_CLASSES[cols]
          ? undefined
          : { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }
      }
    >
      {Array.from({ length: GRID_ROWS }, (_, row) =>
        Array.from({ length: cols }, (_, col) => {
          const cell = cellFor(row, col);
          if (!cell) return <span key={`${row}-${col}`} aria-hidden />;
          // Reuse the cell hash (different bits) for a scattered 0–800ms delay
          const pop = animateIn && cell.tier > 0;
          return (
            <TooltipTrigger key={`${row}-${col}`} delay={0} closeDelay={0}>
              <AriaButton
                aria-label={cell.label}
                excludeFromTabOrder
                className={cx(
                  "aspect-square w-full cursor-default rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  tiers[cell.tier],
                  pop && "animate-cell-pop",
                )}
                style={pop ? { animationDelay: `${(hashCell(row, col) >>> 7) % 800}ms` } : undefined}
              />
              <Tooltip>{cell.label}</Tooltip>
            </TooltipTrigger>
          );
        }),
      )}
    </div>
  );
}

export function ContributionsCard({ accent = "violet", className }: { accent?: Accent; className?: string }) {
  const [period, setPeriod] = useState("weekly");

  return (
    <section
      className={cx(
        "flex h-auto min-w-0 flex-1 flex-col gap-4 overflow-hidden rounded-2xl bg-background-secondary-default p-4 sm:h-[337px]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex w-full flex-col gap-0.5">
        <p className="w-full text-body-medium text-text-secondary">Contributions this year</p>
        <div className="flex w-full items-center gap-2">
          <p className="text-title-1-medium whitespace-nowrap text-text-primary">$7,462</p>
          <Chip variant="bold" color="lime">
            +14.8%
          </Chip>
        </div>
      </div>

      {/* Stats — inset 8px (-mx-2 on top of the card's p-4 = 16px), 8px narrower than everything else.
          Mobile stacks them into a 2×2 grid so the labels fit; from sm they're a single row. */}
      <div className="-mx-2 grid grid-cols-2 gap-2 sm:flex sm:items-stretch">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex min-w-0 flex-col items-start rounded-2lg bg-background-primary-default p-2.5 shadow-card sm:flex-1"
          >
            <p className="w-full truncate text-body-medium text-text-primary">{stat.value}</p>
            <p className="w-full truncate text-body-medium text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="-mt-2 flex min-h-0 w-full flex-1 flex-col gap-1">
        <div className="flex w-full items-center justify-between">
          <p className="text-body-medium text-text-secondary">Activity</p>
          <SegmentedControl
            variant="plain"
            selectedKeys={[period]}
            onSelectionChange={(keys) => {
              const next = [...(keys as Set<string>)][0];
              if (next) setPeriod(next);
            }}
            aria-label="Activity period"
          >
            <SegmentedControlItem id="weekly">Weekly</SegmentedControlItem>
            <SegmentedControlItem id="monthly">Monthly</SegmentedControlItem>
            <SegmentedControlItem id="yearly">Yearly</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <div className="flex min-h-0 w-full flex-1 flex-col gap-1.5 overflow-x-auto sm:overflow-visible">
          {/* Mobile: fixed 13px square cells that overflow into horizontal
              scroll instead of squishing thin. From sm, columns go back to
              flexible 1fr tracks that stretch to fill the card width —
              `aspect-square` keeps every cell square as it grows, instead of
              the old fixed 13px height that left empty space on wide cards. */}
          <div className="flex w-max flex-col gap-1.5 sm:w-full">
            <ContributionsGrid columns={GRID_COLUMNS} accent={accent} />
            <div className="flex w-full justify-between text-body-2-medium text-text-tertiary">
              {MONTHS.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
