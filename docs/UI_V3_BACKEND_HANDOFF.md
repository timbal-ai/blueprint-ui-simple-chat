# UI v3 backend handoff — lean BoardUI blueprint + composer harness diet

**Audience:** monolith owners of `src/composer/skills/timbal-ui/*`,
`src/composer/assets/ui_gate_hook.sh`, `src/composer/SYSTEM_PROMPT.md`,
`src/models/compose.rs` (`COMPOSE_TOOLS`),
`src/handlers/orgs/projects/compose/prompt.rs` (`mcp_config`),
`src/services/compose/ui_deps.rs`, the `timbal` CLI blueprint tarball, and
`evals/ui-quality/*`.

**Status:** proposal + verified spike. Nothing in the monolith was changed.
Companion code: branch `spike/v3-boardui-chat` in `blueprint-ui-simple-chat`
(commit `97eac85`).

**Date:** 2026-09-07

---

## 0. TL;DR

1. **Every generated UI looks the same because the harness tells the agent to
   make it the same.** ~3k lines of in-repo agent indexes + a 2.3k-line skill
   + a Stop hook that bounces turns, all converging on one sanctioned path:
   `RoutedAppShell` (inset) → fork `insights-dashboard-page` / `invoices-page`
   → rename labels. The layout guide literally says *"The #1 failure is
   defaulting to sidebar + stat row + table for everything"* while every other
   rule mandates exactly that composition. The agent isn't lazy; it's
   risk-minimizing inside a rulebook with ~38 named mistakes.
2. **Urgent, independent of the redesign:** the public repo
   `timbal-ai/blueprint-ui-simple-chat` (Apache-2.0) contains ~4.9k lines of
   **BoardUI Pro** source (ai-chat, ai-profile, calendar, medical cards,
   contributions/earnings/steps/sleep/rings). BoardUI's license forbids
   publishing Pro source in a public repo, template or starter kit
   (§2). Make the repo private this week and remove/replace Pro source
   before the next tarball repack.
3. **Approach decision: hybrid.** Vendor the BoardUI **free tier (MIT)** into
   the blueprint, pre-adapted once to Vite + react-router + the Timbal
   runtime (chat chrome, login, uploads). Expose the **BoardUI MCP** in the
   compose sandbox for on-demand docs (`get_component`, `get_usage_examples`,
   `get_theme`) and free installs; **Pro only via the customer's own key
   (BYOK) or an OEM agreement with BoardUI** — never Timbal's single-user key
   inside customer projects. Zero generation-time network for the default
   path; deterministic builds; license-clean.
4. **Delete the house design system.** One token source (`styles/theme.css`,
   BoardUI, 213 vars, accent ramp = the "configurator") + a 30-line bridge
   for the runtime's chat tokens. No `dna.json`/`tokens.css`/`dna:check`, no
   `discovery.ts`, no catalogs, no gallery in the tarball, no shadcn registry
   builder. `AGENTS.md` ≤ 60 lines, skill ≤ 120 lines + 3 short references.
   Target: `ui/src` from ~32k → ~12k lines.
5. **Spike proved the risky part in an afternoon:** BoardUI chrome mounted as
   `TimbalChat` slots (composer pill, messages, welcome, suggestions) with
   streaming/uploads/artifacts untouched, and BoardUI `AuthCard` driven by
   `SessionProvider` (OAuth redirect + magic link). Builds, lints, works at
   1280/375, light/dark.

---

## 1. Diagnosis — why every UI is the same

### 1.1 Numbers (blueprint `main` @ `77dfe92`)

