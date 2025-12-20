import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Tag, ArrowLeft, Eye, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const BASE_URL = "https://karungussv.vercel.app"

// ✅ Public anon Supabase client (NO cookies)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helper function for image URLs
const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return "/og-image.png"
  
  // If it's already a full URL from Supabase, use it directly
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If it's a local path starting with /, use it directly
  if (imagePath.startsWith('/')) {
    return imagePath
  }
  
  // For backward compatibility with old local images
  return `/blog-images/${imagePath}`
}

/* ----------------------------- */
/* Metadata                      */
/* ----------------------------- */
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const { data: post } = await supabase
    .from("blog")
    .select("title, excerpt, image, author, date")
    .eq("id", params.id)
    .eq("status", "published")
    .single()

  if (!post) {
    return { title: "Post Not Found | KSSV" }
  }

  // FIXED: Use getImageUrl to handle both full URLs and local paths
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
          url: imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`],
    },
    robots: { index: true, follow: true },
  }
}

/* ----------------------------- */
/* Page                          */
/* ----------------------------- */
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

  const { data: relatedPosts } = await supabase
    .from("blog")
    .select("id, title, excerpt, image, category")
    .eq("status", "published")
    .neq("id", post.id)
    .limit(3)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  // FIXED: Use getImageUrl for schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: getImageUrl(post.image),
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Karungu Survivors of Sexual Violence",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon-512.png`,
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="min-h-screen">
        <Navigation />

        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-accent-purple/20 via-primary/10 to-accent-sky/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.3)_0%,transparent_50%)]" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
              <Link href="/blog">
                <Button variant="ghost" className="mb-8 hover:bg-primary/10 group">
                  <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to All Stories
                </Button>
              </Link>

              {/* Category Badge */}
              <div className="mb-6">
                <Badge className="text-lg px-5 py-2.5 bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/30">
                  {post.category}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">👤</span>
                  </div>
                  <span className="font-medium">{post.author}</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full">
                  <Calendar size={18} className="text-primary" />
                  <time dateTime={post.date} className="font-medium">
                    {formatDate(post.date)}
                  </time>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full">
                  <Clock size={18} className="text-primary" />
                  <span>{post.read_time}</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full">
                  <Eye size={18} className="text-primary" />
                  <span>{post.views || 0} views</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl -mt-10 relative z-20">
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
            <Image
              src={getImageUrl(post.image)}
              alt={post.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>

        {/* Content Section */}
        <article className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-12">
                {post.tags.map((tag: string) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="px-4 py-2 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-primary/10 transition-colors"
                  >
                    <Tag size={14} className="mr-2" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-serif 
                prose-headings:font-bold
                prose-headings:text-foreground
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground/90
                prose-p:mb-6
                prose-strong:text-foreground prose-strong:font-bold
                prose-blockquote:border-l-4 prose-blockquote:border-primary 
                prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-8
                prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary/5 prose-blockquote:to-transparent
                prose-blockquote:text-foreground/80 prose-blockquote:italic
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
                prose-ul:my-6 prose-li:my-2
                prose-li:marker:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share & Actions */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">Share this story:</span>
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-primary/10"
                    onClick={async () => {
                      // This will be executed on client side
                      if (typeof window !== 'undefined') {
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: post.title,
                              text: post.excerpt,
                              url: window.location.href,
                            })
                          } catch (err) {
                            console.log('Share cancelled')
                          }
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                          alert("Link copied to clipboard!")
                        }
                      }
                    }}
                  >
                    <Share2 size={18} />
                    Share
                  </Button>
                </div>
                
                <Link href="/blog">
                  <Button variant="ghost" className="gap-2 group">
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-primary/5 via-accent-purple/5 to-accent-sky/5">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  More Inspiring Stories
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover more transformative stories from our community
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.id}`}>
                    <div className="group bg-background rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 cursor-pointer border border-gray-200 dark:border-gray-800">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={getImageUrl(rp.image)}
                          alt={rp.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-foreground font-semibold">
                            {rp.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {rp.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {rp.excerpt}
                        </p>
                        <div className="flex items-center text-primary font-semibold text-sm mt-4 group-hover:translate-x-2 transition-transform">
                          Read Story
                          <ArrowLeft className="ml-2 rotate-180 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  )
}
