import { ProgramManager } from '@/components/programs/admin/ProgramManager'
import { AdminHeader } from '@/components/admin/header'

export default function AdminProgramsPage() {
  return (
    <div>
      <AdminHeader 
        title="Programs Management" 
        description="Manage all programs, activities, and track progress"
      />
      <ProgramManager />
    </div>
  )
}