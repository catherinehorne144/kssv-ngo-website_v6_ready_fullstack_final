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
import { useEffect, useState, useRef } from "react"
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        },
        allowBase64: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none bg-background",
      },
      handlePaste: (view, event) => {
        // Handle image paste - upload to Supabase
        const items = Array.from(event.clipboardData?.items || [])
        const file = items.find(item => item.type.startsWith('image/'))?.getAsFile()
        
        if (file) {
          event.preventDefault()
          uploadImageFile(file)
          return true
        }
        return false
      },
    },
    immediatelyRender: false,
  })

  const uploadImageFile = async (file: File) => {
    if (!editor) return
    setUploading(true)
    try {
      const publicUrl = await uploadBlogImage(file)
      editor.chain().focus().setImage({ src: publicUrl }).run()
    } catch (error: any) {
      alert(`Failed to upload image: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

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
    await uploadImageFile(imageFile)
    setOpenImage(false)
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/40">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
        >
          <Bold size={16} />
        </Button>
        
        <Button
          size="sm"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
        >
          <Italic size={16} />
        </Button>
        
        <Button
          size="sm"
          variant={editor.isActive("underline") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0"
        >
          <UnderlineIcon size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 w-8 p-0"
        >
          <Heading1 size={16} />
        </Button>
        
        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 w-8 p-0"
        >
          <Heading2 size={16} />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
        >
          <List size={16} />
        </Button>
        
        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
        >
          <ListOrdered size={16} />
        </Button>

        <Dialog open={openLink} onOpenChange={setOpenLink}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <LinkIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label>URL</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
              <Button onClick={setLink} className="w-full">
                Insert Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openImage} onOpenChange={setOpenImage}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ImageIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
              
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-contain rounded border"
                  />
                </div>
              )}

              <Button
                onClick={insertImage}
                disabled={!imageFile || uploading}
                className="w-full gap-2"
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
          </DialogContent>
        </Dialog>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo size={16} />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo size={16} />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
