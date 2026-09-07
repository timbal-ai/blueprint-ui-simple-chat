# UI v3 backend handoff — pure BoardUI blueprint on the Timbal runtime

**Audience:** monolith owners of `src/composer/skills/timbal-ui/*`,
`src/composer/assets/ui_gate_hook.sh`, `src/composer/SYSTEM_PROMPT.md`, the
`timbal` CLI blueprint tarball (`timbal add ui` / `create --with-ui`), and
`evals/ui-quality/*`.

**Status:** decided 2026-09-07 (BoardUI OEM/redistribution OK'd by the
author). FE build in progress on `blueprint-ui-simple-chat` branch `v3`.
Nothing in the monolith has been changed; this doc lists what to change.

**Rev 2** — supersedes rev 1 (which assumed free-tier-only + BYOK + MCP).

---

## 0. TL;DR

1. **Why every generated UI looks the same:** ~3k lines of in-repo agent
   indexes (`AGENTS.md` 382 lines / 17 NEVERs, `discovery.ts` 679, three
   catalogs, `DESIGN.md` 401) + a 2.1k-line skill + a Stop hook that bounces
   turns, all converging on one sanctioned path: `RoutedAppShell` → fork
   `insights-dashboard-page`/`invoices-page` → rename labels. Three stacked
   theming layers (runtime → BoardUI → DNA compiler with a drift gate) make
   deviation expensive. The agent is risk-minimizing inside a rulebook with
   ~38 named mistakes, not being lazy.
2. **v3 = pure BoardUI (free + Pro, all vendored) + the Timbal runtime + a
   thin adapter layer.** No house design system, no DNA, no `ui/` Radix
   layer, no house blocks/pages, no gallery, no MCP at generation time.
   Discovery goes through a **generated local registry** (BoardUI's own
   catalog + generated props index + patterns + a Timbal seam page).
3. **Variety is designed in, not hoped for:** a mandatory *direction* step
   (shell, accent ramp, density, template-or-compose) recorded in
   `DESIGN.md`, 8 Pro templates + 12 chart cards + agent UI to choose from, a
   topbar shell alongside BoardUI's sidebar, and a **diversity metric in
   evals** that fails when outputs converge.
4. **Monolith work shrinks to:** rewrite the skill (~100 lines + vendored
   BoardUI references), simplify the gate (tsc + lint errors-only, no DNA
   check), one prompt line, repack the tarball from the **private** v3
   repo, add the diversity metric. No MCP server, no license plumbing, no
   sandbox egress change.
5. **Licensing:** the blueprint repo becomes private (it vendors Pro
   source). Timbal's key is used only by Timbal devs (`npx boardui login`,
   2 seats). Keep the written OEM permission with the repo (`LICENSE-BOARDUI.md`).

---

## 1. Diagnosis (numbers, blueprint `main` @ `77dfe92`)

| Surface | Size | Effect |
|---|---|---|
| `ui/src` | ~32k lines / 204 files | agent must navigate all of it |
| House kit (`blocks/` 5.6k, `pages/` 3.4k, `ui/` 3.8k, `app/`, `chat/`) | ~13k | the forkable templates; 3 of 10 are stats+charts+table dashboards, catalog says "ANY dashboard starts here" |
| BoardUI Pro showcase copied in July | 8.8k | mock `ai-chat` (1.9k) wired to nothing |
| Agent-facing harness (`AGENTS.md`, `discovery.ts`, 3 catalogs, `DESIGN.md`, scripts) | ~3k | read before writing a line |
| Skill + references | 202 + 1,931 | kit path pulls ~420 lines every screen |
| Theming | 3 layers, 2 a11y stacks, 2 button systems, 156-item shadcn registry | deviation = gate bounce |
| Bundle | 3.9 MB main chunk | |

Mechanism: compose order is a "hard rule" (template → block → primitive),
taste is frozen as rules, the DNA is a knob the skill says to keep, the
eval rubric scores the same taste rules so sameness scores well. Cost:
~10–15k tokens of ceremony per UI session plus up to 3 hook bounces.

---

## 2. What BoardUI actually ships (verified by installing everything)

- 228 files / ~44k lines: `base/` 44 files (6.8k), `application/` 121 files
  (34k), styles 2k. Pro: 12 chart cards, agent UI (`composer-panel`,
  `composer`, `composer-attachments`, `task-list`, `web-search`,
  `agent-progress`, `agent-limits-card`, `questionnaire`), `calendar`, 8
  templates.
- Templates are thin: `app/<name>/page.tsx` returns `<FinanceShell />`; the
  page lives in `components/application/<domain>/<domain>-shell.tsx` +
  `<domain>-data.ts`. All eight use `DashboardSidebar`.
