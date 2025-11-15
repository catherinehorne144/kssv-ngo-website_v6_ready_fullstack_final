// [file name]: app/api/activities/[id]/route.ts
// [file content begin]
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("activities")
      .select("*, tasks(*)")
      .eq("id", params.id)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching activity:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const updateData = {
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
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("activities")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error updating activity:", error)
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("activities").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting activity:", error)
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 })
  }
}
// [file content end]