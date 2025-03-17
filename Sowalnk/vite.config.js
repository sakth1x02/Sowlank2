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
      "https://application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com", 
      "www.sowalnk.com",
      "application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
    ],
    proxy: {
      "/api": {
        target:
          "http://internal-application-tier-ALb-221203325.ap-south-1.elb.amazonaws.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: [
      "some-package",
      "another-package"
    ],
    exclude: [
      "chunk-QUOHUE5D.js",
      "chunk-Z7TGAZAL.js",
      "chunk-TYRYANW4.js",
      "chunk-OWFZW76L.js",
      "chunk-7PNND6CJ.js"
    ]
  }
});


