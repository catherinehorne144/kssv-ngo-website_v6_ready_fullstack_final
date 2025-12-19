import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File) {
  const supabase = createClient()

  // Simple file name
  const fileName = `${Date.now()}-${file.name}`
  
  try {
    // Upload to blog-images bucket
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file)

    if (error) throw error

    // Return the full public URL
    return `https://cxpizphluslwrcroiecx.supabase.co/storage/v1/object/public/blog-images/${fileName}`
    
  } catch (error) {
    console.error("Upload failed:", error)
    // Fallback: return a placeholder
    return "https://placehold.co/600x400"
  }
}
