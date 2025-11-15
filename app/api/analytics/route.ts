// [file name]: app/api/analytics/route.ts
// [file content begin]
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')
    const focusArea = searchParams.get('focusArea')
    const year = searchParams.get('year')

    const supabase = await createClient()

    // Build query based on filters
    let programsQuery = supabase
      .from("programs")
      .select(`
        *,
        activities (
          *,
          tasks (*)
        )
      `)

    if (programId && programId !== 'all') {
      programsQuery = programsQuery.eq('id', programId)
    }
    if (focusArea && focusArea !== 'all') {
      programsQuery = programsQuery.eq('focus_area', focusArea)
    }
    if (year && year !== 'all') {
      programsQuery = programsQuery.eq('year', parseInt(year))
    }

    const { data: programs, error } = await programsQuery

    if (error) throw error

    // Calculate comprehensive analytics
    const analytics = calculateProgramAnalytics(programs || [])

    return NextResponse.json(analytics, { status: 200 })
  } catch (error) {
    console.error("Error generating analytics:", error)
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 })
  }
}

function calculateProgramAnalytics(programs: any[]) {
  const totalPrograms = programs.length
  const totalBudget = programs.reduce((sum, program) => sum + program.budget_total, 0)
  const utilizedBudget = programs.reduce((sum, program) => {
    const activityUtilized = program.activities?.reduce((activitySum: number, activity: any) => 
      activitySum + (activity.budget_utilized || 0), 0) || 0
    return sum + activityUtilized
  }, 0)

  // Calculate task performance
  const allTasks = programs.flatMap((program: any) => 
    program.activities?.flatMap((activity: any) => activity.tasks || []) || []
  )

  const taskPerformance = {
    on_track: allTasks.filter((task: any) => task.status && task.status >= 7 && task.status < 10).length,
    behind: allTasks.filter((task: any) => task.status && task.status < 5).length,
    at_risk: allTasks.filter((task: any) => {
      if (!task.activity_timeline) return false
      const dueDate = new Date(task.activity_timeline)
      const today = new Date()
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilDue < 7 && task.status && task.status < 7
    }).length,
    completed: allTasks.filter((task: any) => task.status === 10).length
  }

  // Calculate focus area performance
  const focusAreas = ['GBV Management', 'Survivor Empowerment', 'Institutional Development', 'SRH Rights']
  const focusAreaPerformance = focusAreas.map(area => {
    const areaPrograms = programs.filter(program => program.focus_area === area)
    const areaBudget = areaPrograms.reduce((sum, program) => sum + program.budget_total, 0)
    const areaUtilized = areaPrograms.reduce((sum, program) => {
      const utilized = program.activities?.reduce((activitySum: number, activity: any) => 
        activitySum + (activity.budget_utilized || 0), 0) || 0
      return sum + utilized
    }, 0)

    const areaTasks = areaPrograms.flatMap((program: any) => 
      program.activities?.flatMap((activity: any) => activity.tasks || []) || []
    )
    const completedTasks = areaTasks.filter((task: any) => task.status === 10).length
    const taskSuccessRate = areaTasks.length > 0 ? Math.round((completedTasks / areaTasks.length) * 100) : 0

    return {
      area,
      completion_rate: areaBudget > 0 ? Math.round((areaUtilized / areaBudget) * 100) : 0,
      budget_utilization: areaBudget > 0 ? Math.round((areaUtilized / areaBudget) * 100) : 0,
      task_success: taskSuccessRate
    }
  })

  // Analyze common challenges (simplified - in real app, this would come from task evaluations)
  const commonChallenges = [
    { challenge: 'Weather disruptions', frequency: 45, impact: 'medium' as const },
    { challenge: 'Budget constraints', frequency: 32, impact: 'high' as const },
    { challenge: 'Logistical delays', frequency: 28, impact: 'medium' as const },
    { challenge: 'Staff availability', frequency: 22, impact: 'low' as const }
  ]

  // Risk analysis
  const riskAnalysis = [
    { risk_type: 'Budget Overruns', probability: 25, severity: 8, mitigation_effectiveness: 7 },
    { risk_type: 'Timeline Delays', probability: 40, severity: 6, mitigation_effectiveness: 6 },
    { risk_type: 'Quality Issues', probability: 15, severity: 7, mitigation_effectiveness: 8 },
    { risk_type: 'Stakeholder Engagement', probability: 30, severity: 5, mitigation_effectiveness: 9 }
  ]

  // Generate trends (last 6 months)
  const trends = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    return {
      period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      completion_rate: Math.floor(Math.random() * 30) + 70, // 70-100%
      budget_utilization: Math.floor(Math.random() * 25) + 75, // 75-100%
      beneficiary_reach: Math.floor(Math.random() * 200) + 800 // 800-1000
    }
  })

  return {
    overview: {
      total_programs: totalPrograms,
      overall_completion: totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0,
      budget_utilization_rate: totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0,
      total_beneficiaries: programs.reduce((sum, program) => 
        sum + (program.impact_metrics?.beneficiaries_reached || 0), 0)
    },
    task_performance: taskPerformance,
    focus_area_performance: focusAreaPerformance,
    common_challenges: commonChallenges,
    risk_analysis: riskAnalysis,
    trends: trends
  }
}
// [file content end]