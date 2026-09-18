import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/payment": "http://localhost:5000",
    },
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
    sourcemap: false,
    reportCompressedSize: true,
  },
});
