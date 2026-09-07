# BoardUI source in this repository

`src/components/base`, `src/components/application`, `src/components/foundations`,
`src/styles/theme.css`, `src/styles/typography.css`, `src/styles/globals.css`,
`src/utils/cx.ts`, `src/utils/use-dismiss-on-outside-press.ts`,
`src/hooks/use-count-up.ts`, `public/{avatars,brand,ai-chat,templates}` and the
`registry/{components,patterns,theming,motion}.md` references are **BoardUI**
(https://www.boardui.com) source, vendored by `scripts/boardui-sync.mjs`.

- Free items are MIT (BoardUI's public GitHub repo).
- **Pro** items (chart cards, agent UI, calendar, the 8 templates) are licensed
  under BoardUI Pro. Timbal holds a Pro license (2 seats) **and an explicit
  redistribution/OEM permission from the BoardUI author (2026-09-07, obtained
  by Pedro Olivares) covering (a) vendoring Pro source in this private
  blueprint and (b) shipping it inside UIs generated for Timbal customers.**
  Keep the written confirmation next to this file when it arrives.
- Consequences: this repository stays **private**; do not publish Pro source in
  public repos, gists, templates or registries; the generated end products may
  ship it.
- Upstream version: see `package.json` → `timbal.boardui`. Refresh with
  `bun run boardui:sync` (needs `npx boardui login <key>` on the machine).

The rest of the repository is Apache-2.0 (see `LICENSE`).
