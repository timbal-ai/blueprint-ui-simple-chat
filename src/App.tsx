import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTitle } from "@/hooks/use-title";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/auth/AuthGuard";
import { SessionProvider } from "@/auth/provider";

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
      <SessionProvider>
        <TooltipProvider>
        <Toaster position="top-right" duration={3000} />
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <AuthGuard requireAuth>
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
