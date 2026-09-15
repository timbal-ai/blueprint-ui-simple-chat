# Screens — entry recipes and the surface grammar

Two things every generated app got wrong, fixed at the base and written down here:
**what `/` opens on** (it drifted to the same four stat tiles over a chart over a table
every time) and **how a card sits on the page** (borders painted in `currentColor`,
cards the same grey as the page, bordered cards inside bordered cards).

## 1. The entry screen is the primary object

Ask: *what does the user come here to work on?* Tickets, invoices, incidents,
bookings, documents, a conversation. `/` opens on **that** — a list you can act on, a
board, one record, an editor, a schedule, a chat. Numbers about the object are a
second screen (`/overview`, `/reports`) and only when the brief asks for metrics.

**A KPI strip above the primary object is the drift, not a compromise.** `design:check`
resolves the `index` route in `src/App.tsx` and fails when the page renders
`StatCards` while `DESIGN.md`'s Entry says anything other than a dashboard with a reason.
Four numbers in a header can be a `Chip` row or a one-line summary under the title
(`8 zones · 4 elevated · 23 active`) — not four tiles.

### Six recipes (pick one, record it in `DESIGN.md`)

| Entry | Shape | Built from |
|---|---|---|
| **List + detail** (queues, inventories, customers, assets) | Title row with the primary action → one `DataTable` (search, filter selects, chips, row menu, pagination) → row click opens a `Sheet` with the record | `timbal/data-table`, `base/select`, `base/badges/chip`, `timbal/overlays` `Sheet`. Model: `/examples/shell-sidebar` (`TicketsDemo`) |
| **Board** (pipelines, stages, kanban) | Horizontal columns, one per stage, each a tray of primary-surface cards; column header = stage + count `Badge`; card = title, `Avatar`, `Chip`; horizontal scroll inside the page at 375px | `base/badges`, `base/avatar`, trays + tiles (grammar below); DnD is optional, not required for the first cut |
| **Record** (one customer, one incident, one deal) | Header: identity + status `Chip` + actions; two-column body: left = the object's fields in a `divide-y` card, right = activity / related list; tabs for sections | `base/tabs`, `base/badges`, `base/table`, `application/notification-center` for activity |
| **Editor** (documents, prompts, configs, forms) | Full-height two-pane: left = the thing being edited (a form in a card or a text surface), right = preview / `AssistantPill`; sticky save bar | `base/input`, `base/select`, `base/switch`; multi-line text = a bare `<textarea>` on the input tokens (`bg-transparent text-body-regular text-text-primary placeholder:text-text-secondary field-sizing-content`, as `timbal/chat/composer.tsx` does) inside an `InputBase`-styled frame; `timbal/assistant-pill`; `TopbarShell` or focused single page |
| **Schedule** (bookings, shifts, deadlines) | Month/week switcher → calendar grid → event `Sheet` | `application/calendar` (`CalendarMonthGrid`, `CalendarMonthSwitcher`). Model: `/examples/shell-topbar` (`ScheduleDemo`) |
| **Conversation** (the product *is* the assistant) | Full-page chat, history rail | `TimbalChat` + `boardChatComponents` (`pages/Home.tsx`), or `EmbeddedChat` as a `bare` route inside a shell |

Metrics, when the brief asks for them, go on their own route: `StatCards` + one chart
card + one table, straight from `/templates/dashboard`. Then `DESIGN.md` records
`Entry: KPI dashboard` with the brief's words in the Why cell.

## 2. Surface grammar (page → panel → tile)

BoardUI has three surfaces and one hairline. Use them in this order; never invent a fourth.

| Layer | Token | Light | Dark | Use |
|---|---|---|---|---|
| Page | `bg-background-full` | white | neutral-950 | The shell paints it. Pages never set their own background. |
| Panel / tray | `bg-background-secondary-default` | neutral-100 | neutral-900 | A card region: the table frame, a chart card, a form section, a sidebar. **No border needed** — the fill is the edge. |
| Tile | `bg-background-primary-default` | white | neutral-800 | Things *inside* a tray: stat tiles, list rows that lift, inputs, the composer, popovers, modals. |
| Hairline | `border` (default) · `border-separator-border` · `divide-separator-border` | neutral-200 | neutral-800 | Row rules, section dividers, the edge of a tile that sits directly on the page. |

Rules that fall out of it:

