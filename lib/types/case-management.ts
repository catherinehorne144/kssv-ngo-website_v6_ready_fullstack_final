// Base interface with common fields
interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// Case Register (P11 Register)
export interface CaseRegister extends BaseEntity {
  case_id: string;
  case_status: 'ACTIVE' | 'ON_HOLD' | 'CLOSED' | 'INACTIVE';
  name: string;
  contact_no?: string;
  emergency_no?: string;
  consent_status: boolean;
  date_sharing_consent?: string; // ISO date string
}

// Case Assessment (Case Data & Assessment)
export interface CaseAssessment extends BaseEntity {
  case_id: string;
  date_of_intake?: string; // ISO date string
  service_needs: ServiceNeed[];
  safety_risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primary_goal?: string;
  services_provided_log?: string;
  referral_tracking?: string;
  case_notes?: string;
  case_closure: boolean;
  reason_for_closure?: string;
}

// Service Types
export type ServiceNeed = 
  | 'COUNSELING'
  | 'LEGAL'
  | 'MEDICAL'
  | 'SHELTER'
  | 'EMPLOYMENT'
  | 'EDUCATION'
  | 'OTHER';

// Case Services (Services, Actions and Notes)
export interface CaseService extends BaseEntity {
  case_id: string;
  service_date: string; // ISO date string
  service_type: ServiceType;
  service_provider?: string;
  actions_taken?: string;
  notes_observations?: string;
  next_steps?: string;
  follow_up_date?: string; // ISO date string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export type ServiceType = 
  | 'COUNSELING'
  | 'LEGAL_AID'
  | 'MEDICAL'
  | 'SHELTER'
  | 'EMPLOYMENT'
  | 'EDUCATION'
  | 'VOCATIONAL_TRAINING'
  | 'FAMILY_COUNSELING'
  | 'CRISIS_INTERVENTION'
  | 'OTHER';

// Form Input Types (for creating/updating)
export interface CaseRegisterInput {
  case_id?: string; // Auto-generated if not provided
  case_status: 'ACTIVE' | 'ON_HOLD' | 'CLOSED' | 'INACTIVE';
  name: string;
  contact_no?: string;
  emergency_no?: string;
  consent_status: boolean;
  date_sharing_consent?: string;
}

export interface CaseAssessmentInput {
  case_id: string;
  date_of_intake?: string;
  service_needs: ServiceNeed[];
  safety_risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primary_goal?: string;
  services_provided_log?: string;
  referral_tracking?: string;
  case_notes?: string;
  case_closure: boolean;
  reason_for_closure?: string;
}

export interface CaseServiceInput {
  case_id: string;
  service_date: string;
  service_type: ServiceType;
  service_provider?: string;
  actions_taken?: string;
  notes_observations?: string;
  next_steps?: string;
  follow_up_date?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// Dashboard Statistics
export interface CaseManagementStats {
  total_cases: number;
  active_cases: number;
  high_risk_cases: number;
  services_this_month: number;
  pending_assessments: number;
  closed_cases: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

// Filter Types
export interface CaseFilter {
  status?: string;
  risk_level?: string;
  service_needs?: ServiceNeed[];
  date_from?: string;
  date_to?: string;
}

export interface ServiceFilter {
  case_id?: string;
  service_type?: ServiceType;
  status?: string;
  date_from?: string;
  date_to?: string;
}

// Search Types
export interface CaseSearch {
  query: string;
  fields: ('case_id' | 'name' | 'contact_no')[];
}

// Export all types
export type {
  ServiceNeed as ServiceNeedType,
  ServiceType as ServiceType
};