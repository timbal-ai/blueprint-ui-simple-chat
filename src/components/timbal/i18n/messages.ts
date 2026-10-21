import type { ShellLabels } from "@/components/timbal/shells/shell-nav";
import type { VoiceCallMessages } from "@/components/timbal/voice-call/use-voice-call";
import type { VoiceCallLabels } from "@/components/timbal/voice-call/voice-call";

/**
 * Every string the kit (`components/timbal`) renders on its own, accessible
 * names included. One catalog per language; a count is a function so each
 * language writes its own plural. `count` arrives formatted for the locale.
 */
export interface KitMessages {
  shell: Required<ShellLabels>;
  chat: {
    placeholder: string;
    welcome: string;
    newChat: string;
    /** The composer's thread counter once a message is sent. */
    messages: (n: number, count: string) => string;
    navigation: string;
    recent: string;
    recentConversations: string;
    loadError: string;
    empty: string;
    pickWorkforce: string;
    loading: string;
    loadMore: string;
    untitled: string;
    /** A past thread with no title: its date. */
    dated: (date: string) => string;
    /** Relative-time chip under a minute; longer spans use the locale's units. */
    now: string;
    attachFiles: string;
    addAttachment: string;
    stop: string;
    send: string;
    input: string;
    thinking: string;
    workforce: string;
    workforces: string;
    copy: string;
    regenerate: string;
    location: string;
  };
  tools: {
    waiting: string;
    noResult: string;
    failed: (tool: string) => string;
    query: string;
    searching: string;
    found: (n: number, count: string) => string;
    /** The row that groups consecutive tool calls with different names. */
    calls: (n: number, count: string) => string;
    unnamed: string;
  };
  table: {
    /** The summary's label above the row count. */
    total: string;
    rows: (n: number, count: string) => string;
    search: string;
    selectAll: string;
    selectRow: string;
    empty: string;
    moreActions: string;
  };
  queue: {
    showLess: string;
    showMore: (n: number, count: string) => string;
    /** A group's link to the module's own list. */
    viewAll: string;
    loadError: string;
    retry: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  overlay: { close: string };
  assistant: { label: string };
  voiceCall: Required<VoiceCallLabels>;
  voiceErrors: Required<VoiceCallMessages>;
}

/** Replace any of a catalog's strings: `{ chat: { welcome: "…" } }`. */
export type KitMessageOverrides = { [Group in keyof KitMessages]?: Partial<KitMessages[Group]> };
