import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📦 Received volunteer data:", body)

    const supabase = createServerClientInstance()

    const newVolunteer = {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      availability: body.availability || null,
      interests: body.interests || null,
      experience: body.experience || null,
      status: "pending",
      created_at: new Date().toISOString()
    }

    console.log("🚀 Inserting into Supabase:", newVolunteer)

    const { data, error } = await supabase
      .from("volunteers")
      .insert([newVolunteer])
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase error:", error)
      return NextResponse.json({ 
        error: "Database error", 
        details: error.message 
      }, { status: 500 })
    }

    console.log("✅ Volunteer created successfully:", data)
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error("❌ Server error:", error)
    return NextResponse.json({ 
      error: "Failed to create volunteer",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching volunteers:", error)
    return NextResponse.json({ error: "Failed to fetch volunteers" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const body = await request.json()

    const updateData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      availability: body.availability,
      interests: body.interests,
      experience: body.experience,
    }

    const { data, error } = await supabase
      .from("volunteers")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error updating volunteer:", error)
    return NextResponse.json({ error: "Failed to update volunteer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { error } = await supabase.from("volunteers").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting volunteer:", error)
    return NextResponse.json({ error: "Failed to delete volunteer" }, { status: 500 })
  }
}