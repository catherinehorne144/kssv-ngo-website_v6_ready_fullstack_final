export interface Workplan {
  id: string;
  focus_area: string;
  activity_name: string;
  timeline_text: string;
  quarter?: string;
  tasks_description: string;
  target?: string;
  budget_allocated: number;
  resource_person?: string;
  status: 'planned' | 'in-progress' | 'completed';
  progress: number;
  public_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MerlEntry {
  id: string;
  workplan_id: string;
  output?: string;
  outcome?: string;
  kpi?: string;
  means_of_verification?: string;
  risks?: string;
  mitigation_measures?: string;
  learning_development?: string;
  self_evaluation?: string;
  notes?: string;
  merl_status: 'draft' | 'in-review' | 'approved';
  created_at: string;
  updated_at: string;
}

export interface WorkplanFormData {
  focus_area: string;
  activity_name: string;
  timeline_text: string;
  quarter: string;
  tasks_description: string;
  target: string;
  budget_allocated: string;
  resource_person: string;
  status: string;
  progress: string;
  public_visible: boolean;
}