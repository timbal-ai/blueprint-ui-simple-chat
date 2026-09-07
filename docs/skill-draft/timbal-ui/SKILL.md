---
name: timbal-ui
description: "Use for any on-screen frontend/UI work in a Timbal app — designing, building, styling or rebranding a chat assistant, dashboard, admin, settings or any screen (tables, forms, charts, cards, components), including matching a reference screenshot or Mobbin design. Covers React + Vite + Tailwind v4 projects on the Timbal blueprint: BoardUI (vendored design system) + @timbal-ai/timbal-react (chat, auth, streaming). Assume visible UI tasks belong here even when Timbal isn't named. Skip agent/system prompts, timbal.yaml, knowledge bases, the SDK, deploy/CI."
---

# Timbal UI — BoardUI on the Timbal runtime

Read this before touching anything under `ui/`.

## Detect the blueprint generation

```
ui/package.json → "timbal": { "blueprint": "ui-v3" }   → v3 (this file)
ui/src/design/dna.json exists                           → v2 fork-first → references/legacy-v2.md
otherwise                                               → legacy kit    → references/legacy-kit.md
```

Everything below is v3. If `git status` shows the whole `ui/` tree untracked and you
did not create it this turn, commit the pristine scaffold first
(`git add ui && git commit -m "chore: ui scaffold baseline"`), then edit.

## The loop

1. **Direction first — write `ui/DESIGN.md` before any screen.** Decide and record:
   shell (`SidebarShell` workhorse SaaS · `TopbarShell` consumer/browse · focused
   single page · full-page chat · split list/detail), density (airy · regular ·
   dense), start-from (a template slug or "compose"), tone (two adjectives from the
   brief), 1–2 references. **Accent stays BoardUI blue** unless the brief names a
   brand colour (then set the eleven `--color-accent-*` stops in
   `ui/src/styles/brand.css`); never change the hue for variety. When the brief
   is visual and vague, pull 2–4 references with `mcp__timbal__search_screens` /
   `view_screens` and extract intent (layout, density) — never paste image
   URLs into code. **Anti-repetition:** if the previous project used the same shell
   + template, change one of them (or the density) and say why. Run
   `bun run design:check` yourself: it fails while the table has placeholders.
2. **Discover in `ui/registry/`** — `INDEX.md` (one screen: what exists, how to
   pick, and the **intent → component table**: charts, tables, stat tiles, forms,
   settings, calendar, auth all have a vendored component — find yours there before
   writing JSX), then `templates.md` (9 finished pages: dashboard, finance, hr, marketing,
   medical, calendar, ai-profile, ai-chat, ai-image-generation), `components.md`
   (BoardUI catalog, exact names, usage snippets), `props.md` (every component's
   props, generated from source), `patterns.md` (page recipes), `theming.md`,
   `motion.md`. Names are exact; never guess an API — read `props.md`.
3. **Compose, in this order:** template → block/card → `base/` primitive →
   `timbal/overlays` (modal, sheet, popover, toast) → your own. Never rebuild
   anything the registry has (data-table, stat-cards, chart cards, calendar,
   settings-modal, notification-center, auth-card, agent UI). Whole screen → copy the
   closest template shell into `ui/src/pages/`, swap its data file and nav, delete
   what the brief doesn't need. No template fits (wizard, editor, kiosk, feed) →
   compose from blocks under a shell. Every page is a route in `ui/src/App.tsx`;
   multi-page apps mount `SidebarShell`/`TopbarShell` once as a layout route. `/`
   ships as `Placeholder.tsx` — replace it with the product's entry screen and
   delete the file; chat stays at `/chat` unless the product IS a chat.
4. **Verify:** `cd ui && bun run design:check && bun run lint && bun run build`,
   then screenshot the changed routes at 1280 and 375 px, light and dark
   (`bun run screenshots -- --routes /,/orders` or
   `mcp__timbal-browser__browser_screenshot`), and self-score with
   [references/critique.md](references/critique.md). Fix and re-shoot, max 3 rounds,
   then ship with gaps stated.

## The Timbal seam (the only non-BoardUI knowledge)

Read `ui/registry/timbal.md` for detail. In short:

| The product needs… | Build |
|---|---|
| A chat product | keep `ui/src/pages/Home.tsx`: it is the BoardUI Pro ai-chat layout (`ChatHistoryRail` + `ChatFrame` + runtime `Thread` with `boardChatComponents`), with `/chat/:id` history wired. Change brand, welcome copy, suggestions — not the structure |
| A chat page inside an app | `EmbeddedChat` (`@/components/timbal/embedded-chat`) as its own route under the shell — already framed, flush with the shell inset; no title, no extra card |
| AI one tap away on data screens | `AssistantPill` (`@/components/timbal/assistant-pill`) in the shell's `dock`, once |
| Sign-in | nothing: `SessionProvider` + `AuthGuard` (no `renderLogin`) redirect to the platform's login page and back. Never build a login screen or route |
| Your own data | `authFetch("/api/…")` from `@timbal-ai/timbal-react`; never swallow errors |

Never hand-roll a message list, composer, upload, streaming client, or auth form.
Never nest a chat in a modal/card, never let the composer scroll off screen.

## Golden rules

1. **Tokens only.** BoardUI semantic tokens (`text-text-primary`,
   `bg-background-primary-default`, `border-border-button-default`) and composite type
   utilities (`text-body-regular`, `text-title-2-medium`). No palette classes, no hex,
   no `dark:` color overrides. `cx()` from `@/utils/cx`; icons from `@remixicon/react`.
2. **Vendored files are read-only.** `ui/src/components/{base,application,foundations}`
   and `styles/{theme,typography,globals}.css` are overwritten by `bun run
   boardui:sync`. Wrap, don't fork. Project code lives in `components/timbal`,
   `pages`, `styles/brand.css`.
3. **React Aria Components** for interactive primitives (what BoardUI uses). No Radix,
   no native `<select>`/`<input type=date>` (lint-banned).
4. **States are part of the screen:** skeleton loading, empty, error; 375 px works
   (shell → drawer, tables scroll in their container).
5. **Update `DESIGN.md` in the same turn as any design decision.**
6. **Never `import()` / execute `@timbal-ai/timbal-react` to introspect** — grep
   `ui/node_modules/@timbal-ai/timbal-react/dist/*.d.ts`. Never install a browser.

## Verification gate (automatic)

When a turn edits `ui/**`, the stop hook runs `design:check`, `tsc -b` and
`timbal-ui-lint` (errors only: raw colors, chat contract, native pickers). Failures
bounce the turn with findings. Taste is not linted — it is scored by the critique
rubric, including **Distinctiveness**: a screen that looks like the last one you
built is a finding.
