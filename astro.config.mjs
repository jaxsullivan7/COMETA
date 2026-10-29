// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// TODO: cuando exista dominio definitivo, añadir `site: "https://cometa.es"`.
// Se usa para canonical, Open Graph y sitemap.
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [tailwindcss()],
    // Permite abrir la vista previa a través de un túnel (cloudflared, ngrok…).
    // Solo afecta al servidor local, no al sitio desplegado.
    preview: {
      allowedHosts: true,
    },
    server: {
      allowedHosts: true,
    },
  },
  build: {
    inlineStylesheets: "auto",
  },
});
