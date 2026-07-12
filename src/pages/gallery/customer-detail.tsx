import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { CustomerDetailPage } from "@/components/pages/customer-detail-page";

export default function GalleryCustomerDetail() {
  const navigate = useNavigate();
  return (
    <CustomerDetailPage
      onBack={() => navigate("/gallery")}
      onAction={(action) => toast(action)}
    />
  );
}
