# Design record

Fill this in **before** building. It is the contract for every later session:
read it first, update it when a decision changes. Keep it under 40 lines.

Inherited baseline (not a decision to remake): light-first console — white page, dark one
toggle away, 3.5px grid, 4–16px concentric radii, 13px body, BoardUI colours and elevated buttons
(monochrome primary: charcoal in light, white in dark), Remix `Line` icons (`registry/theming.md` → House
style). The direction below is what varies per product.

## Direction

| Axis | Decision | Why |
|---|---|---|
| Product | _what this app is, in one line_ | |
| First job | _the first thing a user DOES on `/`, as a verb + object: "reply to the oldest ticket", "chase an overdue invoice", "approve a booking". "See metrics" is not a job; "spot the degraded service and react" (a monitor) is_ | |
| Shell | _SidebarShell · TopbarShell · focused · full-page chat · split_ | |
| Entry | _what `/` opens on: the object of that job — list · board · record · editor · schedule · conversation · work queue (several modules, first job = what needs attention). A KPI dashboard needs a reason here — a monitor is the one case_ | |
| Accent | `blue` (BoardUI default) unless the brief names a brand colour | |
| Density | _airy · regular · dense_ | |
| Start from | _template slug (`finance`, `hr`, `calendar`, …) or "compose" — `dashboard` needs a reason here_ | |
| Tone | _two adjectives_ | |
| References | _1–2 (Mobbin screens, brand site, user screenshot)_ | |

Previous project used: _shell / entry / template / density_ → this one differs in: _…_

## Screens

| Route | Screen | Built from |
|---|---|---|
| `/` | | |

## Decisions log

- 2026-09-11 — blueprint baseline moved to the console look (see above) · generated UIs read as
  consumer apps: 24px radii, 14px type, blue selection slabs. Colours, chips, charts and the
  elevated buttons stay BoardUI's; the primary button is monochrome (charcoal in light, white in
  dark — the Timbal runtime's own primary) so blue is reserved for selection, links and focus.
- 2026-09-11 — `Entry` axis added and the KPI dashboard now needs a written reason · every
  generated app was opening on the same stat-tiles + chart + table screen.
- 2026-09-14 — surfaces back to BoardUI's ladder (white page / `neutral-100` tray / white tile;
  dark page `neutral-950` under BoardUI's `900` / `800`), bare `border` defaults to the hairline,
  light chips tinted, `design:check` reads the `index` route for `StatCards` · generated screens
  came out "all grey" with `currentColor` borders and a KPI strip on `/` whatever DESIGN.md said.
  Recipes and the surface grammar: `registry/screens.md`.
- 2026-09-14 — light is the default again (`index.html`); dark stays a full mode behind the toggle ·
  generated products should open on the white console, not near-black.
- 2026-09-15 — the shell owns the page header (title · nav `description` · page actions via
  `<PageHeader>`); breadcrumbs only for nested routes; `design:check` fails on an `<h1>` in a
  page under a shell · generated screens opened on "Home › Markets / Markets / Markets".
- 2026-09-30 — a product with several modules opens on a `WorkQueue` (the rows a KPI tile would
  count, each with its verb); `First job` row added; progressive-disclosure budgets (one-line
  header description, no hard-coded paragraphs) checked by `design:check`, which now runs inside
  `bun run lint`, follows `<Navigate>` on `/` and catches `MetricRow` / hand-rolled tiles · generated
  homes kept opening on stat-tile strips and printed every caption and definition on screen.
- 2026-09-30 — switch track on BoardUI's 4px unit, react-aria toggle labels and the shells' scrollers
  positioned · the md switch thumb sat on the track's edge, and clicking any switch scrolled the
  whole `h-dvh` app off screen (its hidden input was laid out against the document).
- 2026-09-30 — `WorkQueue` narrowed to several-module products whose first job is working through
  what needs attention (a pipeline opens on the board, bookings on the schedule); a monitor is the
  one product whose `/` may open on metrics, with the reason in the Why cell; templates are
  started from the closest *entry* template, never trimmed from a KPI one · the work queue was
  reading as the next universal template, and INDEX still said "copy the closest, delete the rest".
- YYYY-MM-DD — _decision · reason_
