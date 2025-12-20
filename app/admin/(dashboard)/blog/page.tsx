"use client"

import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import { format } from "date-fns"
import { Plus, Upload, X } from "lucide-react"

import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { uploadBlogImage } from "@/lib/upload"
import type { BlogPost } from "@/lib/types/database"

const RichTextEditor = dynamic(
  () => import("@/components/admin/rich-text-editor"),
  { ssr: false }
)

export default function BlogAdminPage() {
  const supabase = createClient()

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const [openEditor, setOpenEditor] = useState(false)
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
    const { data } = await supabase
      .from("blog")
      .select("*")
      .order("date", { ascending: false })
    setPosts(data || [])
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

  // Handle file selection - JUST SELECT, don't upload yet
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

  // Upload cover image - USER MUST CLICK TO UPLOAD
  async function uploadCoverImage() {
    if (!selectedCoverFile) {
      alert('Please select an image first')
      return
    }

    setUploadingCover(true)
    
    try {
      console.log('Starting cover image upload...')
      const imageUrl = await uploadBlogImage(selectedCoverFile)
      console.log('Cover image uploaded successfully:', imageUrl)
      
      setForm(f => ({ 
        ...f, 
        image: imageUrl,
        imagePath: imageUrl
      }))
      
      // Keep the preview
      setCoverPreview(imageUrl)
      
      // Clear file input but keep the file reference
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      
    } catch (error: any) {
      console.error('Cover image upload failed:', error)
      alert(`Failed to upload cover image: ${error.message}`)
      
      // Clear on error
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function savePost() {
    if (!form.title || !form.content) {
      alert("Title and content are required")
      return
    }

    // Warn if no cover image but allow save
    if (!form.image && !selectedCoverFile) {
      const confirm = window.confirm("No cover image selected. Save without cover image?")
      if (!confirm) return
    }

    const payload = {
      title: form.title,
      excerpt:
        form.excerpt ||
        form.content.replace(/<[^>]*>/g, "").slice(0, 160),
      content: form.content,
      category: form.category,
      tags: form.tags,
      author: form.author,
      date: new Date(form.date).toISOString(),
      read_time: form.read_time,
      image: form.image || null,
      status: form.status,
    }

    try {
      if (editingPost) {
        await supabase.from("blog").update(payload).eq("id", editingPost.id)
      } else {
        await supabase.from("blog").insert([payload])
      }

      setOpenEditor(false)
      fetchPosts()
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
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <DataTable
            data={posts}
            columns={columns}
            onView={() => {}}
            onEdit={openEdit}
            onDelete={() => {}}
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
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
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
              />
            </div>

            <div>
              <Label>Content</Label>
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
                      {selectedCoverFile ? `Selected: ${selectedCoverFile.name} (${(selectedCoverFile.size / 1024).toFixed(2)} KB)` : 'Existing cover image'}
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
                disabled={uploadingCover}
              >
                Save Blog Post
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpenEditor(false)}
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
