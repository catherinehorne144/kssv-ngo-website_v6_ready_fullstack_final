'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2, FileText, AlertTriangle, Target, Users } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { CaseAssessment, CaseAssessmentInput } from '@/lib/types/case-management'

interface AssessmentFormProps {
  caseId: string
  assessmentData?: CaseAssessment
  onSuccess: (assessmentData: CaseAssessment) => void
  onCancel: () => void
  isEditing?: boolean
}

const serviceNeedsOptions = [
  'COUNSELING',
  'LEGAL',
  'MEDICAL', 
  'SHELTER',
  'EMPLOYMENT',
  'EDUCATION',
  'OTHER'
]

export function AssessmentForm({ caseId, assessmentData, onSuccess, onCancel, isEditing = false }: AssessmentFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedServiceNeeds, setSelectedServiceNeeds] = useState<string[]>(
    assessmentData?.service_needs || []
  )

  const [formData, setFormData] = useState<Partial<CaseAssessmentInput>>({
    case_id: caseId,
    date_of_intake: assessmentData?.date_of_intake || undefined,
    service_needs: assessmentData?.service_needs || [],
    safety_risk_level: assessmentData?.safety_risk_level || 'MEDIUM',
    primary_goal: assessmentData?.primary_goal || '',
    services_provided_log: assessmentData?.services_provided_log || '',
    referral_tracking: assessmentData?.referral_tracking || '',
    case_notes: assessmentData?.case_notes || '',
    case_closure: assessmentData?.case_closure || false,
    reason_for_closure: assessmentData?.reason_for_closure || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const finalData = {
        ...formData,
        service_needs: selectedServiceNeeds,
      }

      console.log('Submitting assessment data:', finalData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock success response
      const mockResponse: CaseAssessment = {
        id: assessmentData?.id || Math.random(),
        case_id: caseId,
        date_of_intake: finalData.date_of_intake,
        service_needs: selectedServiceNeeds,
        safety_risk_level: finalData.safety_risk_level!,
        primary_goal: finalData.primary_goal,
        services_provided_log: finalData.services_provided_log,
        referral_tracking: finalData.referral_tracking,
        case_notes: finalData.case_notes,
        case_closure: finalData.case_closure!,
        reason_for_closure: finalData.reason_for_closure,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      onSuccess(mockResponse)
    } catch (error) {
      console.error('Error saving assessment:', error)
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

  const toggleServiceNeed = (service: string) => {
    setSelectedServiceNeeds(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            <FileText className="w-6 h-6" />
            {isEditing ? 'Edit Assessment' : 'Case Assessment'}
          </CardTitle>
          <p className="text-gray-600">
            Case: {caseId} • {isEditing ? 'Update assessment details' : 'Complete comprehensive case assessment'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Assessment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_of_intake" className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarIcon className="w-4 h-4" />
                  Date of Intake
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl border-2 border-gray-200",
                        !formData.date_of_intake && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date_of_intake ? (
                        format(new Date(formData.date_of_intake), "PPP")
                      ) : (
                        <span>Select intake date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date_of_intake ? new Date(formData.date_of_intake) : undefined}
                      onSelect={(date) => handleInputChange('date_of_intake', date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="safety_risk_level" className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  Safety & Risk Level
                </Label>
                <Select
                  value={formData.safety_risk_level}
                  onValueChange={(value: any) => handleInputChange('safety_risk_level', value)}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 focus:border-blue-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">
                      <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>
                    </SelectItem>
                    <SelectItem value="MEDIUM">
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>
                    </SelectItem>
                    <SelectItem value="HIGH">
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">High Risk</Badge>
                    </SelectItem>
                    <SelectItem value="CRITICAL">
                      <Badge className="bg-red-100 text-red-800 border-red-200">Critical Risk</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Service Needs */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <Users className="w-4 h-4" />
                Service Needs Required
              </Label>
              <div className="flex flex-wrap gap-2">
                {serviceNeedsOptions.map((service) => (
                  <Badge
                    key={service}
                    variant={selectedServiceNeeds.includes(service) ? "default" : "outline"}
                    className={`cursor-pointer rounded-lg px-3 py-1 transition-all ${
                      selectedServiceNeeds.includes(service)
                        ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleServiceNeed(service)}
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Primary Goal */}
            <div className="space-y-2">
              <Label htmlFor="primary_goal" className="flex items-center gap-2 text-sm font-semibold">
                <Target className="w-4 h-4" />
                Primary Goal
              </Label>
              <Textarea
                id="primary_goal"
                placeholder="Describe the primary goal and objectives for this case..."
                value={formData.primary_goal}
                onChange={(e) => handleInputChange('primary_goal', e.target.value)}
                className="rounded-xl border-2 border-gray-200 focus:border-blue-300 min-h-[80px]"
              />
            </div>

            {/* Case Notes */}
            <div className="space-y-2">
              <Label htmlFor="case_notes" className="text-sm font-semibold">
                Case Notes & Observations
              </Label>
              <Textarea
                id="case_notes"
                placeholder="Record important observations, client statements, and assessment findings..."
                value={formData.case_notes}
                onChange={(e) => handleInputChange('case_notes', e.target.value)}
                className="rounded-xl border-2 border-gray-200 focus:border-blue-300 min-h-[100px]"
              />
            </div>

            {/* Case Closure */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <Label htmlFor="case_closure" className="text-sm font-semibold">
                  Case Closure
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Mark this case as closed
                </p>
              </div>
              <Switch
                id="case_closure"
                checked={formData.case_closure}
                onCheckedChange={(checked) => handleInputChange('case_closure', checked)}
              />
            </div>

            {formData.case_closure && (
              <div className="space-y-2">
                <Label htmlFor="reason_for_closure" className="text-sm font-semibold">
                  Reason for Closure
                </Label>
                <Input
                  id="reason_for_closure"
                  placeholder="Explain why this case is being closed..."
                  value={formData.reason_for_closure}
                  onChange={(e) => handleInputChange('reason_for_closure', e.target.value)}
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-300"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditing ? 'Update Assessment' : 'Create Assessment'}</>
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