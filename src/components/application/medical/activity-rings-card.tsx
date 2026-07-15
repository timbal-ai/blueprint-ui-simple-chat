"use client";

import { useState } from "react";
import { Cell, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Sector } from "recharts";
import { MONTHS, YEAR, dayActivity, type SelectedDay } from "@/components/application/medical/medical-data";
import { cx } from "@/utils/cx";

/**
 * Figma source: Board UI → medical profile dashboard → Frame 127 (node
 * 3950:5906). Three concentric goal rings, Apple Watch-style.
 *
 * Ring colors decoded from the Figma SVG assets themselves (each ring is a
 * track + progress ellipse pair): outer Move = pink-400 over a pink-400
 * track, middle Exercise = lime-400 over a purple-400 track, inner Running
 * = sky-400 over an emerald-400 track — every track at 0.12 opacity. The
 * mismatched track hues are Figma's own, reproduced as-is. No ring is ever
 * fully closed, matching the design.
 *
 * recharts renders the FIRST data entry as the innermost band, so the
 * chart data runs Running → Exercise → Move (reverse of the tiles).
 * Hovering a ring darkens it one tone (400 → 500, same recipe as the
 * Steps bars) and highlights its stat tile by dropping the other tiles to
 * 50% opacity.
 *
 * When a day is picked in the Most active days calendar, `selectedDay`
 * swaps the rings and tile values to that day's `dayActivity` numbers —
 * the same `ringPct` fractions the calendar's mini rings draw, so the two
 * charts always agree.
 */

type Ring = {
  label: string;
  value: string;
  /** % of the ring's own goal — kept strictly < 100 so no ring closes. */
  goalPct: number;
  color: string;
  hoverColor: string;
  trackColor: string;
};

/** Tile order (Move / Exercise / Running), matching Figma's stat row.
 *  Values here are the no-selection defaults straight from Figma. */
const DEFAULT_RINGS: Ring[] = [
  { label: "Move", value: "1,592 kcal", goalPct: 82, color: "var(--color-chart-3)", hoverColor: "var(--color-chart-3-active)", trackColor: "var(--color-chart-3)" },
  { label: "Exercise", value: "1h 45m", goalPct: 60, color: "var(--color-chart-2)", hoverColor: "var(--color-chart-2-active)", trackColor: "var(--color-chart-5)" },
  { label: "Running", value: "5.2 km", goalPct: 75, color: "var(--color-chart-4)", hoverColor: "var(--color-chart-4-active)", trackColor: "var(--color-chart-7)" },
];

type SectorProps = {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  index?: number;
};

export function ActivityRingsCard({
  selectedDay = null,
  className,
}: {
  selectedDay?: SelectedDay | null;
  className?: string;
} = {}) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  const activity = selectedDay ? dayActivity(selectedDay.month, selectedDay.day) : null;
  const rings: Ring[] = activity
    ? [
        { ...DEFAULT_RINGS[0], value: activity.move.value, goalPct: Math.round(activity.move.pct * 100) },
        { ...DEFAULT_RINGS[1], value: activity.exercise.value, goalPct: Math.round(activity.exercise.pct * 100) },
        { ...DEFAULT_RINGS[2], value: activity.running.value, goalPct: Math.round(activity.running.pct * 100) },
      ]
    : DEFAULT_RINGS;

  /** Chart order — reversed so Move lands on the outermost band. */
  const chartData = [...rings].reverse().map((ring) => ({
    label: ring.label,
    value: ring.goalPct,
    trackColor: ring.trackColor,
  }));

  return (
    <section
      className={cx(
        "flex h-[330px] w-full min-w-0 flex-col gap-4 rounded-[20px] bg-background-secondary-default p-2.5",
        className,
      )}
    >
      {/* Title + tiles as one block — Figma puts the tiles 11px under the
          title (y=36 → y=47), tighter than the card's 16px section gap. */}
      <div className="flex w-full flex-col gap-[11px]">
        <p className="px-1.5 pt-1.5 text-body-medium text-text-secondary">
          {selectedDay
            ? `Activity for ${MONTHS[selectedDay.month]} ${selectedDay.day}, ${YEAR}`
            : "Activity"}
        </p>
        <div className="flex h-[57px] w-full shrink-0 items-stretch gap-2">
          {rings.map((ring) => (
            <div
              key={ring.label}
              className={cx(
                "flex flex-1 flex-col items-start justify-end gap-px rounded-2lg bg-background-primary-default px-2.5 py-2",
                "transition-opacity duration-200 ease-out",
                activeLabel !== null && activeLabel !== ring.label && "opacity-50",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="size-3 shrink-0 rounded-[4px]" style={{ backgroundColor: ring.color }} />
                <span className="text-body-regular whitespace-nowrap text-text-secondary">{ring.label}</span>
              </div>
              <span className="text-body-medium whitespace-nowrap text-text-primary">{ring.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={chartData}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            innerRadius="16%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            barCategoryGap="20%"
          >
            {/* Pins the angular scale to 0–100 so goalPct maps to real
                percentages — without this recharts stretches the largest
                value to a full 360° circle. */}
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar
              dataKey="value"
              cornerRadius={99}
              background={(props: SectorProps) => {
                const { index, ...rest } = props;
                const ring = chartData[index ?? 0];
                const dimmed = activeLabel !== null && activeLabel !== ring.label;
                return (
                  <Sector
                    {...rest}
                    fill={ring.trackColor}
                    opacity={dimmed ? 0.06 : 0.12}
                    className="transition-opacity duration-200 ease-out"
                  />
                );
              }}
              onMouseEnter={(_, index) => setActiveLabel(chartData[index]?.label ?? null)}
              onMouseLeave={() => setActiveLabel(null)}
              isAnimationActive
              animationDuration={450}
            >
              {chartData.map((entry) => {
                const ring = rings.find((r) => r.label === entry.label) ?? rings[0];
                const dimmed = activeLabel !== null && activeLabel !== entry.label;
                return (
                  <Cell
                    key={entry.label}
                    fill={activeLabel === entry.label ? ring.hoverColor : ring.color}
                    opacity={dimmed ? 0.5 : 1}
                    className="transition-[fill,opacity] duration-200 ease-out"
                  />
                );
              })}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
