import { cx } from "@/utils/cx";

/**
 * Brand mark for BoardUI-derived chrome (docs breadcrumbs, mock panels).
 * The upstream template rendered the BoardUI logo via next/image; this
 * project renders the Timbal mark (public/timbal.png) at a fixed pixel
 * size instead. `mono` is accepted for API compatibility (the mark is
 * already monochrome-friendly).
 */
export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  /** Accepted for BoardUI API compatibility — the Timbal mark has no mono variant. */
  mono?: boolean;
  className?: string;
}) {
  return (
    <img
      src="/timbal.png"
      alt="Timbal"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cx("shrink-0 rounded-[3px] object-contain", className)}
    />
  );
}
