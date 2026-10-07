# UI — BoardUI on the Timbal runtime

React 19 · Vite · Tailwind v4 · react-router · `@timbal-ai/timbal-react` (chat, auth,
streaming, uploads, artifacts). Design system: **BoardUI**, vendored as source under
`src/components/{base,application,foundations}` — never edited by hand
(`bun run boardui:sync` overwrites it). Project code: `src/components/timbal/`
(chat slots, shells, overlays, data-table, work-queue) and `src/pages/`.

**This file and `registry/` are the truth for this project.** They ship with the code, so
they are always the current version; a platform rule or skill (`timbal-ui`, the composer's
system prompt) is the generic guide, and on any design decision where the two disagree this
file wins. Keep the platform's loop: direction in `DESIGN.md`, discover in `registry/`,
run the checks yourself, screenshot and critique.
There is no `dna.json` / `tokens.css` / `@/components/blocks` / `discovery.ts` /
`PAGES_CATALOG` here (`dna:check` runs `design:check`). If anything you read points at the
legacy app kit (`AppShell`, `Page`, `Section`, `MetricRow`, `StatTile`, a "Dashboard" at
`/`, "lead with 3–5 Stats", "copy the closest template and delete what you don't need"),
ignore that part: `design:check` fails on it. A template is a starting composition for the
**object of the first job**, not a page to trim; the KPI templates are `/reports` material.

**Read `registry/INDEX.md` before writing UI.** It lists every template, block,
primitive and their props, plus the direction menu. **Then `registry/screens.md`**:
what `/` opens on, how a card sits on the page, and what waits for a click.
**The baseline look is a console** (`registry/theming.md` → House style): light by
default (dark one toggle away), 3.5 px grid, 4–16 px concentric radii, 13 px body, BoardUI's colours and
elevated buttons (monochrome primary: charcoal in light, white in dark) — all tokens in `src/styles/brand.css`.
Never re-round, re-colour or re-size type by hand to make a screen "feel" different.
**Surfaces: page → tray → tile.** The shell paints the page (`bg-background-full`); a
card region is a tray (`bg-background-secondary-default`, no border); things inside it
are tiles (`bg-background-primary-default`). One frame per region — never a bordered
card inside a bordered card. A bare `border` is always the hairline (set in `brand.css`).

## Rules

1. **Direction first.** Before code, write in `DESIGN.md`: the user's first job on `/`
   (a verb), shell, entry screen, density, template-or-compose, tone, references. Accent
   stays BoardUI blue unless the brief names a brand colour. Variety comes from shell,
   entry screen, template and density — never from a random hue. **The KPI dashboard
   (stat tiles + trend chart + table) is not the default entry screen, and a stat-tile
   strip above the primary object is the same screen**: `/` opens on the object of that
   first job (list, board, record, editor, schedule, conversation — recipes in
   `registry/screens.md`). A product with several modules (CRM, ERP, fleet, back office)
   whose first job is working through what needs attention opens on a **`WorkQueue`**
   (`components/timbal/work-queue`, demo `/examples/workspace`): the rows a KPI tile
   would have counted, each with its verb. It is one of seven shapes, not the answer
   for every multi-module app: a pipeline opens on the board, bookings on the schedule.
   A **monitor** (the first job is watching a live system and reacting) is the one
   product whose `/` may open on metrics, with the reason in the `DESIGN.md` Why cell.
   `design:check` reads the `index` route and rejects `StatCards`, `MetricRow` or
   hand-rolled tiles there without a reason.
2. **Every page is a route.** One `<Route>` per screen in `src/App.tsx`. Multi-page
   apps mount `SidebarShell` or `TopbarShell` (`components/timbal/shells`) once as a
   layout route and render pages through `<Outlet />`. Never switch pages with state.
   **The shell owns the page header**: title from the nav item, `description` under it,
   actions on the right. Pages render no `<h1>`; they pass live values and page-only
   buttons up with `<PageHeader description actions />` (`design:check` fails on an `<h1>`).
   A product not in English passes every `ShellLabels` string, translated, as the shell's
   `labels` (account menu, drawer, theme toggle); never fork the shell to translate it.
   `/` ships as `Placeholder.tsx`: replace it with the real entry screen and delete the
   file. Chat lives at `/chat` unless the product IS a chat — never a chat at `/` by default.
