import { useThread, type ThreadWelcomeProps } from "@timbal-ai/timbal-react";

import { cn } from "@/lib/utils";

/**
 * Project-owned chat welcome (empty state). Registered via the `components`
 * slot in `src/lib/studio-chat-chrome.tsx` — edit THIS file to restyle the
 * first screen users see: brand mark, heading, layout, suggestion placement.
 *
 * The runtime passes `config` (heading/subheading/icon from the shell's
 * `welcome` prop) and the resolved `Suggestions` component; streaming and
 * message state stay in `@timbal-ai/timbal-react`.
 */
export function ChatWelcome({
  config,
  suggestions,
  showWelcomeSuggestions = true,
  Suggestions,
}: ThreadWelcomeProps) {
  const isEmpty = useThread((s) => s.messages.length === 0);
  if (!isEmpty) return null;

  return (
    <div
      data-slot="chat-welcome"
      className="flex w-full flex-1 flex-col items-center justify-center gap-3 px-4 py-12 text-center"
    >
      {config?.icon ? (
        <div className="mb-2 [&_svg:not([class*='size-'])]:size-8">
          {config.icon}
        </div>
      ) : null}
      <h1
        className={cn(
          "max-w-xl text-2xl text-foreground",
          !config?.heading && "text-muted-foreground",
        )}
      >
        {config?.heading ?? "How can I help?"}
      </h1>
      {config?.subheading ? (
        <p className="max-w-md text-base text-muted-foreground">
          {config.subheading}
        </p>
      ) : null}
      {showWelcomeSuggestions && Suggestions ? (
        <div className="mt-6 w-full max-w-xl">
          <Suggestions suggestions={suggestions} />
        </div>
      ) : null}
    </div>
  );
}
