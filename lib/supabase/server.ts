// /lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createServerClientInstance() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  // Never throw during build – return dummy minimal client instead
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠ Supabase env variables missing at build time.")
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
