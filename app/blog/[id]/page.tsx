import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getBlogPost, getBlogPosts } from "@/lib/blog-data"

export async function generateStaticParams() {
  const posts = await getBlogPosts('published')
  return posts.map((post) => ({
    id: post.id,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.id)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const baseUrl = "https://karungussv.vercel.app"
  const postUrl = `${baseUrl}/blog/${post.id}`

  return {
    title: `${post.title} | KSSV Blog`,
    description: post.excerpt,
    keywords: [...post.tags, post.category, "KSSV", "sexual violence", "survivor support", "Kenya NGO"],
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: "Karungu Survivors of Sexual Violence",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.image || `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/jpeg",
        },
      ],
      siteName: "KSSV",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image || `${baseUrl}/og-image.png`],
      creator: "@karungusurvivors",
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id)

  if (!post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Get related posts
  const allPosts = await getBlogPosts('published')
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3)

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://karungussv.vercel.app/blog/${post.id}`,
    headline: post.title,
    description: post.excerpt,
    image: {
      "@type": "ImageObject",
      url: post.image || "https://karungussv.vercel.app/og-image.png",
      width: 1200,
      height: 630,
    },
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://karungussv.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "Karungu Survivors of Sexual Violence",
      logo: {
        "@type": "ImageObject",
        url: "https://karungussv.vercel.app/icon-512.png",
        width: 512,
        height: 512,
      },
      url: "https://karungussv.vercel.app",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://karungussv.vercel.app/blog/${post.id}`,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    articleBody: post.content.replace(/<[^>]*>/g, ""),
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.read_time.split(' ')[0]}M`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
  }

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://karungussv.vercel.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://karungussv.vercel.app/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://karungussv.vercel.app/blog/${post.id}`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <main className="min-h-screen">
        <Navigation />

        {/* Hero Image */}
        <div className="relative h-[60vh] min-h-[400px] mt-20">
          <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 pb-12">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <Badge
                  className="mb-4 text-white shadow-lg"
                  style={{
                    backgroundColor:
                      post.category === "Community Impact"
                        ? "var(--accent-coral)"
                        : post.category === "Success Stories"
                          ? "var(--accent-sunny)"
                          : post.category === "Legal Aid"
                            ? "var(--accent-purple)"
                            : post.category === "Awareness"
                              ? "var(--accent-sky)"
                              : post.category === "News"
                                ? "var(--primary)"
                                : "var(--secondary)",
                  }}
                >
                  {post.category}
                </Badge>
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                  {post.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.read_time}</span>
                </div>
                <div>
                  By <span itemProp="author">{post.author}</span>
                </div>
                <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
                style={{
                  color: "hsl(var(--foreground))",
                }}
              />

              {/* Back to Blog */}
              <div className="pt-8 border-t">
                <Link href="/blog">
                  <Button variant="outline" className="font-accent font-semibold bg-transparent">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-accent-sunny/10 via-background to-accent-purple/10">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative h-48 overflow-hidden rounded-lg mb-4">
                          <img
                            src={relatedPost.image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <Badge className="mb-2" variant="secondary">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="font-serif text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  )
}