- **One frame per region.** A panel holds tiles or rows, never another bordered panel.
  If you want a sub-section inside a card, use a `divide-y` rule or a `text-caption-1-medium text-text-tertiary` label — not a second `rounded-3xl border`.
- **Bare `border` is safe.** `styles/brand.css` defaults every border to the hairline
  token, so `border`, `border-b`, `divide-y` are always the quiet structural line. Say
  `border-border-button-default` on controls (one step stronger) and nothing else.
- **A tile directly on the page gets a hairline** (`bg-background-primary-default border`),
  because in light it is white on white. A tray on the page does not (`bg-background-secondary-default` alone).
- **Radius follows nesting**: `rounded-3xl` panel (16) → `rounded-2xl` tile (12) → `rounded-lg` control (6) → `rounded-md` chip (4). Padding between two layers ≈ the radius difference, so corners stay concentric. Never re-round to "soften".
- **Density is set once** (`--spacing` in `brand.css`). Panels use `p-3`/`p-4`, rows `py-2`/`py-2.5`, gaps `gap-2`/`gap-3`. Do not add `p-6` to feel airy or `p-1` to feel dense.

## 3. Page header grammar — the shell owns it

Every routed page under `SidebarShell` / `TopbarShell` gets exactly one header, rendered
by the shell: **title** (the nav item's label) · **description** (one line,
`text-text-secondary`) · **actions** on the right. The page renders **no `<h1>`, no intro
paragraph, no second "card title" that repeats the page name** — that is how every
generated screen opened on the same word twice (`design:check` fails on an `<h1>` in a
page under a shell).

What the page can't know is passed *up*:

```tsx
// nav item: the static one-liner
{ path: "/tickets", label: "Tickets", icon: RiTicketLine, description: "Open tickets, oldest first" }

// inside the page: live values and page-only actions (renders nothing in place)
<PageHeader
  description={`${open} open · oldest first`}            // overrides the nav item's
  actions={<Button leadingIcon={RiAddFill}>New ticket</Button>}
/>

// a record route: the title changes too, and the breadcrumb appears (Invoices › #4821)
<PageHeader title={`Invoice #${invoice.number}`} description={`Issued ${issued} · due ${due}`} />
```

Rules:

- **Breadcrumbs only when there is depth.** A top-level page shows none — "Overview ›
  Markets" over a page called Markets says nothing the sidebar doesn't. The trail appears
  for nested sections (`/settings/billing`) and for record routes (`/invoices/4821`), and
  never starts with the home item or the brand.
- **Actions belong to the page that uses them.** The shell's `actions` prop is for the rare
  control that is right on every screen (a global "Refresh"); "New ticket" on the Settings
  page is the smell. Default to `<PageHeader actions>`.
- **Filters live in the panel they filter** (the `DataTable` toolbar), not in a separate
  bordered "filter bar" above it. The header is title · description · actions, nothing else.
- **One header per screen.** A `Sheet` or `Modal` has its own (`SheetHeader`); a card inside
  the page has a `text-body-medium` label, not a heading that repeats the page title.

## 4. States are part of the screen

- **Loading**: skeleton rows in the same panel (`animate-pulse` tiles of `bg-background-tertiary-default`), never a centred spinner.
- **Empty**: inside the same panel — an icon in a `size-9 rounded-lg bg-background-tertiary-default` tile, a `text-body-medium` line, a `text-body-regular text-text-secondary` line, one secondary `Button`.
- **Error**: same shape as empty, `RiErrorWarningLine` in `text-foreground-icon-error`, the real message, a retry `Button`. Never swallow the fetch error.
- **375 px**: shells collapse to a drawer, tables scroll inside their panel (`overflow-x-auto` on the panel, not the page), boards scroll horizontally, two-column records stack.

## 5. What a reviewer flags

- `StatCards` (or four hand-made tiles) as the first thing on `/` without a recorded reason.
- The page title printed twice (shell header + an `<h1>` or card title in the page); a breadcrumb on a top-level page; a page-specific button in the shell's global `actions`.
- A bordered card inside a bordered card; a "filter bar" card above a table card.
- Page-coloured cards (`bg-background-full` or nothing on a card) — the "all grey" screen.
- `border-neutral-*`, `border-black`, `border-gray-*`, hex, `dark:` colour overrides.
- Nav, header or table built by hand when `SidebarShell` / `TopbarShell` / `DataTable` exist.
- A screen that is the previous project's screen with new labels (compare `DESIGN.md` → *Previous project used*).
