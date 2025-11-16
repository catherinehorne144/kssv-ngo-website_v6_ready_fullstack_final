import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET all members
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}

// CREATE new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📦 Received member data:", body)

    const supabase = createServerClientInstance()

    const newMember = {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      location: body.location || null,
      motivation: body.motivation || null,
      skills: body.skills || null,
      status: "pending",
      created_at: new Date().toISOString()
    }

    console.log("🚀 Inserting into members table:", newMember)

    const { data, error } = await supabase
      .from("members")
      .insert([newMember])
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase error:", error)
      return NextResponse.json({ 
        error: "Database error", 
        details: error.message 
      }, { status: 500 })
    }

    console.log("✅ Member created successfully:", data)
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error("❌ Server error:", error)
    return NextResponse.json({ 
      error: "Failed to create member",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}