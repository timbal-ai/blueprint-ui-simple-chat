"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BarListCard } from "@/components/application/charts/bar-list-card";
import { ComboChartCard } from "@/components/application/charts/combo-chart-card";
import { RadarChartCard } from "@/components/application/charts/radar-chart-card";
import { StageBarsCard } from "@/components/application/charts/stage-bars-card";
import { DashboardSidebar } from "@/components/application/dashboard/dashboard-sidebar";
import { RecentHiresCard } from "@/components/application/dashboard/recent-hires-card";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { EmployeesTable } from "@/components/application/hr/employees-table";
import {
  ATTRITION_LINE,
  ENGAGEMENT_RANGES,
  GROWTH_RANGES,
  HIRES_BAR,
  HR_STATS,
  PIPELINE_RANGES,
  TEAM_TABS,
} from "@/components/application/hr/hr-data";
import { HrHeader } from "@/components/application/hr/hr-header";
import { cx } from "@/utils/cx";

/**
 * HR management template — same floating sidebar / mobile-drawer shell as
 * `DashboardShell` and `MedicalShell`. KPI stat cards, then a 3-up row
 * (recent hires, hiring pipeline stage bars, engagement score radar), a
 * 2-up row (hires vs. attrition combo, team breakdown bar list), and the
 * employees data table.
 */
export function HrShell({ contained = false }: { contained?: boolean } = {}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={cx(
        "relative flex w-full bg-background-full max-lg:overflow-hidden",
        contained && "overflow-hidden",
        contained
          ? "h-[var(--template-preview-height)]"
          : "h-dvh lg:h-auto lg:min-h-screen",
      )}
    >
      {/* Desktop sidebar (in-flow) */}
      <div
        className={cx(
          "sticky top-3 z-10 hidden shrink-0 py-0 pl-3 lg:block",
          contained
            ? "h-[calc(var(--template-preview-height)-24px)]"
            : "h-[calc(100vh-24px)]",
        )}
      >
        <DashboardSidebar selected="hr" />
      </div>

      {/* Mobile sidebar remains beneath the HR dashboard content. */}
      <div
        className={cx(
          "left-0 z-10 flex w-[272px] py-3 pl-[6px] lg:hidden",
          contained
            ? "absolute top-0 h-[var(--template-preview-height)]"
            : "fixed inset-y-0",
        )}
        aria-hidden={!mobileOpen}
      >
        <motion.div
          initial={false}
          animate={{ scale: mobileOpen ? 1 : 0.94, opacity: mobileOpen ? 1 : 0 }}
          transition={{ duration: 0.325, ease: [0.42, 0, 0.58, 1] }}
          className={cx(
            "h-full w-[260px] origin-left will-change-transform",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <DashboardSidebar
            mobile
            flat
            selected="hr"
            onClose={() => setMobileOpen(false)}
          />
        </motion.div>
      </div>

      <motion.main
        initial={false}
        animate={{ x: mobileOpen ? 272 : 0, borderRadius: mobileOpen ? 32 : 0 }}
        transition={{ duration: 0.325, ease: [0.42, 0, 0.58, 1] }}
        className={cx(
          "relative z-20 flex min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-background-full p-3 will-change-transform sm:pt-6 lg:z-0 lg:!transform-none lg:!rounded-none",
          // Contained, the frame around this is a fixed window: the main
          // column keeps its own scrollbar so the rail beside it stays put,
          // instead of the whole shell scrolling and dragging the rail off
          // the top. Standalone, the page scrolls as it should.
          !contained && "lg:overflow-visible",
        )}
      >
        <motion.button
          type="button"
          aria-label="Close navigation"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
          initial={false}
          animate={{ opacity: mobileOpen ? 1 : 0 }}
          transition={{ duration: 0.325, ease: [0.42, 0, 0.58, 1] }}
          className={cx(
            "absolute inset-0 z-50 cursor-pointer rounded-[inherit] bg-black/10 dark:bg-white/5 lg:hidden",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        />
        <div className="flex w-full max-w-[1300px] flex-col gap-2.5">
          <HrHeader onMenuClick={() => setMobileOpen(true)} />
          <div className="flex w-full flex-col gap-4">
            <StatCards stats={HR_STATS} />
            {/* 3-up chart row: at md (tablet) the cards flow 2-per-row with
                the radar stretched across the empty cell; xl is 3 across. */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <RecentHiresCard />
              <StageBarsCard title="Hiring pipeline" ranges={PIPELINE_RANGES} />
              <RadarChartCard
                variant="score"
                title="Team engagement"
                ranges={ENGAGEMENT_RANGES}
                alertBelow={60}
                className="md:col-span-2 xl:col-span-1"
              />
            </div>
            {/* 2-up row: hires vs. attrition, and where the team comes from. */}
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
              <ComboChartCard
                title="Hires"
                bar={HIRES_BAR}
                line={ATTRITION_LINE}
                ranges={GROWTH_RANGES}
                tiles
              />
              <BarListCard tabs={TEAM_TABS} metricLabel="People" metric="value" />
            </div>
            <EmployeesTable />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
