'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2, User, Phone, Shield, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { CaseRegister, CaseRegisterInput } from '@/lib/types/case-management'

interface CaseFormProps {
  caseData?: CaseRegister
  onSuccess: (caseData: CaseRegister) => void
  onCancel: () => void
  isEditing?: boolean
}

export function CaseForm({ caseData, onSuccess, onCancel, isEditing = false }: CaseFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<CaseRegisterInput>>({
    case_id: caseData?.case_id || '',
    case_status: caseData?.case_status || 'ACTIVE',
    name: caseData?.name || '',
    contact_no: caseData?.contact_no || '',
    emergency_no: caseData?.emergency_no || '',
    consent_status: caseData?.consent_status || false,
    date_sharing_consent: caseData?.date_sharing_consent || undefined,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate case ID if not provided
      const finalData = {
        ...formData,
        case_id: formData.case_id || generateCaseId(),
      }

      // Here you would call your caseManagement.createCase or caseManagement.updateCase
      console.log('Submitting case data:', finalData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock success response
      const mockResponse: CaseRegister = {
        id: caseData?.id || Math.random(),
        case_id: finalData.case_id!,
        case_status: finalData.case_status!,
        name: finalData.name!,
        contact_no: finalData.contact_no,
        emergency_no: finalData.emergency_no,
        consent_status: finalData.consent_status!,
        date_sharing_consent: finalData.date_sharing_consent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      onSuccess(mockResponse)
    } catch (error) {
      console.error('Error saving case:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCaseId = () => {
    const prefix = 'KSSV'
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}${random}`
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <User className="w-6 h-6" />
            {isEditing ? 'Edit Case' : 'Register New Case'}
          </CardTitle>
          <p className="text-gray-600">
            {isEditing 
              ? 'Update case information and status' 
              : 'Register a new survivor case in the system'
            }
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case ID & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="case_id" className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="w-4 h-4" />
                  Case ID
                </Label>
                <Input
                  id="case_id"
                  placeholder="KSSV001"
                  value={formData.case_id}
                  onChange={(e) => handleInputChange('case_id', e.target.value)}
                  className="rounded-xl border-2 border-gray-200 focus:border-blue-300"
                />
                <p className="text-xs text-gray-500">
                  Leave empty to auto-generate
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="case_status" className="flex items-center gap-2 text-sm font-semibold">
                  <Shield className="w-4 h-4" />
                  Case Status
                </Label>
                <Select
                  value={formData.case_status}
                  onValueChange={(value: any) => handleInputChange('case_status', value)}
                >
                  <SelectTrigger className="rounded-xl border-2 border-gray-200 focus:border-blue-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="rounded-xl border-2 border-gray-200 focus:border-blue-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_no" className="flex items-center gap-2 text-sm font-semibold">
                      <Phone className="w-4 h-4" />
                      Contact Number
                    </Label>
                    <Input
                      id="contact_no"
                      placeholder="+255 XXX XXX XXX"
                      value={formData.contact_no}
                      onChange={(e) => handleInputChange('contact_no', e.target.value)}
                      className="rounded-xl border-2 border-gray-200 focus:border-blue-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_no" className="flex items-center gap-2 text-sm font-semibold">
                      <Phone className="w-4 h-4" />
                      Emergency Contact
                    </Label>
                    <Input
                      id="emergency_no"
                      placeholder="+255 XXX XXX XXX"
                      value={formData.emergency_no}
                      onChange={(e) => handleInputChange('emergency_no', e.target.value)}
                      className="rounded-xl border-2 border-gray-200 focus:border-blue-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Consent Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Consent & Permissions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <Label htmlFor="consent_status" className="text-sm font-semibold">
                      Consent Status
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Client agrees to data collection
                    </p>
                  </div>
                  <Switch
                    id="consent_status"
                    checked={formData.consent_status}
                    onCheckedChange={(checked) => handleInputChange('consent_status', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_sharing_consent" className="text-sm font-semibold">
                    Date Sharing Consent
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-xl border-2 border-gray-200",
                          !formData.date_sharing_consent && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date_sharing_consent ? (
                          format(new Date(formData.date_sharing_consent), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date_sharing_consent ? new Date(formData.date_sharing_consent) : undefined}
                        onSelect={(date) => handleInputChange('date_sharing_consent', date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditing ? 'Update Case' : 'Create Case'}</>
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