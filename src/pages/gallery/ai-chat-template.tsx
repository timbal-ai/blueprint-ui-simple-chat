import { AiChatShell } from "@/components/application/ai-chat/ai-chat-shell";

/**
 * BoardUI Pro "AI Chat" template — a full-viewport VISUAL REFERENCE
 * (sidebar, thread, composer with model/effort menus, resizable code
 * panel). It owns the whole viewport, so it mounts as its own top-level
 * route OUTSIDE the gallery's RoutedAppShell.
 *
 * HARD RULE unchanged: real chat products stream through the Timbal
 * machinery — `TimbalChatShell`/`TimbalStudioShell` on their own route, or
 * `EmbeddedChat` as an in-app page (see /gallery/chat). This template is
 * for borrowing CHROME (sidebar grammar, composer controls, code panel),
 * not for hand-rolling a message thread.
 */
export default function GalleryAiChatTemplate() {
  return <AiChatShell />;
}
