import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Tag, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const BASE_URL = "https://karungussv.vercel.app"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return "/og-image.png"
  if (imagePath.startsWith("http")) return imagePath
  if (imagePath.startsWith("/")) return imagePath
  return `/blog-images/${imagePath}`
}

/* ---------------- Metadata ---------------- */
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const { data: post } = await supabase
    .from("blog")
    .select("title, excerpt, image")
    .eq("id", params.id)
    .eq("status", "published")
    .single()

  if (!post) {
    return { title: "Post Not Found | KSSV" }
  }

  const imageUrl = getImageUrl(post.image)

  return {
    title: `${post.title} | KSSV Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `${BASE_URL}/blog/${params.id}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${params.id}`,
      images: [
        {
          url: imageUrl.startsWith("http")
            ? imageUrl
            : `${BASE_URL}${imageUrl}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [
        imageUrl.startsWith("http")
          ? imageUrl
          : `${BASE_URL}${imageUrl}`,
      ],
    },
  }
}

/* ---------------- Page ---------------- */
export default async function BlogPostPage({
  params,
}: {
  params: { id: string }
}) {
  const { data: post } = await supabase
    .from("blog")
    .select("*")
    .eq("id", params.id)
    .eq("status", "published")
    .single()

  if (!post) notFound()

  return (
    <main className="min-h-screen">
      <Navigation />

      <section className="pt-32 pb-12 container mx-auto px-4 max-w-4xl">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2" />
            Back to Blog
          </Button>
        </Link>

        <Badge className="mb-4">{post.category}</Badge>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-2">
            <Calendar size={16} /> {post.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} /> {post.read_time}
          </span>
          <span className="flex items-center gap-2">
            <Eye size={16} /> {post.views || 0}
          </span>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl mb-12">
        <div className="relative h-[450px] rounded-xl overflow-hidden">
          <Image
            src={getImageUrl(post.image)}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <article className="container mx-auto px-4 max-w-4xl prose prose-lg">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <Footer />
    </main>
  )
}
