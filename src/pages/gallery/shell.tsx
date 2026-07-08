import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3Icon,
  BoxesIcon,
  ChevronsUpDownIcon,
  MessageIcon,
  ReceiptIcon,
  TextCursorInputIcon,
} from "@/components/icons";

import { AppShell } from "@/components/blocks/app-shell";
import { AssistantPill } from "@/components/blocks/assistant";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
        <div className="flex items-center gap-2 px-1 py-0.5">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-xs font-medium text-primary-foreground">
            T
          </span>
          <span className="truncate text-sm font-medium">Timbal Kit</span>
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
            { id: "blocks", label: "Blocks", icon: BoxesIcon },
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
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg border border-sidebar-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0"
        >
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px]">TB</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 truncate text-sm group-data-[collapsible=icon]:hidden">
            Blueprint
          </span>
          <ChevronsUpDownIcon className="size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </button>
      }
    >
      <Outlet />
      {/* The Timbal floating AI pill — streams via the same runtime env as
          the chat shell (VITE_TIMBAL_*). */}
      <AssistantPill />
    </AppShell>
  );
}
