import { clsx, type ClassValue } from "clsx"
import { twMergeWithTextStyles } from "@/utils/cx"

/**
 * Detects if the application is running inside an iframe
 * Returns true when embedded in another application
 */
export const isEmbedded = typeof window !== 'undefined' && window.self !== window.top

/**
 * Combines Tailwind CSS classes with clsx and tailwind-merge.
 * Uses the BoardUI-aware merge (composite text-{family}-{weight} utilities
 * from styles/typography.css register as font-size, not text color).
 */
export function cn(...inputs: ClassValue[]) {
  return twMergeWithTextStyles(clsx(inputs))
}

/**
 * Sleep utility for retry delays
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
