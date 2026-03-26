/**
 * Auth configuration module
 *
 * Auth is enabled when a project ID is configured.
 * The API owns all auth screens and OAuth flows.
 */

export const isAuthEnabled = !!import.meta.env.VITE_TIMBAL_PROJECT_ID;
