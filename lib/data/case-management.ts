import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
import type { 
  CaseRegister, CaseRegisterInput,
  CaseAssessment, CaseAssessmentInput, 
  CaseService, CaseServiceInput 
} from '@/lib/types/case-management';

// Case Register Operations
export const caseManagement = {
  // CASE REGISTER
  getCases: async (): Promise<CaseRegister[]> => {
    const { data, error } = await supabase
      .from('case_registers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as CaseRegister[];
  },

  getCase: async (caseId: string): Promise<CaseRegister | null> => {
    const { data, error } = await supabase
      .from('case_registers')
      .select('*')
      .eq('case_id', caseId)
      .single();
    
    if (error) return null;
    return data as CaseRegister;
  },

  createCase: async (caseData: CaseRegisterInput): Promise<CaseRegister> => {
    const { data, error } = await supabase
      .from('case_registers')
      .insert([caseData])
      .select()
      .single();
    
    if (error) throw error;
    return data as CaseRegister;
  },

  updateCase: async (caseId: string, caseData: Partial<CaseRegisterInput>): Promise<CaseRegister> => {
    const { data, error } = await supabase
      .from('case_registers')
      .update(caseData)
      .eq('case_id', caseId)
      .select()
      .single();
    
    if (error) throw error;
    return data as CaseRegister;
  },

  deleteCase: async (caseId: string): Promise<void> => {
    const { error } = await supabase
      .from('case_registers')
      .delete()
      .eq('case_id', caseId);
    
    if (error) throw error;
  },

  // CASE ASSESSMENTS
  getAssessments: async (caseId?: string): Promise<CaseAssessment[]> => {
    let query = supabase
      .from('case_assessments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (caseId) {
      query = query.eq('case_id', caseId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as CaseAssessment[];
  },

  getAssessment: async (assessmentId: number): Promise<CaseAssessment | null> => {
    const { data, error } = await supabase
      .from('case_assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();
    
    if (error) return null;
    return data as CaseAssessment;
  },

  createAssessment: async (assessmentData: CaseAssessmentInput): Promise<CaseAssessment> => {
    const { data, error } = await supabase
      .from('case_assessments')
      .insert([assessmentData])
      .select()
      .single();
    
    if (error) throw error;
    return data as CaseAssessment;
  },

  updateAssessment: async (assessmentId: number, assessmentData: Partial<CaseAssessmentInput>): Promise<CaseAssessment> => {
    const { data, error } = await supabase
      .from('case_assessments')
      .update(assessmentData)
      .eq('id', assessmentId)
      .select()
      .single();
    
    if (error) throw error;
    return data as CaseAssessment;
  },

  deleteAssessment: async (assessmentId: number): Promise<void> => {
    const { error } = await supabase
      .from('case_assessments')
      .delete()
      .eq('id', assessmentId);
    
    if (error) throw error;
  },

  // CASE SERVICES
  getServices: async (caseId?: string): Promise<CaseService[]> => {
    let query = supabase
      .from('case_services')
      .select('*')
      .order('service_date', { ascending: false });
    
    if (caseId) {
      query = query.eq('case_id', caseId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as CaseService[];
  },

  getService: async (serviceId: number): Promise<CaseService | null> => {
    const { data, error } = await supabase
      .from('case_services')
      .select('*')
      .eq('id', serviceId)
      .single();
    
    if (error) return null;
    return data as CaseService;
  },

  createService: async (serviceData: CaseServiceInput): Promise<CaseService> => {
    const { data, error } = await supabase
      .from('case_services')
      .insert([serviceData])
      .select()
      .single();
    
    if (error) throw error;
    return data as CaseService;
  },

  updateService: async (serviceId: number, serviceData: Partial<CaseServiceInput>): Promise<CaseService> => {
    const { data, error } = await supabase
      .from('case_services')
      .update(serviceData)
      .eq('id', serviceId)
      .select()
      .single();
    
    if (error) throw error;
    return data as CaseService;
  },

  deleteService: async (serviceId: number): Promise<void> => {
    const { error } = await supabase
      .from('case_services')
      .delete()
      .eq('id', serviceId);
    
    if (error) throw error;
  },

  // DASHBOARD STATS
  getStats: async () => {
    const [cases, assessments, services] = await Promise.all([
      caseManagement.getCases(),
      caseManagement.getAssessments(),
      caseManagement.getServices()
    ]);

    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.case_status === 'ACTIVE').length;
    const highRiskCases = assessments.filter(a => 
      a.safety_risk_level === 'HIGH' || a.safety_risk_level === 'CRITICAL'
    ).length;
    const servicesThisMonth = services.filter(s => {
      const serviceDate = new Date(s.service_date);
      const now = new Date();
      return serviceDate.getMonth() === now.getMonth() && serviceDate.getFullYear() === now.getFullYear();
    }).length;
    const pendingAssessments = cases.length - assessments.length;

    return {
      total_cases: totalCases,
      active_cases: activeCases,
      high_risk_cases: highRiskCases,
      services_this_month: servicesThisMonth,
      pending_assessments: pendingAssessments,
    };
  }
};