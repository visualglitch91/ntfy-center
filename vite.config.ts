import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

const iconSizes = [50, 72, 100, 128, 192, 512];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: null,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,woff2}"],
        globIgnores: ["latest.json"],
      },
      includeAssets: iconSizes.map((size) => `icons/${size}.png`),
      manifest: {
        name: "NtfyCenter",
        short_name: "NtfyCenter",
        description:
          "An app to unify the notifications from my devices and smart home",
        scope: "/",
        start_url: "/",
        theme_color: "#282A36",
        background_color: "#282A36",
        icons: [
          ...iconSizes.map((size) => ({
            src: `icons/${size}.png`,
            sizes: `${size}x${size}`,
            type: "image/png",
            purpose: "maskable",
          })),
          {
            src: `icons/192.png`,
            sizes: `192x192`,
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});
