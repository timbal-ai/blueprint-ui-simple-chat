/**
 * BLOCKS_CATALOG — machine-readable index of the block kit.
 *
 * Agents: read this file FIRST when building a screen. Every entry is
 * project-owned source under `src/components/blocks/` — import it, pass
 * props, and only fork the file when a requirement genuinely doesn't fit.
 * Compose screens from blocks; drop to `src/components/ui/*` primitives only
 * for the gaps between blocks.
 */

interface BlockEntry {
  /** Import specifier for this block's module. */
  importFrom: string;
  /** Named exports available from the module. */
  exports: string[];
  /** What the block is for, in one sentence. */
  purpose: string;
  /** Concrete situations where this block is the right answer. */
  useWhen: string[];
  /** Primitives/blocks this composes, for forking reference. */
  composes: string[];
}

const BLOCKS_CATALOG: Record<string, BlockEntry> = {
  "app-shell": {
    importFrom: "@/components/blocks/app-shell",
    exports: ["AppShell"],
    purpose:
      "Canonical application frame: sidebar nav (groups, icons, badges, footer) + inset content with sticky topbar and a dock slot for floating chrome.",
    useWhen: [
      "Any multi-page app screen — this is the outermost layout",
      "You need a sidebar, topbar, or a docked AI pill",
    ],
    composes: ["ui/sidebar", "ui/separator", "ui/badge"],
  },
  "list-detail": {
    importFrom: "@/components/blocks/list-detail",
    exports: ["ListDetailLayout"],
    purpose:
      "Master list + detail panel with overlay discipline: side-by-side split on desktop (detail ≥ 24rem), single Sheet on mobile, one detail surface at a time.",
    useWhen: [
      "Clicking a table/list row should show a record's details",
      "Inbox-, CRM-, or ticket-style screens",
    ],
    composes: ["ui/sheet", "ui/scroll-area", "hooks/use-mobile"],
  },
  "filtered-table": {
    importFrom: "@/components/blocks/filtered-table",
    exports: ["FilteredTable"],
    purpose:
      "Search + faceted Select filters + DataTable wired together, with a wrapping toolbar, clear-filters affordance, and a toolbarEnd slot for the primary action.",
    useWhen: [
      "Any table that needs search or filters — do not hand-roll a toolbar",
      "Entity index pages (invoices, users, orders)",
    ],
    composes: ["ui/data-table", "ui/input", "ui/select", "ui/button"],
  },
  "detail-panel": {
    importFrom: "@/components/blocks/detail-panel",
    exports: ["DetailSection", "FieldList", "Field", "ActivityFeed", "DetailDivider"],
    purpose:
      "Structured record-detail content: aligned label/value description lists, sectioned headings with inline actions, and a compact activity timeline.",
    useWhen: [
      "Filling the detail side of ListDetailLayout or a record page",
      "Showing metadata fields or an event history",
    ],
    composes: ["ui/separator"],
  },
  "entity-form": {
    importFrom: "@/components/blocks/entity-form",
    exports: ["FormSheet", "FormGrid", "FormField"],
    purpose:
      "Create/edit scaffolding: a right Sheet with scrollable body and pinned actions, single-column field grid, and label/help/error wiring per field.",
    useWhen: [
      "Creating or editing a record — FormSheet is the standard surface",
      "Any form: wrap every control in FormField, lay out with FormGrid",
    ],
    composes: ["ui/sheet", "ui/label", "ui/button", "ui/scroll-area"],
  },
  "settings-page": {
    importFrom: "@/components/blocks/settings-page",
    exports: ["SettingsStack", "SettingsSection", "SettingsRow", "DangerZone"],
    purpose:
      "Settings scaffolding: one card per topic, label-left/control-right rows that stack on mobile, and a quarantined danger zone.",
    useWhen: [
      "Preferences, account, workspace, or notification settings screens",
      "Any list of toggles/selects paired with descriptions",
    ],
    composes: ["ui/card"],
  },
  "stat-overview": {
    importFrom: "@/components/blocks/stat-overview",
    exports: ["StatOverview", "ChartCard"],
    purpose:
      "Top-of-dashboard band: responsive KPI row plus bounded, titled chart containers with fixed heights (no layout shift).",
    useWhen: [
      "Dashboard headers with metrics at a glance",
      "Any chart — always render inside ChartCard, never bare",
    ],
    composes: ["app/stat", "ui/card"],
  },
};

export { BLOCKS_CATALOG };
export type { BlockEntry };
