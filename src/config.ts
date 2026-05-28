/** SessionProvider + AuthGuard when a Timbal project is configured */
export const isAuthEnabled = Boolean(import.meta.env.VITE_TIMBAL_PROJECT_ID);

/** Floating workforce sidebar (`TimbalStudioShell`). Off by default. */
export const isStudioSidebarEnabled =
  import.meta.env.VITE_STUDIO_SIDEBAR === "true";
