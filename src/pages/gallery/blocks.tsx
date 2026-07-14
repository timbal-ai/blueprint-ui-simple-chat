import { toast } from "sonner";

import { InsightsDashboardPage } from "@/components/pages/insights-dashboard-page";

/**
 * Gallery route: the reference insights dashboard — a REAL screen composed
 * from blocks (PageHeader → StatOverview → ChartCard → FilteredTable), not a
 * component zoo. Domain-agnostic grammar; demo data is HR-flavored. Fork for
 * sales, ops, finance, product, support — copy this composition.
 */
export default function GalleryBlocks() {
  return (
    <InsightsDashboardPage
      onEmployeeAction={(action, employee) =>
        toast(`${action}: ${employee.name}`)
      }
      onRecommendationAction={(action, rec) =>
        action === "approve"
          ? toast.success(`Approved: ${rec.title}`)
          : toast(`${action}: ${rec.title}`)
      }
    />
  );
}
