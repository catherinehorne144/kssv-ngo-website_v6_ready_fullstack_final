'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Calendar, User, Stethoscope, Scale, Home, Briefcase, BookOpen, Activity } from 'lucide-react'
import type { CaseService } from '@/lib/types/case-management'

interface ServiceTimelineProps {
  services: CaseService[]
  caseId?: string
  onViewService?: (service: CaseService) => void
  onEditService?: (service: CaseService) => void
}

export function ServiceTimeline({ services, caseId, onViewService, onEditService }: ServiceTimelineProps) {
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'COUNSELING': return Stethoscope
      case 'LEGAL_AID': return Scale
      case 'MEDICAL': return Stethoscope
      case 'SHELTER': return Home
      case 'EMPLOYMENT': return Briefcase
      case 'EDUCATION': return BookOpen
      default: return Activity
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200'
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

  // Group services by month
  const groupedServices = services.reduce((acc, service) => {
    const date = new Date(service.service_date)
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    if (!acc[monthYear]) {
      acc[monthYear] = []
    }
    acc[monthYear].push(service)
    return acc
  }, {} as Record<string, CaseService[]>)

  return (
    <div className="space-y-8">
      {Object.entries(groupedServices).map(([monthYear, monthServices]) => (
        <div key={monthYear} className="space-y-4">
          {/* Month Header */}
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-lg text-gray-900">{monthYear}</h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {monthServices.length} services
            </Badge>
          </div>

          {/* Services for this month */}
          <div className="space-y-4 ml-6 border-l-2 border-gray-200 pl-8">
            {monthServices.map((service, index) => {
              const ServiceIcon = getServiceIcon(service.service_type)
              const isLast = index === monthServices.length - 1
              
              return (
                <Card 
                  key={service.id} 
                  className={`bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    !isLast ? 'mb-6' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Service Icon */}
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                          <ServiceIcon className="w-6 h-6 text-white" />
                        </div>

                        {/* Service Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg text-gray-900">
                              {service.service_type.replace('_', ' ')}
                            </h4>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(service.service_date)}</span>
                            </div>
                            
                            {service.service_provider && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{service.service_provider}</span>
                              </div>
                            )}

                            {service.actions_taken && (
                              <p className="text-gray-700 mt-2 line-clamp-2">
                                {service.actions_taken}
                              </p>
                            )}

                            {service.next_steps && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm font-semibold text-blue-800 mb-1">Next Steps:</p>
                                <p className="text-sm text-blue-700">{service.next_steps}</p>
                              </div>
                            )}

                            {service.follow_up_date && (
                              <div className="flex items-center gap-2 mt-2 text-orange-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  Follow-up: {formatDate(service.follow_up_date)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {onViewService && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewService(service)}
                            className="rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 border-blue-200 text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEditService && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditService(service)}
                            className="rounded-lg bg-white hover:bg-green-50 hover:text-green-600 border-green-200 text-green-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Services Recorded
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {caseId 
                ? `No services have been recorded for case ${caseId} yet.`
                : 'No services found matching your criteria.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}