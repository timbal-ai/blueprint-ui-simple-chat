import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * ScoreGauge — the house semicircle gauge (AI heat score, health score,
 * completion %). Use THIS instead of hand-rolling SVG arcs: the arc
 * geometry, rounded caps, and track alignment are easy to get wrong, and
 * colors must come from tokens.
 *
 * Tone defaults to "auto": destructive < 40 ≤ warning < 70 ≤ success.
 * Pass an explicit tone when higher is not better.
 */

type GaugeTone =
  | "auto"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "selection";

// Static class map — tones must stay literal token classes for the lint.
const TONE_TEXT: Record<Exclude<GaugeTone, "auto">, string> = {
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
  selection: "text-selection",
};

function resolveTone(tone: GaugeTone, ratio: number): string {
  if (tone !== "auto") return TONE_TEXT[tone];
  if (ratio >= 0.7) return TONE_TEXT.success;
  if (ratio >= 0.4) return TONE_TEXT.warning;
  return TONE_TEXT.destructive;
}

// Semicircle from (10,52) to (90,52) with r=40 → arc length = π·40.
const ARC_PATH = "M 10 52 A 40 40 0 0 1 90 52";
const ARC_LENGTH = Math.PI * 40;

function ScoreGauge({
  value,
  max = 100,
  label,
  formatValue = (v) => String(Math.round(v)),
  tone = "auto",
  className,
}: {
  value: number;
  max?: number;
  /** Caption under the value, e.g. "AI heat score". */
  label?: string;
  formatValue?: (value: number) => string;
  tone?: GaugeTone;
  className?: string;
}) {
  const ratio = Math.min(Math.max(max === 0 ? 0 : value / max, 0), 1);
  return (
    <div
      data-slot="score-gauge"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("flex w-28 flex-col items-center", className)}
    >
      <div className="relative w-full">
        <svg viewBox="0 0 100 58" className="w-full" aria-hidden>
          <path
            d={ARC_PATH}
            fill="none"
            strokeWidth={9}
            strokeLinecap="round"
            className="stroke-muted"
          />
          <path
            d={ARC_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={9}
            strokeLinecap="round"
            strokeDasharray={`${ratio * ARC_LENGTH} ${ARC_LENGTH + 20}`}
            className={cn(
              "transition-[stroke-dasharray] duration-500 ease-out",
              resolveTone(tone, ratio),
            )}
          />
        </svg>
        <span className="absolute inset-x-0 bottom-0 text-center text-2xl leading-none font-medium tracking-tight tabular-nums text-foreground">
          {formatValue(value)}
        </span>
      </div>
      {label ? (
        <span className="mt-1.5 text-xs text-muted-foreground">{label}</span>
      ) : null}
    </div>
  );
}

export { ScoreGauge };
export type { GaugeTone };
