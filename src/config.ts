/** SessionProvider + AuthGuard when a Timbal project is configured */
export const isAuthEnabled = Boolean(import.meta.env.VITE_TIMBAL_PROJECT_ID);

/** Floating workforce sidebar (`TimbalStudioShell`). Off by default. */
export const isStudioSidebarEnabled =
  import.meta.env.VITE_STUDIO_SIDEBAR === "true";

/** Registers `/demo/app-kit` (AppShell + page + floating copilot). Off by default. */
export const isAppKitDemoEnabled =
  import.meta.env.VITE_APP_KIT_DEMO === "true";
