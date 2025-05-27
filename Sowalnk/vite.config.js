import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "sowalnk.com",
      "presentation-574063402.ap-south-1.elb.amazonaws.com",
      "www.sowalnk.com",
    ],
    proxy: {
      "/api": {
        // target:
        //   "http://internal-application-1025494592.ap-south-1.elb.amazonaws.com",
        target: "http://localhost:2000",
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      overlay: false,
    },
  },
});

// target: "http://localhost:2000",
