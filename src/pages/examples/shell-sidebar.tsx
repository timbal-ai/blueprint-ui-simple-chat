import { RiChatAiLine, RiSettings4Line, RiTicketLine } from "@remixicon/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AssistantPill } from "@/components/timbal/assistant-pill";
import { EmbeddedChat } from "@/components/timbal/embedded-chat";
import { Toaster, toast } from "@/components/timbal/overlays";
import { SidebarShell, type ShellNavItem } from "@/components/timbal/shells";
import { SettingsDemo, TicketsDemo } from "./demo-pages";

/**
 * SidebarShell example — mount at `/examples/shell-sidebar/*`. Self-contained:
 * the shell is a layout route and the three pages are nested routes here.
 * The entry screen is the product's primary object (a ticket queue), not a
 * KPI dashboard — see `demo-pages.tsx`.
 */
const BASE = "/examples/shell-sidebar";

const NAV: ShellNavItem[] = [
  { path: BASE, label: "Tickets", icon: RiTicketLine, end: true, badge: 12 },
  // `description` is the one-line intro under the header title. Pages never
  // print their own heading; TicketsDemo overrides this with a live count.
  // `bare`: the chat owns the page — no shell header, no dock over its composer.
  { path: `${BASE}/chat`, label: "Chat", icon: RiChatAiLine, bare: true },
];

const SECONDARY_NAV: ShellNavItem[] = [
  { path: `${BASE}/settings`, label: "Settings", icon: RiSettings4Line, description: "Profile, notifications and how the workspace talks to you." },
];

export default function ShellSidebarExample() {
  return (
    <>
      <Routes>
        <Route
          element={
            <SidebarShell
              brand={{ name: "Acme Support", subtitle: "Workspace" }}
              nav={NAV}
              secondaryNav={SECONDARY_NAV}
              user={{ name: "Ada Lovelace", email: "ada@acme.com", onSignOut: () => toast.info("Signed out") }}
              // No shell-wide `actions`: "New ticket" belongs to the Tickets page
              // (its <PageHeader actions>), not to Settings.
              dock={<AssistantPill />}
            />
          }
        >
          <Route index element={<TicketsDemo />} />
          <Route path="settings" element={<SettingsDemo />} />
          <Route
            path="chat"
            element={
              <EmbeddedChat
                welcome={{ heading: "Ask Acme Support", subheading: "Tickets, customers, and what changed this week." }}
                suggestions={[{ title: "Summarize escalated tickets" }, { title: "Which customers are waiting?" }]}
              />
            }
          />
          <Route path="*" element={<Navigate to={BASE} replace />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
