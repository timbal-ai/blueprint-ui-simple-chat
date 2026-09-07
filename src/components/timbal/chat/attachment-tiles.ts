import { useEffect, useMemo, useRef } from "react";
import type { Attachment } from "@assistant-ui/react";

import type {
  ComposerAttachment,
  ComposerAttachmentKind,
} from "@/components/application/composer-panel/composer-panel";

/**
 * Projects the runtime's composer attachments (assistant-ui `Attachment[]`)
 * onto BoardUI's `ComposerAttachment` tiles.
 *
 * - `kind` comes from the MIME type first, the extension second, so the tile
 *   picks the right plugin icon (spreadsheet, presentation, code, video) and
 *   images get a thumbnail.
 * - `src` for images is an object URL of the staged `File`; URLs are created
 *   once per attachment id and revoked when the attachment leaves the list.
 * - `progress` follows the adapter status: `running` draws the upload ring
 *   (`progress` normalised to 0–100), everything else (staged
 *   `requires-action`, `complete`, `incomplete`) leaves it out so the tile
 *   shows its dismiss button. Timbal's default adapter stages files on add and
 *   uploads on send, so the ring only appears with adapters that stream
 *   upload progress.
 */
export function useTileAttachments(attachments: readonly Attachment[]): ComposerAttachment[] {
  const urls = useRef(new Map<string, string>());

  const tiles = useMemo(
    () =>
      attachments.map((attachment): ComposerAttachment => {
        const kind = attachmentKind(attachment);
        return {
          id: attachment.id,
          name: attachment.name,
          kind,
          src: kind === "image" ? imageSrc(attachment, urls.current) : undefined,
          progress: tileProgress(attachment),
        };
      }),
    [attachments],
  );

  // Revoke object URLs for attachments that left the composer.
  useEffect(() => {
    const live = new Set(attachments.map((a) => a.id));
    for (const [id, url] of urls.current) {
      if (!live.has(id)) {
        URL.revokeObjectURL(url);
        urls.current.delete(id);
      }
    }
  }, [attachments]);

  useEffect(() => {
    const map = urls.current;
    return () => {
      for (const url of map.values()) URL.revokeObjectURL(url);
      map.clear();
    };
  }, []);

  return tiles;
}

const SPREADSHEET_EXT = new Set(["csv", "tsv", "xls", "xlsx", "xlsm", "numbers", "ods"]);
const PRESENTATION_EXT = new Set(["ppt", "pptx", "key", "odp"]);
const VIDEO_EXT = new Set(["mp4", "mov", "webm", "mkv", "avi", "m4v"]);
const CODE_EXT = new Set([
  "js", "jsx", "ts", "tsx", "mjs", "cjs", "json", "py", "rb", "go", "rs", "java",
  "kt", "swift", "c", "h", "cc", "cpp", "hpp", "cs", "php", "sh", "zsh", "bash",
  "sql", "yaml", "yml", "toml", "xml", "html", "css", "scss", "vue", "svelte",
]);

function extensionOf(name: string) {
  const dot = name.lastIndexOf(".");
  return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
}

export function attachmentKind(attachment: Attachment): ComposerAttachmentKind {
  const mime = (attachment.contentType ?? attachment.file?.type ?? "").toLowerCase();
  const ext = extensionOf(attachment.name);
  if (attachment.type === "image" || mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/") || VIDEO_EXT.has(ext)) return "video";
  if (
    mime === "text/csv" ||
    mime === "text/tab-separated-values" ||
    mime.includes("spreadsheet") ||
    mime.includes("ms-excel") ||
    SPREADSHEET_EXT.has(ext)
  ) {
    return "spreadsheet";
  }
  if (mime.includes("presentation") || mime.includes("ms-powerpoint") || PRESENTATION_EXT.has(ext)) {
    return "presentation";
  }
  if (
    mime.includes("json") ||
    mime.includes("javascript") ||
    mime.includes("typescript") ||
    mime.includes("xml") ||
    mime.includes("yaml") ||
    CODE_EXT.has(ext)
  ) {
    return "code";
  }
  return "document";
}

function imageSrc(attachment: Attachment, urls: Map<string, string>) {
  const existing = urls.get(attachment.id);
  if (existing) return existing;
  if (attachment.file) {
    const url = URL.createObjectURL(attachment.file);
    urls.set(attachment.id, url);
    return url;
  }
  const part = attachment.content?.find((p) => p.type === "image");
  return part && part.type === "image" ? part.image : undefined;
}

function tileProgress(attachment: Attachment): number | undefined {
  const status = attachment.status;
  if (status.type !== "running") return undefined;
  const raw = status.progress ?? 0;
  // assistant-ui adapters report either a 0–1 fraction or a 0–100 percentage.
  const pct = raw <= 1 ? raw * 100 : raw;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
