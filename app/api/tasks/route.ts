// [file name]: app/api/tasks/route.ts
// [file content begin]
import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📦 Received task data:", body)

    const supabase = await createClient()

    const newTask = {
      activity_id: body.activity_id,
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
      notes: body.notes || null,
      created_at: new Date().toISOString()
    }

    console.log("🚀 Inserting into Supabase:", newTask)

    const { data, error } = await supabase
      .from("tasks")
      .insert([newTask])
      .select(`
        *,
        activity:activities(
          *,
          program:programs(*)
        )
      `)
      .single()

    if (error) {
      console.error("❌ Supabase error:", error)
      return NextResponse.json({ 
        error: "Database error", 
        details: error.message 
      }, { status: 500 })
    }

    console.log("✅ Task created successfully:", data)
    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error("❌ Server error:", error)
    return NextResponse.json({ 
      error: "Failed to create task",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const activityId = searchParams.get('activityId')

    let query = supabase
      .from("tasks")
      .select(`
        *,
        activity:activities(
          *,
          program:programs(*)
        )
      `)
      .order("created_at", { ascending: false })

    if (activityId) {
      query = query.eq('activity_id', activityId)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}
// [file content end]