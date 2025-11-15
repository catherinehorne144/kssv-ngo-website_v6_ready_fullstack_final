// [file name]: lib/data/program-data.ts
// [file content begin]
import type { ProgramWithDetails, FocusArea } from '@/lib/types/program'

export const focusAreas: FocusArea[] = [
  {
    id: 'gbv',
    name: 'GBV Management',
    description: 'Comprehensive support for gender-based violence survivors including legal aid, psychosocial support, and safe shelter',
    strategic_outcome: 'Reduce GBV incidence by 40% and increase access to justice by 2026',
    kpi: '500+ survivors supported annually with 85% satisfaction rate',
    color: 'red'
  },
  {
    id: 'empowerment',
    name: 'Survivor Empowerment',
    description: 'Economic empowerment and livelihood programs for sustainable recovery',
    strategic_outcome: '75% of supported survivors achieve economic independence within 2 years',
    kpi: '300+ women engaged in income-generating activities annually',
    color: 'green'
  },
  {
    id: 'institutional',
    name: 'Institutional Development',
    description: 'Building organizational capacity for sustainable impact and service delivery',
    strategic_outcome: 'Enhanced organizational efficiency and 100% reporting compliance',
    kpi: '20+ staff trained annually with 95% capacity improvement',
    color: 'blue'
  },
  {
    id: 'srh',
    name: 'SRH Rights',
    description: 'Sexual and reproductive health education, services, and rights advocacy',
    strategic_outcome: 'Increase SRH knowledge by 60% and service access by 50% by 2026',
    kpi: '1000+ youth reached annually with SRH information and services',
    color: 'purple'
  }
]

