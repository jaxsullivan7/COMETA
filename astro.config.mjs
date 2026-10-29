// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Dominio del sitio. En Vercel se toma automáticamente de las variables del
// sistema; en local se puede forzar con PUBLIC_SITE_URL.
const vercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl =
  process.env.PUBLIC_SITE_URL ||
  (vercelUrl ? `https://${vercelUrl}` : undefined);

export default defineConfig({
  site: siteUrl,
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
