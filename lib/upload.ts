// lib/upload.ts
import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File) {
  const supabase = createClient()

  const ext = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${ext}`
  const filePath = fileName

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage
    .from("blog-images")
    .getPublicUrl(filePath)

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  }
}
