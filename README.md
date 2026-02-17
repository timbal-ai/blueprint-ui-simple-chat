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

The app runs on `http://localhost:3737` by default.

## Configuration

Copy `.env` and configure:

```env
VITE_APP_TITLE=Your App Name
VITE_AUTH_ENABLED=true
VITE_TIMBAL_BASE_URL=https://api.timbal.ai
VITE_TIMBAL_API_KEY=your-api-key
VITE_TIMBAL_ORG_ID=your-org-id
VITE_TIMBAL_PROJECT_ID=your-project-id
```

## Project Structure

```
src/
├── auth/           # Authentication (OAuth, guards, tokens)
├── components/ui/  # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Route pages
├── timbal/         # Timbal SDK client & utilities
└── lib/            # Utility functions
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
