import * as React from "react";

import {
  CalendarIcon,
  DropletIcon,
  HeartPulseIcon,
  UserIcon,
} from "@/components/icons";

import { PageBody } from "@/components/blocks/page-body";
import { PageHeader } from "@/components/blocks/page-header";
import {
  ActivityRings,
  ChartPeriodPager,
  MetricLegendList,
  RingCalendar,
  ScoreBreakdownList,
  SegmentedScoreRing,
  TrackedBarChart,
} from "@/components/blocks/interactive-charts";
import { MetricTrendCard } from "@/components/blocks/metric-trend-card";
import { ScoreGauge } from "@/components/app/score-gauge";
import { chartToneVar, type ChartTone } from "@/lib/chart-tone";
import { AvatarChip } from "@/components/blocks/filtered-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * HealthDashboardPage — the reference CONSUMER-METRICS template (the
 * Apple-Health / fitness grammar): big-number metric cards driven by an
 * interactive tracked-bar chart, a segmented score ring with breakdown
 * rows, a heart-rate MetricTrendCard, a recovery card (the house
 * ScoreGauge + a MetricLegendList of vitals), a ring calendar of daily
 * activity, today's activity rings with legend chips, plus a profile card
 * and an alerts feed.
 *
 * Fork this file for any personal-metrics or wellbeing surface (health,
 * habits, usage, energy) — keep the two-column card rhythm and drive the
 * headline value from the chart selection.
 */

/* ----------------------------------------------------------------------- */

interface DaySteps {
  label: string;
  /** Full day name for the card headline ("Friday"). */
  name: string;
  value: number;
}

const DEMO_WEEK_STEPS: DaySteps[] = [
  { label: "Mon", name: "Monday", value: 6900 },
  { label: "Tue", name: "Tuesday", value: 2700 },
  { label: "Wed", name: "Wednesday", value: 2100 },
  { label: "Thu", name: "Thursday", value: 7900 },
  { label: "Fri", name: "Friday", value: 7100 },
  { label: "Sat", name: "Saturday", value: 6400 },
  { label: "Sun", name: "Sunday", value: 4800 },
];

const DEMO_SLEEP = {
  headline: "Excellent",
  score: 98,
  segments: [
    { value: 49, tone: 2 as ChartTone, label: "Duration" },
    { value: 29, tone: 4 as ChartTone, label: "Bedtime" },
    { value: 20, tone: 5 as ChartTone, label: "Interruptions" },
  ],
  breakdown: [
    { id: "duration", label: "Duration: 7h 50m", value: "49/50", tone: 2 as ChartTone },
    { id: "bedtime", label: "Bedtime: 20m earlier", value: "29/30", tone: 4 as ChartTone },
    { id: "interruptions", label: "Interruptions: 5m wake up", value: "20/20", tone: 5 as ChartTone },
  ],
};

/** Resting heart rate per range — the MetricTrendCard morphs between these. */
const DEMO_HEART_RATE = {
  Weekly: {
    value: "58 bpm",
    delta: "-2 bpm",
    deltaTone: "positive" as const,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({
      label,
      value: [61, 60, 62, 59, 58, 57, 58][i],
    })),
  },
  Monthly: {
    value: "60 bpm",
    delta: "-1 bpm",
    deltaTone: "positive" as const,
    data: ["W1", "W2", "W3", "W4"].map((label, i) => ({
      label,
      value: [62, 61, 59, 58][i],
    })),
  },
};

/** Recovery card: gauge score + the vitals legend under it. */
const DEMO_RECOVERY = {
  score: 86,
  vitals: [
    {
      id: "hrv",
      tone: 3 as ChartTone,
      label: "HRV",
      value: "64 ms",
      caption: "7-day average",
    },
    {
      id: "resting-hr",
      tone: 5 as ChartTone,
      label: "Resting HR",
      value: "58 bpm",
      caption: "Down 2 bpm this week",
    },
    {
      id: "respiratory",
      tone: 7 as ChartTone,
      label: "Respiratory rate",
      value: "14.2 /min",
      caption: "Within normal range",
    },
  ],
};

/** Ring progress per day of the month (outer / middle / inner, 0–1). */
const DEMO_MONTH_RINGS = Array.from({ length: 21 }, (_, i) => {
  const decay = i > 9 ? 0.15 : 1;
  return {
    day: i + 1,
    rings: [
      Math.min(((i * 37) % 90) / 90 + 0.2, 1) * decay,
      Math.min(((i * 53) % 80) / 80 + 0.25, 1) * decay,
      Math.min(((i * 71) % 70) / 70 + 0.3, 1) * decay,
    ],
  };
});

