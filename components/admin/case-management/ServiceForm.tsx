'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2, Stethoscope, Scale, Home, Briefcase, BookOpen, Activity, User } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { CaseService, CaseServiceInput } from '@/lib/types/case-management'

interface ServiceFormProps {
  caseId: string
  serviceData?: CaseService
  onSuccess: (serviceData: CaseService) => void
  onCancel: () => void
  isEditing?: boolean
}

const serviceTypeOptions = [
  { value: 'COUNSELING', label: 'Counseling', icon: Stethoscope },
  { value: 'LEGAL_AID', label: 'Legal Aid', icon: Scale },
  { value: 'MEDICAL', label: 'Medical', icon: Stethoscope },
  { value: 'SHELTER', label: 'Shelter', icon: Home },
  { value: 'EMPLOYMENT', label: 'Employment', icon: Briefcase },
  { value: 'EDUCATION', label: 'Education', icon: BookOpen },
  { value: 'VOCATIONAL_TRAINING', label: 'Vocational Training', icon: Briefcase },
  { value: 'FAMILY_COUNSELING', label: 'Family Counseling', icon: User },
  { value: 'CRISIS_INTERVENTION', label: 'Crisis Intervention', icon: Activity },
  { value: 'OTHER', label: 'Other', icon: Activity },
]

export function ServiceForm({ caseId, serviceData, onSuccess, onCancel, isEditing = false }: ServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<CaseServiceInput>>({
    case_id: caseId,
    service_date: serviceData?.service_date || new Date().toISOString(),
    service_type: serviceData?.service_type || 'COUNSELING',
    service_provider: serviceData?.service_provider || '',
    actions_taken: serviceData?.actions_taken || '',
    notes_observations: serviceData?.notes_observations || '',
    next_steps: serviceData?.next_steps || '',
    follow_up_date: serviceData?.follow_up_date || undefined,
    status: serviceData?.status || 'SCHEDULED',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Submitting service data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock success response
      const mockResponse: CaseService = {
        id: serviceData?.id || Math.random(),
        case_id: caseId,
        service_date: formData.service_date!,
        service_type: formData.service_type!,
        service_provider: formData.service_provider,
        actions_taken: formData.actions_taken,
        notes_observations: formData.notes_observations,
        next_steps: formData.next_steps,
        follow_up_date: formData.follow_up_date,
        status: formData.status!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      onSuccess(mockResponse)
    } catch (error) {
      console.error('Error saving service:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getServiceIcon = (serviceType: string) => {
    const service = serviceTypeOptions.find(s => s.value === serviceType)
    return service?.icon || Activity
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            <Activity className="w-6 h-6" />
            {isEditing ? 'Edit Service' : 'Log New Service'}
          </CardTitle>
          <p className="text-gray-600">
            Case: {caseId} • {isEditing ? 'Update service details' : 'Record service provided to survivor'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="service_type" className="flex items-center gap-2 text-sm font-semibold">
                  <Activity className="w-4 h-4" />
                  Service Type
                </Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value: any) => handleInputChange('service_type', value)}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 focus:border-blue-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map((service) => {
                      const IconComponent = service.icon
                      return (
                        <SelectItem key={service.value} value={service.value} className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {service.label}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_date" className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarIcon className="w-4 h-4" />
                  Service Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl border-2 border-gray-200",
                        !formData.service_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.service_date ? (
                        format(new Date(formData.service_date), "PPP")
                      ) : (
                        <span>Select service date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.service_date ? new Date(formData.service_date) : undefined}
                      onSelect={(date) => handleInputChange('service_date', date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Service Provider & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="service_provider" className="text-sm font-semibold">
                  Service Provider
                </Label>
                <Input
                  id="service_provider"
                  placeholder="Organization or individual providing service"
                  value={formData.service_provider}
                  onChange={(e) => handleInputChange('service_provider', e.target.value)}
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Service Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 focus:border-blue-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions Taken */}
            <div className="space-y-2">
              <Label htmlFor="actions_taken" className="text-sm font-semibold">
                Actions Taken
              </Label>
              <Textarea
                id="actions_taken"
                placeholder="Describe the specific actions, interventions, or services provided..."
                value={formData.actions_taken}
                onChange={(e) => handleInputChange('actions_taken', e.target.value)}
                className="rounded-xl border-2 border-gray-200 focus:border-blue-300 min-h-[80px]"
              />
            </div>

            {/* Notes & Observations */}
            <div className="space-y-2">
              <Label htmlFor="notes_observations" className="text-sm font-semibold">
                Notes & Observations
              </Label>
              <Textarea
                id="notes_observations"
                placeholder="Record observations, client responses, challenges, or notable outcomes..."
                value={formData.notes_observations}
                onChange={(e) => handleInputChange('notes_observations', e.target.value)}
                className="rounded-xl border-2 border-gray-200 focus:border-blue-300 min-h-[80px]"
              />
            </div>

            {/* Next Steps & Follow-up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="next_steps" className="text-sm font-semibold">
                  Next Steps
                </Label>
                <Textarea
                  id="next_steps"
                  placeholder="Plan for follow-up actions or next service session..."
                  value={formData.next_steps}
                  onChange={(e) => handleInputChange('next_steps', e.target.value)}
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-300 min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow_up_date" className="text-sm font-semibold">
                  Follow-up Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl border-2 border-gray-200",
                        !formData.follow_up_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.follow_up_date ? (
                        format(new Date(formData.follow_up_date), "PPP")
                      ) : (
                        <span>Schedule follow-up</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.follow_up_date ? new Date(formData.follow_up_date) : undefined}
                      onSelect={(date) => handleInputChange('follow_up_date', date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditing ? 'Update Service' : 'Log Service'}</>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-semibold py-3"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}