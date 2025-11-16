// /lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js"

/**
 * Browser Supabase client (safe for frontend only).
 * Does NOT run during build or cause crashes.
 */
export const getBrowserSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    console.warn("⚠ Missing Supabase public env vars — browser client not initialized.")
    return null
  }

  return createClient(url, anon)
}

/**
 * Legacy export maintained for compatibility with your code:
 * supabase = browser client
 */
export const supabase = getBrowserSupabase()

/**
 * Server-safe client (uses private env vars and never throws during build)
 */
export const getServerSupabase = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    console.warn("⚠ Supabase env vars missing on server — returning null.")
    return null
  }

  return createClient(url, anon)
}
