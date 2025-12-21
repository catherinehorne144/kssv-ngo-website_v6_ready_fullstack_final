import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://karungussv.vercel.app"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/", // allow public pages
        disallow: ["/api/", "/admin/", "/login", "/dashboard"], // block private/admin pages
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // ensure this file lists all pages & blog posts
  }
}
