// app/api/workplans/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClientInstance()
    
    const { data: workplan, error } = await supabase
      .from("work_plans")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("❌ Supabase error fetching workplan:", error)
      return NextResponse.json(
        { error: "Workplan not found", details: error.message },
        { status: 404 }
      )
    }

    if (!workplan) {
      return NextResponse.json(
        { error: "Workplan not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(workplan)
  } catch (error) {
    console.error("❌ Server error fetching workplan:", error)
    return NextResponse.json(
      { error: "Failed to fetch workplan", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    console.log("📝 Updating workplan:", params.id, body)

    const supabase = createServerClientInstance()

    const updatedWorkplan = {
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
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("work_plans")
      .update(updatedWorkplan)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("❌ Supabase update error:", error)
      return NextResponse.json(
        { error: "Failed to update workplan", details: error.message },
        { status: 500 }
      )
    }

    console.log("✅ Workplan updated successfully:", data)
    return NextResponse.json(data)

  } catch (error) {
    console.error("❌ Server error updating workplan:", error)
    return NextResponse.json(
      { error: "Failed to update workplan", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClientInstance()

    // First, check if workplan exists
    const { data: existingWorkplan, error: fetchError } = await supabase
      .from("work_plans")
      .select("id, activity_name")
      .eq("id", params.id)
      .single()

    if (fetchError || !existingWorkplan) {
      return NextResponse.json(
        { error: "Workplan not found" },
        { status: 404 }
      )
    }

    const { error } = await supabase
      .from("work_plans")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("❌ Supabase delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete workplan", details: error.message },
        { status: 500 }
      )
    }

    console.log("✅ Workplan deleted successfully:", params.id)
    return NextResponse.json({ 
      success: true, 
      message: `Workplan "${existingWorkplan.activity_name}" deleted successfully` 
    })

  } catch (error) {
    console.error("❌ Server error deleting workplan:", error)
    return NextResponse.json(
      { error: "Failed to delete workplan", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}