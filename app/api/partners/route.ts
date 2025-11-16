import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// GET all partnerships
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}

// CREATE new partnership
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📦 Received partnership data:", body)

    const supabase = await createClient()

    const newPartner = {
      organization_name: body.organizationName,
      contact_person: body.contactPerson,
      email: body.email,
      phone: body.phone || null,
      partnership_type: body.partnershipType || null,
      description: body.description || null,
      status: "pending",
      created_at: new Date().toISOString()
    }

    console.log("🚀 Inserting into partners table:", newPartner)

    const { data, error } = await supabase
      .from("partners")
      .insert([newPartner])
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase error:", error)
      return NextResponse.json({ 
        error: "Database error", 
        details: error.message 
      }, { status: 500 })
    }

    console.log("✅ Partnership created successfully:", data)
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error("❌ Server error:", error)
    return NextResponse.json({ 
      error: "Failed to create partnership",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}