// lib/upload.ts
import { createClient } from "@/lib/supabase/client"

export async function uploadBlogImage(file: File): Promise<string> {
  const supabase = createClient()
  
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed (jpg, png, gif, etc.)')
    }
    
    // Check file size (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error('Image size must be less than 5MB')
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    
    console.log('Attempting to upload:', fileName, 'Size:', file.size, 'Type:', file.type)
    
    // Upload the file
    const { data, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Upload error details:', uploadError)
      throw new Error(`Failed to upload image: ${uploadError.message}`)
    }
    
    if (!data) {
      throw new Error('No data returned from upload')
    }
    
    console.log('Upload successful:', data)
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName)
    
    console.log('Generated public URL:', publicUrl)
    
    // Verify the URL is accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' })
      if (!response.ok) {
        console.warn('URL might not be publicly accessible yet')
      }
    } catch (fetchError) {
      console.warn('Could not verify URL accessibility:', fetchError)
    }
    
    return publicUrl
    
  } catch (error) {
    console.error('Upload process failed:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Image upload failed. Please try again.')
  }
}

// Helper to list files in bucket (for debugging)
export async function listBlogImages() {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from('blog-images')
    .list()
  
  if (error) {
    console.error('Error listing files:', error)
    return []
  }
  
  return data || []
}

// Helper to delete an image
export async function deleteBlogImage(fileName: string) {
  const supabase = createClient()
  const { error } = await supabase.storage
    .from('blog-images')
    .remove([fileName])
  
  if (error) {
    console.error('Error deleting file:', error)
    throw error
  }
  
  return true
} 
