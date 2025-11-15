"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Tag, ArrowRight, Search } from "lucide-react"
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
      image: "/community-dialogue-meeting.jpg",
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
      image: "/vsla-success-story.jpg",
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
      image: "/legal-victory-justice.jpg",
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
      image: "/awareness-campaign-event.jpg",
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
      image: "/partnership-announcement.jpg",
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
      image: "/youth-program-launch.jpg",
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
      <section id="blog" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 reveal">
            <span className="text-primary font-accent text-sm font-semibold tracking-wider uppercase">Blog & News</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              Stories, Updates & Insights
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              Stay informed about our work, read success stories, and learn about the issues affecting our community.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12 space-y-6 reveal">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="search"
                placeholder="Search articles by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="font-accent font-semibold capitalize"
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-xl transition-all reveal group cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">{post.category}</Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full group-hover:text-primary transition-colors font-accent font-semibold p-0 h-auto"
                    >
                      Read More <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
              <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4">
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Blog Post Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPost && (
            <>
              <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden">
                <img
                  src={selectedPost.image || "/placeholder.svg"}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <Badge className="bg-primary text-primary-foreground">{selectedPost.category}</Badge>
                </div>
              </div>

              <DialogHeader>
                <DialogTitle className="font-serif text-3xl font-bold leading-tight">{selectedPost.title}</DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(selectedPost.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{selectedPost.readTime}</span>
                </div>
                <div>By {selectedPost.author}</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                style={{
                  color: "hsl(var(--foreground))",
                }}
              />

              <div className="mt-8 pt-6 border-t">
                <Button onClick={() => setSelectedPost(null)} className="w-full font-accent font-semibold">
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
