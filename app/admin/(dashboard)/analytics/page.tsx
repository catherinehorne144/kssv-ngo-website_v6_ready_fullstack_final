"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, MessageSquare } from "lucide-react"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    volunteers: { total: 0, approved: 0, pending: 0, rejected: 0 },
    partners: { total: 0 },
    messages: { total: 0, replied: 0, pending: 0 },
    testimonials: { total: 0, approved: 0, pending: 0 },
    blog: { total: 0, published: 0, drafts: 0 },
    projects: { total: 0, active: 0, completed: 0 },
    donations: { total: 0, amount: 0 },
  })

  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setIsLoading(true)

    const [volunteersData, partnersData, messagesData, testimonialsData, blogData, projectsData, donationsData] =
      await Promise.all([
        supabase.from("volunteers").select("status"),
        supabase.from("partners").select("id"),
        supabase.from("messages").select("replied"),
        supabase.from("testimonials").select("approved"),
        supabase.from("blog").select("status"),
        supabase.from("projects").select("status"),
        supabase.from("donations").select("amount"),
      ])

    // Process volunteers
    const volunteers = {
      total: volunteersData.data?.length || 0,
      approved: volunteersData.data?.filter((v) => v.status === "approved").length || 0,
      pending: volunteersData.data?.filter((v) => v.status === "pending").length || 0,
      rejected: volunteersData.data?.filter((v) => v.status === "rejected").length || 0,
    }

    // Process partners
    const partners = {
      total: partnersData.data?.length || 0,
    }

    // Process messages
    const messages = {
      total: messagesData.data?.length || 0,
      replied: messagesData.data?.filter((m) => m.replied).length || 0,
      pending: messagesData.data?.filter((m) => !m.replied).length || 0,
    }

    // Process testimonials
    const testimonials = {
      total: testimonialsData.data?.length || 0,
      approved: testimonialsData.data?.filter((t) => t.approved).length || 0,
      pending: testimonialsData.data?.filter((t) => !t.approved).length || 0,
    }

    // Process blog
    const blog = {
      total: blogData.data?.length || 0,
      published: blogData.data?.filter((b) => b.status === "published").length || 0,
      drafts: blogData.data?.filter((b) => b.status === "draft").length || 0,
    }

    // Process projects
    const projects = {
      total: projectsData.data?.length || 0,
      active: projectsData.data?.filter((p) => p.status === "active").length || 0,
      completed: projectsData.data?.filter((p) => p.status === "completed").length || 0,
    }

    // Process donations
    const donations = {
      total: donationsData.data?.length || 0,
      amount: donationsData.data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0,
    }

    setAnalytics({
      volunteers,
      partners,
      messages,
      testimonials,
      blog,
      projects,
      donations,
    })

    setIsLoading(false)
  }

  // Chart data
  const engagementData = [
    { name: "Volunteers", value: analytics.volunteers.total },
    { name: "Partners", value: analytics.partners.total },
  ]

  const statusData = [
    { name: "Volunteers", approved: analytics.volunteers.approved, pending: analytics.volunteers.pending },
    { name: "Messages", approved: analytics.messages.replied, pending: analytics.messages.pending },
  ]

  const contentData = [
    { name: "Blog Posts", published: analytics.blog.published, drafts: analytics.blog.drafts },
    { name: "Testimonials", published: analytics.testimonials.approved, drafts: analytics.testimonials.pending },
    {
      name: "Projects",
      published: analytics.projects.active,
      drafts: analytics.projects.total - analytics.projects.active,
    },
  ]

  const COLORS = ["#0FA3A3", "#7FC79E", "#FF6B9D", "#FFB84D"]

  return (
    <>
      <AdminHeader title="Analytics" description="Insights and statistics about your website" />

      <div className="p-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading analytics...</p>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Total Engagement</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {analytics.volunteers.total + analytics.partners.total}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Volunteers & Partners</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Total Donations</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  KES {analytics.donations.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">{analytics.donations.total} donations received</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Published Content</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {analytics.blog.published + analytics.testimonials.approved + analytics.projects.active}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Blog, Testimonials & Projects</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  {analytics.messages.pending > 0 ? (
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">Pending Messages</p>
                <p className="text-3xl font-bold text-foreground mt-2">{analytics.messages.pending}</p>
                <p className="text-xs text-muted-foreground mt-2">{analytics.messages.total} total messages</p>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">Community Engagement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">Application Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#0FA3A3" name="Approved/Replied" />
                    <Bar dataKey="pending" fill="#FFB84D" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">Content Publishing Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="published" fill="#7FC79E" name="Published" />
                    <Bar dataKey="drafts" fill="#E0E0E0" name="Drafts/Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-serif text-lg font-bold text-foreground mb-6">Summary Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">Total Volunteers</span>
                    <span className="font-semibold text-foreground">{analytics.volunteers.total}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">Total Messages</span>
                    <span className="font-semibold text-foreground">{analytics.messages.total}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-sm text-muted-foreground">Total Projects</span>
                    <span className="font-semibold text-foreground">{analytics.projects.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Testimonials</span>
                    <span className="font-semibold text-foreground">{analytics.testimonials.total}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Pending Actions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volunteer Applications</span>
                    <Badge variant="secondary">{analytics.volunteers.pending}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Testimonials to Review</span>
                    <Badge variant="secondary">{analytics.testimonials.pending}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Messages to Reply</span>
                    <Badge variant="secondary">{analytics.messages.pending}</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Content Overview</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Published Blog Posts</span>
                    <Badge>{analytics.blog.published}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Draft Posts</span>
                    <Badge variant="outline">{analytics.blog.drafts}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Projects</span>
                    <Badge>{analytics.projects.active}</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-foreground mb-4">Donation Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Donations</span>
                    <Badge variant="default">{analytics.donations.total}</Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <p className="text-xl font-bold text-foreground mt-1">
                      KES {analytics.donations.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
