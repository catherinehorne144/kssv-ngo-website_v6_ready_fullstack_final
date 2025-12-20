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
      month: "short", 
      day: "numeric" 
    })
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Article Header */}
      <article className="pt-20 pb-8">
        <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
          {/* Back Button */}
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2 px-2">
              <ArrowLeft className="mr-1.5 w-3.5 h-3.5" />
              Back
            </Button>
          </Link>

          {/* Category */}
          <div className="mb-3">
            <Badge 
              variant="secondary" 
              className="text-xs font-medium bg-gradient-to-r from-primary/10 to-accent-sky/10"
            >
              {post.category}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2.5xl md:text-3xl lg:text-3.5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground mb-6 pb-5 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.read_time}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {(post.views || 0).toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <div className="relative h-56 md:h-64 rounded-xl overflow-hidden shadow-md">
              <Image
                src={getImageUrl(post.image)}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-sm md:prose-base max-w-none">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                lineHeight: '1.7',
                fontSize: '0.9375rem',
                color: 'var(--foreground)'
              }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-medium text-foreground mb-3 flex items-center gap-1.5 text-sm">
                <Tag className="w-3.5 h-3.5" />
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2.5 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share & Actions */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 justify-between items-center">
            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs h-9">
              <Share2 className="mr-1.5 w-3.5 h-3.5" />
              Share
            </Button>
            <div className="flex gap-1.5 w-full sm:w-auto">
              <Button variant="ghost" size="sm" className="flex-1 sm:flex-none text-xs h-9">
                <Bookmark className="mr-1.5 w-3.5 h-3.5" />
                Save
              </Button>
              <Link href="/blog" className="flex-1">
                <Button size="sm" className="w-full h-9 text-xs">
                  More Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
