import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: true,
      port: parseInt(env.VITE_APP_PORT ? env.VITE_APP_PORT : "5173"),
      allowedHosts: [".timbal.ai"],
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || (process.env.TIMBAL_START_API_PORT ? `http://localhost:${process.env.TIMBAL_START_API_PORT}` : "http://localhost:3000"),
          changeOrigin: true,
          // Forward the original host so the API constructs correct
          // OAuth callback URLs pointing back to the UI dev server
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
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
