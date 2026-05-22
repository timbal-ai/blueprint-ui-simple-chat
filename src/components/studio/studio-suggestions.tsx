import { ArrowUpIcon } from "lucide-react";
import {
  useResolvedSuggestions,
  useThread,
  useThreadRuntime,
  type SuggestionsSlotProps,
} from "@timbal-ai/timbal-react";

import { studioListRowButtonClass } from "@/lib/studio-chrome";
import { cn } from "@/lib/utils";

/**
 * Stacked studio suggestion rows — same chrome as settings role cards.
 * Drop-in replacement for timbal-react `Suggestions` when upstreaming.
 */
export function StudioSuggestions({
  suggestions,
  className,
}: SuggestionsSlotProps & { className?: string }) {
  const isEmpty = useThread((s) => s.messages.length === 0);
  const items = useResolvedSuggestions(suggestions);
  const runtime = useThreadRuntime();

  if (!isEmpty || !items?.length) return null;

  return (
    <div
      className={cn(
        "aui-studio-suggestions flex w-full flex-col gap-2 pb-2.5",
        className,
      )}
      role="list"
      aria-label="Suggested prompts"
    >
      {items.map((suggestion) => {
        const text = suggestion.prompt ?? suggestion.title;
        return (
          <button
            key={text}
            type="button"
            role="listitem"
            className={studioListRowButtonClass}
            onClick={() =>
              runtime.append({
                role: "user",
                content: [{ type: "text", text }],
              })
            }
          >
            <ArrowUpIcon
              className="size-4 shrink-0 text-neutral-500 dark:text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-sm font-normal text-foreground dark:text-foreground/95">
              {suggestion.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
