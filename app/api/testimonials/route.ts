import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClientInstance()
    const { searchParams } = new URL(request.url)
    const approved = searchParams.get("approved") === "true"

    let query = supabase.from("testimonials").select("*")
    if (approved) {
      query = query.eq("approved", true)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClientInstance()
    const body = await request.json()

    const { data, error } = await supabase.from("testimonials").insert([body]).select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 })
  }
}