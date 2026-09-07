# Timbal Blueprint UI (v3)

The starting point for every UI built on the Timbal platform: **BoardUI** (the
complete design system — primitives, blocks, 12 chart cards, agent UI, 8 finished
page templates — vendored as source) on the **Timbal runtime**
(`@timbal-ai/timbal-react`: chat streaming, uploads, artifacts, auth).

Private repository: it contains BoardUI Pro source (see `LICENSE-BOARDUI.md`).

## Run

```
bun install
bun run dev:fake            # vite + a fake Timbal API (:5301): chat streams tools/artifacts, login shows providers
bun run dev                 # vite only — "/" chat, "/login", "/templates/*", "/examples/*" (dev only)
bun run build && bun run lint
bun run design:check        # fails until DESIGN.md's direction table is filled (by design)
bun run screenshots         # every route at 1280/375, light/dark → screenshots/ (exits 1 on page errors)
```

Environment: copy `.env.example` to `.env`. `bun run dev:fake` needs no backend
(`scripts/fake-api.mjs`: prompts containing "slow"/"fail" exercise the running
and error states). Point `VITE_API_PROXY_TARGET` at a real API (or run
`timbal start`) to stream for real.

Routes to look at: `/` (chat), `/login`, `/templates/{dashboard,finance,hr,
marketing,medical,calendar,ai-profile,ai-chat,ai-image-generation}`,
`/examples/shell-sidebar/{,settings,chat}`, `/examples/shell-topbar/{,chat}`.

## Layout

```
AGENTS.md                 the rules for agents (≤ 60 lines)   ·   DESIGN.md  the direction of THIS product
registry/                 what exists: INDEX.md → templates.md · components.md · props.md · patterns.md · timbal.md
src/components/base/      BoardUI primitives           ┐
src/components/application/  BoardUI blocks, charts, agent UI, template subtrees  │ vendored, never hand-edited
src/components/foundations/  brand mark, chevrons      ┘   (bun run boardui:sync)
src/components/timbal/    the seam: chat/ slots · login.tsx · shells/ · overlays/ · embedded-chat · assistant-pill
src/pages/                routes: Home (chat) · Login · NotFound · templates/* · examples/*
src/styles/               theme.css typography.css globals.css (BoardUI) · brand.css (yours) · timbal-bridge.css
src/shims/                next/image, next/link, next/navigation → Vite/react-router
scripts/                  boardui-sync.mjs · registry-build.mjs · screenshots.mjs
```

## Maintaining

- **Upstream refresh:** `npx boardui login <key>` once per machine, then
  `bun run boardui:sync && bun run registry:build && bun run build`. Vendored files
  are byte-identical to upstream; project code only lives in `src/components/timbal`,
  `src/pages`, `src/styles/brand.css`, `src/styles/timbal-bridge.css`, `src/shims`.
- **Registry:** `bun run registry:build` regenerates `registry/props.md`,
  `registry/registry.json`, `registry/templates.md` from source; `--check` fails CI on drift.
- **Runtime:** `@timbal-ai/timbal-react` — restyle chat through the slot map in
  `src/components/timbal/chat/chrome.ts`, never by forking the package.

## For agents

Read `AGENTS.md`, then `registry/INDEX.md`. Decide the direction (shell, accent,
density, template-or-compose) and write it in `DESIGN.md` before building.
