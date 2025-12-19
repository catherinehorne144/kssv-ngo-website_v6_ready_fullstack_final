import type { Metadata } from "next"
import BlogClientPage from "./page.client"
import { createClient } from "@supabase/supabase-js"

// ✅ Force runtime rendering (prevents static build crash)
export const dynamic = "force-dynamic"

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
      "Stories, updates, and insights from Karungu Survivors of Sexual Violence.",
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
  alternates: {
    canonical: "https://karungussv.vercel.app/blog",
  },
}

// ✅ Public, anon Supabase client (NO cookies)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function BlogPage() {
  const { data: posts, error } = await supabase
    .from("blog")
    .select(
      `
        id,
        title,
        excerpt,
        category,
        tags,
        author,
        date,
        read_time,
        image
      `
    )
    .eq("status", "published")
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return <BlogClientPage initialPosts={[]} />
  }

  return <BlogClientPage initialPosts={posts ?? []} />
}
