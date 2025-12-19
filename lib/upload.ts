// lib/upload.ts
import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File) {
  const supabase = createClient()

  const ext = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${ext}`
  const filePath = `blog-images/${fileName}`

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from("blog-images")
    .getPublicUrl(filePath)

  return {
    path: filePath,          // 👉 save this in DB
    publicUrl: data.publicUrl // 👉 use for preview
  }
}
