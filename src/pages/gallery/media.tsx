import { toast } from "sonner";

import { MediaLibraryPage } from "@/components/pages/media-library-page";

export default function GalleryMedia() {
  return <MediaLibraryPage onAction={(action) => toast(action)} />;
}
