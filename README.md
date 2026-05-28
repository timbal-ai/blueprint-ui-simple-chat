# Blueprint UI

Canonical React + Vite template for Timbal chat apps. The UI lives in [`@timbal-ai/timbal-react`](https://www.npmjs.com/package/@timbal-ai/timbal-react) (`^0.5.0`); this repo is a thin shell composers and teams clone.

## Tech stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- `@timbal-ai/timbal-react` — chat, theme tokens, studio chrome
- `next-themes` — light / dark via `.dark` on `<html>`

## Getting started

```bash
bun install
bun run dev
```

Dev server: **http://localhost:5173** (override with `VITE_APP_PORT`).

## Configuration

Copy `.env.example` to `.env`.

| Variable | Purpose |
|----------|---------|
| `VITE_TIMBAL_PROJECT_ID` | Enables auth (`SessionProvider`, `AuthGuard`) |
| `VITE_WELCOME_HEADING` / `VITE_WELCOME_SUBHEADING` | Welcome screen copy |
| `VITE_STUDIO_UI_ONLY` | Mock workforces in dev when no API (default on without project id) |
| `VITE_STUDIO_SIDEBAR` | `true` → floating sidebar (`TimbalStudioShell`); default is top bar only |
| `VITE_API_PROXY_TARGET` | Where `/api` proxies in dev (`vite.config.ts`) |

## Theming (important for generated apps)

Do **not** duplicate color tokens in this repo. Import the library stylesheet and scan its dist:

```css
/* src/index.css */
@import "tailwindcss";
@import "@timbal-ai/timbal-react/styles.css";
@source "../node_modules/@timbal-ai/timbal-react/dist";
```

Toggle dark mode with `next-themes` (`attribute="class"`) or by toggling `.dark` on `<html>`.

## Project structure

```
src/
├── components/
│   ├── studio-topbar-brand.tsx   # Blueprint-only: welcome mark + topbar “new chat”
│   └── ui/sonner.tsx
├── lib/
│   ├── studio-chat-chrome.tsx    # Welcome + composer slots
│   └── ui-only.ts                # Mock fetch for UI-only dev
├── pages/Home.tsx                # TimbalChatShell / optional TimbalStudioShell
├── config.ts
├── App.tsx
├── main.tsx
└── index.css                     # Tailwind + library theme (no local palette)
```

## Scripts

```bash
bun run dev      # Development server
bun run build    # Production build (tsc + vite)
bun run preview  # Preview production build
bun run lint     # ESLint
```

## Production checklist

- [ ] `@timbal-ai/timbal-react` pinned to a published version (e.g. `^0.5.3`); use `file:../timbal-react` only for local dev against a sibling checkout
- [ ] `bun run build` and `bun run lint` pass
- [ ] Backend serves `/api/workforce` and stream routes (or disable `VITE_STUDIO_UI_ONLY` and run `timbal start`)
- [ ] Set `VITE_TIMBAL_PROJECT_ID` when auth is required

## License

Apache-2.0
