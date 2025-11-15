import { AdminHeader } from "@/components/admin/header"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Users, Handshake, MessageSquare, Quote, FileText, FolderKanban, DollarSign, ImageIcon, Target } from "lucide-react" // ← ADD TARGET IMPORT

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: volunteersCount },
    { count: partnersCount },
    { count: messagesCount },
    { count: testimonialsCount },
    { count: blogPostsCount },
    { count: projectsCount },
    { count: programsCount }, // ← ADD THIS LINE
    { count: donationsCount },
    { count: carouselCount },
  ] = await Promise.all([
    supabase.from("volunteers").select("*", { count: "exact", head: true }),
    supabase.from("partners").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("blog").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("programs").select("*", { count: "exact", head: true }), // ← ADD THIS LINE
    supabase.from("donations").select("*", { count: "exact", head: true }),
    supabase.from("carousel_images").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { name: "Volunteers", value: volunteersCount || 0, icon: Users, color: "text-blue-500" },
    { name: "Partners", value: partnersCount || 0, icon: Handshake, color: "text-purple-500" },
    { name: "Messages", value: messagesCount || 0, icon: MessageSquare, color: "text-orange-500" },
    { name: "Testimonials", value: testimonialsCount || 0, icon: Quote, color: "text-pink-500" },
    { name: "Blog Posts", value: blogPostsCount || 0, icon: FileText, color: "text-indigo-500" },
    { name: "Projects", value: projectsCount || 0, icon: FolderKanban, color: "text-teal-500" },
    { name: "Programs", value: programsCount || 0, icon: Target, color: "text-red-500" }, // ← ADD THIS LINE
    { name: "Donations", value: donationsCount || 0, icon: DollarSign, color: "text-emerald-500" },
    { name: "Carousel", value: carouselCount || 0, icon: ImageIcon, color: "text-cyan-500" },
  ]

  return (
    <>
      <AdminHeader title="Dashboard" description="Overview of your KSSV website content and data" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.name}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">New volunteer application</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">New contact message received</p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-foreground font-medium">New testimonial submitted</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/admin/blog"
                className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
              >
                <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">New Blog Post</p>
              </a>
              <a
                href="/admin/projects"
                className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
              >
                <FolderKanban className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">New Project</p>
              </a>
              <a
                href="/admin/testimonials"
                className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
              >
                <Quote className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Review Testimonials</p>
              </a>
              <a
                href="/admin/messages"
                className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-center"
              >
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">View Messages</p>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}