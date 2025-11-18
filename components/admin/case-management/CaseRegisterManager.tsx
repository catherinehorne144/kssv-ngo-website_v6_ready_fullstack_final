'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Plus, Loader2 } from 'lucide-react'
import { CaseCard } from './CaseCard'
import { caseManagement } from '@/lib/data/case-management'
import type { CaseRegister, CaseAssessment } from '@/lib/types/case-management'

export function CaseRegisterManager() {
  const [cases, setCases] = useState<CaseRegister[]>([])
  const [assessments, setAssessments] = useState<CaseAssessment[]>([])
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadData = async () => {
    try {
      setLoading(true)
      const [casesData, assessmentsData, servicesData] = await Promise.all([
        caseManagement.getCases(),
        caseManagement.getAssessments(),
        caseManagement.getServices()
      ])
      setCases(casesData)
      setAssessments(assessmentsData)
      setServices(servicesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = !searchTerm || 
      caseItem.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || caseItem.case_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getAssessmentForCase = (caseId: string) => {
    return assessments.find(a => a.case_id === caseId)
  }

  const getServiceCountForCase = (caseId: string) => {
    return services.filter(s => s.case_id === caseId).length
  }

  const handleViewCase = (caseItem: CaseRegister) => {
    console.log('View case:', caseItem)
    // Navigate to case details
  }

  const handleEditCase = (caseItem: CaseRegister) => {
    console.log('Edit case:', caseItem)
    // Navigate to edit page
    window.location.href = `/admin/case-management/register/${caseItem.case_id}`
  }

  const handleDeleteCase = async (caseItem: CaseRegister) => {
    if (confirm(`Are you sure you want to delete case ${caseItem.case_id}?`)) {
      try {
        await caseManagement.deleteCase(caseItem.case_id)
        await loadData() // Reload data
      } catch (error) {
        console.error('Error deleting case:', error)
        alert('Failed to delete case')
      }
    }
  }

  const handleAddAssessment = (caseItem: CaseRegister) => {
    console.log('Add assessment for:', caseItem)
    // Navigate to assessment form
  }

  const handleAddService = (caseItem: CaseRegister) => {
    console.log('Add service for:', caseItem)
    // Navigate to service form
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-64 mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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
              
              <Button 
                asChild
                className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6"
              >
                <a href="/admin/case-management/register/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Case
                </a>
              </Button>
            </div>

            {/* Results count */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600 font-medium">
                📊 Showing {filteredCases.length} of {cases.length} cases
              </span>
              {(searchTerm || statusFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                  }}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <div className="space-y-6">
          {filteredCases.map((caseItem) => (
            <CaseCard
              key={caseItem.case_id}
              caseItem={caseItem}
              assessment={getAssessmentForCase(caseItem.case_id)}
              serviceCount={getServiceCountForCase(caseItem.case_id)}
              onView={handleViewCase}
              onEdit={handleEditCase}
              onDelete={handleDeleteCase}
              onAddAssessment={handleAddAssessment}
              onAddService={handleAddService}
            />
          ))}

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
                  asChild
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <a href="/admin/case-management/register/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Case
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}