import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET single partner by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching partner:", error)
    return NextResponse.json({ error: "Failed to fetch partner" }, { status: 500 })
  }
}

// UPDATE partner by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const body = await request.json()

    const { data, error } = await supabase
      .from("partners")
      .update(body)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error updating partner:", error)
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
  }
}

// DELETE partner by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { error } = await supabase.from("partners").delete().eq("id", params.id)

    if (error) throw error
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting partner:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}