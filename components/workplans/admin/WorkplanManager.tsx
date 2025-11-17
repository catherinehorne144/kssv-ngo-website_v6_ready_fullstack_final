// [file name]: components/workplans/admin/WorkplanManager.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  BarChart3, 
  Users, 
  Calendar, 
  Target, 
  Download, 
  Filter, 
  Search, 
  ArrowLeft, 
  Loader2, 
  Upload, 
  FileText,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  DollarSign
} from 'lucide-react'
import { WorkplanForm } from './WorkplanForm'
import { WorkplanAnalytics } from './WorkplanAnalytics'
import { ExportManager } from './ExportManager'
import { CSVImport } from './CSVImport'
import { MERLCard } from '@/components/merl/MERLCard'
import { FocusAreaDetail } from './FocusAreaDetail'
import type { Workplan, MerlEntry } from '@/lib/types/workplan'

type ViewMode = 'workplans' | 'create-workplan' | 'edit-workplan' | 'analytics' | 'export' | 'import'

interface FocusAreaTab {
  id: string
  name: string
  color: 'red' | 'green' | 'blue' | 'purple' | 'orange'
  count: number
}

export function WorkplanManager() {
  const [activeView, setActiveView] = useState<ViewMode>('workplans')
  const [selectedWorkplan, setSelectedWorkplan] = useState<Workplan | null>(null)
  const [selectedFocusArea, setSelectedFocusArea] = useState<string | null>(null)
  const [workplans, setWorkplans] = useState<Workplan[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedWorkplan, setExpandedWorkplan] = useState<string | null>(null)
  
  // MERL State Management
  const [merlWorkplan, setMerlWorkplan] = useState<Workplan | null>(null)
  const [isMerlCardOpen, setIsMerlCardOpen] = useState(false)

  // Load workplans from API
  const loadWorkplans = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/workplans')
      if (!response.ok) {
        throw new Error('Failed to fetch workplans')
      }
      
      const data = await response.json()
      setWorkplans(data)
    } catch (err) {
      console.error('Error loading workplans:', err)
      setError(err instanceof Error ? err.message : 'Failed to load workplans')
    } finally {
      setLoading(false)
    }
  }

  // Load workplans on component mount and when returning to workplans view
  useEffect(() => {
    if (activeView === 'workplans' || activeView === 'analytics' || activeView === 'export') {
      loadWorkplans()
    }
  }, [activeView])

  // Generate dynamic focus area tabs from workplans data
  const focusAreaTabs = useMemo((): FocusAreaTab[] => {
    const areas = [...new Set(workplans.map(w => w.focus_area).filter(Boolean))] as string[]
    
    const colorMap: { [key: string]: FocusAreaTab['color'] } = {
      'Comprehensive Gender-based Violence GBV Management': 'red',
      'Survivors Livelihood Support Services': 'green',
      'Institutional Development and Growth': 'blue'
    }
    
    return areas.map(area => ({
      id: area.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: area,
      color: colorMap[area] || 'purple',
      count: workplans.filter(w => w.focus_area === area).length
    }))
  }, [workplans])

  // Get current active focus area (default to first tab)
  const activeFocusAreaTab = focusAreaTabs[0] || null
  const activeFocusAreaName = activeFocusAreaTab?.name || ''

  // Filter workplans for current focus area and search/filters
  const filteredWorkplans = useMemo(() => {
    if (!activeFocusAreaName) return []
    
    return workplans.filter(workplan => {
      const matchesFocusArea = workplan.focus_area === activeFocusAreaName
      const matchesSearch = !searchTerm || 
        workplan.activity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workplan.tasks_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workplan.resource_person?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || workplan.status === statusFilter
      
      return matchesFocusArea && matchesSearch && matchesStatus
    })
  }, [workplans, activeFocusAreaName, searchTerm, statusFilter])

  // Calculate stats for current focus area
  const stats = useMemo(() => {
    const totalActivities = filteredWorkplans.length
    const completedActivities = filteredWorkplans.filter(w => w.status === 'completed').length
    const totalBudget = filteredWorkplans.reduce((sum, workplan) => sum + (workplan.budget_allocated || 0), 0)
    const totalProgress = filteredWorkplans.reduce((sum, w) => sum + (w.progress || 0), 0)
    const avgProgress = totalActivities > 0 ? Math.round(totalProgress / totalActivities) : 0
    
    return {
      totalActivities,
      completedActivities,
      completionRate: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
      totalBudget: totalBudget.toLocaleString(),
      avgProgress
    }
  }, [filteredWorkplans])

  // Get color classes for focus area tabs
  const getFocusAreaColorClasses = (tab: FocusAreaTab, isActive: boolean) => {
    const colorMap = {
      red: isActive 
        ? 'bg-red-500 text-white border-red-500' 
        : 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200',
      green: isActive 
        ? 'bg-green-500 text-white border-green-500' 
        : 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
      blue: isActive 
        ? 'bg-blue-500 text-white border-blue-500' 
        : 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
      purple: isActive 
        ? 'bg-purple-500 text-white border-purple-500' 
        : 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200',
      orange: isActive 
        ? 'bg-orange-500 text-white border-orange-500' 
        : 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200'
    }
    
    return colorMap[tab.color] || colorMap.purple
  }

  // Get emoji for focus area
  const getFocusAreaEmoji = (color: string) => {
    const emojiMap = {
      red: '🔴',
      green: '🟢',
      blue: '🔵',
      purple: '🟣',
      orange: '🟠'
    }
    return emojiMap[color as keyof typeof emojiMap] || '⚪'
  }

  // Get status color and text
  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'completed': return { color: 'text-green-600 bg-green-50 border-green-200', text: 'Completed', dot: '●' }
      case 'in-progress': return { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', text: 'In Progress', dot: '●' }
      case 'planned': return { color: 'text-blue-600 bg-blue-50 border-blue-200', text: 'Planned', dot: '●' }
      default: return { color: 'text-gray-600 bg-gray-50 border-gray-200', text: 'Planned', dot: '●' }
    }
  }

  // Get progress color
  const getProgressColor = (progress: number | null) => {
    if (!progress) return 'bg-gray-500'
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Handlers
  const handleWorkplanCreated = async (createdWorkplan: Workplan) => {
    await loadWorkplans()
    setActiveView('workplans')
    alert(`Workplan "${createdWorkplan.activity_name}" created successfully!`)
  }

  const handleDeleteWorkplan = async (workplanId: string) => {
    const workplan = workplans.find(w => w.id === workplanId)
    if (workplan && window.confirm(`Delete workplan "${workplan.activity_name}"?`)) {
      try {
        const response = await fetch(`/api/workplans/${workplanId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete workplan')
        }

        await loadWorkplans()
        alert('Workplan deleted successfully!')
      } catch (error) {
        console.error('Error deleting workplan:', error)
        alert('Failed to delete workplan')
      }
    }
  }

  const handleEditWorkplan = (workplan: Workplan) => {
    setSelectedWorkplan(workplan)
    setActiveView('edit-workplan')
  }

  const handleViewWorkplan = (workplan: Workplan) => {
    alert(`Viewing: ${workplan.activity_name}\nStatus: ${workplan.status}\nProgress: ${workplan.progress}%`)
  }

  const handleOpenMERL = (workplan: Workplan) => {
    setMerlWorkplan(workplan)
    setIsMerlCardOpen(true)
  }

  const handleMerlSave = (merlData: MerlEntry) => {
    alert(`MERL data saved successfully for "${merlWorkplan?.activity_name}"!`)
    setIsMerlCardOpen(false)
    setMerlWorkplan(null)
  }

  const handleMerlClose = () => {
    setIsMerlCardOpen(false)
    setMerlWorkplan(null)
  }

  const handleImportComplete = async () => {
    await loadWorkplans()
    setActiveView('workplans')
    alert('Workplans imported successfully!')
  }

  const toggleWorkplanDetails = (workplanId: string) => {
    setExpandedWorkplan(expandedWorkplan === workplanId ? null : workplanId)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all'

  // Loading state
  if (loading && workplans.length === 0 && activeView === 'workplans') {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading workplans...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && workplans.length === 0 && activeView === 'workplans') {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error loading workplans</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadWorkplans}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Stats Overview - Only show when in workplans view */}
      {activeView === 'workplans' && activeFocusAreaTab && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedActivities} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                across all activities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {stats.totalBudget}</div>
              <p className="text-xs text-muted-foreground">
                allocated budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">
                average progress
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="workplans">Workplans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value={activeView} className="space-y-6">
          {/* WORKPLANS TAB - REDESIGNED */}
          {activeView === 'workplans' && (
            <div className="space-y-6">
              {/* Focus Area Tabs Navigation */}
              {focusAreaTabs.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {focusAreaTabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant="outline"
                        className={`border-2 font-medium ${getFocusAreaColorClasses(tab, true)}`}
                        size="sm"
                      >
                        {getFocusAreaEmoji(tab.color)} {tab.name.split(' ')[0]}
                      </Button>
                    ))}
                    <Button 
                      onClick={() => setActiveView('create-workplan')}
                      className="bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Focus Area or activities
                    </Button>
                  </div>

                  {/* Program Context Header */}
                  {activeFocusAreaTab && (
                    <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded-r">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {getFocusAreaEmoji(activeFocusAreaTab.color)} {activeFocusAreaTab.name.toUpperCase()} - {activeFocusAreaTab.count} ACTIVITIES
                      </h1>
                    </div>
                  )}

                  {/* Search and Filters */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder={`Search ${activeFocusAreaTab?.name.split(' ')[0] || ''} activities...`}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Results count and filter actions */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            Showing {filteredWorkplans.length} of {activeFocusAreaTab?.count || 0} activities
                          </span>
                          {hasActiveFilters && (
                            <Badge variant="secondary" className="text-xs">
                              Filters Active
                            </Badge>
                          )}
                        </div>
                        {hasActiveFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                          >
                            Clear All
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Cards */}
                  <div className="space-y-4">
                    {filteredWorkplans.map((workplan) => {
                      const statusInfo = getStatusInfo(workplan.status)
                      return (
                        <Card key={workplan.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            {/* Activity Header */}
                            <div className="p-4 border-b">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleWorkplanDetails(workplan.id)}
                                    className="h-8 px-3 font-medium"
                                  >
                                    {expandedWorkplan === workplan.id ? (
                                      <ChevronUp className="h-4 w-4 mr-2" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 mr-2" />
                                    )}
                                    SHOW DETAILS
                                  </Button>
                                  <span className="font-semibold text-lg">
                                    {workplan.activity_name}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Activity Description */}
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {workplan.tasks_description}
                              </p>

                              {/* Status & Metadata */}
                              <div className="flex flex-wrap items-center gap-4 text-sm mt-3">
                                <Badge variant="outline" className={statusInfo.color}>
                                  {statusInfo.dot} {statusInfo.text}
                                </Badge>
                                <span>• {workplan.progress || 0}% Complete</span>
                                <span>• KES {(workplan.budget_allocated || 0).toLocaleString()}</span>
                                <span>• Timeline: {workplan.timeline_text}</span>
                                <span>• 👤 {workplan.resource_person || 'Not assigned'}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 bg-gray-50">
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewWorkplan(workplan)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  VIEW
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditWorkplan(workplan)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  EDIT
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleOpenMERL(workplan)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  MERL FRAMEWORK
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteWorkplan(workplan.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  DELETE
                                </Button>
                              </div>
                            </div>

                            {/* Expandable Details */}
                            {expandedWorkplan === workplan.id && (
                              <div className="p-4 border-t bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                  <div>
                                    <h4 className="font-semibold mb-3 text-gray-900">Activity Details</h4>
                                    <div className="space-y-3">
                                      <div>
                                        <span className="font-medium text-gray-700">Description:</span>
                                        <p className="text-gray-600 mt-1 whitespace-pre-wrap">
                                          {workplan.tasks_description}
                                        </p>
                                      </div>
                                      {workplan.target && (
                                        <div>
                                          <span className="font-medium text-gray-700">Target:</span>
                                          <p className="text-gray-600 mt-1">{workplan.target}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-3 text-gray-900">Additional Information</h4>
                                    <div className="space-y-3">
                                      <div>
                                        <span className="font-medium text-gray-700">Quarter:</span>
                                        <p className="text-gray-600 mt-1">{workplan.quarter || 'Not set'}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700">Resource Person:</span>
                                        <p className="text-gray-600 mt-1">{workplan.resource_person || 'Not assigned'}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700">Visibility:</span>
                                        <p className="text-gray-600 mt-1">{workplan.public_visible ? 'Public' : 'Private'}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700">Progress:</span>
                                        <div className="flex items-center gap-3 mt-1">
                                          <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div 
                                              className={`h-2 rounded-full ${getProgressColor(workplan.progress)}`}
                                              style={{ width: `${workplan.progress || 0}%` }}
                                            />
                                          </div>
                                          <span className="text-gray-600">{workplan.progress || 0}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}

                    {filteredWorkplans.length === 0 && (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <div className="text-muted-foreground">
                            {workplans.length === 0 ? 'No workplans found.' : 'No activities match your filters.'}
                          </div>
                          {(searchTerm || statusFilter !== 'all') && (
                            <Button
                              variant="outline"
                              onClick={clearAllFilters}
                              className="mt-4"
                            >
                              Clear filters
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </>
              )}

              {focusAreaTabs.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="text-muted-foreground mb-4">
                      No focus areas found. Create your first workplan to get started.
                    </div>
                    <Button onClick={() => setActiveView('create-workplan')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Workplan
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* CREATE WORKPLAN VIEW */}
          {activeView === 'create-workplan' && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Workplan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use the comprehensive form to create a workplan
                </p>
              </CardHeader>
              <CardContent>
                <WorkplanForm 
                  onSuccess={handleWorkplanCreated}
                  onCancel={() => setActiveView('workplans')}
                />
              </CardContent>
            </Card>
          )}

          {/* EDIT WORKPLAN VIEW */}
          {activeView === 'edit-workplan' && selectedWorkplan && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setActiveView('workplans')}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>Edit Workplan</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedWorkplan.activity_name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <WorkplanForm 
                  workplan={selectedWorkplan}
                  onSuccess={handleWorkplanCreated}
                  onCancel={() => setActiveView('workplans')}
                />
              </CardContent>
            </Card>
          )}

          {/* ANALYTICS VIEW */}
          {activeView === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle>Workplan Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analytics and reporting across all workplans
                </p>
              </CardHeader>
              <CardContent>
                <WorkplanAnalytics 
                  workplans={workplans}
                  selectedWorkplanId={selectedWorkplan?.id}
                />
              </CardContent>
            </Card>
          )}

          {/* EXPORT VIEW */}
          {activeView === 'export' && (
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Export workplan data in various formats for reporting and analysis
                </p>
              </CardHeader>
              <CardContent>
                <ExportManager 
                  workplans={workplans}
                  selectedWorkplanId={selectedWorkplan?.id}
                />
              </CardContent>
            </Card>
          )}

          {/* IMPORT VIEW */}
          {activeView === 'import' && (
            <Card>
              <CardHeader>
                <CardTitle>Import Workplans</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Bulk import workplans from CSV data
                </p>
              </CardHeader>
              <CardContent>
                <CSVImport onImportComplete={handleImportComplete} />
                <Button 
                  variant="outline" 
                  onClick={() => setActiveView('workplans')}
                  className="mt-4"
                >
                  Back to Workplans
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* MERL Card Popup */}
      {merlWorkplan && (
        <MERLCard 
          workplan={merlWorkplan}
          isOpen={isMerlCardOpen}
          onClose={handleMerlClose}
          onSave={handleMerlSave}
        />
      )}
    </div>
  )
}