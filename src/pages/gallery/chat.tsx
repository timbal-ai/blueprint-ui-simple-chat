import { EmbeddedChat } from "@/components/blocks/embedded-chat";

/**
 * Reference for the in-shell chat page: `EmbeddedChat` mounted as a route
 * inside `RoutedAppShell` — the whole page IS the conversation. No
 * PageHeader, no card around the thread; the composer band shares the
 * content card's white surface.
 */
export default function GalleryChat() {
  return (
    <EmbeddedChat
      welcome={{
        heading: "How can I help you today?",
        subheading: "Ask about your data, or pick a suggestion to start.",
      }}
      suggestions={[
        {
          title: "Summarize this month's invoices",
          description: "Totals, overdue amounts, and largest clients",
        },
        {
          title: "Which invoices are overdue?",
          description: "List them with days late and amounts",
        },
        {
          title: "Draft a payment reminder",
          description: "A friendly nudge for the oldest overdue invoice",
        },
      ]}
      composerPlaceholder="Ask anything about your workspace..."
      attachments
    />
  );
}
