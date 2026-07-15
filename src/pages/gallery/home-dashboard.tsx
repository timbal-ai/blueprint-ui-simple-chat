import { toast } from "sonner";

import { HomeDashboardPage } from "@/components/pages/home-dashboard-page";

export default function GalleryHomeDashboard() {
  return <HomeDashboardPage onAction={(action) => toast(action)} />;
}
