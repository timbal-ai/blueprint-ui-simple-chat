import { useLocation } from "react-router-dom";
import { TimbalMark } from "@timbal-ai/timbal-react/studio";
import {
  ActivityIcon,
  BarChart3Icon,
  BoxesIcon,
  CalendarIcon,
  ChatBotIcon,
  CreditCardIcon,
  GlobeIcon,
  HomeIcon,
  ImagesIcon,
  FileTextIcon,
  ReceiptIcon,
  SparklesIcon,
  TextCursorInputIcon,
  UserIcon,
} from "@/components/icons";

import { RoutedAppShell } from "@/components/blocks/routed-app-shell";
import { AssistantPill } from "@/components/blocks/assistant";
import { SidebarUser } from "@/components/blocks/sidebar-user";

/**
 * Gallery showcase shell — dev/CI surface (VITE_GALLERY), not a product
 * screen. One place to navigate every page template, block, primitive
 * family, and chart recipe. This is also the living reference for the
 * intended composition: `RoutedAppShell` (nav ids ARE route paths, pages
 * render through the router's Outlet) + blocks.
 */
export default function GalleryShell() {
  // The assistant pill is redundant (and overlaps the composer) on the
  // chat page — the whole page already IS the assistant. On the invoice
  // review route it floats exactly over the pinned Approve action, so it
  // is hidden there too (focused decision screens keep the CTA clear).
  const { pathname } = useLocation();
  const hidePill =
    pathname === "/gallery/chat" || pathname === "/gallery/pages/invoice-review";
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
            {
              id: "/gallery/pages/invoice-review",
              label: "Invoice review",
              icon: FileTextIcon,
            },
            { id: "/gallery/blocks", label: "Dashboard", icon: BoxesIcon },
            { id: "/gallery/pages/customer", label: "Customer", icon: CreditCardIcon },
            { id: "/gallery/pages/workspace", label: "Workspace", icon: GlobeIcon },
            { id: "/gallery/pages/media", label: "Media", icon: ImagesIcon },
            // EmbeddedChat reference — full-bleed on the content card, no title.
            { id: "/gallery/chat", label: "Assistant", icon: ChatBotIcon },
          ],
        },
        {
          // BoardUI Pro templates, rehosted on the house shell grammar.
          label: "Pro templates",
          items: [
            { id: "/gallery/pages/home", label: "Home", icon: HomeIcon },
            { id: "/gallery/pages/medical", label: "Medical", icon: ActivityIcon },
            { id: "/gallery/pages/ai-profile", label: "AI profile", icon: UserIcon },
            { id: "/gallery/pages/calendar", label: "Calendar", icon: CalendarIcon },
            // Full-viewport visual reference — leaves the gallery shell.
            { id: "/gallery/templates/ai-chat", label: "AI chat (mock)", icon: SparklesIcon },
          ],
        },
        {
          label: "Library",
          items: [
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
        // No `menu` here on purpose — account actions are app-specific;
        // define them when building a real app.
        <SidebarUser
          name="Sophie Bennett"
          email="sophie@timbal.ai"
          avatarSrc="https://github.com/shadcn.png"
        />
      }
    >
      {/* The Timbal floating AI pill — streams via the same runtime env as
          the chat shell (VITE_TIMBAL_*). */}
      {!hidePill ? <AssistantPill /> : null}
    </RoutedAppShell>
  );
}
