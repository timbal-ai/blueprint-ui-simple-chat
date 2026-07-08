# Design record

> **Read this before any UI work. Update it after any design decision.**
> This file + `dna.json` are the durable design memory of this project —
> every future session reads them first so page 12 looks like page 1.

## Intent

Enterprise-grade operations UI (dashboards, entity indexes, record detail,
settings) plus the Timbal chat surfaces. Calm white-on-gray product feel,
Inter tracking-tight, vibrant-but-controlled accents. The kit must scale to
different domains and 1:1 reference matching without AI slop.

## DNA summary

| Axis | Value | Why |
|---|---|---|
| Finish | `timbal` (canvas gradient, gradient + inset controls) | The house look — keep unless the user or a reference asks for flat |
| Surfaces | `panel` (gray canvas, elevated cards) | Safe SaaS default |
| Brand | `#18181b` (neutral zinc — zero chroma) | Near-black primary; color comes from status/selection/chart accents |
| Status | `vivid` | Badges/status chips must pop (user direction: vibrant, never washed out) |
| Selection | `#3B76FF` | House blue for checkbox/radio checked states (`--selection`) |
| Charts | explicit cool palette (blue → violet → teal → magenta → sky → indigo → aqua → cobalt, oklch) | "Cooler" gradient-friendly series colors, distinct in both modes |
| Typography | `inter` pairing, tracking tight, headings 500 | Titles are NEVER bold |
| Shape | radius 0.625rem, rounded controls | Middle of the road |
| Density | comfortable (tables py-2) | Reference tables are denser than stock |
| Motion | snappy (150ms base) | Product-feel default |

Change any of this in `dna.json`, then run `bun run dna:compile`.
**Never edit `tokens.css` by hand** — `dna:check` rejects drift.

## References

| Source | Ref | Borrowed |
|---|---|---|
| Linear-style invoices shot | user-provided | Index page grammar: big title, search + facets toolbar, dark primary action, soft badges, numbered pagination |
| HR Insights dashboard shot | user-provided | Dashboard rhythm (breadcrumb → title → 3-up KPI → composed chart → tracker table), two-layer KPI tiles, vibrant delta badges |
| Rounded table header shot | user-provided | Muted rounded header band, no header border line |
| "Total Employee / New Hires" cards | user-provided | Stat = gray outer tile + white inner value card with soft shadow |
| Timbal platform sidebar | timbal repo | TimbalMark chrome logo + medium-weight brand title, #F5F5F5 sidebar |

## Layout decisions

- Shell: `AppShell variant="inset"` — gray canvas, white bordered content
  card, sidebar with collapse toggle; mobile gets an in-flow brand bar and
  the drawer auto-closes on nav.
- Chat: full-viewport route only (`/chat`); in-page AI is `AssistantPill`.
- Page width: boxed; pages own their header via `PageHeader`.

## Component decisions

- **Controls:** inputs/selects/textareas are white (`bg-card`) and share the
  exact `SURFACE_SHADOW` with white buttons (`@/lib/control-surface`).
  Buttons compressed (h-8, rounded-lg) with gradient top sheen.
- **Tables:** transparent (no card wrap), rounded muted header band (cells
  carry `bg-muted`, first/last rounded), sort buttons hover as rounded
  pills, toolbar facet triggers read at full `text-foreground` strength.
- **Badges:** vivid tonal chips — solid-tone text, tinted fill (12–20%),
  darker same-tone outline.
- **Selection controls:** checked state is the DNA selection blue with a
  deliberately small tick.
- **KPI tiles (`app/stat`):** two-layer reference card — gray outer tile
  (label + action) + white inner value card with a soft drop shadow.
- **Charts:** no legends (tooltips only), NO Y-axis numbers (they collide
  with edge-less plots — magnitudes live in the tooltip), zero side margins
  (edge-less inside `ChartCard`), gradient fills via `<defs>`, cool DNA
  palette.
- **Hero metric (`blocks/hero-metric`):** one gradient banner max per
  screen for the headline number — chart-token gradient (indigo→violet),
  white comparison lines (solid current / dotted previous), translucent
  footer strip with `ProportionBar` + `ProportionLegend` (Networth
  reference).
- **Table hovers:** row tint lives on the cells with rounded end caps
  (`TableRow`), column-sort hovers are rounded pills — never square
  full-bleed highlights.
- **Sheets:** float (inset, rounded-2xl), `size` presets sm→full; record
  detail sheets follow `MemberDetailSheet` / `InvoiceDetailSheet` grammar
  (identity header, fields, activity, footer actions).
- **Bulk selection:** `BulkActionBar` floating bottom-center bubble — never
  toolbar buttons.
- **Icons:** Nucleo outline 18 via `@/components/icons` only.

## Open questions / known gaps

- The floating AssistantPill (z-71, library-owned) can overlap a sheet's
  footer corner; it is draggable and its position persists — acceptable for
  now, revisit if users complain.