| Surface | Size | Role |
|---|---|---|
| `ui/src` total | **~32,150 lines / 204 files** | |
| `components/application/*` (BoardUI Pro showcase kit) | 8,784 (27%) | dashboard 2,127 · ai-chat 1,931 (mock, wired to nothing) · medical 1,691 · calendar 1,209 · docs 765 |
| `components/blocks` | 5,637 | house block kit (28 files) |
| `components/base` (BoardUI free primitives) | 4,199 | the one layer that should exist |
| `components/ui` (shadcn/Radix leftovers) | 3,825 | 37 files; ~21 gallery-only; `ui/button` has **zero** non-`ui/` importers |
| `components/pages` (forkable templates) | 3,355 | 10 templates, **3 are stats+charts+table dashboards** |
| `src/pages/gallery` | 1,893 | dev showcase behind `VITE_GALLERY` |
| **Agent-facing harness** (`AGENTS.md` 382 + `discovery.ts` 679 + 3 catalogs 948 + `DESIGN.md` 401 + scripts 420 + `README`) | **~3,000** | read *before writing a line* |
| Monolith skill `timbal-ui` | `SKILL.md` 202 + 14 references 1,931 (**2,133** total) | progressive, but the kit path pulls `kit.md` (169) + `layout-patterns.md` (132) + `design-principles.md` (119) on every screen, `components.md` (347) on every restyle |
| Named bans | 17 "NEVER" bullets in `AGENTS.md`, 21-row NEVER table in `kit.md`, 14 `DO_NOT_BUILD`, 37 `INTENT_INDEX` entries | |
| Theming layers | **3 stacked**: `@timbal-ai/timbal-react/styles.css` → BoardUI `theme.css`+`typography.css` → DNA `tokens.css` (compiled, gate-checked) | plus 2 a11y stacks (Radix `ui/`, React Aria `base/`), 2 button systems, a 156-item shadcn registry (`public/r`, 1.4 MB) |
| Production bundle | main chunk **3.9 MB** (826 kB gzip) | |

### 1.2 Mechanism

- **Compose order is a "hard rule":** page template → block → primitive → raw
  HTML, and "never compose a whole screen from primitives". With 10
  templates and text like *"ANY dashboard… start here, not from scratch"*
  (`PAGES_CATALOG.insights-dashboard-page`), the lowest-risk move for any
  brief is the same fork. Templates are the ceiling, not the floor.
- **Taste frozen as rules.** Gradient "timbal finish", inset gray canvas,
  h-8 buttons, rounded muted table header, no legends, no Y-axis, one
  `HeroMetricCard` max, "titles never bold"… Each is defensible; together
  they define exactly one product. The DNA is a knob the skill tells the
  agent to keep (*"keep it unless the user explicitly wants flat surfaces"*).
