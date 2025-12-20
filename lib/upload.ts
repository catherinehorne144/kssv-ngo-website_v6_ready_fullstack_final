import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File): Promise<string> {
  const supabase = createClient()

  // Generate unique filename with timestamp
  const timestamp = Date.now()
  const fileExt = file.name.split('.').pop()
  const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`

  try {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)

    return publicUrl

  } catch (error) {
    console.error('Failed to upload image:', error)
    throw new Error('Image upload failed. Please try again.')
  }
}

// For multiple images
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadBlogImage(file))
  return Promise.all(uploadPromises)
}
