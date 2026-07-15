import { toast } from "sonner";

import { MedicalProfilePage } from "@/components/pages/medical-profile-page";

export default function GalleryMedical() {
  return <MedicalProfilePage onAction={(action) => toast(action)} />;
}
