import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createServerClientInstance() {
  const cookieStore = cookies()

  // Use the PUBLIC variables that actually exist in your Vercel environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Supabase environment variables are missing")
    return null
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}