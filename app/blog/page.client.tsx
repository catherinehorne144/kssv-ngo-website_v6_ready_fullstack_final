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
      "Community Impact": "from-accent-sky to-primary",
      "Success Stories": "from-accent-sunny to-accent-coral",
      "Legal Aid": "from-accent-purple to-secondary",
      "Awareness": "from-primary to-accent-sky",
      "News": "from-accent-coral to-accent-sunny",
      "Programs": "from-secondary to-accent-purple",
    }
    return colors[category as keyof typeof colors] || "from-primary to-accent-purple"
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section - More Compact */}
      <section className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent-purple/5 to-accent-sky/5" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary font-medium text-xs tracking-wider uppercase">
                KSSV Stories
              </span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl lg:text-4.5xl font-bold text-foreground mb-3 leading-tight">
              Stories of{" "}
              <span className="bg-gradient-to-r from-accent-coral via-accent-sunny to-primary bg-clip-text text-transparent">
                Hope & Strength
              </span>
            </h1>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Inspiring journeys of resilience and community transformation.
            </p>

            {/* Stats - More Compact */}
            <div className="flex justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-primary mb-1">{blogPosts.length}+</div>
                <p className="text-xs text-muted-foreground">Stories</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-accent-purple mb-1">95%</div>
                <p className="text-xs text-muted-foreground">Impact</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-accent-coral mb-1">500+</div>
                <p className="text-xs text-muted-foreground">Lives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Search and Filter - Ultra Compact */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="search"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-2.5 rounded-lg border bg-card text-sm"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10"
              >
                <Filter size={14} className="mr-2" />
                Filters
              </Button>
            </div>

            {/* Category Filter - Collapsible */}
            {showFilters && (
              <div className="mb-6 animate-in fade-in duration-200">
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-md font-medium text-xs transition-all ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-primary to-accent-purple text-white shadow-sm"
                          : "bg-card border text-foreground hover:border-primary/30"
                      }`}
                    >
                      {category === "all" ? "All" : category.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blog Posts Grid - More Compact */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full border border-border bg-card hover:-translate-y-0.5">
                    {/* Image Container */}
                    <div className="relative h-44 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-t ${getCategoryColor(post.category)} opacity-20`} />
                      <Image
                        src={getImageUrl(post.image)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-400"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <Badge className={`shadow-xs font-medium text-xs border-0 bg-card/90 backdrop-blur-sm text-foreground`}>
                          {post.category.split(" ")[0]}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Date & Read Time */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(post.date)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {post.read_time}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-sans text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-xs text-muted-foreground"
                            >
                              <Tag size={9} />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-muted-foreground px-1.5 py-0.5">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Read More Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">By {post.author}</span>
                        <div className="flex items-center text-primary font-medium text-xs group-hover:translate-x-1 transition-transform">
                          Read
                          <ArrowRight className="ml-1 w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 max-w-md mx-auto">
              <div className="inline-block p-5 bg-card rounded-xl shadow-sm mb-5">
                <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-sans text-lg font-semibold text-foreground mb-1.5">No Stories Found</h3>
                <p className="text-muted-foreground text-sm mb-3">Try different keywords or browse all categories</p>
                <Button 
                  onClick={() => setSearchQuery("")} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Results Count */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground">
                Showing {filteredPosts.length} of {blogPosts.length} stories
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-8 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-sm mx-auto text-center">
            <h2 className="font-serif text-lg font-bold text-foreground mb-2">
              Stay Connected
            </h2>
            <p className="text-muted-foreground text-xs mb-3">
              Subscribe for updates on new stories and community impact.
            </p>
            <div className="flex gap-1.5">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 py-2 text-sm h-9"
              />
              <Button size="sm" className="h-9 py-0">
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
