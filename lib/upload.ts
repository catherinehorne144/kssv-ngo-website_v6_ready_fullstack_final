// Placeholder helper for client-side image compression + upload to Supabase Storage.
import { supabase } from './supabaseClient'

export async function uploadImage(bucket: string, file: File, path: string) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl
}
