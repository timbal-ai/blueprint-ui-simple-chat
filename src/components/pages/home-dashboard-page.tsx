import { RiAddFill, RiFilter3Fill } from "@remixicon/react";

import { PageBody } from "@/components/blocks/page-body";
import { PageHeader } from "@/components/blocks/page-header";
import { ContributionsCard } from "@/components/application/dashboard/contributions-card";
import { CustomersTable } from "@/components/application/dashboard/customers-table";
import { EarningsChartCard } from "@/components/application/dashboard/earnings-chart-card";
import { RecentHiresCard } from "@/components/application/dashboard/recent-hires-card";
import { RevenueTrendCard } from "@/components/application/dashboard/revenue-trend-card";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { Button } from "@/components/base/buttons/button";

/**
 * HomeDashboardPage — the BoardUI Pro "Home Dashboard" template (Figma
 * node 3731:2932), rehosted on the house shell grammar: the Pro template's
 * own sidebar/header chrome is replaced by `RoutedAppShell` + `PageHeader`
 * (this file renders the CONTENT only — mount it as a route inside the
 * shell).
 *
 * Rhythm: PageHeader with actions → RecentHiresCard + EarningsChartCard
 * band → RevenueTrendCard + ContributionsCard band → StatCards KPI row →
 * CustomersTable (the native BoardUI data-table card with search, facets,
 * selection, and pagination).
 *
 * Fork this for a BoardUI-native overview screen. For the richer
 * block-kit dashboard grammar (AI recommendations, score rings, FormSheet
 * create) fork `insights-dashboard-page` instead.
 */
export function HomeDashboardPage({
  onAction,
}: {
  /** Wire header actions (e.g. toast in the gallery, real handlers in apps). */
  onAction?: (action: string) => void;
} = {}) {
  return (
    <PageBody>
      <PageHeader
        title="Welcome back"
        description="Sales, hiring, and customer activity at a glance."
        actions={
          <>
            <Button
              variant="secondary"
              size="medium"
              leadingIcon={RiFilter3Fill}
              onClick={() => onAction?.("Filters")}
            >
              Filters
            </Button>
            <Button
              variant="primary"
              size="medium"
              leadingIcon={RiAddFill}
              onClick={() => onAction?.("Create ticket")}
            >
              Create ticket
            </Button>
          </>
        }
      />

      {/* People + earnings band */}
      <div className="flex w-full flex-col items-stretch gap-4 xl:flex-row xl:items-start">
        <RecentHiresCard />
        <EarningsChartCard />
      </div>

      {/* Trend + contributions band */}
      <div className="flex w-full flex-col items-stretch gap-4 lg:flex-row lg:items-start">
        <RevenueTrendCard className="h-[337px]" />
        <ContributionsCard />
      </div>

      <StatCards />

      <CustomersTable />
    </PageBody>
  );
}
