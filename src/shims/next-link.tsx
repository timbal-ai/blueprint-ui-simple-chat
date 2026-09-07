import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { Link as RouterLink } from "react-router-dom";

/**
 * `next/link` shim for Vite + react-router. Internal hrefs become
 * client-side <Link to>; absolute/external/hash hrefs stay plain anchors.
 */
type NextLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string; query?: Record<string, string> };
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  passHref?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
};

const isExternal = (href: string) =>
  /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#");

export default function Link({
  href,
  replace,
  children,
  ...props
}: NextLinkProps) {
  // Drop Next-only props so they never reach the DOM.
  const rest = { ...props } as Record<string, unknown>;
  for (const key of ["prefetch", "scroll", "shallow", "locale", "legacyBehavior", "passHref"]) delete rest[key];
  const to =
    typeof href === "string"
      ? href
      : `${href.pathname ?? ""}${href.query ? "?" + new URLSearchParams(href.query).toString() : ""}`;
  if (isExternal(to)) {
    return (
      <a href={to} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={to} replace={replace} {...rest}>
      {children}
    </RouterLink>
  );
}