- Next.js coupling: **14 files** (8× `next/image`, 3× `next/link`, 2×
  `next/navigation`) + `app/api/chat/route.ts`. Solved by three Vite alias
  shims; vendored files stay byte-identical to upstream.
- Pro chat pieces are controlled components (`ComposerPanel`:
  `value/onValueChange/onSubmit/disabled/attachments/…`; `TaskList`,
  `WebSearch`, `AgentProgress`: data props) → map onto the runtime
  (`useComposerRuntime`, `useThread`, tool-call parts).
- BoardUI ships an agent skill (`npx boardui skill`): `SKILL.md` 76 +
  `components.md` 1,978 (full catalog, one snippet each) + `patterns.md` 107
  + `theming.md` 59 + `motion.md` 102 — regenerated from the live registry.
- Excluded from vendoring: `docs/`, `landing/` (site chrome), `agent-chat/`
  + `app/api/chat` (Vercel AI stack), `app-shell/` (chat-starter frame).
  Dropped deps: `ai`, `@ai-sdk/*`, `zod`, `next`.

---

## 3. Blueprint v3 (FE, branch `v3`)

```
ui/
├── AGENTS.md                ≤ 60 lines (BoardUI rules section + 8 Timbal rules)
├── DESIGN.md                ≤ 40 lines: the direction chosen for THIS project
├── LICENSE-BOARDUI.md       OEM permission summary + upstream version
├── package.json             "timbal": { "blueprint": "ui-v3", "boardui": "<cli version>" }
├── vite.config.ts           resolve.alias next/image|link|navigation → src/shims; onwarn filters "use client"
├── registry/                the discovery surface (generated, shipped)
│   ├── INDEX.md             one screen: how to pick, what's here
│   ├── components.md        BoardUI catalog (vendored from `npx boardui skill`)
│   ├── props.md             GENERATED from src: every export + Props interface + JSDoc
│   ├── templates.md         the 8 shells: route, domain, contents, data file
│   ├── patterns.md · theming.md · motion.md   (vendored from the BoardUI skill)
│   ├── timbal.md            the seam: chat surfaces, slots, login, uploads, /api
│   └── registry.json        machine index: name → path → exports → tags → template
├── scripts/
│   ├── boardui-sync.mjs     `boardui add <all names> --overwrite -d src`, exclusions, globals header strip
│   ├── registry-build.mjs   regenerates props.md / registry.json / templates.md
│   └── screenshots.mjs      shoots every route at 1280/375 (playwright) → screenshots/
└── src/
    ├── App.tsx              one <Route> per page; AuthGuard(renderLogin=<Login/>)
    ├── index.css            tailwind → runtime styles.css → styles/globals.css → brand.css → timbal-bridge.css
    ├── styles/              theme.css · typography.css · globals.css (BoardUI) · brand.css · timbal-bridge.css
    ├── shims/               next-image.tsx · next-link.tsx · next-navigation.ts
    ├── components/
    │   ├── base/ application/ foundations/   BoardUI, verbatim — NEVER edited by hand
    │   └── timbal/          the only house code (~1.5k lines): chat/ (slots on Pro ComposerPanel +
    │                        ai-chat messages + TaskList/WebSearch/AgentProgress tool adapters),
    │                        login.tsx, shells/ (sidebar-shell, topbar-shell), overlays/ (modal, sheet,
    │                        popover, toast on react-aria-components), embedded-chat, assistant-pill
    ├── hooks/ utils/        BoardUI foundations
    └── pages/               Home (chat) · Login · NotFound · templates/* (8 route files over the shells)
```

Rules that keep it maintainable: vendored files are never edited (sync is a
pure `--overwrite`); Timbal-specific code lives only in `components/timbal/`
and `pages/`; the registry is regenerated after every sync.

---

## 4. Monolith changes

### 4.1 Skill `src/composer/skills/timbal-ui/` (mirror to `leviosia/skills/timbal-ui/`, `scripts/sync_skills.sh`)

**A ready draft is in this repo: `docs/skill-draft/timbal-ui/SKILL.md` (95 lines) +
`references/critique.md`.** Copy it over, keep today's text as
`references/legacy-v2.md` / `legacy-kit.md` behind the detection below, and vendor
BoardUI's references (`components.md`, `patterns.md`, `theming.md`, `motion.md` —
same files as `ui/registry/`) under `references/boardui/` if you want them
available before the scaffold exists; otherwise the skill reads them from
`ui/registry/` at run time (preferred: one source of truth).

Detection at the top of `SKILL.md`:

