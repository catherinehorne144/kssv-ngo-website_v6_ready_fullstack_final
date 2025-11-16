// [file name]: app/api/workplans/route.ts
// [file content begin]
import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📦 Received workplan data:", body)

    const supabase = createServerClientInstance()

    const newWorkplan = {
      focus_area: body.focus_area,
      activity_name: body.activity_name,
      timeline_text: body.timeline_text,
      quarter: body.quarter,
      tasks_description: body.tasks_description,
      target: body.target,
      budget_allocated: parseInt(body.budget_allocated) || 0,
      output: body.output,
      outcome: body.outcome,
      kpi: body.kpi,
      means_of_verification: body.means_of_verification,
      risks: body.risks,
      mitigation_measures: body.mitigation_measures,
      resource_person: body.resource_person,
      status: body.status || 'planned',
      progress: parseInt(body.progress) || 0,
      learning_development: body.learning_development,
      self_evaluation: body.self_evaluation,
      notes: body.notes,
      public_visible: body.public_visible !== undefined ? body.public_visible : true,
      program_image: body.program_image || null,
      created_at: new Date().toISOString()
    }

    console.log("🚀 Inserting into Supabase:", newWorkplan)

    const { data, error } = await supabase
      .from("work_plans")
      .insert([newWorkplan])
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase error:", error)
      return NextResponse.json({ 
        error: "Database error", 
        details: error.message 
      }, { status: 500 })
    }

    console.log("✅ Workplan created successfully:", data)
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error("❌ Server error:", error)
    return NextResponse.json({ 
      error: "Failed to create workplan",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClientInstance()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const quarter = searchParams.get('quarter')
    const focus_area = searchParams.get('focus_area')

    let query = supabase
      .from("work_plans")
      .select("*")
      .order("created_at", { ascending: false })

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (quarter && quarter !== 'all') {
      query = query.eq('quarter', quarter)
    }
    if (focus_area && focus_area !== 'all') {
      query = query.eq('focus_area', focus_area)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [], { status: 200 })
  } catch (error) {
    console.error("Error fetching workplans:", error)
    return NextResponse.json({ error: "Failed to fetch workplans" }, { status: 500 })
  }
}
// [file content end]