import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/partner", "/careers", "/about"];
  const lastModified = new Date("2026-06-28");
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/partner" ? 0.9 : 0.8,
  }));
}
