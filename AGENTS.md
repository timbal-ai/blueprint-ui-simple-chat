# UI — BoardUI on the Timbal runtime

React 19 · Vite · Tailwind v4 · react-router · `@timbal-ai/timbal-react` (chat, auth,
streaming, uploads, artifacts). Design system: **BoardUI**, vendored as source under
`src/components/{base,application,foundations}` — never edited by hand
(`bun run boardui:sync` overwrites it). Project code: `src/components/timbal/`
(chat slots, shells, overlays) and `src/pages/`.

**Read `registry/INDEX.md` before writing UI.** It lists every template, block,
primitive and their props, plus the direction menu. **Then `registry/screens.md`**:
what `/` opens on and how a card sits on the page.
**The baseline look is a console** (`registry/theming.md` → House style): light by
default (dark one toggle away), 3.5 px grid, 4–16 px concentric radii, 13 px body, BoardUI's colours and
elevated buttons (monochrome primary: charcoal in light, white in dark) — all tokens in `src/styles/brand.css`.
Never re-round, re-colour or re-size type by hand to make a screen "feel" different.
**Surfaces: page → tray → tile.** The shell paints the page (`bg-background-full`); a
card region is a tray (`bg-background-secondary-default`, no border); things inside it
are tiles (`bg-background-primary-default`). One frame per region — never a bordered
card inside a bordered card. A bare `border` is always the hairline (set in `brand.css`).

## Rules

1. **Direction first.** Before code, write in `DESIGN.md`: shell, entry screen,
   density, template-or-compose, tone, references. Accent stays BoardUI blue unless
   the brief names a brand colour. Variety comes from shell, entry screen, template
 and density — never from a random hue. **The KPI dashboard (stat tiles + trend
 chart + table) is not the default entry screen, and a stat-tile strip above the
 primary object is the same screen**: `/` opens on the product's primary object
 (list, board, record, editor, schedule, conversation — recipes in `registry/screens.md`);
 `design:check` reads the `index` route and rejects `StatCards` there without a reason.
2. **Every page is a route.** One `<Route>` per screen in `src/App.tsx`. Multi-page
   apps mount `SidebarShell` or `TopbarShell` (`components/timbal/shells`) once as a
   layout route and render pages through `<Outlet />`. Never switch pages with state.
   **The shell owns the page header**: title from the nav item, `description` under it,
   actions on the right. Pages render no `<h1>`; they pass live values and page-only
   buttons up with `<PageHeader description actions />` (`design:check` fails on an `<h1>`).
   `/` ships as `Placeholder.tsx`: replace it with the real entry screen and delete the
   file. Chat lives at `/chat` unless the product IS a chat — never a chat at `/` by default.
3. **Use what exists, in this order:** template (`registry/templates.md`) → block or
   card (`registry/components.md`, `props.md`) → `base/` primitive →
   `timbal/overlays` → write your own. Never rebuild something the registry has.
   A task / ticket / kanban screen is `ProjectBoardShell` (`/templates/project-board`)
   — never a hand-rolled column board.
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
   People are `Avatar` initials. Do not commit dummy headshots, gallery stills or
   cover art into `public/`.

## Verify before finishing

```
bun run design:check               # DESIGN.md direction filled, and does `/` match it? (the platform gate runs this too)
bun run lint && bun run build      # tsc + vite; the platform gate runs the same
bun run screenshots                # every route at 1280/375, light/dark → screenshots/
bun run registry:build             # only if you added/renamed a component under components/timbal — CI fails on drift
```

Look at the screenshots. Fix overflow, unreadable dark-mode tokens, a composer that isn't
pinned, or a screen that looks like the last one you built.