const DEMO_ACTIVITY = {
  date: "July 10, 2026",
  rings: [
    { value: 816, max: 900, tone: 4 as ChartTone, label: "Move" },
    { value: 101, max: 120, tone: "success" as ChartTone, label: "Exercise" },
    { value: 5.2, max: 8, tone: 5 as ChartTone, label: "Running" },
  ],
  legend: [
    { id: "move", label: "Move", value: "816 kcal", tone: 4 as ChartTone },
    { id: "exercise", label: "Exercise", value: "1h 41m", tone: "success" as ChartTone },
    { id: "running", label: "Running", value: "5.2 km", tone: 5 as ChartTone },
  ],
};

interface HealthAlert {
  id: string;
  title: string;
  description: string;
  date: string;
  tone: "destructive" | "warning" | "info";
  icon: React.ReactNode;
}

const DEMO_ALERTS: HealthAlert[] = [
  {
    id: "hr-high",
    title: "High heart rate",
    description:
      "Your heart rate rose above 120 BPM while you seemed to be inactive for 10 minutes starting at 8:59 AM.",
    date: "Jun 12",
    tone: "destructive",
    icon: <HeartPulseIcon />,
  },
  {
    id: "medical-id",
    title: "Medical ID updated",
    description: "Your emergency contact and allergy information was changed.",
    date: "Jun 9",
    tone: "warning",
    icon: <UserIcon />,
  },
  {
    id: "hydration",
    title: "Hydration below goal",
    description: "You logged 40% less water than your daily goal three days in a row.",
    date: "Jun 6",
    tone: "info",
    icon: <DropletIcon />,
  },
];

const ALERT_TONE: Record<HealthAlert["tone"], string> = {
  destructive: "bg-destructive/12 text-destructive",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/12 text-info",
};

/* ----------------------------------------------------------------------- */

/** Card headline: muted context line over a big value with a unit tail. */
function MetricHeadline({
  context,
  value,
  unit,
}: {
  context: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate text-sm text-muted-foreground">{context}</span>
      <span className="truncate text-2xl font-medium tracking-tight text-foreground">
        {value}
        {unit ? (
          <span className="pl-1.5 text-sm font-normal text-muted-foreground">{unit}</span>
        ) : null}
      </span>
    </div>
  );
}

/** Small white legend chip: tone dot + label over a value. */
function LegendChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: ChartTone;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 rounded-xl border border-border bg-card px-3 py-2">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{ backgroundColor: chartToneVar(tone) }}
        />
        {label}
      </span>
      <span className="truncate text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

/* ----------------------------------------------------------------------- */

