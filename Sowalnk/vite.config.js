import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://3.90.136.1671:2000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, "")
      },
    },
  },
});
