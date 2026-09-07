import { RiAddFill, RiChatAiLine, RiHomeLine, RiSettings4Line } from "@remixicon/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Button } from "@/components/base/buttons/button";
import { AssistantPill } from "@/components/timbal/assistant-pill";
import { EmbeddedChat } from "@/components/timbal/embedded-chat";
import { Toaster, toast } from "@/components/timbal/overlays";
import { SidebarShell, type ShellNavItem } from "@/components/timbal/shells";
import { OverviewDemo, SettingsDemo } from "./demo-pages";

/**
 * SidebarShell example — mount at `/examples/shell-sidebar/*`. Self-contained:
 * the shell is a layout route and the three pages are nested routes here.
 */
const BASE = "/examples/shell-sidebar";

const NAV: ShellNavItem[] = [
  { path: BASE, label: "Overview", icon: RiHomeLine, end: true, badge: 12 },
  // `bare`: the chat owns the page — no shell header, no dock over its composer.
  { path: `${BASE}/chat`, label: "Chat", icon: RiChatAiLine, bare: true },
];

const SECONDARY_NAV: ShellNavItem[] = [{ path: `${BASE}/settings`, label: "Settings", icon: RiSettings4Line }];

export default function ShellSidebarExample() {
  return (
    <>
      <Routes>
        <Route
          element={
            <SidebarShell
              brand={{ name: "Acme Ops", subtitle: "Workspace" }}
              nav={NAV}
              secondaryNav={SECONDARY_NAV}
              user={{ name: "Ada Lovelace", email: "ada@acme.com", onSignOut: () => toast.info("Signed out") }}
              actions={
                <Button leadingIcon={RiAddFill} onClick={() => toast.success("Report created")}>
                  New report
                </Button>
              }
              dock={<AssistantPill />}
            />
          }
        >
          <Route index element={<OverviewDemo />} />
          <Route path="settings" element={<SettingsDemo />} />
          <Route
            path="chat"
            element={
              <EmbeddedChat
                welcome={{ heading: "Ask Acme Ops", subheading: "Reports, customers, and what changed this week." }}
                suggestions={[{ title: "Summarize this week" }, { title: "Which customers churned?" }]}
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
