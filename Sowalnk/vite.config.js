import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all network interfaces (necessary for external access)
    port: 5173, // Default Vite port
    strictPort: true, // Ensures the server fails if port 5173 is unavailable
    allowedHosts: [
      "3-tier-540623662.us-east-2.elb.amazonaws.com", // AWS load balancer
      ".amazonaws.com", // Allow all AWS domains
      "sakthidev.site", // ✅ Add your custom domain here
    ],
    proxy: {
      "/api": {
        target: "https://app-alb-990835184.us-east-2.elb.amazonaws.com/", // Your backend API
        changeOrigin: true, // Changes the origin of the host header to the target URL
        secure: false, // Set to true if HTTPS is correctly configured on the target
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins for testing (tighten for production)
        },
      },
    },
    cors: {
      origin: "*", // Allow all CORS origins (for testing, tighten in production)
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    },
  },
  preview: {
    host: true, // Allow external access during preview mode
    port: 4173, // Default preview port
  },
});
