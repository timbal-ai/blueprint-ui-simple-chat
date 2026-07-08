import { TimbalMark } from "@timbal-ai/timbal-react/studio";
import {
  BarChart3Icon,
  BoxesIcon,
  MessageIcon,
  ReceiptIcon,
  TextCursorInputIcon,
} from "@/components/icons";

import { RoutedAppShell } from "@/components/blocks/routed-app-shell";
import { AssistantPill } from "@/components/blocks/assistant";
import { SidebarUser, SIDEBAR_USER_MENU_PRESET } from "@/components/blocks/sidebar-user";

/**
 * Gallery showcase shell — dev/CI surface (VITE_GALLERY), not a product
 * screen. One place to navigate every page template, block, primitive
 * family, and chart recipe. This is also the living reference for the
 * intended composition: `RoutedAppShell` (nav ids ARE route paths, pages
 * render through the router's Outlet) + blocks.
 */
export default function GalleryShell() {
  return (
    <RoutedAppShell
      variant="inset"
      brand={
        // House brand row: the chrome (liquid-metal) Timbal mark + a larger,
        // never-bold product name.
        <div className="flex items-center gap-2 px-1 py-0.5">
          <TimbalMark size={26} className="shrink-0" />
          {/* Same weight as page titles (medium) — never bold. */}
          <span className="truncate text-base font-medium tracking-tight">
            Timbal Kit
          </span>
        </div>
      }
      nav={[
        {
          label: "Pages",
          items: [
            { id: "/gallery", label: "Invoices", icon: ReceiptIcon },
            { id: "/chat", label: "Chat shell", icon: MessageIcon },
          ],
        },
        {
          label: "Library",
          items: [
            { id: "/gallery/blocks", label: "Dashboard", icon: BoxesIcon },
            {
              id: "/gallery/primitives/forms",
              label: "Primitives",
              icon: TextCursorInputIcon,
              children: [
                { id: "/gallery/primitives/forms", label: "Forms & inputs" },
                { id: "/gallery/primitives/overlays", label: "Overlays" },
                { id: "/gallery/primitives/data", label: "Data display" },
                { id: "/gallery/primitives/feedback", label: "Feedback" },
                { id: "/gallery/primitives/navigation", label: "Navigation" },
                { id: "/gallery/primitives/pickers", label: "Date & time" },
              ],
            },
            { id: "/gallery/charts", label: "Charts", icon: BarChart3Icon },
          ],
        },
      ]}
      footer={
        <SidebarUser
          name="Sophie Bennett"
          email="sophie@timbal.ai"
          avatarSrc="https://github.com/shadcn.png"
          menu={SIDEBAR_USER_MENU_PRESET}
        />
      }
    >
      {/* The Timbal floating AI pill — streams via the same runtime env as
          the chat shell (VITE_TIMBAL_*). */}
      <AssistantPill />
    </RoutedAppShell>
  );
}
