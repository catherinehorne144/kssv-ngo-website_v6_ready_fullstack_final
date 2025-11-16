import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// ✅ Update a volunteer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const body = await request.json()

    // Ensure only valid columns are updated
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

// ✅ Delete a volunteer
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
