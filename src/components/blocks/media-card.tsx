import * as React from "react";

import { cn } from "@/lib/utils";
import { ImageIcon } from "@/components/icons";
import { Chip } from "@/components/base/badges/chip";

/** Legacy ui/badge variant names — kept so page callers don't change. */
type MediaBadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "destructive-solid"
  | "success-solid"
  | "warning-solid"
  | "info-solid";

const BADGE_COLOR: Record<
  MediaBadgeVariant,
  React.ComponentProps<typeof Chip>["color"]
> = {
  default: "gray",
  secondary: "gray",
  outline: "soft",
  destructive: "rose",
  "destructive-solid": "rose",
  success: "lime",
  "success-solid": "lime",
  warning: "yellow",
  "warning-solid": "yellow",
  info: "blue",
  "info-solid": "blue",
};

/**
 * Media kit — image-first cards for galleries, template pickers, asset
 * libraries, and content catalogs.
 *
 * - `ImageCard` — image + title/subtitle. Default puts the caption BELOW
 *   the image; `overlay` floats it over a bottom gradient (photo-first).
 *   Clickable when `onClick` is set (lifts on hover, image zooms subtly).
 *   Broken/missing images degrade to a muted placeholder tile — never a
 *   broken-image glyph.
 * - `MediaGrid` — the responsive grid wrapper (2–4 columns).
 *
 * Keep captions on `bg-card` (never tinted); status color belongs in the
 * badge slot.
 */

type ImageAspect = "video" | "square" | "portrait" | "wide";

const ASPECT: Record<ImageAspect, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[2/1]",
};

function ImageCard({
  src,
  alt,
  title,
  subtitle,
  badge,
  meta,
  aspect = "video",
  overlay = false,
  onClick,
  className,
}: {
  src?: string;
  alt?: string;
  title: string;
  subtitle?: string;
  /** Status chip pinned to the image's top-left corner. */
  badge?: {
    label: string;
    variant?: MediaBadgeVariant;
  };
  /** Footer row under the caption — file size, date, avatar chips… */
  meta?: React.ReactNode;
  aspect?: ImageAspect;
  /** Caption floats over a bottom gradient instead of below the image. */
  overlay?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const [broken, setBroken] = React.useState(false);
  const clickable = onClick != null;

  const image = (
    <div className={cn("relative w-full overflow-hidden bg-muted", ASPECT[aspect])}>
      {src && !broken ? (
        <img
          src={src}
          alt={alt ?? title}
          loading="lazy"
          onError={() => setBroken(true)}
          className={cn(
            "size-full object-cover transition-transform duration-300 ease-out",
            clickable && "group-hover/image-card:scale-[1.03]",
          )}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground">
          <ImageIcon className="size-6" />
        </div>
      )}
      {badge ? (
        <Chip
          variant="caption"
          color={BADGE_COLOR[badge.variant ?? "secondary"]}
          className="absolute top-2 left-2 h-5 px-1.5 text-[11px]"
        >
          {badge.label}
        </Chip>
      ) : null}
      {overlay ? (
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/65 to-transparent px-3 pt-8 pb-2.5 text-left">
          <span className="truncate text-sm font-medium text-white">{title}</span>
          {subtitle ? (
            <span className="truncate text-xs text-white/75">{subtitle}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const caption = !overlay ? (
    <div className="flex min-w-0 flex-col gap-0.5 px-3 py-2.5 text-left">
      <span className="truncate text-sm font-medium text-foreground">{title}</span>
      {subtitle ? (
        <span className="truncate text-xs text-muted-foreground">{subtitle}</span>
      ) : null}
      {meta ? (
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          {meta}
        </div>
      ) : null}
    </div>
  ) : null;

  const surface = cn(
    "group/image-card flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card",
    "transition-[box-shadow,border-color,transform] duration-200",
    clickable &&
      "cursor-pointer hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
    className,
  );

  if (clickable) {
    return (
      <button type="button" onClick={onClick} className={surface}>
        {image}
        {caption}
      </button>
    );
  }
  return (
    <div className={surface}>
      {image}
      {caption}
    </div>
  );
}

function MediaGrid({
  columns = 3,
  className,
  children,
}: {
  /** Max columns at the widest breakpoint. */
  columns?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];
  return (
    <div className={cn("grid grid-cols-1 gap-3", gridCols, className)}>{children}</div>
  );
}

export { ImageCard, MediaGrid };
export type { ImageAspect };
