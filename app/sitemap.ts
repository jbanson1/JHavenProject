import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/landlords", "/about", "/stay", "/contact", "/privacy"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/landlords" ? 0.9 : 0.6,
  }));
}
