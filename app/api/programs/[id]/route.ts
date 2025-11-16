// [file name]: app/api/programs/[id]/route.ts
// [file content begin]
import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { data, error } = await supabase
      .from("programs")
      .select(`
        *,
        activities (
          *,
          tasks (*)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    // Transform with impact metrics
    const activities = data.activities || []
    const totalBudgetUtilized = activities.reduce((sum: number, activity: any) => sum + (activity.budget_utilized || 0), 0)
    const completedActivities = activities.filter((activity: any) => activity.status === 'completed').length
    const totalProgress = activities.reduce((sum: number, activity: any) => sum + (activity.progress || 0), 0)
    const averageSuccessRate = activities.length > 0 ? Math.round(totalProgress / activities.length) : 0

    const programWithMetrics = {
      ...data,
      impact_metrics: {
        beneficiaries_reached: totalProgress,
        activities_completed: completedActivities,
        budget_utilized: totalBudgetUtilized,
        success_rate: averageSuccessRate
      }
    }

    return NextResponse.json(programWithMetrics, { status: 200 })
  } catch (error) {
    console.error("Error fetching program:", error)
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const body = await request.json()

    const updateData = {
      name: body.name,
      description: body.description,
      year: parseInt(body.year),
      status: body.status,
      public_visible: body.public_visible,
      budget_total: parseInt(body.budget_total),
      focus_area: body.focus_area,
      program_image: body.program_image || null,
      strategic_objective: body.strategic_objective || null,
      location: body.location
    }

    const { data, error } = await supabase
      .from("programs")
      .update(updateData)
      .eq("id", params.id)
      .select(`
        *,
        activities (
          *,
          tasks (*)
        )
      `)
      .single()

    if (error) throw error

    // Transform with impact metrics
    const activities = data.activities || []
    const totalBudgetUtilized = activities.reduce((sum: number, activity: any) => sum + (activity.budget_utilized || 0), 0)
    const completedActivities = activities.filter((activity: any) => activity.status === 'completed').length
    const totalProgress = activities.reduce((sum: number, activity: any) => sum + (activity.progress || 0), 0)
    const averageSuccessRate = activities.length > 0 ? Math.round(totalProgress / activities.length) : 0

    const programWithMetrics = {
      ...data,
      impact_metrics: {
        beneficiaries_reached: totalProgress,
        activities_completed: completedActivities,
        budget_utilized: totalBudgetUtilized,
        success_rate: averageSuccessRate
      }
    }

    return NextResponse.json(programWithMetrics, { status: 200 })
  } catch (error) {
    console.error("Error updating program:", error)
    return NextResponse.json({ error: "Failed to update program" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClientInstance()
    const { error } = await supabase.from("programs").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting program:", error)
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 })
  }
}
// [file content end]