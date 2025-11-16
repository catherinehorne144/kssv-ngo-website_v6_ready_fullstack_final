// [file name]: app/api/workplans/[id]/route.ts
// [file content begin]
import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from("work_plans")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ error: "Workplan not found" }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching workplan:", error)
    return NextResponse.json({ error: "Failed to fetch workplan" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const body = await request.json()

    const updateData = {
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
      status: body.status,
      progress: parseInt(body.progress) || 0,
      learning_development: body.learning_development,
      self_evaluation: body.self_evaluation,
      notes: body.notes,
      public_visible: body.public_visible,
      program_image: body.program_image || null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("work_plans")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error updating workplan:", error)
    return NextResponse.json({ error: "Failed to update workplan" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { error } = await supabase.from("work_plans").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting workplan:", error)
    return NextResponse.json({ error: "Failed to delete workplan" }, { status: 500 })
  }
}
// [file content end]