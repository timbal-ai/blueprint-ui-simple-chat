/**
 * ESM bridge for zustand `traditional` entry (default import from shim/with-selector).
 * Uses the React 18+ build of with-selector (delegates to `react.useSyncExternalStore`).
 */
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

export { useSyncExternalStoreWithSelector };

export default { useSyncExternalStoreWithSelector };
