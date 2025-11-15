// [file name]: app/api/export/route.ts
// [file content begin - FIXED WITHOUT EXTERNAL DEPENDENCIES]
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Simple CSV generator without external dependencies
function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvHeaders = headers.map(header => `"${header}"`).join(',')
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      // Handle values that might contain commas or quotes
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      return `"${stringValue.replace(/"/g, '""')}"`
    }).join(',')
  })
  
  return [csvHeaders, ...csvRows].join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      includeProgramDetails, 
      includeActivities, 
      includeTasks, 
      includeMEData, 
      includeAnalytics,
      format,
      scope,
      startDate,
      endDate,
      programId 
    } = body

    const supabase = await createClient()

    // Build query based on scope
    let programsQuery = supabase
      .from("programs")
      .select(`
        *,
        activities (
          *,
          tasks (*)
        )
      `)

    if (scope === 'current' && programId) {
      programsQuery = programsQuery.eq('id', programId)
    } else if (scope === 'dateRange' && startDate && endDate) {
      programsQuery = programsQuery
        .gte('created_at', startDate)
        .lte('created_at', endDate)
    }

    const { data: programs, error } = await programsQuery

    if (error) throw error

    // Generate export data based on selections
    const exportData: any = {}

    if (includeProgramDetails) {
      exportData.programs = programs?.map(program => ({
        'Program ID': program.id,
        'Program Name': program.name,
        'Description': program.description,
        'Focus Area': program.focus_area,
        'Year': program.year,
        'Status': program.status,
        'Budget Total': program.budget_total,
        'Location': program.location,
        'Strategic Objective': program.strategic_objective,
        'Public Visible': program.public_visible,
        'Created At': program.created_at
      })) || []
    }

    if (includeActivities) {
      exportData.activities = programs?.flatMap(program => 
        program.activities?.map((activity: any) => ({
          'Activity ID': activity.id,
          'Program ID': activity.program_id,
          'Activity Name': activity.name,
          'Description': activity.description,
          'Outcome': activity.outcome,
          'KPI': activity.kpi,
          'Start Date': activity.timeline_start,
          'End Date': activity.timeline_end,
          'Budget Allocated': activity.budget_allocated,
          'Budget Utilized': activity.budget_utilized,
          'Status': activity.status,
          'Progress': activity.progress,
          'Responsible Person': activity.responsible_person,
          'Challenges': activity.challenges,
          'Next Steps': activity.next_steps
        })) || []
      ) || []
    }

    if (includeTasks) {
      exportData.tasks = programs?.flatMap(program => 
        program.activities?.flatMap((activity: any) => 
          activity.tasks?.map((task: any) => ({
            'Task ID': task.id,
            'Activity ID': task.activity_id,
            'Task Name': task.name,
            'Target': task.target,
            'Task Timeline': task.task_timeline,
            'Activity Timeline': task.activity_timeline,
            'Budget': task.budget,
            'Output': task.output,
            'Outcome': task.outcome,
            'Evaluation Criteria': task.evaluation_criteria,
            'Risks': task.risks,
            'Mitigation Measures': task.mitigation_measures,
            'Resource Person': task.resource_person,
            'Status': task.status,
            'Learning & Development': task.learning_and_development,
            'Self Evaluation': task.self_evaluation,
            'Notes': task.notes
          })) || []
        ) || []
      ) || []
    }

    if (includeAnalytics) {
      const analytics = calculateProgramAnalytics(programs || [])
      exportData.analytics = [analytics.overview]
      exportData.performance = analytics.task_performance
      exportData.focus_areas = analytics.focus_area_performance
    }

    // Generate CSV files using our custom function
    const csvFiles: { [key: string]: string } = {}

    for (const [sheetName, data] of Object.entries(exportData)) {
      if (Array.isArray(data) && data.length > 0) {
        csvFiles[`${sheetName}.csv`] = convertToCSV(data)
      }
    }

    // For Excel format, we would typically use a library like exceljs
    // For this example, we'll return CSV files
    if (format === 'csv') {
      return NextResponse.json({
        files: csvFiles,
        message: 'Export generated successfully'
      }, { status: 200 })
    } else {
      return NextResponse.json({
        error: 'Excel and PDF export not implemented in this example',
        available_formats: ['csv'],
        generated_files: Object.keys(csvFiles)
      }, { status: 501 })
    }

  } catch (error) {
    console.error("Error generating export:", error)
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 })
  }
}

// Reuse analytics calculation from analytics/route.ts
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

  return {
    overview: {
      total_programs: totalPrograms,
      overall_completion: totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0,
      budget_utilization_rate: totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0,
      total_beneficiaries: programs.reduce((sum, program) => 
        sum + (program.impact_metrics?.beneficiaries_reached || 0), 0)
    },
    task_performance: taskPerformance,
    focus_area_performance: focusAreaPerformance
  }
}
// [file content end]