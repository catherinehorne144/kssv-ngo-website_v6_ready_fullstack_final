"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Tag, ArrowRight, Search, Sparkles, BookOpen, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import type { BlogPost } from "@/lib/types/database"
import Image from "next/image"

interface BlogClientPageProps {
  initialPosts: BlogPost[]
}

export default function BlogClientPage({ initialPosts }: BlogClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [blogPosts] = useState<BlogPost[]>(initialPosts)

  const categories = ["all", "Community Impact", "Success Stories", "Legal Aid", "Awareness", "News", "Programs"]

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Helper function to get local image
  const getLocalImage = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg"
    // If it's already a local path starting with /, use it directly
    if (imagePath.startsWith("/")) return imagePath
    // Otherwise, assume it's in the blog-images folder
    return `/blog-images/${imagePath}`
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section with Beautiful Gradient */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-primary/15 to-accent-sky/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.3)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.3)_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-primary font-accent text-sm font-semibold tracking-wider uppercase">
                  Blog & News
                </span>
                <Sparkles className="w-5 h-5 text-primary" />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
              Stories That{" "}
              <span className="bg-gradient-to-r from-accent-purple via-primary to-accent-sky bg-clip-text text-transparent">
                Transform
              </span>{" "}
              Lives
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed text-pretty max-w-3xl mx-auto mb-10">
              Inspiring journeys, impactful victories, and community stories from Karungu Survivors of Sexual Violence.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-primary mb-2">
                  <BookOpen className="w-8 h-8" />
                  <span>{blogPosts.length}+</span>
                </div>
                <p className="text-sm text-muted-foreground">Inspiring Stories</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-accent-purple mb-2">
                  <TrendingUp className="w-8 h-8" />
                  <span>95%</span>
                </div>
                <p className="text-sm text-muted-foreground">Positive Impact</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-accent-sky mb-2">
                  <Users className="w-8 h-8" />
                  <span>500+</span>
                </div>
                <p className="text-sm text-muted-foreground">Lives Changed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 lg:py-24 bg-background relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8">
          {/* Search and Filter - Enhanced */}
          <div className="max-w-6xl mx-auto mb-16 space-y-8">
            {/* Featured Articles Banner */}
            <div className="bg-gradient-to-r from-accent-sunny/20 to-accent-coral/20 rounded-2xl p-6 border border-accent-sunny/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">✨ Featured Stories</h3>
                  <p className="text-muted-foreground">Read our most impactful articles this month</p>
                </div>
                <Badge className="bg-accent-sunny text-gray-900 font-semibold px-4 py-2">
                  Hot 🔥
                </Badge>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent-purple to-accent-sky rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={22} />
                <Input
                  type="search"
                  placeholder="Search stories, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:border-primary"
                />
              </div>
            </div>

            {/* Category Filter - Beautiful Cards */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-3 rounded-xl font-accent font-semibold capitalize transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/30"
                      : "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-foreground hover:border-primary/50"
                  }`}
                >
                  {category === "all" ? "📚 All Stories" : category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid - Enhanced */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer h-full border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:-translate-y-2">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent-purple/10 to-accent-sky/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                    
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                      <Image
                        src={getLocalImage(post.image)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <Badge className={`shadow-lg font-semibold border-0 ${
                          post.category === "Community Impact"
                            ? "bg-accent-coral text-white"
                            : post.category === "Success Stories"
                            ? "bg-accent-sunny text-gray-900"
                            : post.category === "Legal Aid"
                            ? "bg-accent-purple text-white"
                            : post.category === "Awareness"
                            ? "bg-accent-sky text-white"
                            : "bg-primary text-white"
                        }`}>
                          {post.category}
                        </Badge>
                      </div>
                      
                      {/* Read Time */}
                      <div className="absolute bottom-4 right-4 z-20 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                        <Clock size={12} />
                        {post.read_time}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 relative z-10">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar size={14} className="text-primary" />
                        <time dateTime={post.date} className="font-medium">
                          {formatDate(post.date)}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                          >
                            <Tag size={12} className="mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Read More Button */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-sm text-muted-foreground">By {post.author}</span>
                        <div className="flex items-center text-primary font-accent font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                          Read Story
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent-purple to-accent-sky transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 max-w-2xl mx-auto">
              <div className="inline-block p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl mb-8">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">No Stories Found</h3>
                <p className="text-muted-foreground mb-6">Try searching with different keywords or browse all categories</p>
                <Button 
                  onClick={() => setSearchQuery("")} 
                  className="bg-gradient-to-r from-primary to-accent-purple text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Show All Stories
                </Button>
              </div>
            </div>
          )}

          {/* Empty State Message */}
          {filteredPosts.length === 0 && blogPosts.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground">
                Showing {filteredPosts.length} of {blogPosts.length} stories
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent-purple/10 to-accent-sky/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Stay Updated with Our Journey
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Subscribe to receive inspiring stories, impact updates, and news about our community transformation.
            </p>
            <div className="flex max-w-md mx-auto gap-4">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              />
              <Button className="bg-gradient-to-r from-primary to-accent-purple text-white px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all">
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
