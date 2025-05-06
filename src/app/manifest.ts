import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Não Faltei",
    short_name: "Não Faltei",
    display: "fullscreen",
    background_color: "#3B79A7",
    start_url: "/signin",
    theme_color: "#006FEE",
    screenshots: [
      {
        src: "/screenshot-desktop.png",
        sizes: "1897x908",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-mobile.png",
        sizes: "373x664",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
