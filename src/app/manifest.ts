import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "The Big Questions",
    short_name: "Big Questions",
    description:
      "A weekly civic hearing on artificial intelligence: one featured question, civic and institutional views on the record, and follow-up clarification.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f9f6ec",
    theme_color: "#f9f6ec",
    categories: ["news", "government", "social"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
