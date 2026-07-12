import { toast } from "sonner";

import { EarningsPage } from "@/components/pages/earnings-page";

export default function GalleryEarnings() {
  return <EarningsPage onAction={(action) => toast(action)} />;
}
