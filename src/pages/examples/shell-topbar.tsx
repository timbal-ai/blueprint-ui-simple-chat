import { RiChatAiLine, RiDashboardLine, RiSettings4Line, RiShareForwardLine } from "@remixicon/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Button } from "@/components/base/buttons/button";
import { EmbeddedChat } from "@/components/timbal/embedded-chat";
import { Toaster, toast } from "@/components/timbal/overlays";
import { TopbarShell, type ShellNavItem } from "@/components/timbal/shells";
import { OverviewDemo, SettingsDemo } from "./demo-pages";

/**
 * TopbarShell example — mount at `/examples/shell-topbar/*`. Self-contained:
 * the shell is a layout route and the three pages are nested routes here.
 */
const BASE = "/examples/shell-topbar";

const NAV: ShellNavItem[] = [
  { path: BASE, label: "Overview", icon: RiDashboardLine, end: true },
  { path: `${BASE}/chat`, label: "Chat", icon: RiChatAiLine, badge: "AI", bare: true },
  { path: `${BASE}/settings`, label: "Settings", icon: RiSettings4Line },
];

export default function ShellTopbarExample() {
  return (
    <>
      <Routes>
        <Route
          element={
            <TopbarShell
              brand={{ name: "Northwind" }}
              nav={NAV}
              user={{ name: "Ada Lovelace", email: "ada@northwind.com", onSignOut: () => toast.info("Signed out") }}
              actions={
                <Button variant="secondary" size="small" leadingIcon={RiShareForwardLine} onClick={() => toast.info("Link copied")}>
                  Share
                </Button>
              }
            />
          }
        >
          <Route index element={<OverviewDemo />} />
          <Route path="settings" element={<SettingsDemo />} />
          <Route
            path="chat"
            element={
              <EmbeddedChat
                welcome={{ heading: "Ask Northwind", subheading: "Orders, shipments, and customer questions." }}
                suggestions={[{ title: "Late shipments this week" }, { title: "Draft a customer update" }]}
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