function HealthDashboardPage({
  onAction,
}: {
  onAction?: (action: string) => void;
}) {
  const [selectedDay, setSelectedDay] = React.useState(4);
  const [selectedCalendarDay, setSelectedCalendarDay] = React.useState(10);
  const day = DEMO_WEEK_STEPS[selectedDay];
  const monthTotal = 32_459;

  return (
    <PageBody>
      <PageHeader
        title="Health"
        description="Daily activity, sleep, and alerts at a glance."
        actions={
          <Button variant="outline" onClick={() => onAction?.("export")}>
            <CalendarIcon />
            This week
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Steps — the chart drives the headline. */}
        <Card className="gap-5">
          {/* flex-1 so the bar chart absorbs extra height when the row's
              neighbor card is taller (equal-height grid). */}
          <CardContent className="flex flex-1 flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <MetricHeadline
                context={day.name}
                value={day.value.toLocaleString()}
                unit="steps"
              />
              <ChartPeriodPager
                label="29 Jun – 5 Jul"
                onPrev={() => onAction?.("steps-prev")}
                onNext={() => onAction?.("steps-next")}
              />
            </div>
            <TrackedBarChart
              data={DEMO_WEEK_STEPS}
              tone={7}
              height="12.5rem"
              selectedIndex={selectedDay}
              onSelect={setSelectedDay}
              formatValue={(v) => `${v.toLocaleString()} steps`}
            />
          </CardContent>
        </Card>

        {/* Sleep score — segmented ring + breakdown rows. */}
        <Card className="gap-5">
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <MetricHeadline context="Sleep score" value={DEMO_SLEEP.headline} />
              <ChartPeriodPager
                label="29 Jun – 5 Jul"
                onPrev={() => onAction?.("sleep-prev")}
                onNext={() => onAction?.("sleep-next")}
              />
            </div>
            <div className="flex justify-center">
              <SegmentedScoreRing segments={DEMO_SLEEP.segments} size={140}>
                <span className="text-4xl font-medium tracking-tight tabular-nums">
                  {DEMO_SLEEP.score}
                </span>
              </SegmentedScoreRing>
            </div>
            <ScoreBreakdownList items={DEMO_SLEEP.breakdown} />
          </CardContent>
        </Card>

        {/* Resting heart rate — a MetricTrendCard: the line morphs when the
            range tab changes, headline + delta update with it. */}
        <MetricTrendCard
          title="Resting heart rate"
          ranges={DEMO_HEART_RATE}
          defaultRange="Weekly"
          tone={4}
          seriesLabel="Resting HR"
          height="11rem"
        />

        {/* Recovery — the house ScoreGauge headline over a MetricLegendList
            of vitals (gradient tone pills, big numbers, View actions). */}
        <Card className="gap-5">
          <CardContent className="flex flex-1 flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <MetricHeadline context="Recovery" value="Ready to train" />
              <ChartPeriodPager
                label="This morning"
                onPrev={() => onAction?.("recovery-prev")}
                onNext={() => onAction?.("recovery-next")}
              />
            </div>
            <div className="flex justify-center">
              <ScoreGauge
                value={DEMO_RECOVERY.score}
                label="Recovery score"
                className="w-44"
              />
            </div>
            <MetricLegendList
              columns={["Vitals", "Today"]}
              items={DEMO_RECOVERY.vitals.map((vital) => ({
                ...vital,
                action: (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAction?.(`vital:${vital.id}`)}
                  >
                    View
                  </Button>
                ),
              }))}
            />
          </CardContent>
        </Card>

        {/* Most active days — ring calendar. */}
        <Card className="gap-5">
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <MetricHeadline
                context="Most active days"
                value={monthTotal.toLocaleString()}
                unit="total steps"
              />
              <ChartPeriodPager
                label="July"
                onPrev={() => onAction?.("month-prev")}
                onNext={() => onAction?.("month-next")}
              />
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="px-1 pb-2 text-sm font-medium text-foreground">Jul</p>
              <RingCalendar
                days={DEMO_MONTH_RINGS}
                selectedDay={selectedCalendarDay}
                onSelectDay={setSelectedCalendarDay}
              />
            </div>
          </CardContent>
        </Card>

        {/* Today's activity — legend chips + the big rings. */}
        <Card className="gap-5">
          <CardContent className="flex flex-col gap-5">
            <MetricHeadline context="Activity" value={DEMO_ACTIVITY.date} />
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACTIVITY.legend.map((item) => (
                <LegendChip key={item.id} {...item} />
              ))}
            </div>
            <div className="flex flex-1 items-center justify-center py-2">
              <ActivityRings rings={DEMO_ACTIVITY.rings} size={190} />
            </div>
          </CardContent>
        </Card>

        {/* Profile card. */}
        <Card className="gap-5">
          <CardContent className="flex flex-col items-center gap-4">
            <AvatarChip name="Mertcan Esmergül" size="lg" />
            <p className="text-lg font-medium tracking-tight">Mertcan Esmergül</p>
            <div className="flex w-full flex-col divide-y divide-border overflow-hidden rounded-xl border border-border">
              {[
                { label: "Date of birth", value: "28 July, 1997" },
                { label: "Gender", value: "Male" },
                { label: "Blood type", value: "A rh+" },
                { label: "GP doctor", value: "Mattheus Clarkson" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts feed. */}
        <Card className="gap-5">
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <MetricHeadline context="Important alerts" value="12" unit="this week" />
              <ChartPeriodPager
                label="29 Jun – 5 Jul"
                onPrev={() => onAction?.("alerts-prev")}
                onNext={() => onAction?.("alerts-next")}
              />
            </div>
            <div className="flex flex-col gap-3">
              {DEMO_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-4.5 ${ALERT_TONE[alert.tone]}`}
                    >
                      {alert.icon}
                    </span>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[11px]">
                      {alert.date}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">{alert.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageBody>
  );
}

export { HealthDashboardPage, DEMO_WEEK_STEPS, DEMO_ALERTS };
export type { DaySteps, HealthAlert };
