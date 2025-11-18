import { CaseForm } from '@/components/admin/case-management/CaseForm'
import { AdminHeader } from '@/components/admin/header'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface EditCasePageProps {
  params: {
    id: string
  }
}

export default function EditCasePage({ params }: EditCasePageProps) {
  // In a real app, you would fetch the case data using the ID
  const mockCaseData = {
    id: 1,
    case_id: params.id,
    case_status: 'ACTIVE' as const,
    name: 'VA-0014',
    contact_no: '+255712345678',
    emergency_no: '+255788901234',
    consent_status: true,
    date_sharing_consent: '2024-01-15',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const handleSuccess = (caseData: any) => {
    // Redirect or show success message
    console.log('Case updated:', caseData)
  }

  const handleCancel = () => {
    // Navigate back
    window.history.back()
  }

  return (
    <div>
      <AdminHeader 
        title={`Edit Case: ${params.id}`} 
        description="Update case information and status"
      />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            asChild
            className="rounded-xl border-2 border-gray-200 hover:border-gray-300"
          >
            <Link href="/admin/case-management/register">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Link>
          </Button>
        </div>

        {/* Case Form */}
        <CaseForm 
          caseData={mockCaseData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isEditing={true}
        />
      </div>
    </div>
  )
}