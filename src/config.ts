/** SessionProvider + AuthGuard when a Timbal project is configured */
export const isAuthEnabled = Boolean(import.meta.env.VITE_TIMBAL_PROJECT_ID);

const studioUiOnlyEnv = import.meta.env.VITE_STUDIO_UI_ONLY;

/**
 * Blueprint shell without a Timbal API — mock workforces, no `/api` proxy traffic.
 * Default on in dev when auth is off; set `VITE_STUDIO_UI_ONLY=false` to use a real API.
 */
export const isStudioUiOnly =
  studioUiOnlyEnv === "true" ||
  (import.meta.env.DEV &&
    studioUiOnlyEnv !== "false" &&
    !isAuthEnabled);

/** Floating workforce sidebar (`TimbalStudioShell`). Off by default. */
export const isStudioSidebarEnabled =
  import.meta.env.VITE_STUDIO_SIDEBAR === "true";
