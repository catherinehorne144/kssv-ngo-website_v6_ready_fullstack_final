import { createServerClient } from '@/lib/supabase/server'
import type { BlogPost } from '@/lib/types/database'

// Server-side function to get all blog posts
export async function getBlogPosts(status: string = 'published'): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('blog')
      .select('*')
    
    if (status !== 'all') {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query.order('date', { ascending: false })

    if (error) {
      console.error('Error fetching blog posts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getBlogPosts:', error)
    return []
  }
}

// Server-side function to get a single blog post
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('blog')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching blog post:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getBlogPost:', error)
    return null
  }
}

// For client-side use (if needed)
export const blogPosts = {
  getAll: async (status?: string) => await getBlogPosts(status),
  getById: async (id: string) => await getBlogPost(id),
}