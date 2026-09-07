# Registry — start here

This app is **BoardUI** (design system, all components vendored as source) on the
**Timbal runtime** (`@timbal-ai/timbal-react`: chat streaming, uploads, artifacts,
auth). Everything you can build with is indexed in this folder. Nothing needs to
be installed; nothing is fetched at build time.

| Read | When |
|---|---|
| **`templates.md`** | You need a whole screen. 9 finished pages (dashboard, finance, hr, marketing, medical, calendar, ai-profile, ai-chat, ai-image-generation), each with its route, subtree and data file. |
| **`components.md`** | The BoardUI catalog: every block and primitive with a one-line description and a usage snippet. Names are exact. |
| **`props.md`** | Props of every component (generated from source). Look here before guessing an API. |
| **`patterns.md`** | Page recipes: dashboard, table page, auth, AI chat, settings. |
| **`theming.md`** · `motion.md` | Tokens, type scale, accent ramp, dark mode; the motion language. |
| **`timbal.md`** | The Timbal seam: chat surfaces, slots, login, uploads, `/api`. The only non-BoardUI knowledge you need. |
| `registry.json` | Machine index (name → path → exports → props → tags → template). |

## Where things live

```
src/components/base/            36 primitives (button, input, select, table, tabs, date-picker, …)   BoardUI, verbatim
src/components/application/     blocks + Pro kits: charts/ (12 cards), composer-panel/, task-list/,
                                web-search/, agent-progress/, questionnaire/, calendar/, settings/,
                                notification-center/, auth/, data-table/, and one folder per template
                                (dashboard/, finance/, hr/, marketing/, medical/, ai-profile/, ai-chat/)  BoardUI, verbatim
src/components/timbal/          the seam (ours): chat/ slots · login.tsx · shells/ · overlays/ ·
                                embedded-chat.tsx · assistant-pill.tsx
src/pages/                      routes. templates/* mount the BoardUI shells (dev only)
src/styles/brand.css            accent ramp + fonts — the ONE file that restyles the product
```

Import through `@/`: `import { Button } from "@/components/base/buttons/button"`.

## How to pick (in this order)

1. **Decide the direction and write it in `DESIGN.md` first** — shell, accent, density,
   template-or-compose, tone, references. Variety is a decision: the previous
   project's choices are not a default. See the direction menu below.
2. **Whole screen?** Start from the closest **template** (`templates.md`) → copy its
   shell into `src/pages/`, swap data + nav, delete what the brief doesn't need. If
   no template fits (a wizard, an editor, a kiosk, a feed…), compose from blocks.
3. **Block or card?** `components.md` → `props.md`. Chart cards (`application/charts`),
   agent UI (`task-list`, `web-search`, `agent-progress`, `questionnaire`,
   `agent-limits`), `data-table`, `stat-cards`, `settings-modal`,
   `notification-center`, `calendar`, `auth-card` exist — never rebuild them.
4. **Primitive?** `src/components/base/*`. Gaps BoardUI doesn't cover (modal,
   sheet, popover, toast) are in `src/components/timbal/overlays`.
5. **Chat / AI / auth?** `timbal.md`. The runtime is the engine; BoardUI is the chrome.

## Direction menu (pick one per axis; record in DESIGN.md)

| Axis | Options |
|---|---|
| Shell | `SidebarShell` (workhorse SaaS, 4+ destinations) · `TopbarShell` (consumer/browse-first, ≤5 destinations) · focused single page (one job: form, editor, kiosk) · full-page chat (`Home` pattern) · split list/detail |
| Accent | Set the eleven `--color-accent-*` stops in `styles/brand.css` to the brand hue (violet, emerald, rose, amber, teal, neutral…). Default blue only when the brand is blue. |
| Density | airy (marketing, consumer) · regular · dense (ops, finance, dispatch) |
| Start from | a template by slug, or "compose" |
| Tone | two adjectives from the brief ("warm, calm" / "sharp, technical" / "playful") |

**Anti-repetition rule:** if the last project you built used the same shell + accent
+ template, change at least one of them, and say why in `DESIGN.md`.

## Don'ts (short list)

- No raw palette classes or hex (`bg-white`, `text-gray-500`, `#fff`) — semantic tokens only.
- No hand-stacked type (`text-sm font-medium`) — composite utilities (`text-body-medium`).
- No lookalikes of anything in `components.md`.
- No editing under `base/`, `application/`, `foundations/`, `styles/theme.css|typography.css|globals.css` — they are overwritten by `bun run boardui:sync`. Wrap, don't fork.
- No `useState` page switching — every page is a route.
- No chat re-implementations — `TimbalChat` + slots (see `timbal.md`).
