import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File) {
  const supabase = createClient()

  const ext = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${ext}`
  
  // Upload path
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

  // Get public URL for preview
  const { data } = supabase.storage
    .from("blog-images")
    .getPublicUrl(filePath)

  // ✅ Return BOTH: database path and preview URL
  return {
    path: `/blog-images/${filePath}`,  // For database
    publicUrl: data.publicUrl,        // For preview
  }
}