3. **Use what exists, in this order:** template (`registry/templates.md`) → block or
   card (`registry/components.md`, `props.md`) → `base/` primitive →
   `timbal/overlays` → write your own. Never rebuild something the registry has.
   A task / ticket / kanban screen is `ProjectBoardShell` (`/templates/project-board`)
   — never a hand-rolled column board. The dashboard / finance / hr / marketing /
   medical templates are metrics screens: fork them for `/reports`, not for `/`.
4. **Color and type only through tokens.** BoardUI semantic tokens
   (`text-text-primary`, `bg-background-primary-default`, `border-border-button-default`)
   and composite type utilities (`text-body-regular`, `text-title-2-medium`). No
   palette classes, no hex, no `dark:` color overrides (`.dark` flips tokens).
   Merge classes with `cx()` from `@/utils/cx`. Icons from `@remixicon/react` —
   `Line` variants for chrome, `Fill` only where BoardUI uses it (stop, alerts).
5. **Chat is the runtime.** `TimbalChat` + `boardChatComponents` (Home pattern),
   `EmbeddedChat` for a chat page in an app, `AssistantPill` for in-page AI. Never
   hand-roll a message list, composer, upload or streaming. The composer hides
   the **model picker** and the **Auto/permission pill** by default — do not turn
   them on unless the brief strictly requires switching models/workforces or
   picking Auto / Manual / Plan / Bypass, and the runtime honours that choice
   (`SHOW_MODEL_PICKER` / `SHOW_PERMISSION_MENU` in
   `src/components/timbal/chat/composer-panel.tsx`).
6. **Auth is the platform.** `SessionProvider` + `AuthGuard` (no `renderLogin`): signed-out
   users go to the Timbal login page and come back. Never build a login screen. API
   calls go through `/api` with `authFetch`. Never swallow fetch errors.
7. **States are part of the screen.** Loading (skeleton, not spinner), empty, error.
   375 px must work: shells collapse to a drawer, tables scroll in their container.
8. **Forms and menus on react-aria-components** (what BoardUI uses). No Radix, no
   native `<select>` / `<input type="date">` — use `base/select`, `base/date-picker`.
   `Switch` / `Checkbox` `onChange` receive a boolean (`onChange={setOn}`), not an event.
   People are `Avatar` initials. Do not commit dummy headshots, gallery stills or
   cover art into `public/`.
9. **Reveal progressively.** A screen shows the object and its next action; detail
   waits for a click. The header description is one line of live values (≤ 90
   characters). Lists show their first rows ("Show N more", "View all"), a record opens
   in a `Sheet`, how a number is computed sits behind an info `Tooltip` / `Popover`,
   and empty groups disappear instead of showing 0. No explanation paragraphs, no caption
   under every number, no "as of" date on every card (`registry/screens.md` §4;
   `design:check` fails on long descriptions and hard-coded paragraphs).

## Verify before finishing

```
bun run lint && bun run build      # eslint + design:check (DESIGN.md filled? does `/` match it?), then tsc + vite (deploys run build)
bun run screenshots                # every route at 1280/375, light/dark → screenshots/
bun run registry:build             # only if you added/renamed a component under components/timbal — CI fails on drift
```

Look at the screenshots. Fix overflow, unreadable dark-mode tokens, a composer that isn't
pinned, or a screen that looks like the last one you built.

## Native voice calls

For requested browser voice, use `LiveKitVoiceSession` from
`@timbal-ai/timbal-sdk/voice/livekit` (SDK 0.18.0 is installed). Follow the
[README voice recipe](README.md#native-voice-calls). Fetch connection material from
the API blueprint’s authenticated `/api/workforce/:id/voice/session` route with
`authFetch` (API SDK >=0.18.0). It uses native LiveKit session creation through the
request-scoped SDK client. Keep platform credentials server-side.
Let the SDK handle media and `timbal.events`; do not implement SDP offers or
infer readiness from participant presence. Preserve the Agent's voice settings;
when no greeting is configured, show “Ready — start speaking”. Cancel on unmount.
