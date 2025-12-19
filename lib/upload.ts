import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File) {
  const supabase = createClient()

  const ext = file.name.split(".").pop()
  const safeName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(safeName, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    console.error("Supabase upload error:", error)
    throw error
  }

  const { data } = supabase.storage
    .from("blog-images")
    .getPublicUrl(safeName)

  return {
    path: safeName,
    publicUrl: data.publicUrl,
  }
}
