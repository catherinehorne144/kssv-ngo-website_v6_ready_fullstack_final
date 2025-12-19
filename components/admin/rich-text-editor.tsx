"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { uploadBlogImage } from "@/lib/upload"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-6",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  })

  const addLink = () => {
    if (!editor || !linkUrl) return
    editor.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl("")
    setIsLinkDialogOpen(false)
  }

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run()
  }

  const addImage = async () => {
    if (!editor || !imageFile) return
    try {
      setUploading(true)
      const { publicUrl } = await uploadBlogImage(imageFile)
      editor.chain().focus().setImage({ src: publicUrl }).run()
      setImageFile(null)
      setIsImageDialogOpen(false)
    } catch (err) {
      console.error("Image upload failed", err)
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  if (!isMounted || !editor) {
    return (
      <div className="border rounded-lg min-h-[300px] flex items-center justify-center text-muted-foreground">
        Loading editor…
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
        <Button size="sm" variant={editor.isActive("bold") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </Button>

        <Button size="sm" variant={editor.isActive("italic") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </Button>

        <Button size="sm" variant={editor.isActive("underline") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </Button>

        <Button size="sm" variant={editor.isActive("bulletList") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </Button>

        <Button size="sm" variant={editor.isActive("orderedList") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft size={16} />
        </Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter size={16} />
        </Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight size={16} />
        </Button>

        <Button size="sm" variant={editor.isActive("blockquote") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </Button>

        {/* Link */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <LinkIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <Label>URL</Label>
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            <div className="flex gap-2 mt-4">
              <Button onClick={addLink}>Save</Button>
              <Button variant="outline" onClick={removeLink}>Remove</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Image */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <ImageIcon size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <Label>Select image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <Button className="mt-4" onClick={addImage} disabled={uploading}>
              {uploading ? "Uploading…" : "Insert Image"}
            </Button>
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
