/** SessionProvider + AuthGuard when a Timbal project is configured. */
export const isAuthEnabled = Boolean(import.meta.env.VITE_TIMBAL_PROJECT_ID);

/**
 * Mount the BoardUI template routes under /templates/* so they can be seen
 * running. On in dev; set VITE_TEMPLATES=true to keep them in a build.
 * Product apps delete the template routes they don't use.
 */
export const areTemplatesEnabled =
  import.meta.env.DEV || import.meta.env.VITE_TEMPLATES === "true";
