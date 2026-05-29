import path from "node:path";
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
    plugins: [react(), tailwindcss()],
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
      alias: {
        "@": path.join(root, "src"),
        react: reactRoot,
        "react-dom": reactDomRoot,
        "react/jsx-runtime": path.join(reactRoot, "jsx-runtime.js"),
        "react/jsx-dev-runtime": path.join(reactRoot, "jsx-dev-runtime.js"),
        "@assistant-ui/react": assistantUiRoot,
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "@assistant-ui/react"],
    },
  };
});
