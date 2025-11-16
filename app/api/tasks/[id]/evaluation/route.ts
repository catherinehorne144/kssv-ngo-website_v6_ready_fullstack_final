// [file name]: app/api/tasks/[id]/evaluation/route.ts
// [file content begin]
import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const evaluationData = {
      task_id: params.id,
      evaluation_date: body.evaluation_date || new Date().toISOString(),
      progress_rating: body.progress_rating,
      quality_rating: body.quality_rating,
      challenges_encountered: body.challenges_encountered,
      success_factors: body.success_factors,
      adjustments_made: body.adjustments_made,
      lessons_learned: body.lessons_learned,
      recommendations: body.recommendations,
      evaluator_name: body.evaluator_name,
      next_evaluation_date: body.next_evaluation_date,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from("task_evaluations")
      .insert([evaluationData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error creating task evaluation:", error)
    return NextResponse.json({ error: "Failed to create task evaluation" }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("task_evaluations")
      .select("*")
      .eq("task_id", params.id)
      .order("evaluation_date", { ascending: false })

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error fetching task evaluations:", error)
    return NextResponse.json({ error: "Failed to fetch task evaluations" }, { status: 500 })
  }
}
// [file content end]