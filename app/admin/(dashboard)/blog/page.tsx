"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { format } from "date-fns"
import { Plus, Calendar, Clock, Tag, Upload } from "lucide-react"

import { AdminHeader } from "@/components/admin/header"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] border rounded-lg flex items-center justify-center text-muted-foreground">
        Loading editor…
      </div>
    ),
  }
)

export default function BlogAdminPage() {
  const supabase = createClient()

  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const [openEditor, setOpenEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [viewPost, setViewPost] = useState<BlogPost | null>(null)

  const [tagInput, setTagInput] = useState("")
  const [uploadingCover, setUploadingCover] = useState(false)

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
      status: "draft",
    })
    setTagInput("")
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
      status: post.status,
    })
    setEditingPost(post)
    setOpenEditor(true)
  }

  async function handleCoverUpload(file: File) {
    try {
      setUploadingCover(true)
      const { publicUrl } = await uploadBlogImage(file)
      setForm({ ...form, image: publicUrl })
    } catch (e) {
      alert("Cover image upload failed")
    } finally {
      setUploadingCover(false)
    }
  }

  async function savePost() {
    if (!form.title || !form.content) {
      alert("Title and content are required")
      return
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

    if (editingPost) {
      await supabase.from("blog").update(payload).eq("id", editingPost.id)
    } else {
      await supabase.from("blog").insert([payload])
    }

    setOpenEditor(false)
    fetchPosts()
  }

  async function deletePost(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"?`)) return
    await supabase.from("blog").delete().eq("id", post.id)
    fetchPosts()
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
      <AdminHeader title="Blog" description="Create, edit and manage blog posts" />

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
            onView={setViewPost}
            onEdit={openEdit}
            onDelete={deletePost}
            searchPlaceholder="Search blog posts…"
          />
        )}
      </div>

      {/* CREATE / EDIT */}
      <Dialog open={openEditor} onOpenChange={setOpenEditor}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              {editingPost ? "Edit Blog Post" : "New Blog Post"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

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

            <Label>Excerpt</Label>
            <Textarea
              rows={3}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />

            <Label>Content</Label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => setForm({ ...form, content: html })}
            />

            {/* COVER IMAGE UPLOAD */}
            <Label>Cover Image</Label>
            <div className="space-y-2">
              {form.image && (
                <img
                  src={form.image}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleCoverUpload(e.target.files[0])
                  }
                />
                <Button variant="outline" disabled={uploadingCover}>
                  <Upload size={14} className="mr-2" />
                  {uploadingCover ? "Uploading…" : "Upload Cover Image"}
                </Button>
              </label>
            </div>

            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <Button variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {form.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="cursor-pointer"
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

            <div className="flex items-center gap-2">
              <Switch
                checked={form.status === "published"}
                onCheckedChange={(v) =>
                  setForm({ ...form, status: v ? "published" : "draft" })
                }
              />
              <Label>Publish</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={savePost} className="flex-1">
                Save
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
