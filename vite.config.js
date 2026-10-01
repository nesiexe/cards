import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
  server: {
    port: 4001,
    strictPort: true,
    proxy: {
      "/api/now-playing": {
        target: "https://api.nesiexe.xyz",
        changeOrigin: true,
      },
    },
  },
  preview: { port: 4001, strictPort: true },
});
