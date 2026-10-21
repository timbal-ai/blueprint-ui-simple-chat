import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@assistant-ui/react-markdown/styles/dot.css";
import "katex/dist/katex.min.css";

import "./index.css";
import App from "./App.tsx";
import { KitLocale } from "@/components/timbal/i18n";
// A namespace import: a config.ts rewritten without `LOCALE` fails `tsc`, but
// the preview keeps rendering (in English) instead of failing to load.
import * as config from "@/config";


window.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'navigate') {
      if (event.data.direction === 'back') {
          window.history.go(-1);
      } else if (event.data.direction === 'forward') {
          window.history.go(1);
      }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KitLocale locale={config.LOCALE ?? "en"}>
      <App />
    </KitLocale>
  </StrictMode>,
)
