import { ErrorPrimitive } from "@assistant-ui/react";
import { MarkdownText, MessagePrimitive } from "@timbal-ai/timbal-react";

import { StudioAssistantActionBar } from "@/components/studio/studio-assistant-action-bar";
import { StudioToolArtifactFallback } from "@/components/studio/studio-tool-fallback";

function StudioMessageError() {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/5 dark:text-red-200">
        <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
}

/**
 * Assistant bubble with compose-panel tool chrome (integration cards + IO wells).
 */
export function StudioAssistantMessage() {
  return (
    <MessagePrimitive.Root
      className="aui-assistant-message-root fade-in slide-in-from-bottom-1 relative mx-auto w-full max-w-(--thread-max-width) animate-in py-3 duration-150"
      data-role="assistant"
    >
      <div className="aui-assistant-message-content wrap-break-word px-2 text-foreground leading-relaxed">
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            tools: { Override: StudioToolArtifactFallback },
          }}
        />
        <StudioMessageError />
      </div>
      <div className="aui-assistant-message-footer mt-0 ml-1 flex">
        <StudioAssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  );
}
