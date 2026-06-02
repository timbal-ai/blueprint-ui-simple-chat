/** SessionProvider + AuthGuard when a Timbal project is configured */
export const isAuthEnabled = Boolean(import.meta.env.VITE_TIMBAL_PROJECT_ID);

/** Floating workforce sidebar (`TimbalStudioShell`). Off by default. */
export const isStudioSidebarEnabled =
  import.meta.env.VITE_STUDIO_SIDEBAR === "true";

/** Registers `/demo/app-kit` (AppShell + page + floating copilot). Off by default. */
export const isAppKitDemoEnabled =
  import.meta.env.VITE_APP_KIT_DEMO === "true";

/**
 * Brand personality preset (color + roundness + shadows + font) applied at the
 * app root via `TimbalThemeStyle`. One of the `TIMBAL_THEME_PRESETS` ids
 * (`indigo`, `violet`, `forest`, `warm`, `slate`, `folio`, `carbon`). Empty /
 * `platform` keeps the shipped neutral look. The preset's web font is loaded
 * automatically. Override individual tokens in `index.css` for finer control.
 */
export const themePreset = import.meta.env.VITE_THEME_PRESET as
  | string
  | undefined;
