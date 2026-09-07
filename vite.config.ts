import path from "node:path";
import { timbalReactLocalDev } from "@timbal-ai/timbal-react/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const root = path.resolve(__dirname);
const reactRoot = path.join(root, "node_modules/react");
const reactDomRoot = path.join(root, "node_modules/react-dom");
const assistantUiRoot = path.join(root, "node_modules/@assistant-ui/react");

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [timbalReactLocalDev(), react(), tailwindcss()],
    server: {
      host: true,
      port: parseInt(env.VITE_APP_PORT ? env.VITE_APP_PORT : "5173"),
      allowedHosts: [".timbal.ai"],
      watch: {
        ignored: ["**/.nfs*"],
      },
      proxy: {
        "/api": {
          target:
            env.VITE_API_PROXY_TARGET ||
            (process.env.TIMBAL_START_API_PORT
              ? `http://localhost:${process.env.TIMBAL_START_API_PORT}`
              : "http://localhost:3000"),
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              if (req.headers.host) {
                proxyReq.setHeader("x-forwarded-host", req.headers.host);
              }
            });
          },
        },
      },
    },
    preview: {
      host: true,
      port: parseInt(env.VITE_APP_PORT ? env.VITE_APP_PORT : "5173"),
    },
    resolve: {
      // `file:../timbal-react` installs nested copies — force one React.
      dedupe: ["react", "react-dom", "react/jsx-runtime", "@assistant-ui/react"],
      alias: [
        { find: "@", replacement: path.join(root, "src") },
        // BoardUI is authored for Next.js. Vendored files keep their `next/*`
        // imports and resolve to these shims so upstream stays byte-identical
        // (scripts/boardui-sync.mjs can always --overwrite).
        { find: /^next\/image$/, replacement: path.join(root, "src/shims/next-image.tsx") },
        { find: /^next\/link$/, replacement: path.join(root, "src/shims/next-link.tsx") },
        { find: /^next\/navigation$/, replacement: path.join(root, "src/shims/next-navigation.ts") },
        { find: /^react$/, replacement: reactRoot },
        { find: /^react-dom$/, replacement: reactDomRoot },
        { find: "react/jsx-runtime", replacement: path.join(reactRoot, "jsx-runtime.js") },
        { find: "react/jsx-dev-runtime", replacement: path.join(reactRoot, "jsx-dev-runtime.js") },
        { find: "@assistant-ui/react", replacement: assistantUiRoot },
      ],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "@assistant-ui/react"],
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        onwarn(warning, warn) {
          // BoardUI files carry Next's "use client" directive; harmless in Vite.
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
          warn(warning);
        },
        output: {
          manualChunks: {
            runtime: ["@timbal-ai/timbal-react"],
            charts: ["recharts"],
          },
        },
      },
    },
  };
});
