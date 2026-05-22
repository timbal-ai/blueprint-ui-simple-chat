import { StudioQuestionArtifact } from "@/components/studio/studio-question-artifact";

import type { TimbalChatProps, UiEventEnvelope } from "@timbal-ai/timbal-react";

/** Re-export for workforce / agent system prompts (paste into timbal.yaml). */
export { ARTIFACT_AGENT_INSTRUCTIONS } from "@timbal-ai/timbal-react";

export const studioWelcome = {
  heading:
    import.meta.env.VITE_WELCOME_HEADING || "How can I help you today?",
  subheading:
    import.meta.env.VITE_WELCOME_SUBHEADING ||
    "Send a message to start a conversation.",
} as const;

/** Host-side handler for `ui` artifact emit actions (sliders, buttons, drag, etc.). */
export function handleStudioArtifactEvent(event: UiEventEnvelope) {
  if (import.meta.env.DEV) {
    console.debug("[studio:artifact]", event.name, event.payload);
  }
}

/** Shared `TimbalChat` props for the studio playground (minus `workforceId`). */
export const studioTimbalChatProps = {
  maxWidth: "42rem",
  composerPlaceholder: "Send a message...",
  welcome: studioWelcome,
  attachments: true,
  debug: import.meta.env.DEV,
  onArtifactEvent: handleStudioArtifactEvent,
  artifacts: {
    renderers: {
      question: StudioQuestionArtifact,
    },
  },
  className: "min-h-0 flex-1 bg-transparent",
} satisfies Omit<TimbalChatProps, "workforceId">;
