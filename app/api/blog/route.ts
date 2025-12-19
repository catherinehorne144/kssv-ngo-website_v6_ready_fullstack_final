import { createServerClientInstance } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const supabase = createServerClientInstance()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") ?? "published"

  let query = supabase.from("blog").select("*")
  if (status !== "all") query = query.eq("status", status)

  const { data, error } = await query.order("date", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createServerClientInstance()
  const body = await req.json()

  if (!body.title || !body.content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const { data, error } = await supabase.from("blog").insert([body]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data, { status: 201 })
}
