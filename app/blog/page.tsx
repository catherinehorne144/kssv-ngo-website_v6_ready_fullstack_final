import type { Metadata } from "next"
import BlogClientPage from "./page.client"

export const metadata: Metadata = {
  title: "Blog & News | KSSV - Karungu Survivors of Sexual Violence",
  description:
    "Read stories, updates, and insights from KSSV. Explore success stories, legal victories, community impact, and awareness articles about sexual violence prevention and survivor support.",
  keywords: [
    "KSSV blog",
    "survivor stories",
    "sexual violence prevention",
    "community impact",
    "legal aid",
    "women empowerment",
    "Karungu",
    "Kenya NGO",
  ],
  openGraph: {
    title: "Blog & News | KSSV",
    description:
      "Stories, updates, and insights from Karungu Survivors of Sexual Violence. Read about our impact and community transformation.",
    url: "https://karungussv.vercel.app/blog",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KSSV Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & News | KSSV",
    description: "Stories, updates, and insights from Karungu Survivors of Sexual Violence.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://karungussv.vercel.app/blog",
  },
}

export default function BlogPage() {
  return <BlogClientPage />
}
