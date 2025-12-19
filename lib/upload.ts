import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File) {
  const supabase = createClient()

  // Simple file name
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`
  
  // Upload to storage
  const { error } = await supabase.storage
    .from("blog-images")
    .upload(fileName, file)

  if (error) {
    console.error("Upload failed:", error)
    throw error
  }

  // Get full public URL
  const { data } = supabase.storage
    .from("blog-images")
    .getPublicUrl(fileName)

  // Return FULL URL for everything
  return data.publicUrl
}
