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

// ✅ Public anon Supabase client (NO cookies)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

  const imageUrl = post.image
    ? `${BASE_URL}${post.image}`
    : `${BASE_URL}/og-image.png`

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
          url: imageUrl,
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
      images: [imageUrl],
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
    .select("id, title, excerpt, image")
    .eq("status", "published")
    .neq("id", post.id)
    .limit(3)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image
      ? `${BASE_URL}${post.image}`
      : `${BASE_URL}/og-image.png`,
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

        <div className="relative h-[70vh] min-h-[500px] mt-20">
          <Image
            src={post.image || "/og-image.png"}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <article className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Badge className="mb-4">{post.category}</Badge>

            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex gap-6 text-muted-foreground mb-10">
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
                {post.views || 0}
              </span>
            </div>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="flex flex-wrap gap-3 mt-12">
              {post.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  <Tag size={12} className="mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-16">
              <Link href="/blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {relatedPosts && relatedPosts.length > 0 && (
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="font-serif text-3xl font-bold mb-10 text-center">
                Related Stories
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.id}`}>
                    <div className="bg-background rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={rp.image || "/og-image.png"}
                          alt={rp.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif font-bold line-clamp-2">
                          {rp.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                          {rp.excerpt}
                        </p>
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
