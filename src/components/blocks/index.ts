/**
 * Block kit barrel — one import surface for the whole kit:
 *
 *   import { AppShell, FilteredTable, BulkActionBar } from "@/components/blocks";
 *
 * Agents: pair this with BLOCKS_CATALOG (also exported here) to discover
 * what exists before building anything by hand. Page templates live in
 * `@/components/pages/*` and are imported by path.
 */

export * from "./app-shell";
export * from "./assistant";
export * from "./bulk-action-bar";
export * from "./catalog";
export * from "./chart-demos";
export * from "./chat-screen";
export * from "./detail-panel";
export * from "./entity-form";
export * from "./filtered-table";
export * from "./hero-metric";
export * from "./list-detail";
export * from "./page-header";
export * from "./resource-grid";
export * from "./routed-app-shell";
export * from "./settings-page";
export * from "./sidebar-user";
export * from "./stat-overview";
