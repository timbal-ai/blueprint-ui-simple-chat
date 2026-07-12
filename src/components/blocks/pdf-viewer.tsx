import * as React from "react";

import { cn } from "@/lib/utils";
import {
  ArrowUpRightIcon,
  DownloadIcon,
  FileTextIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Separator } from "@/components/ui/separator";

/**
 * PdfViewer — an inline document viewer with the house chrome: a toolbar
 * (file title, zoom, open-in-tab, download) over the browser's native PDF
 * renderer in a bordered muted well. Zero dependencies — no pdf.js.
 *
 * Where to mount it:
 * - In a page section for a document-centric screen (contracts, reports).
 * - Inside a `Sheet size="xl" | "full"` or a side `DrawerContent size="xl"`
 *   for a click-to-preview flow next to a files table.
 *
 * No `src` renders an EmptyState (never a blank well). The viewer is an
 * iframe, so cross-origin URLs must allow embedding; same-origin files
 * (e.g. `/samples/report.pdf` in public/) always work.
 */

const ZOOM_LEVELS = [50, 75, 100, 125, 150, 200] as const;

function PdfViewer({
  src,
  title,
  height = "40rem",
  downloadUrl,
  toolbar = true,
  actions,
  emptyTitle = "No document selected",
  emptyDescription = "Choose a file to preview it here.",
  className,
}: {
  /** URL of the PDF. Same-origin (public/ assets) or embed-friendly. */
  src?: string;
  /** Toolbar label. Defaults to the file name from `src`. */
  title?: string;
  /** Viewer height — use "100%" inside a height-constrained pane. */
  height?: string;
  /** Download target. Defaults to `src`. */
  downloadUrl?: string;
  /** Hide the toolbar for a bare embed. */
  toolbar?: boolean;
  /** Extra toolbar actions, rendered before the built-ins. */
  actions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}) {
  const [zoomIndex, setZoomIndex] = React.useState(2);
  const zoom = ZOOM_LEVELS[zoomIndex];
  const fileName = title ?? src?.split("/").pop()?.split("?")[0] ?? "Document";

  if (!src) {
    return (
      <EmptyState
        icon={<FileTextIcon />}
        title={emptyTitle}
        description={emptyDescription}
        className={className}
        style={{ minHeight: height }}
      />
    );
  }

  const embedSrc = `${src}#toolbar=0&navpanes=0&zoom=${zoom}`;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
      style={{ height }}
    >
      {toolbar ? (
        <div className="flex shrink-0 items-center gap-1 border-b border-border px-3 py-2">
          <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate pl-1.5 text-sm font-medium text-foreground">
            {fileName}
          </span>
          {actions}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Zoom out"
            disabled={zoomIndex === 0}
            onClick={() => setZoomIndex((i) => Math.max(i - 1, 0))}
          >
            <ZoomOutIcon />
          </Button>
          <span className="w-10 text-center text-xs tabular-nums text-muted-foreground">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Zoom in"
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            onClick={() => setZoomIndex((i) => Math.min(i + 1, ZOOM_LEVELS.length - 1))}
          >
            <ZoomInIcon />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Button variant="ghost" size="icon-sm" asChild>
            <a href={src} target="_blank" rel="noreferrer" aria-label="Open in new tab">
              <ArrowUpRightIcon />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild>
            <a href={downloadUrl ?? src} download aria-label="Download">
              <DownloadIcon />
            </a>
          </Button>
        </div>
      ) : null}
      <div className="min-h-0 flex-1 bg-muted">
        <iframe
          key={zoom}
          src={embedSrc}
          title={fileName}
          className="size-full"
        />
      </div>
    </div>
  );
}

export { PdfViewer };
