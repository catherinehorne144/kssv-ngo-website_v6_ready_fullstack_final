"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Tag, ArrowRight, Search, Sparkles, BookOpen, TrendingUp, Users, Filter } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/lib/types/database"
import Image from "next/image"

interface BlogClientPageProps {
  initialPosts: BlogPost[]
}

export default function BlogClientPage({ initialPosts }: BlogClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [blogPosts] = useState<BlogPost[]>(initialPosts)

  const categories = ["all", "Community Impact", "Success Stories", "Legal Aid", "Awareness", "News", "Programs"]

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg"
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/')) return imagePath
    return `/blog-images/${imagePath}`
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Community Impact": "from-blue-500 to-cyan-500",
      "Success Stories": "from-emerald-500 to-green-500",
      "Legal Aid": "from-violet-500 to-purple-500",
      "Awareness": "from-amber-500 to-orange-500",
      "News": "from-rose-500 to-pink-500",
      "Programs": "from-indigo-500 to-blue-600",
    }
    return colors[category as keyof typeof colors] || "from-primary to-accent-purple"
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section - More Compact */}
      <section className="pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent-purple/5 to-accent-sky/5" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium text-sm tracking-wider uppercase">
                KSSV Stories
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Voices of{" "}
              <span className="bg-gradient-to-r from-primary via-accent-purple to-accent-sky bg-clip-text text-transparent">
                Resilience
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Inspiring stories of transformation, hope, and community impact from survivors and advocates.
            </p>

            {/* Stats - More Compact */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{blogPosts.length}+</div>
                <p className="text-xs text-muted-foreground">Stories</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-purple mb-1">95%</div>
                <p className="text-xs text-muted-foreground">Impact</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-sky mb-1">500+</div>
                <p className="text-xs text-muted-foreground">Lives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Search and Filter - Compact */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="search"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-3 rounded-xl border bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                />
              </div>
              <Button 
                variant="outline" 
                className="md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="mr-2" />
                Categories
              </Button>
            </div>

            {/* Category Filter - Collapsible */}
            {showFilters && (
              <div className="mb-8 animate-in fade-in duration-300">
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-primary to-accent-purple text-white shadow-md"
                          : "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {category === "all" ? "All Stories" : category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blog Posts Grid - More Compact */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:-translate-y-1">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(post.category)} opacity-10`} />
                      <Image
                        src={getImageUrl(post.image)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={`shadow-sm font-medium text-xs border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-gray-200`}>
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Date & Read Time */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.read_time}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-sans text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-muted-foreground"
                            >
                              <Tag size={10} />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground px-2 py-1">
                              +{post.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Read More Button */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs text-muted-foreground">By {post.author}</span>
                        <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                          Read
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 max-w-md mx-auto">
              <div className="inline-block p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-sm mb-6">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sans text-xl font-bold text-foreground mb-2">No Stories Found</h3>
                <p className="text-muted-foreground text-sm mb-4">Try different keywords or browse all categories</p>
                <Button 
                  onClick={() => setSearchQuery("")} 
                  variant="outline" 
                  className="w-full"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Results Count */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Showing {filteredPosts.length} of {blogPosts.length} stories
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-12 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-md mx-auto text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
              Stay Connected
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Subscribe for updates on new stories and community impact.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 py-2.5 text-sm"
              />
              <Button size="sm" className="py-2.5">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