```
package.json "timbal.blueprint" == "ui-v3"   → v3 (main path)
[ -f ui/src/design/dna.json ]                → v2 fork-first → references/legacy-v2.md (today's text)
otherwise                                     → legacy kit    → references/legacy-kit.md
```

`SKILL.md` v3 (~100 lines):

1. **Direction first (mandatory, written to `ui/DESIGN.md` before any code):**
   shell (`sidebar-shell` / `topbar-shell` / focused / full-page chat /
   split), accent (set the 11 `--color-accent-*` vars in `styles/brand.css`;
   never leave the default blue unless the brand is blue), density, tone (two
   adjectives from the brief), template-or-compose (name the template or say
   "compose from cards"), 1–2 references (`mcp__timbal__search_screens` when
   the brief is visual). **Anti-repetition:** if the last project used the
   same shell + accent + template, change at least one.
2. **Discover in `ui/registry/`:** `INDEX.md` → `components.md` / `props.md`
   / `templates.md` / `patterns.md`. Names are exact; never rebuild what the
   registry has; never write Radix/shadcn; `cx()` only.
3. **Timbal seam** (25 lines, from `registry/timbal.md`): chat surfaces table
   (chat product → `Home` pattern; chat page in an app → `EmbeddedChat`;
   in-page AI → `AssistantPill`), slots (`boardChatComponents`), `Login`,
   uploads through the runtime, `/api` via `authFetch`.
4. **Verify:** `bun run lint && bun run build`, `bun run screenshots` (or
   `mcp__timbal-browser__browser_screenshot`) at 1280/375, critique rubric
   incl. Distinctiveness, max 3 rounds.
5. Golden rules (8) = `AGENTS.md`.

References: keep `critique.md` (trimmed + **Distinctiveness** dimension),
add `timbal-seam.md`, vendor BoardUI's `components.md`, `patterns.md`,
`theming.md`, `motion.md` under `references/boardui/` (refresh with
`npx boardui skill --force`). Delete `kit.md`, `app-kit.md`, `components.md`
(house), `primitives.md`, `dna.md`, `theming.md` (house),
`theming-internals.md`, `layout-patterns.md`, `reference-match.md`,
`interaction.md`, `runtime.md`. Re-author `evals/evals.json` routing cases.

### 4.2 `src/composer/assets/ui_gate_hook.sh`

- Detect v3: `node -p "require('./ui/package.json').timbal?.blueprint" == ui-v3`.
- v3 runs, in order: **`node scripts/design-check.mjs`** (the anti-sameness
  gate: exit 1 while `DESIGN.md`'s direction table still has placeholders —
  shell / accent / density / template-or-compose / tone must be decided before
  screens are built; warns when the accent ramp is still default blue),
  **`tsc -b`**, **`timbal-ui-lint` errors-only**; skip `timbal-dna check`.
  `MAX_ATTEMPTS=3` and exit-2 contract unchanged. Feed `design-check`'s stderr
  back verbatim — it tells the agent exactly what to decide.
- `timbal-react` lint (separate FE release, 4.3.0): keep as errors only raw
  hex/oklch/palette classes, `hsl(var(--x))`, unsafe chart `dataKey`s, chat
  shell nested in a constrained wrapper, displaced composer, native
  `<select>`/`<input type=date>`. Demote to warnings (never blocking on v3):
  `button-custom-fill`, `page-missing-inset`, `card-flush-content`,
  `status-fill-foreground`, `no-table-in-card`, `no-uppercase-heading`,
  `no-glow`, custom-heading-in-chat.

### 4.3 `src/composer/SYSTEM_PROMPT.md`

- `timbal-ui` row → "Frontend UI — any screen, chat chrome, theming (React,
  Vite, Tailwind v4, BoardUI)".
- Add: *"Design direction is a decision, not a default — pick shell, accent,
  density and template per project (see `timbal-ui` §1) and never reuse the
  previous project's."*

### 4.4 Tarball

Repack from the private v3 repo `main` once phase 1 lands; ship the
`registry/` folder and `package.json` marker. `ensure_ui_deps` unchanged
(deps: `react-aria-components`, `@remixicon/react`, `@internationalized/date`,
`motion`, `@tanstack/react-table`, `recharts`, `prism-react-renderer`,
`tailwind-merge`, `@timbal-ai/timbal-react`). Preview/deploy untouched (Vite,
bun, static `dist/`). Optional: a second kind `ui-chat` (Home + Login only)
vs `ui-app` (with shells/templates) — cheap variety at scaffold time.

### 4.5 `evals/ui-quality/`

