import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTitle } from "@/hooks/use-title";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import {
  TooltipProvider,
  SessionProvider,
  AuthGuard,
} from "@timbal-ai/timbal-react";

import { isAuthEnabled } from "@/config";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

function App() {
  const appTitle = import.meta.env.VITE_APP_TITLE;
  useTitle(appTitle || "");
  return (
    <ThemeProvider
      defaultTheme="system"
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
                    <Home />
                  </AuthGuard>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default App;
