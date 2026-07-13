import * as React from "react";

import {
  FileTextIcon,
  ChevronRightIcon,
  SearchIcon,
  UploadIcon,
} from "@/components/icons";

import { PageBody } from "@/components/blocks/page-body";
import { PageHeader } from "@/components/blocks/page-header";
import { MetadataGrid } from "@/components/blocks/detail-panel";
import { ImageCard, MediaGrid } from "@/components/blocks/media-card";
import { PdfViewer } from "@/components/blocks/pdf-viewer";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * MediaLibraryPage — the reference ASSET-LIBRARY template: search + type
 * facet over an ImageCard grid (photos) and a document list. Clicking a
 * photo opens a large preview Sheet with a MetadataGrid; clicking a
 * document opens a wide right Drawer (`size="xl"`) with the PdfViewer —
 * the click-to-preview flow for files.
 *
 * Fork this file for galleries, template pickers, brand-asset or document
 * screens — swap the demo assets and the metadata fields.
 */

interface MediaAsset {
  id: string;
  name: string;
  kind: "image" | "document";
  /** Image URL (images) — documents use `fileUrl`. */
  src?: string;
  fileUrl?: string;
  size: string;
  updated: string;
  by: string;
}

const DEMO_ASSETS: MediaAsset[] = [
  { id: "a1", name: "Launch hero", kind: "image", src: "https://picsum.photos/seed/timbal-hero/960/540", size: "1.8 MB", updated: "Jul 8, 2026", by: "Sophie Bennett" },
  { id: "a2", name: "Team offsite", kind: "image", src: "https://picsum.photos/seed/timbal-team/960/540", size: "2.4 MB", updated: "Jul 5, 2026", by: "Marta Vidal" },
  { id: "a3", name: "Product still", kind: "image", src: "https://picsum.photos/seed/timbal-product/960/540", size: "1.1 MB", updated: "Jun 30, 2026", by: "Hugo Lasa" },
  { id: "a4", name: "Keynote backdrop", kind: "image", src: "https://picsum.photos/seed/timbal-keynote/960/540", size: "3.2 MB", updated: "Jun 24, 2026", by: "Sophie Bennett" },
  { id: "a5", name: "Office space", kind: "image", src: "https://picsum.photos/seed/timbal-office/960/540", size: "1.6 MB", updated: "Jun 18, 2026", by: "Aina Ferrer" },
  { id: "a6", name: "Conference booth", kind: "image", src: "https://picsum.photos/seed/timbal-booth/960/540", size: "2.0 MB", updated: "Jun 11, 2026", by: "Carles Puig" },
  { id: "d1", name: "Quarterly report.pdf", kind: "document", fileUrl: "/samples/report.pdf", size: "773 B", updated: "Jul 10, 2026", by: "Finance" },
  { id: "d2", name: "Brand guidelines.pdf", kind: "document", fileUrl: "/samples/report.pdf", size: "773 B", updated: "Jun 21, 2026", by: "Design" },
  { id: "d3", name: "Security whitepaper.pdf", kind: "document", fileUrl: "/samples/report.pdf", size: "773 B", updated: "May 30, 2026", by: "Platform" },
];

function MediaLibraryPage({
  assets = DEMO_ASSETS,
  onAction,
}: {
  assets?: MediaAsset[];
  onAction?: (action: string) => void;
}) {
  const [search, setSearch] = React.useState("");
  const [kind, setKind] = React.useState<"all" | "image" | "document">("all");
  const [preview, setPreview] = React.useState<MediaAsset | null>(null);
  const [activeDoc, setActiveDoc] = React.useState<MediaAsset | null>(null);

  const visible = assets.filter(
    (a) =>
      (kind === "all" || a.kind === kind) &&
      a.name.toLowerCase().includes(search.toLowerCase()),
  );
  const images = visible.filter((a) => a.kind === "image");
  const documents = visible.filter((a) => a.kind === "document");

  return (
    <PageBody>
      <PageHeader
        title="Media library"
        description="Photos, brand assets, and documents shared across the workspace."
        actions={
          <Button onClick={() => onAction?.("upload")}>
            <UploadIcon />
            Upload
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-64 min-w-40">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-icon-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets…"
            className="pl-8"
            aria-label="Search assets"
          />
        </div>
        <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<SearchIcon />}
          title="No assets match"
          description="Try a different search term or clear the type filter."
        />
      ) : null}

      {images.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-foreground">Photos</h3>
          <MediaGrid columns={3}>
            {images.map((asset) => (
              <ImageCard
                key={asset.id}
                src={asset.src}
                title={asset.name}
                subtitle={`${asset.size} · ${asset.updated}`}
                onClick={() => setPreview(asset)}
              />
            ))}
          </MediaGrid>
        </section>
      ) : null}

      {documents.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-foreground">Documents</h3>
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {documents.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setActiveDoc(doc)}
                className="flex items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground [&_svg]:size-4.5">
                  <FileTextIcon />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">
                    {doc.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {doc.size} · Updated {doc.updated} · {doc.by}
                  </span>
                </span>
                <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {/* Photo preview — large Sheet with metadata. */}
      <Sheet open={preview != null} onOpenChange={(open) => !open && setPreview(null)}>
        <SheetContent size="lg" className="flex flex-col gap-4 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{preview?.name}</SheetTitle>
            <SheetDescription>Uploaded by {preview?.by}</SheetDescription>
          </SheetHeader>
          {preview ? (
            <div className="flex flex-col gap-4 px-4 pb-4">
              <img
                src={preview.src}
                alt={preview.name}
                className="w-full rounded-xl border border-border object-cover"
              />
              <MetadataGrid
                items={[
                  { label: "File size", value: preview.size },
                  { label: "Updated", value: preview.updated },
                  { label: "Owner", value: preview.by },
                ]}
              />
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Document preview — WIDE right drawer with the PdfViewer. */}
      <Drawer
        direction="right"
        open={activeDoc != null}
        onOpenChange={(open) => !open && setActiveDoc(null)}
      >
        <DrawerContent size="xl">
          <DrawerHeader>
            <DrawerTitle>{activeDoc?.name}</DrawerTitle>
            <DrawerDescription>
              {activeDoc?.size} · Updated {activeDoc?.updated}
            </DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 px-4 pb-4">
            <PdfViewer src={activeDoc?.fileUrl} title={activeDoc?.name} height="100%" />
          </div>
        </DrawerContent>
      </Drawer>
    </PageBody>
  );
}

export { MediaLibraryPage, DEMO_ASSETS };
export type { MediaAsset };
