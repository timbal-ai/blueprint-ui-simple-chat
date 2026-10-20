import { createContext, useContext } from "react";

import { ca } from "./ca";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import type { KitMessageOverrides, KitMessages } from "./messages";
import { pt } from "./pt";

/** The languages the kit ships. Another one is a `KitMessages` file added here. */
export const KIT_CATALOGS: Record<string, KitMessages> = { en, es, ca, fr, pt, de, it };

/** `es-MX` → `es` → English. */
export function kitCatalog(locale: string): KitMessages {
  const tag = locale.toLowerCase();
  return KIT_CATALOGS[tag] ?? KIT_CATALOGS[tag.split("-")[0]] ?? en;
}

function shipped(locale: string): boolean {
  const tag = locale.toLowerCase();
  return tag in KIT_CATALOGS || tag.split("-")[0] in KIT_CATALOGS;
}

export interface KitText {
  locale: string;
  t: KitMessages;
  /** `1234` → "1,234" / "1.234". */
  count: (n: number) => string;
  /** The history chips: "now", then the locale's narrow units ("34m", "34 min", "2 sem"). */
  relative: (iso?: string) => string;
  date: (iso: string, options?: Intl.DateTimeFormatOptions) => string;
}

const UNITS: [limit: number, minutes: number, unit: string][] = [
  [60, 1, "minute"],
  [24 * 60, 60, "hour"],
  [7 * 24 * 60, 24 * 60, "day"],
  [Infinity, 7 * 24 * 60, "week"],
];

export function kitText(locale: string, overrides?: KitMessageOverrides): KitText {
  const base = kitCatalog(locale);
  const t = overrides
    ? (Object.fromEntries(
        Object.entries(base).map(([group, values]) => [group, { ...values, ...overrides[group as keyof KitMessages] }]),
      ) as unknown as KitMessages)
    : base;
  // A language without a catalog shows English text: its numbers and dates stay English too.
  const format = shipped(locale) ? locale : "en";
  const numbers = new Intl.NumberFormat(format);
  return {
    locale,
    t,
    count: (n) => numbers.format(n),
    relative: (iso) => {
      if (!iso) return "";
      const minutes = Math.round(Math.max(0, Date.now() - Date.parse(iso)) / 60_000);
      if (minutes < 1) return t.chat.now;
      const [, size, unit] = UNITS.find(([limit]) => minutes < limit)!;
      return new Intl.NumberFormat(format, { style: "unit", unit, unitDisplay: "narrow" }).format(
        Math.max(1, Math.round(minutes / size)),
      );
    },
    date: (iso, options) => new Date(iso).toLocaleDateString(format, options),
  };
}

export const KitContext = createContext<KitText>(kitText("en"));

/** The kit's strings and formatters in the product's language (`KitLocale`), English outside one. */
export function useKit(): KitText {
  return useContext(KitContext);
}
