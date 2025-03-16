import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "sowalnk.com",
      "internal-application-tier-ALb-221203325.ap-south-1.elb.amazonaws.com",
    ],
    proxy: {
      "/api": {
        target:
          "https://internal-application-tier-ALb-221203325.ap-south-1.elb.amazonaws.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

// http://localhost:2000
