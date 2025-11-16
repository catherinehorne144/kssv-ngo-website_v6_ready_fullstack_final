// [file name]: app/api/programs/route.ts
// [file content begin]
import { createServerClientInstance } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📦 Received program data:", body)

    const supabase = await createClient()

    const newProgram = {
      name: body.name,
      description: body.description,
      year: parseInt(body.year),
      status: body.status,
      public_visible: body.public_visible !== undefined ? body.public_visible : true,
      budget_total: parseInt(body.budget_total),
      focus_area: body.focus_area,
      program_image: body.program_image || null,
      strategic_objective: body.strategic_objective || null,
      location: body.location || 'Migori County',
      created_at: new Date().toISOString()
    }

    console.log("🚀 Inserting into Supabase:", newProgram)

    const { data, error } = await supabase
      .from("programs")
      .insert([newProgram])
      .select(`
        *,
        activities (
          *,
          tasks (*)
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

    // Add impact metrics for new program
    const programWithMetrics = {
      ...data,
      impact_metrics: {
        beneficiaries_reached: 0,
        activities_completed: 0,
        budget_utilized: 0,
        success_rate: 0
      }
    }

    console.log("✅ Program created successfully:", programWithMetrics)
    return NextResponse.json(programWithMetrics, { status: 201 })

  } catch (error) {
    console.error("❌ Server error:", error)
    return NextResponse.json({ 
      error: "Failed to create program",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const year = searchParams.get('year')
    const focus_area = searchParams.get('focus_area')

    let query = supabase
      .from("programs")
      .select(`
        *,
        activities (
          *,
          tasks (*)
        )
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (year && year !== 'all') {
      query = query.eq('year', parseInt(year))
    }
    if (focus_area && focus_area !== 'all') {
      query = query.eq('focus_area', focus_area)
    }

    const { data, error } = await query

    if (error) throw error

    // Transform data with impact metrics
    const programsWithMetrics = data?.map(program => {
      const activities = program.activities || []
      const totalBudgetUtilized = activities.reduce((sum: number, activity: any) => sum + (activity.budget_utilized || 0), 0)
      const completedActivities = activities.filter((activity: any) => activity.status === 'completed').length
      const totalProgress = activities.reduce((sum: number, activity: any) => sum + (activity.progress || 0), 0)
      const averageSuccessRate = activities.length > 0 ? Math.round(totalProgress / activities.length) : 0

      return {
        ...program,
        impact_metrics: {
          beneficiaries_reached: totalProgress,
          activities_completed: completedActivities,
          budget_utilized: totalBudgetUtilized,
          success_rate: averageSuccessRate
        }
      }
    }) || []

    return NextResponse.json(programsWithMetrics, { status: 200 })
  } catch (error) {
    console.error("Error fetching programs:", error)
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 })
  }
}
// [file content end]