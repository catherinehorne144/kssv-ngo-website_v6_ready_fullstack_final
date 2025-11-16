import { createServerClientInstance } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// ✅ Update an existing message
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await req.json()

    // Guard: ensure there's data
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No data provided for update" },
        { status: 400 }
      )
    }

    // ✅ Only include valid DB columns (no subject)
    const updateData = {
      first_name: body.first_name?.trim() || null,
      last_name: body.last_name?.trim() || null,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      message: body.message?.trim() || null,
      replied: body.replied ?? false,
      reply_text: body.reply_text?.trim() || null,
    }

    const { data, error } = await supabase
      .from("messages")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error("🔥 PUT /api/messages/[id] error:", err)
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    )
  }
}

// ✅ Delete an existing message
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error("🔥 DELETE /api/messages/[id] error:", err)
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    )
  }
}
