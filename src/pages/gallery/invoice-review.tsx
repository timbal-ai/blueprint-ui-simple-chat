import { toast } from "sonner";

import { InvoiceReviewPage } from "@/components/pages/invoice-review-page";

/** Document review reference — 50/50 PDF + extracted entries + approve/reject. */
export default function GalleryInvoiceReview() {
  return (
    <InvoiceReviewPage
      onAction={(action, invoice) => toast(`${action}: ${invoice.id}`)}
    />
  );
}
