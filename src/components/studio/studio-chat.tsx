import type { ComponentProps } from "react";
import { TimbalChat } from "@timbal-ai/timbal-react";

import { studioTimbalChatProps } from "@/lib/studio-chat";

import { StudioAssistantMessage } from "./studio-assistant-message";
import { StudioComposer } from "./studio-composer";
import { StudioTopbarTimbalPortal } from "./studio-topbar-timbal-mark";
import { StudioSuggestions } from "./studio-suggestions";
import { StudioUserMessage } from "./studio-user-message";
import { StudioWelcome } from "./studio-welcome";

interface StudioChatProps {
  workforceId: string;
}

function StudioComposerWithTopbarBrand(
  props: ComponentProps<typeof StudioComposer>,
) {
  return (
    <>
      <StudioTopbarTimbalPortal />
      <StudioComposer {...props} />
    </>
  );
}

/** Studio-thread chat — timbal-react 0.3 runtime with custom slots. */
export function StudioChat({ workforceId }: StudioChatProps) {
  return (
    <TimbalChat
      {...studioTimbalChatProps}
      workforceId={workforceId}
      key={workforceId}
      components={{
        Welcome: StudioWelcome,
        Suggestions: StudioSuggestions,
        Composer: StudioComposerWithTopbarBrand,
        AssistantMessage: StudioAssistantMessage,
        UserMessage: StudioUserMessage,
      }}
    />
  );
}
