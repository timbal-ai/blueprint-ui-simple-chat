import { useEffect, useMemo, type ReactNode } from "react";

import { KitContext, kitText } from "./context";
import type { KitMessageOverrides } from "./messages";

export interface KitLocaleProps {
  /** BCP 47 tag of the product's language: `es`, `ca`, `fr`, `pt`, `de`, `it` ship; others fall back to English. */
  locale: string;
  /** Replace single strings: `{ chat: { welcome: "¿Qué factura revisamos?" } }`. */
  messages?: KitMessageOverrides;
  children: ReactNode;
}

/**
 * KitLocale — the product's language for every kit component: the shells,
 * chat, data table, work queue, overlays, assistant pill and voice call, with
 * dates, numbers and relative times formatted for it. Mounted once in
 * `main.tsx` from `LOCALE` in `src/config.ts`; never translate kit text by
 * editing the components.
 */
export function KitLocale({ locale, messages, children }: KitLocaleProps) {
  const value = useMemo(() => kitText(locale, messages), [locale, messages]);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return <KitContext.Provider value={value}>{children}</KitContext.Provider>;
}
