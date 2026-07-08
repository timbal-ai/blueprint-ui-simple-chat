import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TimbalMark } from "@timbal-ai/timbal-react/studio";
import {
  BarChart3Icon,
  BoxesIcon,
  MessageIcon,
  ReceiptIcon,
  TextCursorInputIcon,
} from "@/components/icons";

import { AppShell } from "@/components/blocks/app-shell";
import { AssistantPill } from "@/components/blocks/assistant";
import { SidebarUser } from "@/components/blocks/sidebar-user";

/**
 * Gallery showcase shell — dev/CI surface (VITE_GALLERY), not a product
 * screen. One place to navigate every page template, block, primitive
 * family, and chart recipe. This is also the living reference for the
 * intended composition: AppShell inset variant + blocks.
 */

const ROUTE_BY_ID: Record<string, string> = {
  invoices: "/gallery",
  chat: "/chat",
  blocks: "/gallery/blocks",
  primitives: "/gallery/primitives/forms",
  forms: "/gallery/primitives/forms",
  overlays: "/gallery/primitives/overlays",
  data: "/gallery/primitives/data",
  feedback: "/gallery/primitives/feedback",
  navigation: "/gallery/primitives/navigation",
  pickers: "/gallery/primitives/pickers",
  charts: "/gallery/charts",
};

function activeIdFromPath(pathname: string): string {
  const match = Object.entries(ROUTE_BY_ID).find(([, path]) => path === pathname);
  return match?.[0] ?? "invoices";
}

export default function GalleryShell() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <AppShell
      variant="inset"
      brand={
        // House brand row: the chrome (liquid-metal) Timbal mark + a larger,
        // never-bold product name.
        <div className="flex items-center gap-2 px-1 py-0.5">
          <TimbalMark size={26} className="shrink-0" />
          <span className="truncate text-base font-normal tracking-tight">
            Timbal Kit
          </span>
        </div>
      }
      nav={[
        {
          label: "Pages",
          items: [
            { id: "invoices", label: "Invoices", icon: ReceiptIcon },
            { id: "chat", label: "Chat shell", icon: MessageIcon },
          ],
        },
        {
          label: "Library",
          items: [
            { id: "blocks", label: "Dashboard", icon: BoxesIcon },
            {
              id: "primitives",
              label: "Primitives",
              icon: TextCursorInputIcon,
              children: [
                { id: "forms", label: "Forms & inputs" },
                { id: "overlays", label: "Overlays" },
                { id: "data", label: "Data display" },
                { id: "feedback", label: "Feedback" },
                { id: "navigation", label: "Navigation" },
                { id: "pickers", label: "Date & time" },
              ],
            },
            { id: "charts", label: "Charts", icon: BarChart3Icon },
          ],
        },
      ]}
      activeId={activeIdFromPath(pathname)}
      onNavigate={(id) => {
        const to = ROUTE_BY_ID[id];
        if (to) navigate(to);
      }}
      footer={
        <SidebarUser
          name="Sophie Bennett"
          email="sophie@timbal.ai"
          avatarSrc="https://github.com/shadcn.png"
        />
      }
    >
      <Outlet />
      {/* The Timbal floating AI pill — streams via the same runtime env as
          the chat shell (VITE_TIMBAL_*). */}
      <AssistantPill />
    </AppShell>
  );
}
