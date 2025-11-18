import { CaseManagementDashboard } from '@/components/admin/case-management/CaseManagementDashboard'
import { AdminHeader } from '@/components/admin/header'

export default function CaseManagementPage() {
  return (
    <div>
      <AdminHeader 
        title="Case Management" 
        description="Manage survivor cases, assessments, services, and track progress"
      />
      <CaseManagementDashboard />
    </div>
  )
}