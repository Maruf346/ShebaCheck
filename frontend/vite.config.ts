import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_DJANGO_ORIGIN || "http://127.0.0.1:8000",
          changeOrigin: true,
        },
      },
    },
  };
});
