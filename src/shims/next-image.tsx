import type { CSSProperties, ImgHTMLAttributes } from "react";

/**
 * `next/image` shim for Vite. BoardUI is authored for Next.js; vendored files
 * keep their `import Image from "next/image"` and resolve here through the
 * alias in vite.config.ts / tsconfig paths. Renders a plain <img>; the
 * Next-only props are accepted and dropped so they never reach the DOM.
 */
type NextImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
};

const NEXT_ONLY = ["quality", "placeholder", "blurDataURL", "unoptimized", "loader"] as const;

export default function Image(props: NextImageProps) {
  const { src, fill, priority, style, alt = "", ...rest } = props;
  for (const key of NEXT_ONLY) delete (rest as Record<string, unknown>)[key];
  const resolved = typeof src === "string" ? src : src.src;
  const fillStyle: CSSProperties | undefined = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }
    : style;
  return (
    <img
      src={resolved}
      alt={alt}
      loading={priority ? "eager" : (rest.loading ?? "lazy")}
      decoding="async"
      style={fillStyle}
      {...rest}
    />
  );
}
