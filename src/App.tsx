import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard, SessionProvider } from "@timbal-ai/timbal-react";

import { areTemplatesEnabled, isAuthEnabled } from "@/config";
import { useTitle } from "@/hooks/use-title";
import { Login } from "@/components/timbal/login";
import Home from "@/pages/Home";
import LoginPage from "@/pages/Login";
import NotFound from "@/pages/NotFound";

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

function App() {
  useTitle(import.meta.env.VITE_APP_TITLE || "");
  return (
    <SessionProvider enabled={isAuthEnabled}>
      <BrowserRouter>
        <Routes>
          <Route
            index
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
