"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { BlogPost } from "@/lib/types/database"
import { format } from "date-fns"
import { Plus, Calendar, Clock, Tag } from "lucide-react"
import dynamic from 'next/dynamic'

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('@/components/admin/rich-text-editor'), {
  ssr: false,
  loading: () => <div className="h-64 border rounded-lg flex items-center justify-center">Loading editor...</div>
})

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    category: "Community Impact",
    tags: [] as string[],
    author: "KSSV Team",
    date: new Date().toISOString().split('T')[0],
    read_time: "5 min read",
    image: "",
    status: "draft" as "draft" | "published",
  })

  const [tagInput, setTagInput] = useState("")

  const categories = [
    "Community Impact",
    "Success Stories", 
    "Legal Aid",
    "Awareness",
    "News",
    "Programs"
  ]

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("blog").select("*").order("date", { ascending: false })

    if (!error && data) {
      setPosts(data)
    }
    setIsLoading(false)
  }

  const handleCreate = () => {
    setFormData({
      id: "",
      title: "",
      excerpt: "",
      content: "",
      category: "Community Impact",
      tags: [],
      author: "KSSV Team",
      date: new Date().toISOString().split('T')[0],
      read_time: "5 min read",
      image: "",
      status: "draft",
    })
    setTagInput("")
    setIsCreating(true)
  }

  const handleEdit = (post: BlogPost) => {
    setFormData({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags || [],
      author: post.author,
      date: post.date.split('T')[0],
      read_time: post.read_time,
      image: post.image || "",
      status: post.status,
    })
    setTagInput("")
    setIsEditing(true)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required")
      return
    }

    const postData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      author: formData.author,
      date: new Date(formData.date).toISOString(),
      read_time: formData.read_time,
      image: formData.image || null,
      status: formData.status,
    }

    try {
      if (isCreating) {
        const { error } = await supabase.from("blog").insert([postData])

        if (error) throw error
        fetchPosts()
        setIsCreating(false)
      } else if (isEditing) {
        const { error } = await supabase
          .from("blog")
          .update(postData)
          .eq("id", formData.id)

        if (error) throw error
        fetchPosts()
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Error saving blog post. Please try again.")
    }
  }

  const handleDelete = async (post: BlogPost) => {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      const { error } = await supabase.from("blog").delete().eq("id", post.id)

      if (!error) {
        fetchPosts()
      } else {
        alert("Error deleting post. Please try again.")
      }
    }
  }

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => <Badge variant={value === "published" ? "default" : "secondary"}>{value}</Badge>,
    },
    { key: "views", label: "Views" },
    {
      key: "date",
      label: "Created",
      render: (value: string) => format(new Date(value), "MMM d, yyyy"),
    },
  ]

  return (
    <>
      <AdminHeader title="Blog Posts" description="Create and manage blog articles" />

      <div className="p-6">
        <div className="mb-6">
          <Button onClick={handleCreate} className="gap-2">
            <Plus size={18} />
            New Blog Post
          </Button>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Loading blog posts...</p>
        ) : (
          <DataTable
            data={posts}
            columns={columns}
            onView={setSelectedPost}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Search blog posts..."
          />
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={!!selectedPost && !isEditing} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{selectedPost?.title}</DialogTitle>
            <DialogDescription>
              {selectedPost?.views} views • {selectedPost?.date && format(new Date(selectedPost.date), "MMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={selectedPost.status === "published" ? "default" : "secondary"}>
                  {selectedPost.status}
                </Badge>
                <Badge variant="outline">{selectedPost.category}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{format(new Date(selectedPost.date), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{selectedPost.read_time}</span>
                </div>
                <div>By {selectedPost.author}</div>
              </div>

              {selectedPost.image && (
                <img
                  src={selectedPost.image || "/placeholder.svg"}
                  alt={selectedPost.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              <div className="flex flex-wrap gap-2">
                {selectedPost.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Excerpt</p>
                <p className="text-base text-foreground">{selectedPost.excerpt}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Content</p>
                <div 
                  className="prose max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={() => handleEdit(selectedPost)} className="flex-1">
                  Edit Post
                </Button>
                <Button onClick={() => setSelectedPost(null)} variant="outline" className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreating || isEditing}
        onOpenChange={() => {
          setIsCreating(false)
          setIsEditing(false)
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {isCreating ? "Create New Blog Post" : "Edit Blog Post"}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? "Write a new article for the blog" : "Update blog post information"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the blog post"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="read_time">Read Time *</Label>
                <Input
                  id="read_time"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Publish Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Cover Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.status === "published"}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "published" : "draft" })}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1">
                {isCreating ? "Create Post" : "Save Changes"}
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false)
                  setIsEditing(false)
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}