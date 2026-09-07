import {
  RiChat3Line,
  RiFilePaper2Line,
  RiPhoneLine,
  RiShakeHandsLine,
  RiTeamLine,
  RiTimeLine,
  RiUserAddLine,
  RiUserMinusLine,
  RiUserSearchLine,
} from "@remixicon/react";
import type { BarListTab } from "@/components/application/charts/bar-list-card";
import type { ComboPoint, ComboRange, ComboSeries } from "@/components/application/charts/combo-chart-card";
import type { RadarPoint, RadarRange } from "@/components/application/charts/radar-chart-card";
import type { StageBar, StageBarsRange } from "@/components/application/charts/stage-bars-card";
import type { Stat } from "@/components/application/dashboard/stat-cards";

/**
 * Demo datasets for the HR template — the hiring pipeline, engagement radar,
 * hires-vs-attrition combo, and team breakdown lists all read from here so
 * the numbers stay consistent (the pipeline's hires match the combo chart's
 * bars, headcount matches the KPI row, and so on).
 */

/* -------------------------------------------------------------- KPI cards */

export const HR_STATS: Stat[] = [
  { icon: RiTeamLine, label: "Employees", value: "248", delta: "+4.2%", deltaColor: "lime" },
  { icon: RiUserSearchLine, label: "Open roles", value: "12", delta: "+8.3%", deltaColor: "neutral" },
  { icon: RiTimeLine, label: "Time to hire", value: "24 days", delta: "-8.3%", deltaColor: "lime" },
  { icon: RiUserMinusLine, label: "Attrition", value: "3.8%", delta: "-0.6%", deltaColor: "lime" },
];

/* --------------------------------------------------------- hiring pipeline */

/** The bars are the bright 400 chart tones in both themes, so a glyph sitting
 *  on one always wants the same near-black ink. */
const BAR_ICON = "size-3.5 shrink-0 text-neutral-950";

const pipelineStages = (values: [number, number, number, number, number]): StageBar[] => [
  { label: "Applications", value: values[0], icon: <RiFilePaper2Line className={BAR_ICON} aria-hidden /> },
  { label: "Screens", value: values[1], icon: <RiPhoneLine className={BAR_ICON} aria-hidden /> },
  { label: "Interviews", value: values[2], icon: <RiChat3Line className={BAR_ICON} aria-hidden /> },
  { label: "Offers", value: values[3], icon: <RiShakeHandsLine className={BAR_ICON} aria-hidden /> },
  { label: "Hires", value: values[4], icon: <RiUserAddLine className={BAR_ICON} aria-hidden /> },
];

export const PIPELINE_RANGES: StageBarsRange[] = [
  { id: "30d", label: "Last 30 days", stages: pipelineStages([412, 156, 68, 21, 12]), delta: 0.062 },
  { id: "90d", label: "Last 90 days", stages: pipelineStages([1_240, 462, 210, 64, 38]), delta: 0.048 },
  { id: "year", label: "This year", stages: pipelineStages([4_680, 1_710, 790, 244, 141]), delta: -0.015 },
];

/* ------------------------------------------------------- team engagement */

const engagement = (values: [number, number, number, number, number, number]): RadarPoint[] => [
  { label: "Growth", score: values[0] },
  { label: "Compensation", score: values[1] },
  { label: "Culture", score: values[2] },
  { label: "Management", score: values[3] },
  { label: "Balance", score: values[4] },
  { label: "Tools", score: values[5] },
];

export const ENGAGEMENT_RANGES: RadarRange[] = [
  { id: "q3", label: "Q3 survey", data: engagement([84, 71, 88, 79, 66, 91]) },
  { id: "q2", label: "Q2 survey", data: engagement([78, 69, 85, 74, 58, 86]) },
  { id: "q1", label: "Q1 survey", data: engagement([74, 72, 81, 70, 62, 79]) },
];

/* -------------------------------------------------- hires vs. attrition */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const growthRows = (hires: number[], attrition: number[]): ComboPoint[] =>
  hires.map((value, i) => ({ label: MONTHS[i], hires: value, attrition: attrition[i] }));

export const HIRES_BAR: ComboSeries = { key: "hires", label: "Hires" };
export const ATTRITION_LINE: ComboSeries = {
  key: "attrition",
  label: "Attrition",
  color: "var(--color-chart-3)",
  activeColor: "var(--color-chart-3-active)",
  format: (n: number) => `${Math.round(n * 10) / 10}%`,
};

const GROWTH_YEAR = growthRows(
  [8, 11, 14, 9, 12, 16, 10, 13, 15, 12, 14, 12],
  [5.2, 4.8, 4.6, 4.9, 4.4, 4.1, 4.3, 4.0, 3.9, 4.1, 3.8, 3.8],
);

export const GROWTH_RANGES: ComboRange[] = [
  { id: "year", label: "This year", data: GROWTH_YEAR, delta: 0.084 },
  {
    id: "h2",
    label: "Last 6 months",
    data: growthRows(
      [10, 13, 15, 12, 14, 12],
      [4.3, 4.0, 3.9, 4.1, 3.8, 3.8],
    ).map((row, i) => ({ ...row, label: MONTHS[i + 6] })),
    delta: 0.061,
  },
  {
    id: "prev",
    label: "Last year",
    data: growthRows(
      [6, 8, 10, 7, 9, 12, 8, 10, 11, 9, 11, 10],
      [6.1, 5.8, 5.6, 5.9, 5.4, 5.2, 5.4, 5.1, 5.0, 5.2, 4.9, 5.0],
    ),
    delta: -0.032,
  },
];

/* ---------------------------------------------------------- team makeup */

export const TEAM_TABS: BarListTab[] = [
  {
    id: "departments",
    label: "Departments",
    items: [
      { label: "Engineering", value: 96 },
      { label: "Sales", value: 44 },
      { label: "Support", value: 38 },
      { label: "Marketing", value: 26 },
      { label: "Design", value: 22 },
      { label: "Operations", value: 14 },
      { label: "People", value: 8 },
    ],
  },
  {
    id: "sources",
    label: "Hiring sources",
    items: [
      { label: "Referrals", value: 52 },
      { label: "LinkedIn", value: 38 },
      { label: "Job boards", value: 24 },
      { label: "Inbound", value: 17 },
      { label: "Agencies", value: 10 },
    ],
  },
  {
    id: "locations",
    label: "Locations",
    items: [
      { label: "Remote", value: 84 },
      { label: "Berlin", value: 62 },
      { label: "London", value: 48 },
      { label: "New York", value: 34 },
      { label: "Singapore", value: 20 },
    ],
  },
];
