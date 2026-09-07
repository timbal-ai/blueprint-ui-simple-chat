import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard, SessionProvider } from "@timbal-ai/timbal-react";

import { areTemplatesEnabled, isAuthEnabled } from "@/config";
import { useTitle } from "@/hooks/use-title";
import { Login } from "@/components/timbal/login";
import Home from "@/pages/Home";
import LoginPage from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Placeholder from "@/pages/Placeholder";

// Every page is a ROUTE. Add one <Route> per screen; for multi-page apps mount
// a shell from components/timbal/shells as a layout route and render pages
// through its <Outlet />. Never switch "pages" with useState.
//
// BoardUI Pro templates, mounted so they can be seen running (dev / VITE_TEMPLATES).
// Fork the shell you start from into src/pages/<yours>.tsx, then delete these.
const templates = {
  dashboard: lazy(() => import("@/pages/templates/dashboard")),
  finance: lazy(() => import("@/pages/templates/finance")),
  hr: lazy(() => import("@/pages/templates/hr")),
  marketing: lazy(() => import("@/pages/templates/marketing")),
  medical: lazy(() => import("@/pages/templates/medical")),
  calendar: lazy(() => import("@/pages/templates/calendar")),
  "ai-profile": lazy(() => import("@/pages/templates/ai-profile")),
  "ai-chat": lazy(() => import("@/pages/templates/ai-chat")),
  "ai-image-generation": lazy(() => import("@/pages/templates/ai-image-generation")),
};

// Shell examples (dev): SidebarShell / TopbarShell with overview, settings
// (modal, sheet, toasts) and an EmbeddedChat route — the two multi-page grammars.
const examples = {
  "shell-sidebar": lazy(() => import("@/pages/examples/shell-sidebar")),
  "shell-topbar": lazy(() => import("@/pages/examples/shell-topbar")),
};

function App() {
  useTitle(import.meta.env.VITE_APP_TITLE || "");
  return (
    <SessionProvider enabled={isAuthEnabled}>
      <BrowserRouter>
        <Routes>
          {/* The index route is a neutral placeholder on a fresh scaffold — a
              build should never open on a chat the user didn't ask for. Replace
              it with the real surface (<Home /> for a chat product, a template
              shell, or your own page) and delete Placeholder.tsx. */}
          <Route
            index
            element={
              <AuthGuard requireAuth enabled={isAuthEnabled} renderLogin={<Login />}>
                <Placeholder />
              </AuthGuard>
            }
          />
          {/* The wired chat surface: Timbal runtime + BoardUI chrome. */}
          <Route
            path="/chat"
            element={
              <AuthGuard requireAuth enabled={isAuthEnabled} renderLogin={<Login />}>
                <Home />
              </AuthGuard>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          {areTemplatesEnabled
            ? Object.entries(templates).map(([slug, Page]) => (
                <Route
                  key={slug}
                  path={`/templates/${slug}`}
                  element={
                    <Suspense fallback={null}>
                      <Page />
                    </Suspense>
                  }
                />
              ))
            : null}
          {areTemplatesEnabled
            ? Object.entries(examples).map(([slug, Page]) => (
                <Route
                  key={slug}
                  path={`/examples/${slug}/*`}
                  element={
                    <Suspense fallback={null}>
                      <Page />
                    </Suspense>
                  }
                />
              ))
            : null}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
