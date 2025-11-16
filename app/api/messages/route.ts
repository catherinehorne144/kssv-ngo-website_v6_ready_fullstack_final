import { createServerClientInstance } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

// ✅ GET — Fetch all messages (Admin Panel)
export async function GET() {
  try {
    const supabase = createServerClientInstance()

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error("🔥 GET /api/messages route error:", err)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// ✅ POST — Submit new message (Contact Form)
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClientInstance()
    const body = await req.json()

    const { firstName, lastName, email, phone, message } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      )
    }

    // ✅ Insert using correct column names
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone: phone?.trim() || null,
          message: message.trim(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(
      { success: true, message: "Message saved successfully", data },
      { status: 201 }
    )
  } catch (err) {
    console.error("🔥 POST /api/messages route error:", err)
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    )
  }
}
