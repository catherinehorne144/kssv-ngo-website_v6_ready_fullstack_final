// /app/api/branding/route.ts
import { NextResponse } from "next/server"
import { createServerClientInstance } from "@/lib/supabase/server"

export async function GET() {
  const supabase = createServerClientInstance()
  if (!supabase) return NextResponse.json({ error: "Supabase not ready" }, { status: 500 })

  const { data, error } = await supabase
    .from("branding")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? {})
}

export async function POST(request: Request) {
  const supabase = createServerClientInstance()
  if (!supabase) return NextResponse.json({ error: "Supabase not ready" }, { status: 500 })

  const body = await request.json()

  const { data, error } = await supabase.from("branding").upsert(body).select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
