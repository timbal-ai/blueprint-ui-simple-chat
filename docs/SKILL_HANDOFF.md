# `timbal-ui` skill handoff — kit v3 (taste-enforced blocks)

**Audience:** whoever edits the `timbal-ui` skill and the codegen system
prompt on the platform side. This doc is the contract between the kit in
this repo and the behavior layer: it tells you exactly **what the agent
must be told**, where the machine-readable surfaces live, and how to keep
taste enforced while staying easy to edit.

**Companion doc:** `monolith/docs/UI_V2_BACKEND_HANDOFF.md` (infra items:
npm publish, tarball repack, screenshot loop). This doc covers only the
**skill/prompt content**.

---

## 0. TL;DR

The blueprint now ships a **pre-styled, catalog-indexed block kit** on top
of the DNA system. The skill's job changes from "design carefully" to:

1. **Discover** — read `BLOCKS_CATALOG` before building anything.
2. **Compose** — page templates → blocks → primitives → raw HTML, in that
   order. Forking a block file is normal; rebuilding a pattern is not.
3. **Obey the taste rules** (§3) and **never commit the named mistakes** (§4).
4. **Verify** — dna:check, lint, build, then screenshot + self-critique.

Everything the agent needs is inside the scaffolded project — the skill
mostly needs to point at files, not restate them.

## 1. Prerequisites (hard version gates)

| Piece | Required | Why |
|---|---|---|
| `@timbal-ai/timbal-react` | **≥ 4.2.0** | DNA compiler v1.2.0: `color.selection` field (checkbox/radio house blue). 4.1.0 CLIs false-flag v1.2.0 tokens as drift. |
| Blueprint tarball | repack from `blueprint-ui-simple-chat` `main` (this commit) | Ships the block kit, catalog, registry, Nucleo icons, HR dashboard + invoices templates. |
| Screenshot tool | `browser_screenshot` available to the agent | The verify loop is visual; without it taste regresses. |

## 2. Discovery surfaces (what the agent reads, in order)

| Surface | Path (inside the scaffolded `ui/`) | What it is |
|---|---|---|
| **Block catalog** | `src/components/blocks/catalog.ts` (`BLOCKS_CATALOG`) | Machine-readable index: every block's import path, exports, purpose, use-when, composition. **The skill must instruct: read this FIRST.** |
| Barrel | `src/components/blocks/index.ts` | One-line imports: `import { AppShell, FilteredTable, BulkActionBar } from "@/components/blocks"`. |
| Page templates | `src/components/pages/` (`hr-dashboard-page.tsx`, `invoices-page.tsx`) | Full forkable screens: dashboard grammar (stats → chart → table → detail sheet → bulk bar) and entity-index grammar. `HeroMetricCard` is an opt-in resource (see charts gallery), not part of the default dashboard. |
| shadcn registry | `public/r/registry.json` + `public/r/<name>.json` (rebuild: `bun run registry:build`) | Standard `shadcn add <url>` items for pulling any vetted component into other projects. |
| Project rules | `AGENTS.md` (repo root) | House rules + the mistakes list, kept in-repo so it survives scaffolding. |
| Design record | `src/design/DESIGN.md` | Session-durable design decisions; agent updates it after design changes. |

## 3. Taste rules (paste-ready skill excerpt)

Everything below is **already encoded in the component source** — the
skill's job is to stop the agent from overriding it. Paste-ready:

```md
### House rules (enforced — do not override)
- Compose from `@/components/blocks` first (read `BLOCKS_CATALOG`), then
  `@/components/ui` primitives, raw HTML last. Fork a block file when it's
  80% right; never rebuild the pattern from scratch.
- Global restyling goes through `src/design/dna.json` → `bun run
  dna:compile`. Never hand-edit `tokens.css`; never use raw hex/oklch or
  palette classes (`bg-blue-600`) in components.
- Titles are never bold (`font-medium` max). Page tops use `PageHeader`.
- Inputs, search bars, and selects are white (`bg-card`), never gray, and
  share the exact `SURFACE_SHADOW` with white buttons.
- Tables: transparent (no card wrap), rounded muted header band, rounded
  row/column hovers, dense rows. Search/filters via `FilteredTable`;
  selection actions via the floating `BulkActionBar`; row click opens a
  floating detail `Sheet` (see `MemberDetailSheet`/`InvoiceDetailSheet`).
- Badges are vibrant tonal chips (solid-tone text, tinted fill, darker
  same-tone outline). Checkboxes/radios check in the DNA selection blue.
- Charts: through `ChartContainer` only, DNA `--chart-*` tokens, NO
  legends, NO Y-axis numbers, edge-less plots, gradient fills, tooltips
  ALWAYS via `ChartTooltipContent`. Fork a `chart-demos` recipe. Score
  gauges via `ScoreGauge` — never hand-drawn arcs. One `HeroMetricCard`
  max per screen.
- Sheets float (inset, rounded, `size` presets sm→full). One overlay at a
  time — never nest a Select inside a Popover.
- Icons only from `@/components/icons` (Nucleo). New glyph = one re-export.
- Every screen ships empty/loading/error states and works at 375px (the
  mobile drawer auto-closes on nav — keep it that way).
```

