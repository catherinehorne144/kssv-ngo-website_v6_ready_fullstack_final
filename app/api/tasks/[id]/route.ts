// [file name]: app/api/tasks/[id]/route.ts
// [file content begin]
import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        activity:activities(
          *,
          program:programs(*)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const body = await request.json()

    const updateData = {
      name: body.name,
      target: body.target ? parseInt(body.target) : null,
      task_timeline: body.task_timeline || null,
      activity_timeline: body.activity_timeline,
      budget: parseInt(body.budget) || 0,
      output: body.output || null,
      outcome: body.outcome || null,
      evaluation_criteria: body.evaluation_criteria || null,
      risks: body.risks || null,
      mitigation_measures: body.mitigation_measures || null,
      resource_person: body.resource_person || null,
      status: body.status ? parseInt(body.status) : 0,
      learning_and_development: body.learning_and_development || null,
      self_evaluation: body.self_evaluation || null,
      notes: body.notes || null
    }

    const { data, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", params.id)
      .select(`
        *,
        activity:activities(
          *,
          program:programs(*)
        )
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { error } = await supabase.from("tasks").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
// [file content end]