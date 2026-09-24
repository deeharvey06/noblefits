import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
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
