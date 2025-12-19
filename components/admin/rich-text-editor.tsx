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
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg my-6 max-w-full" },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[320px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  })

  const insertImage = async () => {
    if (!editor || !imageFile) return
    setUploading(true)
    try {
      const { publicUrl } = await uploadBlogImage(imageFile)
      editor.chain().focus().setImage({ src: publicUrl }).run()
      setOpenImage(false)
      setImageFile(null)
    } finally {
      setUploading(false)
    }
  }

  if (!mounted || !editor) {
    return (
      <div className="border rounded-lg h-[320px] flex items-center justify-center text-muted-foreground">
        Loading editor…
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/40">
        <Button size="sm" variant={editor.isActive("bold") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></Button>
        <Button size="sm" variant={editor.isActive("italic") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></Button>
        <Button size="sm" variant={editor.isActive("underline") ? "default" : "ghost"} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={16} /></Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 size={16} /></Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight size={16} /></Button>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></Button>

        <Dialog open={openLink} onOpenChange={setOpenLink}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost"><LinkIcon size={16} /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Insert link</DialogTitle></DialogHeader>
            <Label>URL</Label>
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            <Button className="mt-4" onClick={() => {
              editor.chain().focus().setLink({ href: linkUrl }).run()
              setLinkUrl("")
              setOpenLink(false)
            }}>Insert</Button>
          </DialogContent>
        </Dialog>

        <Dialog open={openImage} onOpenChange={setOpenImage}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost"><ImageIcon size={16} /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload image</DialogTitle></DialogHeader>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <Button disabled={uploading} className="mt-4" onClick={insertImage}>
              {uploading ? "Uploading…" : "Insert"}
            </Button>
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().undo().run()}><Undo size={16} /></Button>
        <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().redo().run()}><Redo size={16} /></Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
