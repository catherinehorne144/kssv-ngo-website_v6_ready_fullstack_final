import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File) {
  const supabase = createClient()

  const ext = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${ext}`
  
  // Upload to blog-images bucket
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

  // Return ONLY the path for database (format: /blog-images/filename.jpg)
  return {
    path: `/blog-images/${filePath}`,
    publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog-images/${filePath}`
  }
}
