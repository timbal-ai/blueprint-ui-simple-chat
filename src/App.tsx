import { lazy, Suspense, type ComponentType } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTitle } from "@/hooks/use-title";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import {
  TooltipProvider,
  SessionProvider,
  AuthGuard,
} from "@timbal-ai/timbal-react";

import { isAuthEnabled, isGalleryEnabled } from "@/config";
// COMPOSER: `Home` is the ready-made chat shell (streaming, attachments,
// artifacts — all wired). It stays mounted at /chat so the full conversation
// surface is always reachable; the index route renders a neutral
// `<Placeholder />` so a fresh build doesn't mislead users with a chat they
// didn't ask for. When you build the UI, replace `<Placeholder />` on the
// index route with the real surface (`<Home />` for chat-first apps, or your
// own page) and delete `Placeholder.tsx` once it's unused.
//
// COMPOSER — multi-page apps (hard rule): every page is a ROUTE, never a
// useState-switched view inside one component (deep links, back/forward and
// refresh must work). Mount `RoutedAppShell` (blocks/routed-app-shell) once
// as a layout route — nav ids ARE route paths — and register one <Route> per
// page under it:
//
//   <Route element={<RoutedAppShell brand={…} nav={NAV} dock={<AssistantPill />} />}>
//     <Route index element={<DashboardPage />} />
//     <Route path="/invoices" element={<InvoicesPage />} />
//   </Route>
//
// The /gallery tree below is the living reference for this exact pattern.
import Home from "@/pages/Home";
import Placeholder from "@/pages/Placeholder";
import NotFound from "@/pages/NotFound";

// Gallery showcase (dev/CI surface): routed pages/blocks/primitives/charts
// inside the inset AppShell. Gated behind VITE_GALLERY.
const GalleryShell = isGalleryEnabled
  ? lazy(() => import("@/pages/gallery/shell"))
  : null;
const GalleryInvoices = lazy(() => import("@/pages/gallery/invoices"));
const GalleryBlocks = lazy(() => import("@/pages/gallery/blocks"));
const GalleryForms = lazy(() => import("@/pages/gallery/primitives-forms"));
const GalleryOverlays = lazy(() => import("@/pages/gallery/primitives-overlays"));
const GalleryData = lazy(() => import("@/pages/gallery/primitives-data"));
const GalleryFeedback = lazy(() => import("@/pages/gallery/primitives-feedback"));
const GalleryNavigation = lazy(
  () => import("@/pages/gallery/primitives-navigation"),
);
const GalleryPickers = lazy(() => import("@/pages/gallery/primitives-pickers"));
const GalleryCharts = lazy(() => import("@/pages/gallery/charts"));

// Local-only dev hub: src/pages/dev/ is git-ignored, so this glob resolves to
// nothing on fresh scaffolds/CI and the /dev route simply doesn't mount.
const devPages = import.meta.glob("./pages/dev/DevHub.tsx") as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;
const devHubLoader = devPages["./pages/dev/DevHub.tsx"];
const DevHub = devHubLoader ? lazy(devHubLoader) : null;
const devProbes = import.meta.glob("./pages/dev/ChatScreenProbe.tsx") as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;
const chatProbeLoader = devProbes["./pages/dev/ChatScreenProbe.tsx"];
const ChatScreenProbe = chatProbeLoader ? lazy(chatProbeLoader) : null;

function App() {
  const appTitle = import.meta.env.VITE_APP_TITLE;
  useTitle(appTitle || "");
  return (
    <ThemeProvider
      defaultTheme="light"
      enableSystem={false}
      storageKey="timbal-theme"
      attribute="class"
    >
      <SessionProvider enabled={isAuthEnabled}>
        <TooltipProvider>
          <Toaster position="top-right" duration={3000} />
          <BrowserRouter>
            <Routes>
              <Route
                index
                element={
                  <AuthGuard requireAuth enabled={isAuthEnabled}>
                    <Placeholder />
                  </AuthGuard>
                }
              />
              <Route
                path="/chat"
                element={
                  <AuthGuard requireAuth enabled={isAuthEnabled}>
                    <Home />
                  </AuthGuard>
                }
              />
              {GalleryShell ? (
                <Route
                  path="/gallery"
                  element={
                    <Suspense fallback={null}>
                      <GalleryShell />
                    </Suspense>
                  }
                >
                  <Route index element={<GalleryInvoices />} />
                  <Route path="blocks" element={<GalleryBlocks />} />
                  <Route path="primitives/forms" element={<GalleryForms />} />
                  <Route
                    path="primitives/overlays"
                    element={<GalleryOverlays />}
                  />
                  <Route path="primitives/data" element={<GalleryData />} />
                  <Route
                    path="primitives/feedback"
                    element={<GalleryFeedback />}
                  />
                  <Route
                    path="primitives/navigation"
                    element={<GalleryNavigation />}
                  />
                  <Route
                    path="primitives/pickers"
                    element={<GalleryPickers />}
                  />
                  <Route path="charts" element={<GalleryCharts />} />
                </Route>
              ) : null}
              {DevHub ? (
                <Route
                  path="/dev"
                  element={
                    <Suspense fallback={null}>
                      <DevHub />
                    </Suspense>
                  }
                />
              ) : null}
              {ChatScreenProbe ? (
                <Route
                  path="/dev/chat-screen"
                  element={
                    <Suspense fallback={null}>
                      <ChatScreenProbe />
                    </Suspense>
                  }
                />
              ) : null}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
