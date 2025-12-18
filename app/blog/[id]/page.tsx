import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Tag, ArrowLeft, Share2, Eye, Heart, Bookmark } from "lucide-react"
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

        {/* Hero Image with Gradient Overlay */}
        <div className="relative h-[70vh] min-h-[500px] mt-20">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent-purple/20 to-accent-sky/20 mix-blend-overlay" />
          
          <img 
            src={post.image || "/placeholder.svg"} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 right-0 pb-16 z-20">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <Badge
                  className="mb-6 px-4 py-2 text-sm font-semibold border-0 shadow-lg"
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
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance drop-shadow-lg">
                  {post.title}
                </h1>
                
                {/* Author & Date */}
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent-purple rounded-full flex items-center justify-center text-white font-semibold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <div className="flex items-center gap-4 text-sm opacity-80">
                        <span className="flex items-center gap-2">
                          <Calendar size={14} />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock size={14} />
                          {post.read_time}
                        </span>
                        <span className="flex items-center gap-2">
                          <Eye size={14} />
                          {post.views || 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="py-12 lg:py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Floating Action Bar */}
              <div className="sticky top-24 z-30 mb-12">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="ghost" className="flex items-center gap-2">
                      <Heart size={18} />
                      <span>Like</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="flex items-center gap-2">
                      <Bookmark size={18} />
                      <span>Save</span>
                    </Button>
                    <Button size="sm" variant="ghost" className="flex items-center gap-2">
                      <Share2 size={18} />
                      <span>Share</span>
                    </Button>
                  </div>
                  <Link href="/blog">
                    <Button variant="outline" className="font-accent font-semibold">
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Back to Blog
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-12">
                {post.tags?.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="px-4 py-2 text-sm bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Tag size={14} className="mr-2" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Article Body - Enhanced Styling */}
              <div className="prose prose-lg max-w-none mb-16
                prose-headings:font-serif 
                prose-headings:font-bold
                prose-headings:text-foreground
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground/90
                prose-p:mb-6
                prose-strong:text-foreground prose-strong:font-bold
                prose-em:text-foreground/80
                prose-blockquote:border-l-4 prose-blockquote:border-primary 
                prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-8
                prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary/5 prose-blockquote:to-transparent
                prose-blockquote:text-foreground/80
                prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
                prose-li:text-foreground/90 prose-li:my-2
                prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-8
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-table:border-collapse prose-table:w-full prose-table:my-8
                prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-4 prose-th:text-left
                prose-td:p-4 prose-td:border-t prose-td:border-gray-200 dark:prose-td:border-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author Box */}
              <div className="bg-gradient-to-r from-primary/5 to-accent-purple/5 rounded-3xl p-8 mb-16 border border-primary/20">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent-purple rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-2">About the Author</h3>
                    <p className="text-foreground/80 leading-relaxed mb-4">
                      <strong>{post.author}</strong> is a dedicated member of the KSSV team, committed to sharing stories of transformation and hope from Karungu.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Published on {formatDate(post.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-accent-sunny/20 to-accent-coral/20 rounded-3xl p-8 mb-16 text-center">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Inspired by this story?</h3>
                <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
                  Your support can help us create more success stories. Join us in our mission to empower survivors and transform communities.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-gradient-to-r from-primary to-accent-purple text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">
                    Support Our Work
                  </Button>
                  <Link href="/blog">
                    <Button variant="outline" className="px-8 py-3 rounded-xl">
                      Read More Stories
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts - Enhanced */}
        {relatedPosts.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900/50">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                    You Might Also Like
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover more inspiring stories from our community
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                      <div className="group cursor-pointer bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={relatedPost.image || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className={`shadow-lg font-semibold border-0 ${
                              relatedPost.category === "Community Impact"
                                ? "bg-accent-coral text-white"
                                : relatedPost.category === "Success Stories"
                                ? "bg-accent-sunny text-gray-900"
                                : relatedPost.category === "Legal Aid"
                                ? "bg-accent-purple text-white"
                                : "bg-primary text-white"
                            }`}>
                              {relatedPost.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{formatDate(relatedPost.date)}</span>
                            <span className="flex items-center gap-1">
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
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
