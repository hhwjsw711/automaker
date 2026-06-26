import { createFileRoute } from "@tanstack/react-router";
import { getPublishedBlogPosts } from "~/data-access/blog";
import { getPublicAgents } from "~/data-access/agents";
import { getAllLaunchKits } from "~/data-access/launch-kits";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/news",
  "/community",
  "/members",
  "/affiliates",
  "/purchase",
  "/blog",
  "/agents",
  "/launch-kits",
  "/terms-of-service",
  "/privacy-policy",
  "/refund-policy",
];

function getBaseUrl(): string {
  return (process.env.VITE_HOST_NAME ?? "https://automaker.dev").replace(
    /\/$/,
    ""
  );
}

function e(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function hreflang(baseUrl: string, path: string): string {
  const u = baseUrl + path;
  return [
    '<xhtml:link rel="alternate" hreflang="en" href="' + e(u) + '"/>',
    '<xhtml:link rel="alternate" hreflang="zh" href="' + e(u + "?lang=zh") + '"/>',
    '<xhtml:link rel="alternate" hreflang="x-default" href="' + e(u) + '"/>',
  ].join("\n    ");
}

function urlEntry(baseUrl: string, path: string, lastmod?: string): string {
  const lastmodTag = lastmod
    ? "\n    <lastmod>" + lastmod + "</lastmod>"
    : "";

  return "  <url>\n    <loc>" + e(baseUrl + path) + "</loc>" + lastmodTag + "\n    " + hreflang(baseUrl, path) + "\n  </url>";
}

export const Route = createFileRoute("/sitemap")({
  server: {
    handlers: {
      GET: async () => {
        const baseUrl = getBaseUrl();

        let entries: string[] = STATIC_ROUTES.map((route) =>
          urlEntry(baseUrl, route)
        );

        try {
          const posts = await getPublishedBlogPosts();
          for (const p of posts) {
            entries.push(
              urlEntry(baseUrl, "/blog/" + p.slug, p.publishedAt?.toISOString())
            );
          }
        } catch {}

        try {
          const agents = await getPublicAgents();
          for (const a of agents) {
            entries.push(
              urlEntry(baseUrl, "/agents/" + a.slug, a.updatedAt?.toISOString())
            );
          }
        } catch {}

        try {
          const kits = await getAllLaunchKits();
          for (const k of kits) {
            entries.push(
              urlEntry(baseUrl, "/launch-kits/" + k.slug, k.createdAt?.toISOString())
            );
          }
        } catch {}

        const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + entries.join("\n") + "\n</urlset>";

        const response = new Response(xml, { status: 200 });
        response.headers.set("Content-Type", "application/xml; charset=utf-8");
        response.headers.set("Cache-Control", "public, max-age=3600");
        return response;
      },
    },
  },
});
