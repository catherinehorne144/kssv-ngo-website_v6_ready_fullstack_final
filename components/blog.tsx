"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Tag, ArrowRight, Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useScrollReveal } from "@/lib/scroll-reveal"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  date: string
  readTime: string
  image: string
}

export function Blog() {
  useScrollReveal()
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Breaking the Silence: How Community Dialogues Are Changing Attitudes",
      excerpt:
        "Discover how our community dialogue sessions are challenging harmful norms and creating safe spaces for conversations about sexual violence prevention.",
      content: `
        <p>In the heart of Karungu, something remarkable is happening. Community members who once remained silent about sexual violence are now speaking up, challenging harmful norms, and creating lasting change.</p>
        
        <h3>The Power of Dialogue</h3>
        <p>Our community dialogue sessions bring together diverse groups—elders, youth, religious leaders, and survivors—to discuss the root causes of sexual violence and explore solutions together. These conversations are not easy, but they are essential.</p>
        
        <h3>Changing Mindsets</h3>
        <p>Through these dialogues, we've witnessed significant shifts in attitudes. Community members are beginning to understand that sexual violence is not a private matter but a community issue that requires collective action. They're learning about consent, gender equality, and the importance of supporting survivors.</p>
        
        <h3>Real Impact</h3>
        <p>The results speak for themselves: increased reporting of cases, more community members willing to testify as witnesses, and a growing network of community champions who are spreading awareness in their neighborhoods.</p>
        
        <p>This is just the beginning. As we continue these dialogues, we're building a community where sexual violence is no longer tolerated, and survivors are supported with dignity and respect.</p>
      `,
      category: "Community Impact",
      tags: ["Prevention", "Community Engagement", "Awareness"],
      author: "KSSV Team",
      date: "2025-01-15",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "2",
      title: "From Survivor to Entrepreneur: Success Stories from Our VSLA Program",
      excerpt:
        "Meet the inspiring women who have transformed their lives through our Village Savings and Loan Association program.",
      content: `
        <p>Economic empowerment is a crucial part of healing and recovery for survivors of sexual violence. Our VSLA program has helped dozens of women achieve financial independence and rebuild their lives with dignity.</p>
        
        <h3>The VSLA Model</h3>
        <p>Village Savings and Loan Associations are community-based financial groups where members save together, access loans, and support each other's business ventures. It's more than just money—it's about building confidence, skills, and community.</p>
        
        <h3>Success Stories</h3>
        <p>One member started with just KES 500 in savings. Today, she runs a successful tailoring business that supports her family and employs two other women. Another member used her VSLA loan to start a vegetable stand at the local market, and her business has grown steadily over the past year.</p>
        
        <h3>Beyond Business</h3>
        <p>The impact goes beyond financial gains. VSLA members report increased self-esteem, stronger social networks, and a renewed sense of purpose. They're not just surviving—they're thriving.</p>
        
        <p>These success stories inspire us to continue expanding our economic empowerment programs, knowing that financial independence is a powerful tool for healing and transformation.</p>
      `,
      category: "Success Stories",
      tags: ["Economic Empowerment", "VSLA", "Women's Empowerment"],
      author: "Sarah Otieno",
      date: "2025-01-08",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "3",
      title: "Legal Victory: Landmark Conviction Sends Strong Message",
      excerpt:
        "A recent court victory demonstrates the power of comprehensive legal support and the importance of survivor-centered justice.",
      content: `
        <p>Last month, our legal team secured a landmark conviction in a sexual violence case that had been pending for over two years. This victory represents not just justice for one survivor, but hope for many others.</p>
        
        <h3>The Journey to Justice</h3>
        <p>The path to justice is rarely straightforward. This case involved extensive evidence gathering, multiple court appearances, and unwavering support for the survivor throughout the process. Our legal team provided free representation, court accompaniment, and psychosocial support every step of the way.</p>
        
        <h3>Survivor-Centered Approach</h3>
        <p>What made this case successful was our commitment to putting the survivor's needs first. We ensured she had access to counseling, protected her privacy, and empowered her to make informed decisions about her case. She was never alone in the courtroom.</p>
        
        <h3>Broader Impact</h3>
        <p>This conviction sends a powerful message to the community: sexual violence will not be tolerated, and perpetrators will be held accountable. It also demonstrates that survivors can find justice when they have the right support.</p>
        
        <p>We're committed to continuing this work, ensuring that every survivor who seeks justice has access to quality legal representation and comprehensive support.</p>
      `,
      category: "Legal Aid",
      tags: ["Justice", "Legal Support", "Advocacy"],
      author: "Legal Team",
      date: "2024-12-20",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1589391886085-8b6b3acb3a8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "4",
      title: "World Day Against Sexual Violence: Our Commitment to Survivors",
      excerpt:
        "On this important day, we reflect on our work, honor survivors' courage, and renew our commitment to ending sexual violence.",
      content: `
        <p>Today, we join the global community in observing the World Day Against Sexual Violence. It's a day to honor survivors, raise awareness, and recommit ourselves to the fight against sexual violence.</p>
        
        <h3>Honoring Survivors</h3>
        <p>We stand in solidarity with survivors everywhere. Your courage inspires us daily. Your resilience drives our work. Your voices matter, and we are committed to amplifying them.</p>
        
        <h3>Our Progress</h3>
        <p>Since our founding in 2021, we've supported over 500 survivors, secured 15 convictions, and empowered dozens of women through our economic programs. But we know there's still much work to be done.</p>
        
        <h3>Looking Forward</h3>
        <p>This year, we're expanding our services, launching new prevention programs, and strengthening our partnerships. We're committed to creating a community where sexual violence is eliminated and survivors are empowered.</p>
        
        <p>Join us in this important work. Whether through volunteering, donating, or simply spreading awareness, you can make a difference. Together, we can break the silence and end the violence.</p>
      `,
      category: "Awareness",
      tags: ["Advocacy", "Awareness", "Global Solidarity"],
      author: "KSSV Team",
      date: "2024-11-25",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "5",
      title: "New Partnership Announcement: Expanding Our Reach",
      excerpt:
        "We're excited to announce a new partnership that will help us expand our services and reach more survivors across Migori County.",
      content: `
        <p>We're thrilled to announce a new partnership with the Migori County Government and several local organizations to expand our services and reach more survivors of sexual violence.</p>
        
        <h3>What This Means</h3>
        <p>This partnership will enable us to open two new counseling centers, train additional paralegals, and launch mobile legal aid clinics that will serve remote communities. We'll also be able to expand our VSLA program to reach 100 more women.</p>
        
        <h3>Collaborative Approach</h3>
        <p>This partnership exemplifies the power of collaboration. By working together with government, civil society, and community organizations, we can create a comprehensive support system for survivors.</p>
        
        <h3>Timeline</h3>
        <p>The expansion will begin in March 2025, with the first counseling center opening in Karungu Town. Mobile legal aid clinics will launch in June, serving five sub-counties across Migori.</p>
        
        <p>We're grateful to our partners for their commitment to this important work, and we look forward to the positive impact this expansion will have on survivors and communities across the region.</p>
      `,
      category: "News",
      tags: ["Partnership", "Expansion", "Collaboration"],
      author: "KSSV Team",
      date: "2024-11-10",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "6",
      title: "Training the Next Generation: Youth Mentorship Program Launch",
      excerpt:
        "Our new youth mentorship program aims to empower young people with the knowledge and skills to prevent sexual violence.",
      content: `
        <p>We're excited to announce the launch of our Youth Empowerment & Mentorship Program, designed to equip young people aged 15-24 with life skills, knowledge about consent and healthy relationships, and leadership abilities.</p>
        
        <h3>Why Youth?</h3>
        <p>Young people are both vulnerable to sexual violence and powerful agents of change. By investing in youth education and empowerment, we can prevent violence before it occurs and build a generation of leaders committed to gender equality.</p>
        
        <h3>Program Components</h3>
        <p>The program includes weekly mentorship sessions, life skills training, peer support groups, and leadership development opportunities. We'll also create safe spaces where young people can discuss issues affecting them without judgment.</p>
        
        <h3>Mentor Training</h3>
        <p>We're currently training 20 youth mentors who will lead the program. These mentors come from the community and have been carefully selected for their commitment to youth empowerment and gender equality.</p>
        
        <p>We believe this program will have a lasting impact, creating a ripple effect of positive change that extends far beyond the participants themselves.</p>
      `,
      category: "Programs",
      tags: ["Youth", "Prevention", "Mentorship"],
      author: "Programs Team",
      date: "2024-10-28",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ]

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

  return (
    <>
      <section id="blog" className="py-20 lg:py-32 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent-purple/5 to-accent-sky/5" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="max-w-4xl mx-auto text-center mb-16 reveal">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary font-accent text-sm font-semibold tracking-wider uppercase">Blog & News</span>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-8 text-balance leading-tight">
              Stories That{" "}
              <span className="bg-gradient-to-r from-accent-purple via-primary to-accent-sky bg-clip-text text-transparent">
                Inspire Change
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
              Discover powerful stories of transformation, resilience, and hope from the KSSV community.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-16 space-y-8 reveal">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent-purple to-accent-sky rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={22} />
                <Input
                  type="search"
                  placeholder="Search inspiring stories and articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:border-primary"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
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

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 reveal group cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedPost(post)}
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent-purple/10 to-accent-sky/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className={`shadow-lg font-semibold border-0 ${
                        post.category === "Community Impact"
                          ? "bg-accent-coral text-white"
                          : post.category === "Success Stories"
                          ? "bg-accent-sunny text-gray-900"
                          : post.category === "Legal Aid"
                          ? "bg-accent-purple text-white"
                          : post.category === "Awareness"
                          ? "bg-accent-sky text-white"
                          : post.category === "News"
                          ? "bg-primary text-white"
                          : "bg-gray-700 text-white"
                      }`}>
                        {post.category}
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-4 right-4 z-10 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                      <Clock size={12} />
                      {post.readTime}
                    </div>
                  </div>

                  <div className="p-7 relative z-10">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-4">No stories found matching your search.</p>
              <Button 
                onClick={() => setSearchQuery("")} 
                className="bg-gradient-to-r from-primary to-accent-purple text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Show All Stories
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Blog Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-0">
          {selectedPost && (
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              {/* Hero Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={selectedPost.image || "/placeholder.svg"}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Badge className={`shadow-lg font-semibold border-0 px-4 py-2 ${
                    selectedPost.category === "Community Impact"
                      ? "bg-accent-coral text-white"
                      : selectedPost.category === "Success Stories"
                      ? "bg-accent-sunny text-gray-900"
                      : selectedPost.category === "Legal Aid"
                      ? "bg-accent-purple text-white"
                      : selectedPost.category === "Awareness"
                      ? "bg-accent-sky text-white"
                      : "bg-primary text-white"
                  }`}>
                    {selectedPost.category}
                  </Badge>
                </div>
              </div>

              <div className="p-8">
                <DialogHeader>
                  <DialogTitle className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
                    {selectedPost.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                    <Calendar size={16} className="text-primary" />
                    <span>{formatDate(selectedPost.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                    <Clock size={16} className="text-primary" />
                    <span>{selectedPost.readTime}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
                    👤 By {selectedPost.author}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  {selectedPost.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2">
                      <Tag size={14} className="mr-2" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div
                  className="prose prose-lg max-w-none mb-8
                    prose-headings:font-serif 
                    prose-headings:font-bold
                    prose-headings:text-foreground
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground/90
                    prose-p:mb-6
                    prose-strong:text-foreground prose-strong:font-bold
                    prose-blockquote:border-l-4 prose-blockquote:border-primary 
                    prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-8
                    prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary/5 prose-blockquote:to-transparent
                    prose-blockquote:text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => setSelectedPost(null)} 
                      className="flex-1 bg-gradient-to-r from-primary to-accent-purple text-white hover:shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      Close Story
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
