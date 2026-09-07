import { useLocation, useNavigate, useParams, useSearchParams as useRouterSearchParams } from "react-router-dom";

/**
 * `next/navigation` shim for react-router. Covers what the vendored BoardUI
 * files use (`usePathname`, `useRouter`) plus the common extras.
 */
export function usePathname(): string {
  return useLocation().pathname;
}

export function useSearchParams(): URLSearchParams {
  return useRouterSearchParams()[0];
}

export { useParams };

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => {},
    prefetch: () => {},
  };
}

export function redirect(href: string): never {
  window.location.assign(href);
  throw new Error(`redirect(${href})`);
}

export function notFound(): never {
  throw new Error("notFound()");
}
