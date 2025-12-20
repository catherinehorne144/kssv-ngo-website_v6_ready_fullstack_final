"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Upload,
  Loader2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { uploadBlogImage } from "@/lib/upload"

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function RichTextEditor({ value, onChange }: Props) {
  const [mounted, setMounted] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openImage, setOpenImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => setMounted(true), [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        paragraph: { HTMLAttributes: { class: "my-4" } },
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline hover:text-primary/80 transition-colors" },
      }),
      Image.configure({
        HTMLAttributes: { 
          class: "rounded-lg my-6 max-w-full h-auto shadow-md",
          style: "max-height: 500px; object-fit: contain;"
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none bg-background",
      },
    },
    immediatelyRender: false,
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const insertImage = async () => {
    if (!editor || !imageFile) return
    setUploading(true)
    try {
      const publicUrl = await uploadBlogImage(imageFile)
      editor.chain().focus().setImage({ src: publicUrl }).run()
      setOpenImage(false)
      setImageFile(null)
      setImagePreview("")
    } catch (error) {
      console.error("Failed to insert image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const setLink = () => {
    if (!editor || !linkUrl) return
    
    if (linkUrl === "") {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    setLinkUrl("")
    setOpenLink(false)
  }

  if (!mounted || !editor) {
    return (
      <div className="border-2 border-dashed rounded-xl h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-background to-muted/30">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="border-2 rounded-xl overflow-hidden shadow-lg bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 border-b bg-gradient-to-r from-muted/50 to-background">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant={editor.isActive("bold") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-9 w-9 p-0"
            title="Bold"
          >
            <Bold size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("italic") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-9 w-9 p-0"
            title="Italic"
          >
            <Italic size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("underline") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="h-9 w-9 p-0"
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="h-9 w-9 p-0"
            title="Heading 1"
          >
            <Heading1 size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-9 w-9 p-0"
            title="Heading 2"
          >
            <Heading2 size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className="h-9 w-9 p-0"
            title="Heading 3"
          >
            <Heading3 size={16} />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant={editor.isActive("bulletList") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-9 w-9 p-0"
            title="Bullet List"
          >
            <List size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive("orderedList") ? "default" : "outline"}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-9 w-9 p-0"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            size="sm"
            variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className="h-9 w-9 p-0"
            title="Align Left"
          >
            <AlignLeft size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className="h-9 w-9 p-0"
            title="Align Center"
          >
            <AlignCenter size={16} />
          </Button>
          <Button
            size="sm"
            variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className="h-9 w-9 p-0"
            title="Align Right"
          >
            <AlignRight size={16} />
          </Button>
        </div>

        {/* Blockquote */}
        <Button
          size="sm"
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-9 w-9 p-0"
          title="Quote"
        >
          <Quote size={16} />
        </Button>

        {/* Link Dialog */}
        <Dialog open={openLink} onOpenChange={setOpenLink}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0"
              title="Insert Link"
            >
              <LinkIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Insert Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setLink()}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setOpenLink(false)}>
                  Cancel
                </Button>
                <Button onClick={setLink} disabled={!linkUrl}>
                  Insert Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog open={openImage} onOpenChange={setOpenImage}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0"
              title="Insert Image"
            >
              <ImageIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Upload Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                
                {imagePreview && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpenImage(false)
                      setImageFile(null)
                      setImagePreview("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={insertImage}
                    disabled={!imageFile || uploading}
                    className="gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Insert Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-9 w-9 p-0"
            title="Undo"
          >
            <Undo size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-9 w-9 p-0"
            title="Redo"
          >
            <Redo size={16} />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