- **Diversity metric** per run across seed briefs: mean/min pairwise
  perceptual-hash (or CLIP) distance of 1280 px screenshots; *template
  fingerprint* (share of briefs importing the same shell + same template);
  accent histogram. Fail when below the v3 baseline.
- Add **Distinctiveness** to the vision rubric.
- Add 3 non-dashboard briefs (wizard, document editor, kiosk).
- Baseline v2 first, then v3; promote when quality ≥ baseline and diversity
  materially higher.

### 4.6 Removed from rev 1

No BoardUI MCP in the sandbox, no `COMPOSE_TOOLS` additions, no BYOK
setting, no egress change, no `timbal-dna` anywhere.

---

## 5. Rollout

| Phase | Work | Owner | Done when |
|---|---|---|---|
| 0 | Repo private; `LICENSE-BOARDUI.md` with the OEM permission | FE | today |
| 1 | Blueprint v3 branch → `main` (§3), screenshots of every route at 1280/375, test recipe in README | FE | tag `ui-v3.0.0` |
| 2 | 4.1 skill + mirror, 4.2 hook, 4.3 prompt, 4.4 repack behind `TIMBAL_UI_BLUEPRINT=v3` | BE | fresh project → v3 `ui/`, hook passes, one compose turn builds a non-dashboard screen |
| 3 | 4.5 evals; baseline v2 vs v3 | BE/FE | report: quality ≥ baseline, diversity up |
| 4 | Flip default; archive v2 docs; keep v2 detection for existing projects | BE | |

Effort: phase 1 ≈ 4–5 FE days; phase 2 ≈ 1.5 BE days; phase 3 ≈ 2 days.

## 6. Testing the blueprint (for BE smoke on a fresh project)

```
cd ui && bun install
bun run design:check                   # FAILS on a pristine scaffold by design (direction not decided yet)
bun run build && bun run lint          # gate parity
bun run dev                            # / (chat), /login, /templates/* and /examples/* (DEV only)
bun run screenshots                    # screenshots/<route>-{1280,375}[-dark].png, exits 1 on page errors
bun run registry:build                 # after any boardui:sync; `--check` = CI drift check
bun run boardui:sync                   # pulls upstream (needs `npx boardui login` on the machine)
```

Compose-turn smoke (what the hook should see): 1) a turn that edits `ui/src/pages`
without filling `DESIGN.md` → `design:check` exit 1, turn bounced with the list of
undecided axes; 2) after `DESIGN.md` is filled → `tsc` + lint run; 3) the composer
picks a template by slug from `registry/templates.md` or composes from
`registry/components.md`, never from a house kit (there is none).

Expected: `/` renders the BoardUI chat chrome on the Timbal runtime (sending
without a backend shows the runtime error state, not a crash); `/login`
renders `AuthCard` with the providers from `/api/config`; each template route
renders its BoardUI shell; build has no `tsc` errors and no raw-color lint
errors.

---

## Appendix — BoardUI facts (2026-09-07)

CLI `boardui@0.5.3`: `init [--pro]`, `add [--all|--overwrite|-d dir]`
(`--all` = free items only; Pro by name), `list`, `mcp`, `skill`, `login <key>`,
`logout`. Registry: `https://www.boardui.com/r/registry.json` (free) +
`/r/<name>.json`. Free: 36 base, 16 application, 10 foundations. Pro: 26
components, 8 templates (`template-home-dashboard`, `template-marketing`,
`template-finance`, `template-hr`, `template-medical-profile`,
`template-ai-chat`, `template-ai-profile`, `template-ai-image-generation`).
Theming: `theme.css` 904 lines / 213 vars, accent ramp re-tints every
interactive surface; `.dark` overrides; `typography.css` composite `text-*`
utilities. License: single-user Pro (2 seats on our key); OEM permission for
Timbal obtained verbally 2026-09-07 — get it in writing.

Timbal runtime surface used by the seam: `TimbalChat`, `ThreadComponents`
slots, assistant-ui re-exports (`ComposerPrimitive`, `MessagePrimitive`,
`ActionBarPrimitive`, `AuiIf`, `useThread`, `useComposerRuntime`),
`MarkdownText`, `ToolArtifactFallback`, `ComposerAttachments`,
`UserMessageAttachments`, `SessionProvider`, `AuthGuard({renderLogin})`,
`useOptionalSession` (`authProviders`), `getAuthBaseUrl`, `useWorkforces`,
`useConversations`. Wire: `GET /api/config`, `GET /api/auth/{provider}`,
`POST /api/auth/magic-link {email}`, `POST /api/workforce/{id}/stream` (SSE),
`/api/files/upload`.
