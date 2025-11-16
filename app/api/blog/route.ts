import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClientInstance() // Remove 'await'
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "published"

    let query = supabase.from("blog").select("*")
    if (status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("date", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClientInstance() // Remove 'await'
    const body = await request.json()

    const { data, error } = await supabase.from("blog").insert([body]).select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}