import { toast } from "sonner";

import { DEMO_INVOICES, InvoicesPage } from "@/components/pages/invoices-page";

/** The flagship reference page — InvoicesPage template with demo data. */
export default function GalleryInvoices() {
  return (
    <InvoicesPage
      invoices={DEMO_INVOICES}
      onExport={() => toast.success("Exported 24 invoices")}
      onRowAction={(action, invoice) => toast(`${action}: ${invoice.id}`)}
    />
  );
}
