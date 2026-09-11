# Design record

Fill this in **before** building. It is the contract for every later session:
read it first, update it when a decision changes. Keep it under 40 lines.

Inherited baseline (not a decision to remake): dark-first console — dark default,
3.5px grid, 4–16px concentric radii, 13px body, BoardUI colours and elevated buttons
(monochrome primary: charcoal in light, white in dark), Remix `Line` icons (`registry/theming.md` → House
style). The direction below is what varies per product.

## Direction

| Axis | Decision | Why |
|---|---|---|
| Product | _what this app is, in one line_ | |
| Shell | _SidebarShell · TopbarShell · focused · full-page chat · split_ | |
| Entry | _what `/` opens on: the product's primary object — list · board · record · editor · schedule · conversation. A KPI dashboard needs a reason here_ | |
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
- YYYY-MM-DD — _decision · reason_
