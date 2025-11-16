// [file name]: app/api/activities/route.ts
// [file content begin]
import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📦 Received activity data:", body)

    const supabase = createServerClientInstance()

    const newActivity = {
      program_id: body.program_id,
      name: body.name,
      description: body.description,
      outcome: body.outcome,
      kpi: body.kpi,
      timeline_start: body.timeline_start,
      timeline_end: body.timeline_end,
      budget_allocated: parseInt(body.budget_allocated),
      budget_utilized: parseInt(body.budget_utilized || '0'),
      status: body.status,
      responsible_person: body.responsible_person || null,
      progress: parseInt(body.progress || '0'),
      challenges: body.challenges || null,
      next_steps: body.next_steps || null,
      created_at: new Date().toISOString()
    }

    console.log("🚀 Inserting activity into Supabase:", newActivity)

    const { data, error } = await supabase
      .from("activities")
      .insert([newActivity])
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase activity creation error:", error)
      return NextResponse.json({ 
        error: "Database error", 
        details: error.message 
      }, { status: 500 })
    }

    console.log("✅ Activity created successfully:", data)
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error("❌ Server error creating activity:", error)
    return NextResponse.json({ 
      error: "Failed to create activity",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')

    const supabase = createServerClientInstance()

    let query = supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })

    if (programId) {
      query = query.eq('program_id', programId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [], { status: 200 })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}
// [file content end]