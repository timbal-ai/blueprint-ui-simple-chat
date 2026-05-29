/**
 * ESM bridge for Radix / other libs that named-import from
 * `use-sync-external-store/shim` (package ships CJS-only entrypoints).
 * React 19 exposes the native hook — no shim runtime needed.
 */
export { useSyncExternalStore } from "react";
