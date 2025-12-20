"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { format } from "date-fns"
import { Plus, Upload, X, Eye, Trash2, Pencil } from "lucide-react"

import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { uploadBlogImage, deleteBlogImage } from "@/lib/upload"
import type { BlogPost } from "@/lib/types/database"
import Link from "next/link"

const RichTextEditor = dynamic(
  () => import("@/components/admin/rich-text-editor"),
  { ssr: false }
)

export default function BlogAdminPage() {
  const supabase = createClient()

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const [openEditor, setOpenEditor] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  const [tagInput, setTagInput] = useState("")
  const [uploadingCover, setUploadingCover] = useState(false)
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    id: "",
    title: "",
    excerpt: "",
    content: "",
    category: "Community Impact",
    tags: [] as string[],
    author: "KSSV Team",
    date: new Date().toISOString().split("T")[0],
    read_time: "5 min read",
    image: "",
    imagePath: "",
    status: "draft" as "draft" | "published",
  })

  const categories = [
    "Community Impact",
    "Success Stories",
    "Legal Aid",
    "Awareness",
    "News",
    "Programs",
  ]

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .order("date", { ascending: false })
    
    if (error) {
      console.error("Error fetching posts:", error)
      alert("Failed to load blog posts")
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }

  function resetForm() {
    setForm({
      id: "",
      title: "",
      excerpt: "",
      content: "",
      category: "Community Impact",
      tags: [],
      author: "KSSV Team",
      date: new Date().toISOString().split("T")[0],
      read_time: "5 min read",
      image: "",
      imagePath: "",
      status: "draft",
    })
    setTagInput("")
    setSelectedCoverFile(null)
    setCoverPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function openCreate() {
    resetForm()
    setEditingPost(null)
    setOpenEditor(true)
  }

  function openEdit(post: BlogPost) {
    setForm({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags || [],
      author: post.author,
      date: post.date.split("T")[0],
      read_time: post.read_time,
      image: post.image || "",
      imagePath: post.image || "",
      status: post.status,
    })
    // Set preview if image exists
    if (post.image) {
      setCoverPreview(post.image)
    }
    setEditingPost(post)
    setOpenEditor(true)
  }

  function openDelete(post: BlogPost) {
    setPostToDelete(post)
    setOpenDeleteDialog(true)
  }

  async function handleDelete() {
    if (!postToDelete) return

    try {
      const { error } = await supabase
        .from("blog")
        .delete()
        .eq("id", postToDelete.id)

      if (error) throw error

      // Remove image from storage if exists
      if (postToDelete.image) {
        try {
          const fileName = postToDelete.image.split('/').pop()
          if (fileName) {
            await deleteBlogImage(fileName)
          }
        } catch (imgError) {
          console.warn("Failed to delete image file:", imgError)
        }
      }

      setPosts(posts.filter(p => p.id !== postToDelete.id))
      setOpenDeleteDialog(false)
      setPostToDelete(null)
    } catch (error: any) {
      alert(`Failed to delete post: ${error.message}`)
    }
  }

  function viewPost(post: BlogPost) {
    window.open(`/blog/${post.id}`, '_blank')
  }

  // Handle file selection
  function handleCoverFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (jpg, png, gif, etc.)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    setSelectedCoverFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Upload cover image
  async function uploadCoverImage() {
    if (!selectedCoverFile) {
      alert('Please select an image first')
      return
    }

    setUploadingCover(true)
    
    try {
      const imageUrl = await uploadBlogImage(selectedCoverFile)
      
      setForm(f => ({ 
        ...f, 
        image: imageUrl,
        imagePath: imageUrl
      }))
      
      setCoverPreview(imageUrl)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      
    } catch (error: any) {
      console.error('Cover image upload failed:', error)
      alert(`Failed to upload cover image: ${error.message}`)
      
      setSelectedCoverFile(null)
      setCoverPreview("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } finally {
      setUploadingCover(false)
    }
  }

  // Remove selected cover
  function removeCoverImage() {
    setSelectedCoverFile(null)
    setCoverPreview("")
    setForm(f => ({ ...f, image: "", imagePath: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function savePost() {
    if (!form.title || !form.content) {
      alert("Title and content are required")
      return
    }

    const payload = {
      title: form.title,
      excerpt: form.excerpt || form.content.replace(/<[^>]*>/g, "").slice(0, 160),
      content: form.content,
      category: form.category,
      tags: form.tags,
      author: form.author,
      date: new Date(form.date).toISOString(),
      read_time: form.read_time,
      image: form.image || null,
      status: form.status,
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingPost) {
        const { error } = await supabase
          .from("blog")
          .update(payload)
          .eq("id", editingPost.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from("blog")
          .insert([{ ...payload, created_at: new Date().toISOString() }])

        if (error) throw error
      }

      setOpenEditor(false)
      fetchPosts()
      resetForm()
    } catch (error: any) {
      alert(`Failed to save post: ${error.message}`)
    }
  }

  function addTag() {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm({ ...form, tags: [...form.tags, tagInput] })
      setTagInput("")
    }
  }

  const columns = [
    { key: "title", label: "Title" },
    {
      key: "status",
      label: "Status",
      render: (v: string) => (
        <Badge variant={v === "published" ? "default" : "secondary"}>
          {v}
        </Badge>
      ),
    },
    { key: "views", label: "Views" },
    {
      key: "date",
      label: "Date",
      render: (v: string) => format(new Date(v), "MMM d, yyyy"),
    },
  ]

  return (
    <>
      <AdminHeader title="Blog" description="Manage blog posts" />

      <div className="p-6">
        <Button onClick={openCreate} className="mb-6 gap-2">
          <Plus size={16} /> New Blog Post
        </Button>

        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground mb-4">No blog posts yet</p>
            <Button onClick={openCreate}>Create your first post</Button>
          </div>
        ) : (
          <DataTable
            data={posts}
            columns={columns}
            onView={viewPost}
            onCustomAction={openEdit}
            onDelete={openDelete}
          />
        )}
      </div>

      {/* EDITOR DIALOG */}
      <Dialog open={openEditor} onOpenChange={setOpenEditor}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              {editingPost ? "Edit Blog Post" : "New Blog Post"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="Enter blog post title"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Excerpt</Label>
              <Textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) =>
                  setForm({ ...form, excerpt: e.target.value })
                }
                placeholder="Brief summary of your post (optional)"
              />
            </div>

            <div>
              <Label>Content *</Label>
              <RichTextEditor
                value={form.content}
                onChange={(html) =>
                  setForm({ ...form, content: html })
                }
              />
            </div>

            <div>
              <Label>Cover Image</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileSelect}
                    className="flex-1"
                  />
                  
                  {selectedCoverFile && (
                    <Button
                      type="button"
                      onClick={uploadCoverImage}
                      disabled={uploadingCover}
                      className="gap-2"
                    >
                      {uploadingCover ? (
                        <>
                          <span className="animate-spin">⟳</span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {uploadingCover && (
                  <p className="text-sm text-muted-foreground">
                    Uploading cover image...
                  </p>
                )}

                {(coverPreview || form.image) && (
                  <div className="relative mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Preview:</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeCoverImage}
                        className="h-8 w-8 p-0"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <img
                        src={coverPreview || form.image}
                        alt="Cover preview"
                        className="w-full max-h-64 object-contain bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedCoverFile ? `Selected: ${selectedCoverFile.name}` : 'Existing cover image - click X to remove'}
                    </p>
                  </div>
                )}

                {!coverPreview && !form.image && selectedCoverFile && (
                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <p className="text-sm text-yellow-800">
                      Image selected but not uploaded yet. Click "Upload" to upload it.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add a tag and press Enter"
                />
                <Button variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() =>
                        setForm({
                          ...form,
                          tags: form.tags.filter((x) => x !== t),
                        })
                      }
                    >
                      {t} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <Label>Read Time</Label>
                <Input
                  value={form.read_time}
                  onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.status === "published"}
                onCheckedChange={(v) =>
                  setForm({
                    ...form,
                    status: v ? "published" : "draft",
                  })
                }
              />
              <Label>Publish immediately</Label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button 
                onClick={savePost} 
                className="flex-1"
                disabled={uploadingCover || !form.title || !form.content}
              >
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setOpenEditor(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{postToDelete?.title}"? This action cannot be undone.
              {postToDelete?.image && " The cover image will also be removed from storage."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