- **Gate pressure.** The Stop hook bounces up to 3× on lint/dna/tsc; agents
  learn that deviation costs turns. (The July `timbal-react` proposal already
  diagnosed this: *"the allowlist made the kit's own components the quality
  ceiling"*.)
- **Single tarball, single shell.** `timbal add ui` unpacks one blueprint; no
  direction choice happens anywhere in the flow. `evals/ui-quality` scores a
  rubric (the same taste rules) — it cannot detect sameness because
  sameness scores well.
- **Cost.** ~10–15k tokens of ceremony per UI session before the first edit
  (AGENTS.md 25 KB alone), then hook bounces. Speed and diversity both lose.

---

## 2. Urgent — BoardUI license exposure (do this week)

Facts (boardui.com/license, /terms, verified 2026-09-07):

- Pro is a **single-user** license (Annual/Lifetime; "Unlimited for
  Startups" = 5 users). Keys are personal and may not be shared; 3 machine
  seats; CI via `BOARDUI_LICENSE_KEY`. **Free tier is MIT** (public GitHub).
- Prohibited: *"Redistribute the Source, or any recognisable derivative of it,
  as source code. That includes … publishing it in a public repository, gist,
  template, starter kit or course."* and *"Resell a template, or a lightly
  changed version of one, as a starter kit, boilerplate…"*. Allowed: end
  products for yourself, your employer, or clients.
- Our situation: `github.com/timbal-ai/blueprint-ui-simple-chat` is
  **PUBLIC**, licensed Apache-2.0, and ships Pro source in
  `src/components/application/{ai-chat,ai-profile,calendar,dashboard/*-card,
  medical/*}` (~4.9k lines). That tarball is then copied into every customer
  project ("template / starter kit"), and customers receive it as source.

Actions:

1. **Make the repo private now** (or strip Pro source from `main`). Rewrite
   history only if legal asks; at minimum remove from HEAD and repack.
2. **Next tarball = free tier only** (v3 below). No Pro source in anything
   that leaves Timbal.
3. **Ask BoardUI for an OEM/platform agreement** (author: Mertcan Esmergül;
   support is a DM on X per the site) covering: vendoring Pro in a private
   Timbal blueprint + distributing Pro inside generated end products. Until
   signed, Pro reaches customers only via **BYOK** (§3.3).
4. Keep Timbal's own key for Timbal developers maintaining the blueprint
   (`npx boardui login`), never in sandboxes.

---

## 3. Decision — "install all" vs MCP → hybrid

Evaluated against: it has to work in the Vite/bun/static-`dist` pipeline
(hard platform constraints, `preview.rs`, `deployments/serverless/ui.rs`),
generation cost/latency, determinism, license, and customizability.

### 3.1 Pure "install all" (vendor everything incl. Pro, no MCP)

+ Zero runtime network, deterministic, adapt Next-isms once.
− **License-incompatible for Pro** (§2). Vendoring 8 Pro templates + 26 Pro
  components recreates today's 8.8k-line showcase problem and the fork bias.

### 3.2 Pure MCP (agent installs at generation time)

+ Always latest; nothing vendored.
− Network + `boardui.com` availability on every UI turn; `npx` cold start
  (~6 s here) per sandbox; **Next.js coupling in several free items**
  (`agent-chat` uses `next/navigation` + Vercel AI SDK `useChat`; `app-shell`
  drags 25 docs/marketing files incl. WebGL shaders; `next/image`,
  `next/link`) — the agent would re-do the Vite/Timbal adaptation every
  project, badly; Pro needs a key in the sandbox (single-user license,
  seat accounting per machine).

### 3.3 Hybrid (recommended)

| Layer | What | Why |
|---|---|---|
| **Blueprint v3 (tarball)** | BoardUI **free tier** vendored: 36 `base/*` primitives + selected `application/*` blocks (sidebar, settings-modal, auth-card, notification-center, data-table, stat-cards, revenue/orders chart cards, agent-thinking, composer-loader, agent-log, theme-toggle) + foundations (`theme.css`, `typography.css`, `globals.css`, `cx`, hooks). Pre-adapted once: `next/*` → react-router / `<img>`, Vercel-AI chat → Timbal runtime slots, `AuthCard` → `SessionProvider` (passwordless). | Works offline, deterministic, MIT, no per-project adaptation. |
| **BoardUI MCP in sandbox** (`bun x boardui@0.5.3 mcp`, stdio) | Allow: `get_started`, `list_components`, `get_component`, `get_usage_examples`, `get_theme`, `install_components`. Deny: `init_boardui`, `install_rules`, `install_skill`, `get_skill`, `activate_license`, `license_status`, `deactivate_license`. | Progressive disclosure replaces the 3k-line in-repo index. Free installs fill gaps (carousel, slider, input-otp, meeting-scheduler, date-range-picker…) without bloating the tarball. Feature-flag it; the blueprint must work without it. |
| **Pro** | (a) **OEM deal** → vendor Pro into a *private* blueprint later; (b) **BYOK**: project setting "BoardUI Pro license key" → `BOARDUI_LICENSE_KEY` in the compose env → `install_components` Pro items into *that customer's* project. | (b) is license-compliant today (customer = licensee installing into their end product). Confirm seat accounting for ephemeral sandboxes with BoardUI (env-var mode is documented for CI). |
| **Customization ("configurator")** | BoardUI's token system: 11 `--color-accent-*` vars re-tint every interactive surface; `--font-inter`/`--font-mono-source`; `.dark` class; 213 semantic vars in one file. Expose as a 15-line `styles/brand.css` the agent (or a future UI in the platform) edits. `get_theme` documents it. | Replaces `dna.json` → compiler → `tokens.css` → `dna:check` with one CSS file and no gate. |

Charts: free tier has 2 chart cards; the blueprint keeps the house Recharts
recipes (`chart-demos`, 8 recipes, license-free) as the default chart kit.
Pro chart cards (19) come via BYOK/OEM.

---

## 4. What the spike proved (branch `spike/v3-boardui-chat`)

| Claim | Evidence |
|---|---|
| BoardUI CLI works in the Vite project | `npx boardui@latest add <items> -d src -y` writes to `src/components/{base,application}`, `src/styles`, resolves deps transitively. (It also adds `@tailwindcss/postcss` — revert; Vite uses `@tailwindcss/vite`.) |
| Current blueprint BoardUI layer is stale | repo `theme.css` had 79 vars vs 213 upstream; accent ramp + composer/button tokens missing. Refreshed with `--overwrite`; build still green. |
| BoardUI chrome on the Timbal engine, no runtime fork | `src/components/chat/board/{board-composer,board-messages,board-welcome}.tsx` + `src/lib/board-chat-chrome.tsx` — `ThreadComponents` slots (`Composer`, `UserMessage`, `AssistantMessage`, `Welcome`, `Suggestions`) built on the runtime's re-exported assistant-ui primitives (`ComposerPrimitive`, `MessagePrimitive`, `ActionBarPrimitive`, `AuiIf`, `useThread`, `useComposerRuntime`) + BoardUI `ComposerLoader`/`AgentThinking`. Streaming, attachments (`ComposerPrimitive.AddAttachment`/`AttachmentDropzone` bind to the `/api/files/upload` adapter), markdown (`MarkdownText`), tool calls/artifacts (`ToolArtifactFallback`) are the stock runtime. ~330 lines total. |
| Login on BoardUI `AuthCard` + Timbal session | `src/components/chat/board/board-login.tsx`: providers from `useOptionalSession().authProviders` (from `GET /api/config`), OAuth → `{base}/auth/{provider}?redirect_uri=`, magic link → `POST {base}/auth/magic-link {email}` — the same contract `TimbalLoginScreen` uses. `AuthCard` fork gained a `passwordless` prop (hides password/remember/forgot, CTA "Send sign-in link"). Mount: `<AuthGuard renderLogin={<BoardLogin/>}>`. |
| Vite adaptation cost is small | Only Next-isms met: an `eslint-disable @next/next/no-img-element` comment (deleted) and harmless `"use client"` directives. `next/navigation` lives in `agent-chat-history.tsx`/`app-shell.tsx`, which v3 does not vendor (it writes its own thin shell on BoardUI `sidebar`). |
| Gate-clean | `bun run build`, `bun run lint`, `tsc -b`, `bun run dna:check` all pass on the branch. |
| Visual | `/board` at 1280/375, light/dark, typed/sent states; `/board/login` at 1280/375 — no console/page errors beyond the expected `/api` proxy 500 (no backend locally). |

---

## 5. Blueprint v3 — target shape

```
ui/
├── AGENTS.md                 ≤ 60 lines: stack facts, 8 rules, verify commands (see 5.3)
├── DESIGN.md                 ≤ 40 lines: the chosen direction (accent, density, shell), refs used
├── package.json              "timbal": { "blueprint": "ui-v3" }  ← generation marker for hook + skill
├── index.html · vite.config.ts · tsconfig*.json · eslint.config.js
└── src/
    ├── main.tsx · App.tsx    routes: "/" (Home = chat or app), "/login", "*" — one <Route> per page
    ├── index.css             tailwind → runtime styles.css → styles/globals.css → styles/timbal-bridge.css
    ├── styles/               theme.css · typography.css · globals.css (BoardUI, verbatim, refreshable
    │                         with `npx boardui add theme typography globals --overwrite`)
    │                         brand.css (accent ramp + fonts + radius overrides — THE configurator)
    │                         timbal-bridge.css (~30 lines: --background/--card/--primary/--muted/--border/
    │                         --ring/--composer-bg/--thread-canvas → BoardUI tokens, so runtime chat matches)
    ├── utils/cx.ts · hooks/  (BoardUI foundations)
    ├── components/
    │   ├── base/             BoardUI free primitives (36 items, verbatim)
    │   ├── application/      BoardUI free blocks (sidebar, settings-modal, auth-card, notification-center,
    │   │                     data-table, stat-cards, revenue/orders chart cards, agent-thinking,
    │   │                     composer-loader, agent-log, theme-toggle) — verbatim unless Next-coupled
    │   ├── timbal/           the ONLY project-authored layer (~1k lines):
    │   │   ├── app-shell.tsx        BoardUI sidebar + react-router Outlet + mobile drawer (thin)
    │   │   ├── chat/               board-composer · board-messages · board-welcome · chrome.ts (slots)
    │   │   ├── login.tsx           AuthCard ↔ SessionProvider (passwordless + OAuth)
    │   │   ├── embedded-chat.tsx   TimbalChat full-bleed on a route (kept from v2)
    │   │   ├── assistant-pill.tsx  AppCopilot wrapper (kept from v2)
    │   │   └── charts/recipes.tsx  8 Recharts recipes (kept from chart-demos, BoardUI chart tokens)
    │   └── ui/               ≤ 10 Radix gap primitives BoardUI lacks: dialog, sheet, drawer, popover,
    │                         command, card, skeleton, sonner, empty-state, spinner
    └── pages/                Home (chat) · Login · NotFound — NO forkable domain templates
```

### 5.1 Deleted (from today's tree)

`src/design/*` (dna.json, tokens.css, DESIGN.md as-is), `discovery.ts`,
`blocks/catalog.ts`, `pages/catalog.ts`, `pages/gallery/**` (+ `catalog.ts`),
`scripts/{kit-discover,build-registry,screenshot-smoke}.mjs` (screenshot
smoke moves to the eval harness), `components.json` + `public/r/**`,
`components/pages/**` (all 12 templates), `components/application/{ai-chat,
ai-profile,calendar,docs}` and every Pro card (`contributions`, `earnings`,
`recent-hires`, `revenue-trend`, `steps`, `sleep-score`, `activity-rings`,
`most-active-days`, `customers-table`, `patients-table`), `blocks/{filtered-table,
bulk-action-bar,stat-overview,settings-page,settings-dialog,entity-form,
list-detail,detail-panel,resource-grid,media-card,pdf-viewer,recommendation-card,
hero-metric,interactive-charts,review-extraction,document-review-layout,
page-header,page-body,page-skeleton}`, `components/app/*`, `components/icons.tsx`
(BoardUI convention: `@remixicon/react` directly), `ui/*` except the ≤10 gaps,
`lib/{control-surface,button-tokens,chart-tone,page-inset,thread-message-layout}`,
`screenshots-boardui/`.

### 5.2 Kept and why

`@timbal-ai/timbal-react` runtime (unchanged); `Home.tsx` (chat shell,
attachments, artifacts); `SessionProvider`/`AuthGuard` wiring; the v2
Timbal glue blocks (embedded-chat, assistant pill) rebased on BoardUI tokens;
the Recharts recipes; `RoutedAppShell`'s *routing contract* (nav ids = paths,
`<Outlet/>`) — it is engineering, not taste.

### 5.3 `AGENTS.md` v3 (draft, whole file)

```md
# UI — BoardUI on the Timbal runtime

Stack: React 19 · Vite · Tailwind v4 · react-router · @timbal-ai/timbal-react (chat, auth, streaming).
Design system: BoardUI (source-owned under src/components/base|application). Tokens: src/styles/theme.css;
brand overrides: src/styles/brand.css (accent ramp, fonts, radius). Dark mode = `.dark` on <html>.

Rules
1. Pick a direction first and write it in DESIGN.md (shell, density, accent, tone, 1–2 references).
   Do not reuse the last project's direction.
2. Every page is a route. Layout = src/components/timbal/app-shell.tsx once; one <Route> per page.
3. Components: base/ → application/ → ui/ gaps → install from BoardUI (MCP `install_components` or
   `npx boardui add <name>`) → write your own. Never rebuild an installed component.
4. Color/type only through BoardUI semantic tokens and composite text utilities. No palette classes, no hex.
5. Chat is the runtime: TimbalChatShell / EmbeddedChat / AssistantPill (+ `boardChatComponents` for the
   BoardUI look). Never re-implement message lists, composers or uploads.
6. Auth: <SessionProvider> + <AuthGuard renderLogin={<Login/>}>. Never hand-roll auth forms.
7. Every screen ships loading (skeleton), empty and error states, and works at 375 px.
8. Never swallow fetch errors.

Verify: bun run lint && bun run build. Then screenshot at 1280 and 375 and self-review.
```

---

## 6. Monolith changes (the handoff)

### 6.1 `src/composer/skills/timbal-ui/` — rewrite for v3, keep legacy paths behind detection

**Detection (top of `SKILL.md`):**

```
package.json "timbal.blueprint" == "ui-v3"  → v3 (this skill's main path)
[ -f ui/src/design/dna.json ]              → v2 fork-first (kit/BoardUI) — keep today's text, moved to references/legacy-v2.md
otherwise                                   → legacy v3-kit — references/legacy-kit.md
```

**`SKILL.md` v3 ≤ 120 lines:**

1. Protocol: *direction → compose → verify*. **Direction is mandatory and
   recorded in `DESIGN.md`**: shell archetype (sidebar app / topbar app /
   focused tool / full-page chat / split master-detail), density (airy /
   regular / dense), accent (pick and set the 11 `--color-accent-*` vars in
   `brand.css`), tone (2 adjectives from the brief), 1–2 references
   (`mcp__timbal__search_screens` when the brief is visual). Include a
   one-line **anti-repetition rule**: *"if the previous project in this
   session used the same shell + accent, change one."*
2. Component order (rule 3 above) + how to discover: `Read`
   `src/components/base` tree; `mcp__boardui__list_components` /
   `get_component` / `get_usage_examples` when wired; install free gaps.
3. Timbal integration cheat-sheet (the only part BoardUI can't teach):
   chat surfaces table (kept from today's "Pick the surface FIRST"), slots
   (`boardChatComponents`), auth (`Login`), uploads (runtime adapter),
   `authFetch` for `/api`. ~25 lines.
4. Verify loop: `bun run lint && bun run build`, screenshot 1280/375,
   critique rubric (references/critique.md, trimmed), max 3 rounds.
5. Golden rules (8, mirrors `AGENTS.md`).

**References — keep 3, ≤ 400 lines total:**

| Keep | Change |
|---|---|
| `design-principles.md` | trim to ~80 lines; remove kit mentions |
| `critique.md` | keep; **add a "Distinctiveness" dimension** (does this screen look like the last three? penalize) |
| `chat.md` | rewrite to the slot API + `boardChatComponents` + `Login`; drop DNA/`--thread-canvas` lore except one line |
| **Delete** | `kit.md`, `app-kit.md`, `components.md`, `primitives.md`, `dna.md`, `theming.md`, `theming-internals.md`, `layout-patterns.md` (fold the archetype table into SKILL.md §1), `reference-match.md` (fold 15 lines into §1), `interaction.md` (BoardUI components carry states), `runtime.md` (fold env/commands into SKILL.md) |
| `evals/evals.json` | re-author routing evals for the new reference set |

Also mirror to `leviosia/skills/timbal-ui/` and `scripts/sync_skills.sh`.

### 6.2 `src/composer/assets/ui_gate_hook.sh`

- Detect v3 via `package.json` `timbal.blueprint == "ui-v3"` (use `jq`/`node -p`).
- v3: run **`tsc -b`** and **`timbal-ui-lint` errors-only** (no `--strict`,
  no `timbal-dna check` — there is no DNA). Keep `MAX_ATTEMPTS=3`, exit 2
  contract unchanged.
- Coordinate with `timbal-react` (`src/design/ui-lint.ts`): on v3 only
  correctness rules should be *errors* — raw hex/oklch/palette classes,
  `hsl(var(--x))`, unsafe chart `dataKey`s, chat shell nested in a
  padded/height-constrained wrapper, displaced composer (messages + input in
  document flow), native `<select>`/`<input type="date">`. Retire or demote
  to *warning* (never blocking on v3): `button-custom-fill`,
  `page-missing-inset`, `card-flush-content`, `status-fill-foreground`,
  `no-table-in-card`, `no-uppercase-heading`, `no-glow`, custom-heading-in-chat.
  BoardUI's semantic-token rule replaces the DNA color rule.

### 6.3 `src/handlers/orgs/projects/compose/prompt.rs` — BoardUI MCP entry (feature-flagged)

Add a local stdio server next to `timbal-browser` (no `alwaysLoad`; the
key must stay `boardui` so tools are `mcp__boardui__*`):

```json
"boardui": {
  "type": "stdio",
  "command": "bun",
  "args": ["x", "boardui@0.5.3", "mcp"],
  "env": {
    "BOARDUI_TELEMETRY_DISABLED": "1",
    "BOARDUI_LICENSE_KEY": "<project's BYOK key if configured, else unset>"
  }
}
```

- Gate with `COMPOSE_BOARDUI_MCP=1` (env) so it can be turned off without a
  deploy. Pre-warm `bun x boardui@0.5.3` in the sandbox image / `ui_deps`
  step (cold `npx` was ~6 s here). Sandbox egress must allow
  `www.boardui.com` (registry + Pro downloads).
- `src/models/compose.rs` `COMPOSE_TOOLS`: add the six allowed tools
  explicitly (`mcp__boardui__get_started`, `…list_components`,
  `…get_component`, `…get_usage_examples`, `…get_theme`,
  `…install_components`). Do **not** allow license/init/rules/skill tools.
- `install_components` writes under the worktree `ui/` and runs `bun add`
  for missing deps — confirm it respects `ui/node_modules` being a symlink
  into `PREVIEW_DATA_ROOT` (`ui_deps.rs`); if not, run installs through the
  same `ensure_ui_deps` path after the turn (the hook's `tsc` step will
  otherwise fail on unresolved imports).
- Project setting + storage for the BYOK key (encrypted), surfaced in the
  compose env only. Never log it.

### 6.4 `src/composer/SYSTEM_PROMPT.md`

- Skills table row for `timbal-ui`: shorten to *"Frontend UI — any screen,
  chat chrome, theming (React, Vite, Tailwind v4, BoardUI)"*.
- Keep the hard rule "load `timbal-ui` before touching `ui/`" (the skill is
  now cheap).
- Add one line: *"Design direction is a decision, not a default — see
  `timbal-ui` §1. Do not reuse the previous project's shell/accent."*

### 6.5 Scaffold tarball (`timbal` CLI `add ui` / `create --with-ui`)

- Repack from blueprint **v3** `main` once §5 lands (private repo). Include
  `package.json` marker `"timbal": { "blueprint": "ui-v3" }`.
- Ship `ui/node_modules`-free as today; `ensure_ui_deps` unchanged
  (BoardUI free items add `react-aria-components`, `@remixicon/react`,
  `@internationalized/date`, `motion`, `@tanstack/react-table` — already
  in the current lockfile).
- `add_blueprint(kind="ui", force)` semantics unchanged. Consider a second
  kind later (`ui-chat` = Home-only tarball vs `ui-app` = shell + login +
  chat page) — cheap variety at scaffold time; not required for v3.

### 6.6 Preview / deploy (`preview.rs`, `deployments/serverless/ui.rs`)

No changes required: v3 stays Vite + bun + static `dist/`. Note for later:
the current main chunk is 3.9 MB; v3 should add `build.rollupOptions.
output.manualChunks` for `recharts`/`shiki`/`katex` (runtime deps).

### 6.7 `evals/ui-quality/` — measure sameness, not just taste

- Add a **diversity metric** across the seed briefs of one run: (a)
  perceptual-hash / CLIP-embedding pairwise distance of the 1280 px
  screenshots (report mean + min), (b) *template fingerprint*: share of
  briefs whose `ui/src` imports the same shell + same page skeleton, (c)
  accent-hex histogram (v2 will show one bar). Fail the run if mean distance
  drops below the v3 baseline.
- Add the "Distinctiveness" rubric dimension (6.1) to `score`.
- Baseline v2 first (today's tarball), then v3; promote v3 when quality is
  ≥ baseline and diversity is materially higher. Add 3 briefs that must
  *not* be dashboards (a wizard, a document editor, a kiosk) to catch fork
  bias.

### 6.8 Docs

Retire `docs/UI_V2_BACKEND_HANDOFF.md` / `UI_V2_1_SKILL_SYNC.md` to a
`docs/archive/`; add this file as `docs/UI_V3_BACKEND_HANDOFF.md`.

---

## 7. Rollout

| Phase | Work | Owner | Done when |
|---|---|---|---|
| **0 (this week)** | Repo private; Pro source removed from `main`; OEM ask sent to BoardUI | FE + legal | repo private, email sent |
| **1 (blueprint v3)** | §5 tree on `blueprint` `main`: vendor free tier (refresh with `--overwrite`), delete list, `timbal/` glue from the spike, `brand.css` + `timbal-bridge.css`, ≤60-line `AGENTS.md`, `build`/`lint` green, 1280/375 shots of Home/Login/App-shell | FE | tarball candidate tagged `ui-v3.0.0` |
| **2 (monolith)** | 6.1 skill rewrite (+ leviosia mirror), 6.2 hook, 6.4 prompt, 6.5 repack behind a flag (`TIMBAL_UI_BLUEPRINT=v3`) | BE | compose turn on a fresh project produces a v3 `ui/` and the hook passes |
| **3 (MCP, flagged)** | 6.3 server entry + tools allowlist + BYOK setting; egress; pre-warm | BE | `mcp__boardui__get_component button` works in a sandbox; Pro install works with a customer key |
| **4 (evals)** | 6.7 diversity metric + new briefs; baseline v2 vs v3 | BE/FE | report shows ≥ baseline quality, higher diversity |
| **5** | Flip default to v3; archive v2 docs; keep v2 detection in skill/hook for existing projects | BE | |

Estimated effort: phase 1 ≈ 3–4 FE days (mostly deletion + the bridge +
thin shell); phase 2 ≈ 2 BE days; phase 3 ≈ 2–3 BE days; phase 4 ≈ 2 days.

---

## 8. Open questions

1. **License path:** pursue OEM with BoardUI, ship BYOK, or both? (Recommend
   both; v3 ships on the free tier regardless.)
2. **MCP at generation time — on by default or opt-in?** Depends on sandbox
   egress policy and `bun x` cold start. Recommend opt-in first, default-on
   after phase 4 shows it is used.
3. **Two tarball kinds** (`ui-chat` vs `ui-app`) now or later?
4. **`timbal-ui-lint` demotions** (6.2) live in `timbal-react` — who owns
   the release (needs a 4.3.0)?
5. **Existing v2 projects:** leave on v2 detection forever, or offer a
   `timbal add ui --force` migration prompt?

---

## Appendix A — BoardUI facts (verified 2026-09-07)

- CLI `boardui@0.5.3` (npm; `init [--pro]`, `add [--all|--overwrite|-d dir]`,
  `list`, `mcp`, `skill`, `login <key>`, `logout`). Registry = shadcn schema:
  `https://www.boardui.com/r/registry.json` (free items only, 62) and
  `/r/<name>.json`; Pro is served through the licensed CLI/MCP path.
- MCP (`npx boardui@latest mcp`, stdio): `get_started, list_components,
  get_component, get_usage_examples, install_components, init_boardui,
  install_rules, get_skill, install_skill, get_theme, activate_license,
  license_status, deactivate_license`.
- **Free (MIT):** base ×36 (button, icon-button, link-button, button-group,
  close-button, input, checkbox(+card), radio(+card), switch(+card), select,
  slider, social-button, dropdown, divider, file-upload, tabs, table,
  tooltip, badge, chip, status-dot, avatar, breadcrumb, pagination, carousel,
  input-otp, segmented-control, announcement, notification, kbd,
  date-picker, date-range-picker, meeting-scheduler); application ×16
  (theme-toggle, agent-chat, app-shell, agent-thinking, agent-log,
  composer-loader, sidebar, settings-modal, auth-card, notification-center,
  data-table, stat-cards, revenue-chart-card, orders-chart-card,
  important-alerts-card, patient-info-card); foundations ×10 (theme,
  typography, globals, cx, rules, use-dismiss-on-outside-press, use-count-up,
  chevrons, logo, agent-runtime[Next route, unused]).
- **Pro components ×26:** web-search, task-list, composer, composer-panel,
  composer-attachments, agent-progress, agent-limits-card, questionnaire,
  calendar, earnings-chart-card, line-chart-card, contributions-card,
  radar/radial/funnel/sankey/stage-bars/bar-list/area/combo/scatter/heatmap
  chart cards, steps-card, sleep-score-card, activity-rings-card,
  most-active-days-card. **Pro templates ×8:** home-dashboard, marketing,
  finance, hr, medical-profile, ai-chat, ai-profile, ai-image-generation.
- Next.js coupling in free items: `agent-chat-history.tsx` (`next/navigation`),
  `agent-chat.tsx` (Vercel AI SDK `useChat` → replace by Timbal slots, done in
  the spike), `app-shell.tsx` (`usePathname`, pulls 25 docs/landing files),
  `showcase-card.tsx` (`next/link`), `free-landing-previews.tsx` (`next/image`).
  Everything else is plain React + React Aria + Tailwind.
- Theming: `theme.css` (904 lines, 213 vars): `@theme` primitives + accent
  ramp (`--color-accent-50…950`, re-tints all interactive surfaces),
  `:root` semantic tokens, `.dark` overrides, `@theme inline` re-export;
  `typography.css` composite `text-*` utilities; fonts via `--font-inter`,
  `--font-mono-source`.
- Always-on rules BoardUI itself installs: 44 lines (`/r/rules.json`) — the
  size our `AGENTS.md` should be.

## Appendix B — Timbal runtime surface used by the spike

`@timbal-ai/timbal-react` 4.2.2 root exports: `TimbalChat`, `TimbalChatShell`,
`TimbalStudioShell`, `TimbalRuntimeProvider`, `useTimbalStream({workforceId,
baseUrl, fetch}) → {messages, isRunning, send(input,{attachments}), cancel,
reload, clear, loadMessages}`, `ChatMessage`, `ChatAttachment`,
`createUploadAttachmentAdapter`, `ThreadComponents` (`Composer`,
`UserMessage`, `AssistantMessage`, `EditComposer`, `Welcome`, `Suggestions`,
`ScrollToBottom`), assistant-ui re-exports (`ComposerPrimitive`,
`MessagePrimitive`, `ThreadPrimitive`, `ActionBarPrimitive`, `AuiIf`,
`useThread`, `useComposerRuntime`, `useThreadRuntime`), `MarkdownText`,
`ToolArtifactFallback`, `ComposerAttachments`, `UserMessageAttachments`,
`useResolvedSuggestions`, `SessionProvider`, `AuthGuard({renderLogin})`,
`useSession`/`useOptionalSession` (`authProviders`, `ssoEnabled`, `user`),
`TimbalLoginScreen`, `getAuthBaseUrl`, `authFetch`, `useWorkforces`,
`TimbalMark`, `ModeToggle`. Auth wire: `GET {base}/config`,
`GET {base}/auth/{google|microsoft|github}[?redirect_uri=]`,
`POST {base}/auth/magic-link {email}`. Streaming: `POST
/api/workforce/{id}/stream` (SSE). Uploads: `/api/files/upload`.
