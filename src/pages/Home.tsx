import { useTheme } from "next-themes";
import type { UiEventEnvelope } from "@timbal-ai/timbal-react";
import {
  ARTIFACT_AGENT_INSTRUCTIONS,
  ModeToggle,
  TimbalChatShell,
  TimbalStudioShell,
} from "@timbal-ai/timbal-react";

import { isStudioSidebarEnabled } from "@/config";
import { studioChatComponents } from "@/lib/studio-chat-chrome";

/** Re-export so workforce / agent system prompts can paste it into timbal.yaml. */
export { ARTIFACT_AGENT_INSTRUCTIONS };

const welcome = {
  heading:
    import.meta.env.VITE_WELCOME_HEADING || "How can I help you today?",
  subheading:
    import.meta.env.VITE_WELCOME_SUBHEADING ||
    "Send a message to start a conversation.",
} as const;

function handleArtifactEvent(event: UiEventEnvelope) {
  if (import.meta.env.DEV) {
    console.debug("[blueprint:artifact]", event.name, event.payload);
  }
}

const Home = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const headerActions = (
    <ModeToggle theme={resolvedTheme} setTheme={setTheme} />
  );

  const chatProps = {
    welcome,
    composerPlaceholder: "Send a message...",
    attachments: true as const,
    debug: import.meta.env.DEV,
    onArtifactEvent: handleArtifactEvent,
    headerActions,
    components: studioChatComponents,
  };

  // Sidebar is opt-in: set VITE_STUDIO_SIDEBAR=true to use the full studio shell.
  if (isStudioSidebarEnabled) {
    return <TimbalStudioShell {...chatProps} />;
  }

  return <TimbalChatShell {...chatProps} />;
};

export default Home;
