import { toast } from "sonner";

import { HealthDashboardPage } from "@/components/pages/health-dashboard-page";

export default function GalleryHealth() {
  return <HealthDashboardPage onAction={(action) => toast(action)} />;
}