export const samplePrograms: ProgramWithDetails[] = [
  {
    id: 'gbv-management-2025',
    name: 'Comprehensive Gender-Based Violence (GBV) Management',
    description: 'End-to-end support for survivors of sexual violence, from initial reporting through legal proceedings and beyond. We ensure survivors have access to justice while maintaining their dignity and safety.',
    year: 2025,
    status: 'active',
    public_visible: true,
    budget_total: 2500000,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    focus_area: 'GBV Management',
    program_image: '/programs/gbv-management.jpg',
    strategic_objective: 'Provide comprehensive GBV response services and reduce case backlog by 60%',
    location: 'Migori County',
    impact_metrics: {
      beneficiaries_reached: 150,
      activities_completed: 8,
      budget_utilized: 850000,
      success_rate: 85
    },
    activities: [
      {
        id: 'activity-1',
        program_id: 'gbv-management-2025',
        name: 'Legal Aid and Court Representation',
        description: 'Provide free legal services and court accompaniment for survivors',
        outcome: 'Increased access to justice for GBV survivors',
        kpi: '15 court cases represented, 80% success rate',
        timeline_start: '2025-01-01',
        timeline_end: '2025-12-31',
        budget_allocated: 800000,
        budget_utilized: 450000,
        status: 'in-progress',
        responsible_person: 'Legal Team',
        progress: 65,
        challenges: 'Court delays and limited legal aid resources',
        next_steps: 'Hire additional legal officer and streamline case management'
      },
      {
        id: 'activity-2',
        program_id: 'gbv-management-2025',
        name: 'Psychosocial Counseling',
        description: 'Trauma-informed counseling and mental health support',
        outcome: 'Improved mental health and wellbeing of survivors',
        kpi: '100+ counseling sessions provided',
        timeline_start: '2025-01-01',
        timeline_end: '2025-12-31',
        budget_allocated: 500000,
        budget_utilized: 300000,
        status: 'in-progress',
        responsible_person: 'Counseling Team',
        progress: 75,
        challenges: 'High demand for services exceeding capacity',
        next_steps: 'Train peer counselors and expand service hours'
      }
    ],
    tasks: [
      {
        id: 'task-1',
        activity_id: 'activity-1',
        name: 'Legal case documentation',
        target: 15,
        task_timeline: '2 weeks',
        activity_timeline: '2025-01-30',
        budget: 150000,
        output: 'Case files organized',
        outcome: 'Efficient case management',
        evaluation_criteria: '100% case documentation completeness',
        risks: 'Missing case information',
        mitigation_measures: 'Regular follow-ups with clients',
        resource_person: 'Legal Officer',
        status: 8,
        learning_and_development: 'Improved legal documentation skills',
        self_evaluation: 'Good progress on case organization',
        notes: 'Need digital case management system'
      }
    ]
  },
  {
    id: 'survivor-empowerment-2025',
    name: 'Survivor Empowerment Program',
    description: 'Economic empowerment through VSLAs, skills training, and seed capital support. We believe economic independence is crucial for long-term recovery and healing.',
    year: 2025,
    status: 'active',
    public_visible: true,
    budget_total: 1800000,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    focus_area: 'Survivor Empowerment',
    program_image: '/programs/empowerment.jpg',
    strategic_objective: 'Enable 200 survivors to achieve economic independence through skills and capital',
    location: 'Migori County',
    impact_metrics: {
      beneficiaries_reached: 200,
      activities_completed: 6,
      budget_utilized: 650000,
      success_rate: 78
    },
    activities: [
      {
        id: 'activity-3',
        program_id: 'survivor-empowerment-2025',
        name: 'Village Savings and Loan Associations',
        description: 'Establish community-based savings groups for economic resilience',
        outcome: 'Increased financial independence for survivors',
        kpi: '10 VSLAs established, 200 members',
        timeline_start: '2025-01-01',
        timeline_end: '2025-12-31',
        budget_allocated: 600000,
        budget_utilized: 350000,
        status: 'in-progress',
        responsible_person: 'Economic Empowerment Officer',
        progress: 70,
        challenges: 'Low financial literacy among members',
        next_steps: 'Conduct financial literacy training'
      },
      {
        id: 'activity-4',
        program_id: 'survivor-empowerment-2025',
        name: 'Business Skills Training',
        description: 'Entrepreneurship and small business management workshops',
        outcome: 'Enhanced business capabilities and income generation',
        kpi: '150 survivors trained, 30 business startups',
        timeline_start: '2025-01-01',
        timeline_end: '2025-12-31',
        budget_allocated: 500000,
        budget_utilized: 200000,
        status: 'planned',
        responsible_person: 'Training Coordinator',
        progress: 20,
        challenges: 'Venue availability for workshops',
        next_steps: 'Secure community hall for training sessions'
      }
    ],
    tasks: []
  },
  {
    id: 'institutional-development-2025',
    name: 'Institutional Development',
    description: 'Building organizational capacity through training, governance, and monitoring & evaluation systems for sustainable impact.',
    year: 2025,
    status: 'active',
    public_visible: true,
    budget_total: 1200000,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    focus_area: 'Institutional Development',
    program_image: '/programs/institutional.jpg',
    strategic_objective: 'Strengthen organizational systems for 50% improved efficiency',
    location: 'Migori County',
    impact_metrics: {
      beneficiaries_reached: 100,
      activities_completed: 4,
      budget_utilized: 450000,
      success_rate: 90
    },
    activities: [
      {
        id: 'activity-5',
        program_id: 'institutional-development-2025',
        name: 'Staff Capacity Building',
        description: 'Training and professional development for team members',
        outcome: 'Enhanced service delivery and program effectiveness',
        kpi: '20 staff trained, 95% satisfaction rate',
        timeline_start: '2025-01-01',
        timeline_end: '2025-12-31',
        budget_allocated: 400000,
        budget_utilized: 250000,
        status: 'completed',
        responsible_person: 'HR Manager',
        progress: 100,
        challenges: 'Scheduling conflicts for training sessions',
        next_steps: 'Plan advanced training for Q3 2025'
      }
    ],
    tasks: []
  },
  {
    id: 'srh-rights-2025',
    name: 'Sexual Reproductive Health & Rights Promotion',
    description: 'Comprehensive SRH education, services, and rights advocacy for adolescents and young women. Empowering communities with knowledge and access to reproductive health services.',
    year: 2025,
    status: 'active',
    public_visible: true,
    budget_total: 2200000,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    focus_area: 'SRH Rights',
    program_image: '/programs/srh-rights.jpg',
    strategic_objective: 'Increase SRH service uptake by 60% among youth in target communities',
    location: 'Migori County',
    impact_metrics: {
      beneficiaries_reached: 300,
      activities_completed: 7,
      budget_utilized: 950000,
      success_rate: 82
    },
    activities: [
      {
        id: 'activity-6',
        program_id: 'srh-rights-2025',
        name: 'SRH Education Workshops',
        description: 'Community workshops on reproductive health and rights',
        outcome: 'Increased SRH knowledge and awareness',
        kpi: '40 workshops conducted, 500+ participants',
        timeline_start: '2025-01-01',
        timeline_end: '2025-12-31',
        budget_allocated: 600000,
        budget_utilized: 400000,
        status: 'in-progress',
        responsible_person: 'SRH Educator',
        progress: 80,
        challenges: 'Cultural barriers in some communities',
        next_steps: 'Engage community leaders for support'
      }
    ],
    tasks: []
  }
]
// [file content end]