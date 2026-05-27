import { useTheme } from "next-themes";
import type { ThreadSuggestion, UiEventEnvelope } from "@timbal-ai/timbal-react";
import {
  ARTIFACT_AGENT_INSTRUCTIONS,
  ModeToggle,
  TimbalChatShell,
  TimbalStudioShell,
} from "@timbal-ai/timbal-react";

import { StudioTopbarBrandAnchor } from "@/components/studio-topbar-brand";
import { isStudioSidebarEnabled, isStudioUiOnly } from "@/config";
import { studioChatComponents } from "@/lib/studio-chat-chrome";
import { studioUiOnlyFetch, studioUiPreviewSuggestions } from "@/lib/ui-only";

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

  const suggestions: ThreadSuggestion[] | undefined = isStudioUiOnly
    ? studioUiPreviewSuggestions
    : undefined;

  const headerActions = (
    <ModeToggle theme={resolvedTheme} setTheme={setTheme} />
  );

  const chatProps = {
    welcome,
    suggestions,
    composerPlaceholder: "Send a message...",
    attachments: true as const,
    debug: import.meta.env.DEV,
    onArtifactEvent: handleArtifactEvent,
    headerActions,
    fetch: isStudioUiOnly ? studioUiOnlyFetch : undefined,
    components: studioChatComponents,
  };

  // Sidebar is opt-in: set VITE_STUDIO_SIDEBAR=true to use the full studio shell.
  if (isStudioSidebarEnabled) {
    return (
      <TimbalStudioShell
        {...chatProps}
        workforcesFetch={chatProps.fetch}
        sidebarEmptyCaption="Blueprint UI preview"
        headerStart={<StudioTopbarBrandAnchor />}
      />
    );
  }

  return (
    <TimbalChatShell
      {...chatProps}
      brand={<StudioTopbarBrandAnchor />}
    />
  );
};

export default Home;
