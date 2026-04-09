/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** App tab title */
  readonly VITE_APP_TITLE?: string;
  /** Dev server port (vite.config.ts) */
  readonly VITE_APP_PORT?: string;
  /** Proxy target for /api in dev (vite.config.ts) */
  readonly VITE_API_PROXY_TARGET?: string;
  /** Timbal project ID — enables auth when set */
  readonly VITE_TIMBAL_PROJECT_ID?: string;
  /** Welcome screen heading shown before the first message */
  readonly VITE_WELCOME_HEADING?: string;
  /** Welcome screen subheading shown before the first message */
  readonly VITE_WELCOME_SUBHEADING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
