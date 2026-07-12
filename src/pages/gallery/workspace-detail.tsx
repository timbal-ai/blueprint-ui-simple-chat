import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { WorkspaceDetailPage } from "@/components/pages/workspace-detail-page";

export default function GalleryWorkspaceDetail() {
  const navigate = useNavigate();
  return (
    <WorkspaceDetailPage
      onBack={() => navigate("/gallery/blocks")}
      onAction={(action) => toast(action)}
    />
  );
}
