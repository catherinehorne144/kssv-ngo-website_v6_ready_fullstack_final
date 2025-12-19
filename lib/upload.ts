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
    })

  if (error) {
    console.error("Supabase upload error:", error)
    throw error
  }

  const { data } = supabase.storage
    .from("blog-images")
    .getPublicUrl(filePath)

  // Return correct format for database
  return {
    path: `/blog-images/${filePath}`,
    publicUrl: data.publicUrl,
  }
}
