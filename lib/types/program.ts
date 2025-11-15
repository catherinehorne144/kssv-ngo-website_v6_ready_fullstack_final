// [file name]: lib/types/program.ts
// [file content begin - ENHANCED WITH M&E TYPES]
export interface Program {
  id: string
  name: string
  description: string
  year: number
  status: 'active' | 'completed' | 'planned'
  public_visible: boolean
  budget_total: number
  created_at: string
  updated_at: string
  focus_area: 'GBV Management' | 'Survivor Empowerment' | 'Institutional Development' | 'SRH Rights' | 'Other'
  program_image: string
  strategic_objective?: string
  location: string
}

export interface Activity {
  id: string
  program_id: string
  name: string
  description: string
  outcome: string
  kpi: string
  timeline_start: string
  timeline_end: string
  budget_allocated: number
  budget_utilized: number
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled'
  responsible_person: string
  progress: number
  challenges?: string
  next_steps?: string
}

export interface Task {
  id: string
  activity_id: string
  name: string
  target: number | null
  task_timeline: string | null
  activity_timeline: string
  budget: number
  output: string | null
  outcome: string | null
  evaluation_criteria: string | null
  risks: string | null
  mitigation_measures: string | null
  resource_person: string | null
  status: number | null
  learning_and_development: string | null
  self_evaluation: string | null
  notes: string | null
}

// M&E SPECIFIC INTERFACES
export interface TaskEvaluation {
  id: string
  task_id: string
  evaluation_date: string
  progress_rating: number // 1-10 scale
  quality_rating: number // 1-10 scale
  challenges_encountered: string
  success_factors: string
  adjustments_made: string
  lessons_learned: string
  recommendations: string
  evaluator_name: string
  next_evaluation_date: string
  created_at: string
}

export interface RiskAssessment {
  id: string
  task_id: string
  risk_description: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  mitigation_strategy: string
  status: 'open' | 'mitigated' | 'closed'
  assigned_to: string
  created_at: string
}

export interface ProgramWithDetails extends Program {
  activities: Activity[]
  tasks: Task[]
  task_evaluations: TaskEvaluation[]
  risk_assessments: RiskAssessment[]
  impact_metrics: {
    beneficiaries_reached: number
    activities_completed: number
    budget_utilized: number
    success_rate: number
  }
  analytics?: ProgramAnalytics
}

// ANALYTICS INTERFACES
export interface ProgramAnalytics {
  program_id: string
  overall_completion: number
  budget_utilization_rate: number
  task_performance: {
    on_track: number
    behind: number
    at_risk: number
    completed: number
  }
  focus_area_performance: {
    area: string
    completion_rate: number
    budget_utilization: number
    task_success: number
  }[]
  common_challenges: {
    challenge: string
    frequency: number
    impact: 'low' | 'medium' | 'high'
  }[]
  risk_analysis: {
    risk_type: string
    probability: number
    severity: number
    mitigation_effectiveness: number
  }[]
  trends: {
    period: string
    completion_rate: number
    budget_utilization: number
    beneficiary_reach: number
  }[]
}

// FOCUS AREA METADATA
export interface FocusArea {
  id: 'gbv' | 'empowerment' | 'institutional' | 'srh'
  name: string
  description: string
  strategic_outcome: string
  kpi: string
  color: string
}

// EXPORT INTERFACES
export interface ExportConfig {
  includeProgramDetails: boolean
  includeActivities: boolean
  includeTasks: boolean
  includeMEData: boolean
  includeAnalytics: boolean
  format: 'csv' | 'excel' | 'pdf'
  scope: 'current' | 'all' | 'dateRange'
  startDate?: string
  endDate?: string
  programId?: string
}
// [file content end]