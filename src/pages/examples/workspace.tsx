import { RiBillLine, RiChatAiLine, RiListCheck3, RiSettings4Line } from "@remixicon/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AssistantPill } from "@/components/timbal/assistant-pill";
import { EmbeddedChat } from "@/components/timbal/embedded-chat";
import { Toaster, toast } from "@/components/timbal/overlays";
import { SidebarShell, type ShellNavItem } from "@/components/timbal/shells";
import { SettingsDemo } from "./demo-pages";
import { InvoicesDemo, TodayDemo } from "./workspace-pages";

/**
 * Workspace example — mount at `/examples/workspace/*`. The shape most
 * generated products have: one app, several modules. `/` is `Today`, a
 * `WorkQueue` of what needs the user across modules, and each group links to
 * its module's list (`Invoices`). No stat tiles: the counts are the header's
 * one line and the group badges.
 */
const BASE = "/examples/workspace";

const NAV: ShellNavItem[] = [
  { path: BASE, label: "Today", icon: RiListCheck3, end: true },
  { path: `${BASE}/invoices`, label: "Invoices", icon: RiBillLine },
  { path: `${BASE}/chat`, label: "Assistant", icon: RiChatAiLine, bare: true },
];

const SECONDARY_NAV: ShellNavItem[] = [
  { path: `${BASE}/settings`, label: "Settings", icon: RiSettings4Line, description: "Profile, notifications and workspace defaults." },
];

export default function WorkspaceExample() {
  return (
    <>
      <Routes>
        <Route
          element={
            <SidebarShell
              brand={{ name: "Northwind Supply", subtitle: "Back office" }}
              nav={NAV}
              secondaryNav={SECONDARY_NAV}
              user={{ name: "Ada Lovelace", email: "ada@northwind.co", onSignOut: () => toast.info("Signed out") }}
              dock={<AssistantPill />}
            />
          }
        >
          <Route index element={<TodayDemo invoicesPath={`${BASE}/invoices`} />} />
          <Route path="invoices" element={<InvoicesDemo />} />
          <Route path="settings" element={<SettingsDemo />} />
          <Route
            path="chat"
            element={
              <EmbeddedChat
                welcome={{ heading: "Ask Northwind", subheading: "Invoices, stock and follow-ups." }}
                suggestions={[{ title: "Who owes us the most?" }, { title: "What should I reorder this week?" }]}
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
