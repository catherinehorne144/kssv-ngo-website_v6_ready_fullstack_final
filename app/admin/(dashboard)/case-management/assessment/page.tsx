import { AssessmentManager } from '@/components/admin/case-management/AssessmentManager'
import { AdminHeader } from '@/components/admin/header'

export default function AssessmentsPage() {
  return (
    <div>
      <AdminHeader 
        title="Case Assessments" 
        description="Manage comprehensive case assessments and risk evaluations"
      />
      <AssessmentManager />
    </div>
  )
}