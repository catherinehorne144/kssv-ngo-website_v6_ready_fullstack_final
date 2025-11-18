'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Trash2, ChevronDown, ChevronUp, Phone, Calendar, FileText, Activity } from 'lucide-react'
import type { CaseRegister, CaseAssessment } from '@/lib/types/case-management'

interface CaseCardProps {
  caseItem: CaseRegister
  assessment?: CaseAssessment
  serviceCount?: number
  onView?: (caseItem: CaseRegister) => void
  onEdit?: (caseItem: CaseRegister) => void
  onDelete?: (caseItem: CaseRegister) => void
  onAddAssessment?: (caseItem: CaseRegister) => void
  onAddService?: (caseItem: CaseRegister) => void
}

export function CaseCard({ 
  caseItem, 
  assessment, 
  serviceCount = 0, 
  onView, 
  onEdit, 
  onDelete, 
  onAddAssessment,
  onAddService 
}: CaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200'
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card className={`bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
      isExpanded ? 'ring-2 ring-blue-200' : 'hover:ring-1 hover:ring-gray-200'
    }`}>
      <CardContent className="p-0">
        {/* Case Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-10 px-4 font-semibold rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 transition-all duration-300"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-2" />
                )}
                SHOW DETAILS
              </Button>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {caseItem.case_id} - {caseItem.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {caseItem.contact_no && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {caseItem.contact_no}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Joined {formatDate(caseItem.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-green-600" />
                    {serviceCount} Services
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status & Metadata */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Badge 
              variant="outline" 
              className={`px-3 py-1 rounded-full border-2 font-semibold ${getStatusColor(caseItem.case_status)}`}
            >
              {caseItem.case_status}
            </Badge>
            
            {assessment && (
              <Badge 
                variant="outline" 
                className={`px-3 py-1 rounded-full border-2 font-semibold ${getRiskColor(assessment.safety_risk_level)}`}
              >
                {assessment.safety_risk_level} Risk
              </Badge>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {assessment ? 'Assessed' : 'Needs Assessment'}
              </span>
              
              {caseItem.consent_status && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                  Consent Given
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50">
          <div className="flex gap-2 flex-wrap">
            {onView && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onView(caseItem)}
                className="rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 border-blue-200 text-blue-600 font-medium px-4"
              >
                <Eye className="h-4 w-4 mr-2" />
                VIEW
              </Button>
            )}
            {onEdit && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(caseItem)}
                className="rounded-lg bg-white hover:bg-green-50 hover:text-green-600 border-green-200 text-green-600 font-medium px-4"
              >
                <Edit className="h-4 w-4 mr-2" />
                EDIT
              </Button>
            )}
            {onAddAssessment && !assessment && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAddAssessment(caseItem)}
                className="rounded-lg bg-white hover:bg-purple-50 hover:text-purple-600 border-purple-200 text-purple-600 font-medium px-4"
              >
                <FileText className="h-4 w-4 mr-2" />
                ADD ASSESSMENT
              </Button>
            )}
            {onAddService && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAddService(caseItem)}
                className="rounded-lg bg-white hover:bg-orange-50 hover:text-orange-600 border-orange-200 text-orange-600 font-medium px-4"
              >
                <Activity className="h-4 w-4 mr-2" />
                ADD SERVICE
              </Button>
            )}
            {onDelete && (
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-lg bg-white hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600 font-medium px-4"
                onClick={() => onDelete(caseItem)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                DELETE
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Case Information */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Case Information
                </h4>
                <div className="space-y-3 bg-white/50 p-4 rounded-xl">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-700 text-sm">Case ID:</span>
                    <span className="text-gray-600 text-sm font-mono">{caseItem.case_id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-gray-700 text-sm">Status:</span>
                    <Badge className={getStatusColor(caseItem.case_status)}>
                      {caseItem.case_status}
                    </Badge>
                  </div>
                  {caseItem.contact_no && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700 text-sm">Contact:</span>
                      <span className="text-gray-600 text-sm">{caseItem.contact_no}</span>
                    </div>
                  )}
                  {caseItem.emergency_no && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700 text-sm">Emergency Contact:</span>
                      <span className="text-gray-600 text-sm">{caseItem.emergency_no}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-gray-700 text-sm">Consent:</span>
                    <Badge variant="outline" className={caseItem.consent_status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {caseItem.consent_status ? 'Given' : 'Not Given'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Assessment Information */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Assessment Details
                </h4>
                {assessment ? (
                  <div className="space-y-3 bg-white/50 p-4 rounded-xl">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-700 text-sm">Risk Level:</span>
                      <Badge className={getRiskColor(assessment.safety_risk_level)}>
                        {assessment.safety_risk_level}
                      </Badge>
                    </div>
                    {assessment.date_of_intake && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-semibold text-gray-700 text-sm">Intake Date:</span>
                        <span className="text-gray-600 text-sm">
                          {formatDate(assessment.date_of_intake)}
                        </span>
                      </div>
                    )}
                    {assessment.primary_goal && (
                      <div className="py-2">
                        <span className="font-semibold text-gray-700 text-sm">Primary Goal:</span>
                        <p className="text-gray-600 mt-1 text-sm">
                          {assessment.primary_goal}
                        </p>
                      </div>
                    )}
                    {assessment.service_needs.length > 0 && (
                      <div className="py-2">
                        <span className="font-semibold text-gray-700 text-sm">Service Needs:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {assessment.service_needs.map((need, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <FileText className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-yellow-800 text-sm font-medium">No Assessment Completed</p>
                    <p className="text-yellow-700 text-xs mt-1">This case needs a comprehensive assessment</p>
                    {onAddAssessment && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onAddAssessment(caseItem)}
                        className="mt-3 rounded-lg bg-white hover:bg-yellow-50 border-yellow-200 text-yellow-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Start Assessment
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}