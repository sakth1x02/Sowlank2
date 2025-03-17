import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "sowalnk.com",
      "application-tier-alb-52084640.ap-south-1.elb.amazonaws.com",
      "www.sowalnk.com",
    ],
    proxy: {
      "/api": {
        target:
          "http://internal-application-tier-alb-221203325.ap-south-1.elb.amazonaws.com",
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      overlay: false, // Disable error overlay
    },
  },
  // optimizeDeps: {
  //   include: ["some-package", "another-package"],
  //   exclude: [
  //     "chunk-QUOHUE5D.js",
  //     "chunk-Z7TGAZAL.js",
  //     "chunk-TYRYANW4.js",
  //     "chunk-OWFZW76L.js",
  //     "chunk-7PNND6CJ.js",
  //   ],
  // },
});
// target: "http://localhost:2000",
