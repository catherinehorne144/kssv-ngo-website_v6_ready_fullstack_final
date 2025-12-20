import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Tag, ArrowLeft, Eye, Share2, Bookmark, User } from "lucide-react"
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
  if (!imagePath) return "/placeholder.svg"
  if (imagePath.startsWith("http")) return imagePath
  if (imagePath.startsWith("/")) return imagePath
  return `/blog-images/${imagePath}`
}

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Article Header */}
      <article className="pt-24 pb-12">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-8 -ml-2">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Stories
            </Button>
          </Link>

          {/* Category */}
          <div className="mb-4">
            <Badge variant="secondary" className="text-sm font-medium">
              {post.category}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-4.5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.read_time}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {(post.views || 0).toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-10">
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={getImageUrl(post.image)}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Featured image for this story
            </p>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                lineHeight: '1.75',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share & Actions */}
          <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Share2 className="mr-2 w-4 h-4" />
              Share Story
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Bookmark className="mr-2 w-4 h-4" />
                Save
              </Button>
              <Link href="/blog">
                <Button size="sm">
                  More Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts - If you want to add later */}
      {/* <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 lg:px-6">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-8 text-center">
            More Stories You Might Like
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            // Related posts would go here
          </div>
        </div>
      </section> */}

      <Footer />
    </main>
  )
}
