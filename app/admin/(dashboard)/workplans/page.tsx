// app/admin/workplans/page.tsx
import { WorkplanManager } from '@/components/workplans/admin/WorkplanManager'
import { AdminHeader } from '@/components/admin/header'

export default function AdminWorkplansPage() {
  return (
    <div>
      <AdminHeader 
        title="Workplans Management" 
        description="Manage all program workplans, MERL tracking, and activities"
      />
      <WorkplanManager />
    </div>
  )
}