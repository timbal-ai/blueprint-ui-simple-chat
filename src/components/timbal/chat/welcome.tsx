import {
  ThreadPrimitive,
  useResolvedSuggestions,
  useThread,
  type SuggestionsSlotProps,
  type ThreadWelcomeProps,
} from "@timbal-ai/timbal-react";

import { cx } from "@/utils/cx";

/**
 * BoardUI welcome (empty state) for the Timbal thread — the `Welcome` slot.
 * Mirrors the chat-starter hero: title-2 heading, secondary subline, and the
 * suggestion prompts as a row of small secondary buttons (`Suggestions` slot below).
 */
export function BoardWelcome({
  config,
  suggestions,
  showWelcomeSuggestions = true,
  Suggestions = BoardSuggestions,
}: ThreadWelcomeProps) {
  const isEmpty = useThread((s) => s.messages.length === 0);
  if (!isEmpty) return null;

  return (
    <div
      data-slot="board-welcome"
      className="flex w-full flex-1 flex-col items-center justify-center gap-3 px-4 py-12 text-center"
    >
      {config?.icon ? (
        <div className="mb-2 [&_svg:not([class*='size-'])]:size-8">
          {config.icon}
        </div>
      ) : null}
      <h1 className="max-w-xl text-title-2-medium text-text-primary">
        {config?.heading ?? "What can I help with?"}
      </h1>
      {config?.subheading ? (
        <p className="max-w-md text-body-regular text-text-secondary">
          {config.subheading}
        </p>
      ) : null}
      {showWelcomeSuggestions ? (
        <Suggestions suggestions={suggestions} className="mt-6" />
      ) : null}
    </div>
  );
}

/** Suggestion prompts as BoardUI secondary buttons (small, squared). */
export function BoardSuggestions({ suggestions, className }: SuggestionsSlotProps) {
  const items = useResolvedSuggestions(suggestions);
  if (!items || items.length === 0) return null;
  return (
    <div className={cx("flex flex-wrap justify-center gap-2", className)}>
      {items.map((s) => (
        <ThreadPrimitive.Suggestion
          key={s.title}
          prompt={s.prompt ?? s.title}
          method="replace"
          autoSend
          asChild
        >
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-border-button-default bg-background-primary-default px-3 py-1.5 text-body-2-medium text-text-secondary shadow-xs transition-colors hover:bg-background-primary-hover hover:text-text-primary"
          >
            {s.title}
          </button>
        </ThreadPrimitive.Suggestion>
      ))}
    </div>
  );
}
