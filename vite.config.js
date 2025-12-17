import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",      // allow access from network / codespaces
    port: 8080,      // dev server port
  },
  plugins: [
    react(),         // React + SWC compiler
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // clean imports
    },
  },
});

