import { lazy, Suspense } from "react";
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
// COMPOSER: `Home` is the ready-made chat shell. The index route below renders a
// neutral `<Placeholder />` so a fresh build doesn't mislead users with a chat
// they didn't ask for. When you build the UI, replace `<Placeholder />` on the
// index route with the real surface (`<Home />` for chat, or your own page) and
// delete `Placeholder.tsx` once it's unused.
import Home from "@/pages/Home";
import Placeholder from "@/pages/Placeholder";
import NotFound from "@/pages/NotFound";

// Keep `Home` imported and ready to swap in (no-op reference avoids lint until used).
void Home;

const Gallery = isGalleryEnabled ? lazy(() => import("@/pages/Gallery")) : null;
const GalleryBlocks = isGalleryEnabled
  ? lazy(() => import("@/pages/GalleryBlocks"))
  : null;

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
              {Gallery ? (
                <Route
                  path="/gallery"
                  element={
                    <Suspense fallback={null}>
                      <Gallery />
                    </Suspense>
                  }
                />
              ) : null}
              {GalleryBlocks ? (
                <Route
                  path="/gallery/blocks"
                  element={
                    <Suspense fallback={null}>
                      <GalleryBlocks />
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
