# Blueprint UI

A React + Vite template for building AI applications with the Timbal SDK.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Radix UI components
- React Router DOM
- Timbal SDK integration

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

The dev server listens on **port 5173** by default. Override with `VITE_APP_PORT` in `.env`.

## Configuration

Copy `.env.example` to `.env` and adjust values.

This app reads `VITE_*` variables at build time. Auth (`SessionProvider`, `AuthGuard`, logout) is enabled when **`VITE_TIMBAL_PROJECT_ID`** is set. Other Timbal settings are consumed by `@timbal-ai/timbal-react` / your deployment; see `.env.example` for common keys.

In development, `/api` is proxied to `VITE_API_PROXY_TARGET`, or `http://localhost:3000`, or the port from `TIMBAL_START_API_PORT` — see `vite.config.ts`.

## Project Structure

```
src/
├── components/     # mode-toggle, ui (shadcn-style)
├── hooks/
├── lib/
├── pages/          # Home, NotFound
├── config.ts       # shared flags derived from env
├── App.tsx
├── main.tsx
└── index.css
```

## Scripts

```bash
bun run dev      # Development server
bun run build    # Production build
bun run preview  # Preview production build
bun run lint     # Run ESLint
```

## License

Apache-2.0
