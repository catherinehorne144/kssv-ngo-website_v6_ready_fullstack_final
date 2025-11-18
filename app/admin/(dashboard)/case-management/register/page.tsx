import { CaseRegisterManager } from '@/components/admin/case-management/CaseRegisterManager'
import { AdminHeader } from '@/components/admin/header'

export default function CaseRegisterPage() {
  return (
    <div>
      <AdminHeader 
        title="Case Register" 
        description="Manage all survivor cases, view details, and track progress"
      />
      <CaseRegisterManager />
    </div>
  )
}