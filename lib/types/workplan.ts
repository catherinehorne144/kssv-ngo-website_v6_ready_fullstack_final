// [file name]: lib/types/workplan.ts
// [file content begin]
export interface Workplan {
  id: string
  focus_area: string
  activity_name: string
  timeline_text: string
  quarter: string | null
  tasks_description: string
  target: string | null
  budget_allocated: number
  output: string | null
  outcome: string | null
  kpi: string | null
  means_of_verification: string | null
  risks: string | null
  mitigation_measures: string | null
  resource_person: string | null
  status: string | null
  progress: number | null
  learning_development: string | null
  self_evaluation: string | null
  notes: string | null
  public_visible: boolean | null
  program_image: string | null
  created_at: string
  updated_at: string
}

export interface WorkplanFormData {
  focus_area: string
  activity_name: string
  timeline_text: string
  quarter: string
  tasks_description: string
  target: string
  budget_allocated: string
  output: string
  outcome: string
  kpi: string
  means_of_verification: string
  risks: string
  mitigation_measures: string
  resource_person: string
  status: string
  progress: string
  learning_development: string
  self_evaluation: string
  notes: string
  public_visible: boolean
  program_image: string
}

export interface ExportConfig {
  includeProgramDetails?: boolean
  includeActivities?: boolean
  includeTasks?: boolean
  includeMEData?: boolean
  includeAnalytics?: boolean
  format: 'csv' | 'excel' | 'pdf'
  scope: 'current' | 'all' | 'dateRange'
  workplanId?: string
  startDate?: string
  endDate?: string
}
// [file content end]