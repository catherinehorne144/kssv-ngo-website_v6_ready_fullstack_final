'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Users, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Clipboard,
  Stethoscope,
  Scale,
  Home,
  Briefcase,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Activity,
  TrendingUp,
  Shield,
  HeartHandshake
} from 'lucide-react'
import type { CaseRegister, CaseAssessment, CaseService } from '@/lib/types/case-management'

type ViewMode = 'dashboard' | 'cases' | 'assessments' | 'services' | 'new-case'

export function CaseManagementDashboard() {
  const [activeView, setActiveView] = useState<ViewMode>('dashboard')
  const [cases, setCases] = useState<CaseRegister[]>([])
  const [assessments, setAssessments] = useState<CaseAssessment[]>([])
  const [services, setServices] = useState<CaseService[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCase, setExpandedCase] = useState<string | null>(null)

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [casesRes, assessmentsRes, servicesRes] = await Promise.all([
        fetch('/api/case-management/cases'),
        fetch('/api/case-management/assessments'),
        fetch('/api/case-management/services')
      ])

      if (!casesRes.ok || !assessmentsRes.ok || !servicesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const casesData = await casesRes.json()
      const assessmentsData = await assessmentsRes.json()
      const servicesData = await servicesRes.json()

      setCases(casesData)
      setAssessments(assessmentsData)
      setServices(servicesData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const totalCases = cases.length
    const activeCases = cases.filter(c => c.case_status === 'ACTIVE').length
    const highRiskCases = assessments.filter(a => 
      a.safety_risk_level === 'HIGH' || a.safety_risk_level === 'CRITICAL'
    ).length
    const servicesThisMonth = services.filter(s => {
      const serviceDate = new Date(s.service_date)
      const now = new Date()
      return serviceDate.getMonth() === now.getMonth() && serviceDate.getFullYear() === now.getFullYear()
    }).length
    const pendingAssessments = cases.length - assessments.length

    return {
      totalCases,
      activeCases,
      highRiskCases,
      servicesThisMonth,
      pendingAssessments
    }
  }, [cases, assessments, services])

  // Filter cases for display
  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      const matchesSearch = !searchTerm || 
        caseItem.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || caseItem.case_status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [cases, searchTerm, statusFilter])

  // Get risk level color
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200'
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  // Get service type icon
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'COUNSELING': return Stethoscope
      case 'LEGAL_AID': return Scale
      case 'MEDICAL': return Stethoscope
      case 'SHELTER': return Home
      case 'EMPLOYMENT': return Briefcase
      case 'EDUCATION': return BookOpen
      default: return FileText
    }
  }

  const toggleCaseDetails = (caseId: string) => {
    setExpandedCase(expandedCase === caseId ? null : caseId)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setRiskFilter('all')
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || riskFilter !== 'all'

  // Loading state
  if (loading && cases.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Enhanced Stats Overview */}
        {activeView === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-2">Total Cases</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalCases}</h3>
                    <p className="text-xs text-green-600 mt-1">
                      +{stats.activeCases} active
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-red-50 border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-2">High Risk Cases</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.highRiskCases}</h3>
                    <p className="text-xs text-red-600 mt-1">
                      Needs immediate attention
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">Services This Month</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.servicesThisMonth}</p>
                    <p className="text-xs text-green-600 mt-1">
                      Support provided
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-2">Pending Assessments</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.pendingAssessments}</h3>
                    <p className="text-xs text-purple-600 mt-1">
                      Need evaluation
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardContent className="p-0">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as ViewMode)} className="space-y-6">
              <div className="px-8 pt-6">
                <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                  {[
                    { value: 'dashboard', label: 'Overview', icon: TrendingUp },
                    { value: 'cases', label: 'Cases', icon: Users },
                    { value: 'assessments', label: 'Assessments', icon: FileText },
                    { value: 'services', label: 'Services', icon: Activity },
                    { value: 'new-case', label: 'New Case', icon: Plus }
                  ].map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <TabsTrigger 
                        key={tab.value} 
                        value={tab.value}
                        className="flex items-center gap-2 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                      >
                        <IconComponent className="w-4 h-4" />
                        {tab.label}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>

              {/* DASHBOARD TAB CONTENT */}
              <TabsContent value="dashboard" className="m-0 p-8">
                <div className="space-y-8">
                  {/* Recent Cases */}
                  <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Recent Cases
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cases.slice(0, 5).map((caseItem) => (
                          <div key={caseItem.case_id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{caseItem.case_id} - {caseItem.name}</h4>
                                <p className="text-sm text-gray-600">{caseItem.contact_no}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(caseItem.case_status)}>
                                {caseItem.case_status}
                              </Badge>
                              <Button variant="ghost" size="sm" className="rounded-lg">
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                        onClick={() => setActiveView('cases')}
                      >
                        View All Cases
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Upcoming Services */}
                  <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        Upcoming Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {services
                          .filter(s => new Date(s.service_date) > new Date())
                          .slice(0, 5)
                          .map((service) => {
                            const ServiceIcon = getServiceIcon(service.service_type)
                            return (
                              <div key={service.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                  <ServiceIcon className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-sm">{service.case_id}</span>
                                  <span className="text-sm text-gray-600">{service.service_type}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {new Date(service.service_date).toLocaleDateString()}
                                </Badge>
                              </div>
                            )
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* CASES TAB CONTENT */}
              <TabsContent value="cases" className="m-0 p-8">
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              placeholder="🔍 Search cases by ID or name..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white/50"
                            />
                          </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-48 rounded-xl border-2 border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 bg-white/50 py-3">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-0 shadow-xl">
                            <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                            <SelectItem value="ACTIVE" className="rounded-lg">Active</SelectItem>
                            <SelectItem value="ON_HOLD" className="rounded-lg">On Hold</SelectItem>
                            <SelectItem value="CLOSED" className="rounded-lg">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Results count */}
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-600 font-medium">
                          📊 Showing {filteredCases.length} of {cases.length} cases
                        </span>
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cases List */}
                  <div className="space-y-4">
                    {filteredCases.map((caseItem) => {
                      const caseAssessment = assessments.find(a => a.case_id === caseItem.case_id)
                      const isExpanded = expandedCase === caseItem.case_id
                      
                      return (
                        <Card 
                          key={caseItem.case_id} 
                          className={`bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                            isExpanded ? 'ring-2 ring-blue-200' : 'hover:ring-1 hover:ring-gray-200'
                          }`}
                        >
                          <CardContent className="p-0">
                            {/* Case Header */}
                            <div className="p-6 border-b border-gray-100">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4 flex-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleCaseDetails(caseItem.case_id)}
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
                                    <p className="text-gray-600 text-sm">
                                      {caseItem.contact_no} • {caseItem.emergency_no && `Emergency: ${caseItem.emergency_no}`}
                                    </p>
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
                                {caseAssessment && (
                                  <Badge 
                                    variant="outline" 
                                    className={`px-3 py-1 rounded-full border-2 font-semibold ${getRiskColor(caseAssessment.safety_risk_level)}`}
                                  >
                                    {caseAssessment.safety_risk_level} Risk
                                  </Badge>
                                )}
                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    {caseAssessment ? 'Assessed' : 'Needs Assessment'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Activity className="w-4 h-4 text-green-600" />
                                    {services.filter(s => s.case_id === caseItem.case_id).length} Services
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    Joined {new Date(caseItem.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50">
                              <div className="flex gap-3">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 border-blue-200 text-blue-600 font-medium px-4"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  VIEW
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="rounded-lg bg-white hover:bg-green-50 hover:text-green-600 border-green-200 text-green-600 font-medium px-4"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  EDIT
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="rounded-lg bg-white hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600 font-medium px-4"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  DELETE
                                </Button>
                              </div>
                            </div>

                            {/* Expandable Details */}
                            {isExpanded && caseAssessment && (
                              <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                      <FileText className="w-5 h-5 text-blue-600" />
                                      Assessment Details
                                    </h4>
                                    <div className="space-y-3 bg-white/50 p-4 rounded-xl">
                                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-semibold text-gray-700 text-sm">Risk Level:</span>
                                        <Badge className={getRiskColor(caseAssessment.safety_risk_level)}>
                                          {caseAssessment.safety_risk_level}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-semibold text-gray-700 text-sm">Intake Date:</span>
                                        <span className="text-gray-600 text-sm">
                                          {caseAssessment.date_of_intake ? new Date(caseAssessment.date_of_intake).toLocaleDateString() : 'Not set'}
                                        </span>
                                      </div>
                                      <div className="py-2">
                                        <span className="font-semibold text-gray-700 text-sm">Primary Goal:</span>
                                        <p className="text-gray-600 mt-1 text-sm">
                                          {caseAssessment.primary_goal || 'Not specified'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                      <Activity className="w-5 h-5 text-green-600" />
                                      Service Needs
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {caseAssessment.service_needs.map((need, index) => (
                                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                          {need}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}

                    {filteredCases.length === 0 && (
                      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                        <CardContent className="py-16 text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {cases.length === 0 ? 'No cases found' : 'No matching cases'}
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {cases.length === 0 
                              ? 'Get started by creating your first case to begin tracking survivor support.'
                              : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                            }
                          </p>
                          <Button 
                            onClick={() => setActiveView('new-case')}
                            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Case
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* OTHER TABS - To be implemented in next phases */}
              <TabsContent value="assessments" className="m-0 p-8">
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessments Management</h3>
                  <p className="text-gray-600">Comprehensive assessment tools coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="services" className="m-0 p-8">
                <div className="text-center py-16">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Services Management</h3>
                  <p className="text-gray-600">Service tracking and management coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="new-case" className="m-0 p-8">
                <div className="text-center py-16">
                  <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">New Case Form</h3>
                  <p className="text-gray-600">Case registration form coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}