## 4. The mistakes list (NEVER — name them in the skill verbatim)

These are real failures observed in generated UIs. The skill should list
them as hard NEVERs, each with the correction:

| Mistake | Correction |
|---|---|
| **Unnecessary topbar** (brand chip + one button in a bar) | Inset pages own their header via `PageHeader`; brand lives in the sidebar; primary action goes in `PageHeader` `actions` or the table's `toolbarEnd`. `AppShell`'s `topbar` slot is only for genuine global chrome (workspace switcher, global search). |
| **Tinted chat composer** (colored band behind the chat input) | The composer and its surroundings stay on the plain surface. The chat shells style themselves — never wrap or re-skin them. |
| **Chat shell nested in a layout** (inside AppShell/Card/Sheet/grid cell) | `TimbalChatShell`/`TimbalStudioShell` own the whole viewport on their own route. In-page AI = `AssistantPill`. |
| **Chart clutter** (legends, Y-axis numbers, bordered chart-in-card-in-card) | Tooltip-only, edge-less, one wrapper: `ChartCard`. |
| **Bulk actions as toolbar buttons** | Floating `BulkActionBar`, appears on selection. |
| **Squared full-bleed hovers** | Rounded hovers are built into `TableRow`/`DataTableColumnHeader` — don't override. |
| **Gray inputs / bold titles / washed-out badges** | White controls, medium-weight titles, vivid tonal badges — all defaults; don't fight them. |
| **Hand-rolled SVG gauges/arcs** (broken geometry, raw colors) | `ScoreGauge` from `@/components/app/score-gauge` — token tones, auto thresholds, solved geometry. |
| **Native browser pickers** (`<input type="date">`, native `<select>`) | Lint-banned in the blueprint (`no-restricted-syntax`). Use `ui/date-picker` + `ui/select`/`Combobox`. |
| **Hand-rolled chart tooltips** (illegible colored boxes, duplicate rows) | `ChartTooltipContent` only — see `DemoScatterChart` for a custom label done right. |
| **Tinted info/value cards** (blue-washed summary tiles) | Cards stay `bg-card` white; color lives in badges, gauges, charts — never card backgrounds. |

## 5. Chat + assistant conventions

- `/chat` (or `/`) route → `TimbalChatShell` (`src/pages/Home.tsx` is the
  wired example: `attachments: true`, artifact events, welcome copy).
  Uploads go through the built-in adapter to `/api/files/upload` — do not
  hand-roll upload UI.
- App screens → `<AssistantPill context={...} />` from
  `@/components/blocks/assistant`, docked once per screen. It streams via
  the same `VITE_TIMBAL_*` env as the shells.

## 6. Verification loop (the skill's closing section)

```md
Before finishing: `bun run dna:check && bun run lint && bun run build`,
then screenshot the changed screens at 1280 and 375 (light + dark when
relevant) and self-review against the rules above. If a screenshot shows
a named mistake (§4), fix it before returning.
```

CI mirror: the blueprint's `UI smoke` workflow (dna-check → lint → build →
gallery screenshots) is the same loop; keep skill and workflow in sync.

## 7. How to edit taste later (one place per axis)

| To change… | Edit… |
|---|---|
| Colors, radius, fonts, density, motion, status/selection/chart palettes | `src/design/dna.json` → `bun run dna:compile` |
| Control shadow/surface (inputs + white buttons) | `src/lib/control-surface.ts` (`SURFACE_SHADOW`, `controlSurfaceClass`) |
| Button chrome (gradient sheen, compression) | `src/components/ui/button.tsx` |
| Table grammar (header band, hover shape, density) | `src/components/ui/table.tsx` + `ui/data-table.tsx` |
| Badge vibrancy | `src/components/ui/badge.tsx` (tonal variants) |
| Chart grammar (legends/axes/gradients) | `src/components/blocks/chart-demos.tsx` recipes |
| The rules the agent reads | `AGENTS.md` + `BLOCKS_CATALOG` purposes |

Each edit is one file; the catalog and AGENTS.md are prose — keep them in
the same PR as the component change so the skill never lies.

## 8. Acceptance checklist (for the skill PR)

- [ ] Skill instructs: read `BLOCKS_CATALOG` before composing; blocks →
      primitives → raw HTML order stated explicitly.
- [ ] §3 house rules present (verbatim or tightened, not weakened).
- [ ] §4 mistakes listed as NEVERs with corrections.
- [ ] Chat mount convention stated as a hard rule.
- [ ] Verification loop requires screenshots + self-review.
- [ ] Skill references files by path instead of duplicating their content
      wherever possible (so kit updates don't strand the skill).
- [ ] Eval: generate one dashboard + one index page + one chat app from
      scratch; zero §4 mistakes in the screenshots.
