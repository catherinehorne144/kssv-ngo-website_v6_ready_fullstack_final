import { ServicesManager } from '@/components/admin/case-management/ServicesManager'
import { AdminHeader } from '@/components/admin/header'

export default function ServicesPage() {
  return (
    <div>
      <AdminHeader 
        title="Services & Actions" 
        description="Track services provided, interventions, and follow-up actions"
      />
      <ServicesManager />
    </div>
  )
}