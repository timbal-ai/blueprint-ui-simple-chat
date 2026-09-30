# Page recipes — the screens after `/`

What `/` opens on is `screens.md` §1. These are the other routes a product grows.
(Blueprint-owned. BoardUI's generic `patterns.md` is not synced here: it targets
Next.js + `npx boardui add`, leads with a KPI dashboard and prints an `<h1>` per page.)

Shared by every recipe: one `<Route>` per screen under the shell; the shell prints
title · description · actions, the page passes live values up with `<PageHeader>`;
page → tray (`bg-background-secondary-default`) → tile (`bg-background-primary-default`);
loading / empty / error inside the same tray (`screens.md` §5); detail on click (§4).

## Module list — `/invoices`, `/orders`, `/vehicles`

The list is the page. `<PageHeader description={live summary} actions={<Button leadingIcon={RiAddFill}>New invoice</Button>} />`
→ one `DataTable` (`filters`: 2–3 `Select`s · `search` · `summary`) → row action opens a
`Sheet`. Five columns, give or take one; everything else lives in the Sheet. A
`WorkQueue` group's "View all" lands here — read its filter from the URL
(`useSearchParams`) so `/invoices?status=overdue` opens filtered.
Model: `InvoicesDemo` (`/examples/workspace/invoices`), `TicketsDemo` (`/examples/shell-sidebar`).

## Record route — `/invoices/:id`

Only when the record is shared or bookmarked; otherwise the list's `Sheet` is enough.
`<PageHeader title={record.name} description={status line} actions={…} />` (the
breadcrumb appears by itself on a deeper URL). Body `grid gap-3 lg:grid-cols-[2fr_1fr]`:
left, the fields as `divide-y` label/value rows in one tile; right, activity or related
records. `base/tabs` once there are three or more sections.

## Settings — `/settings`

One tray, one tile of `divide-y` rows: label + a one-line hint on the left, the control
on the right (`Switch`, `Select`, `Button`). Edits that need a form open a `Modal` or
`Sheet`. Destructive actions last. Model: `SettingsDemo` (`/examples/shell-sidebar/settings`).
`Switch` / `Checkbox` `onChange` receive a **boolean** (`onChange={setDigest}`), not an
event — `e.target.checked` throws. For a settings modal inside the app:
`application/settings` (`SettingsModal`).

## Form — create / edit

One column (`max-w-2xl`), grouped under `text-body-medium` labels once there are five or
more fields; submit at the end beside Cancel. `base/input`, `base/select`,
`base/date-picker`, `base/textarea`, `base/checkbox`, `base/radio` — never native
`<select>` / `<input type="date">`. Errors inline under the field. A multi-step flow is
`application/questionnaire`.

## Metrics — `/reports`, only when the brief asks for metrics

`StatCards` (≤ 4 tiles, `stats` from real data) → one trend chart card → one table or
`bar-list-card`. Fork `/templates/dashboard` (or finance / hr / marketing for their
charts). Each tile's number is a filter: link it to the list it counts. This screen is
never `/` unless `DESIGN.md` records the brief's reason, and never sits above a list or
board on the same page.

## Chat and auth

A chat page is `EmbeddedChat` on a `bare` nav route; auth is the platform's
(`timbal.md`). Neither is built by hand.
