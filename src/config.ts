/** SessionProvider + AuthGuard when a Timbal project is configured */
export const isAuthEnabled = Boolean(import.meta.env.VITE_TIMBAL_PROJECT_ID);

/** Floating workforce sidebar (`TimbalStudioShell`). Off by default. */
export const isStudioSidebarEnabled =
  import.meta.env.VITE_STUDIO_SIDEBAR === "true";

/** Registers `/demo/app-kit` (AppShell + page + floating copilot). Off by default. */
export const isAppKitDemoEnabled =
  import.meta.env.VITE_APP_KIT_DEMO === "true";

/**
 * Registers `/gallery` — every project-owned component in its states, used by
 * the screenshot smoke check (1280 + 375 px). Dev/CI surface, off by default;
 * never ship it enabled to end users.
 */
export const isGalleryEnabled = import.meta.env.VITE_GALLERY === "true";

// Theming note: this blueprint is fork-first — ALL theming flows from
// src/design/dna.json (compiled to tokens.css). The legacy VITE_THEME_PRESET /
// TimbalThemeStyle mechanism is intentionally not wired: a runtime preset
// would silently override the DNA and split the design into two sources of
// truth. To rebrand, edit dna.json and run `bun run dna:compile`.
