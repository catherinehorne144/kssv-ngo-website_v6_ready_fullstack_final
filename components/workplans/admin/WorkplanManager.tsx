// [file name]: components/workplans/admin/WorkplanManager.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, BarChart3, Users, Calendar, Target, Download, Filter, Search, ArrowLeft, Loader2, Upload } from 'lucide-react'
import { WorkplanTable } from './WorkplanTable'
import { WorkplanForm } from './WorkplanForm'
import { WorkplanWizard } from './WorkplanWizard'
import WorkplanAnalytics from './WorkplanAnalytics'
import ExportManager from './ExportManager'
import CSVImport from './CSVImport'
import type { Workplan } from '@/lib/types/workplan'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

type ViewMode = 'workplans' | 'create-workplan' | 'edit-workplan' | 'analytics' | 'export' | 'import'

export function WorkplanManager() {
  const [activeView, setActiveView] = useState<ViewMode>('workplans')
  const [selectedWorkplan, setSelectedWorkplan] = useState<Workplan | null>(null)
  const [workplans, setWorkplans] = useState<Workplan[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [quarterFilter, setQuarterFilter] = useState<string>('all')
  const [focusAreaFilter, setFocusAreaFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // Filter workplans based on search and filters
  const filteredWorkplans = useMemo(() => {
    return workplans.filter(workplan => {
      const matchesSearch = !searchTerm || 
        workplan.activity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workplan.tasks_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workplan.focus_area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workplan.resource_person?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || workplan.status === statusFilter
      const matchesQuarter = quarterFilter === 'all' || workplan.quarter === quarterFilter
      const matchesFocusArea = focusAreaFilter === 'all' || workplan.focus_area === focusAreaFilter
      
      return matchesSearch && matchesStatus && matchesQuarter && matchesFocusArea
    })
  }, [workplans, searchTerm, statusFilter, quarterFilter, focusAreaFilter])

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalBudget = workplans.reduce((sum, workplan) => sum + (workplan.budget_allocated || 0), 0)
    const completedWorkplans = workplans.filter(w => w.status === 'completed').length
    const inProgressWorkplans = workplans.filter(w => w.status === 'in-progress').length
    const plannedWorkplans = workplans.filter(w => w.status === 'planned').length
    const totalProgress = workplans.reduce((sum, w) => sum + (w.progress || 0), 0)
    const avgProgress = workplans.length > 0 ? Math.round(totalProgress / workplans.length) : 0
    
    return {
      totalWorkplans: workplans.length,
      completedWorkplans,
      inProgressWorkplans,
      plannedWorkplans,
      completionRate: workplans.length > 0 ? Math.round((completedWorkplans / workplans.length) * 100) : 0,
      totalBudget: totalBudget.toLocaleString(),
      avgProgress
    }
  }, [workplans])

  // Get unique quarters for filter
  const availableQuarters = useMemo(() => {
    const quarters = [...new Set(workplans.map(w => w.quarter).filter(Boolean))] as string[]
    return quarters.sort()
  }, [workplans])

  // Get focus areas for filter
  const availableFocusAreas = useMemo(() => {
    const areas = [...new Set(workplans.map(w => w.focus_area).filter(Boolean))] as string[]
    return areas.sort()
  }, [workplans])

  // Handle workplan creation
  const handleWorkplanCreated = async (createdWorkplan: Workplan) => {
    await loadWorkplans()
    setActiveView('workplans')
    alert(`Workplan "${createdWorkplan.activity_name}" created successfully!`)
  }

  // Handle workplan deletion
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

  // Handle bulk delete workplans
  const handleBulkDeleteWorkplans = async (workplanIds: string[]) => {
    if (workplanIds.length === 0) return
    
    const workplanNames = workplans
      .filter(w => workplanIds.includes(w.id))
      .map(w => w.activity_name)
      .slice(0, 3)
    
    const message = workplanIds.length === 1 
      ? `Delete workplan "${workplanNames[0]}"?`
      : `Delete ${workplanIds.length} workplans?\n\nIncludes: ${workplanNames.join(', ')}${workplanIds.length > 3 ? ` and ${workplanIds.length - 3} more...` : ''}`
    
    if (window.confirm(message)) {
      try {
        // Delete workplans sequentially
        for (const workplanId of workplanIds) {
          const response = await fetch(`/api/workplans/${workplanId}`, {
            method: 'DELETE',
          })
          
          if (!response.ok) {
            throw new Error(`Failed to delete workplan ${workplanId}`)
          }
        }
        
        await loadWorkplans()
        alert(`${workplanIds.length} workplan(s) deleted successfully!`)
      } catch (error) {
        console.error('Error deleting workplans:', error)
        alert('Failed to delete workplans')
      }
    }
  }

  // Handle edit workplan
  const handleEditWorkplan = (workplan: Workplan) => {
    setSelectedWorkplan(workplan)
    setActiveView('edit-workplan')
  }

  // Handle view workplan
  const handleViewWorkplan = (workplan: Workplan) => {
    // You can implement a detailed view modal or page here
    alert(`Viewing: ${workplan.activity_name}\nStatus: ${workplan.status}\nProgress: ${workplan.progress}%`)
  }

  // Handle CSV import completion
  const handleImportComplete = async () => {
    await loadWorkplans()
    setActiveView('workplans')
    alert('Workplans imported successfully!')
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setQuarterFilter('all')
    setFocusAreaFilter('all')
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || quarterFilter !== 'all' || focusAreaFilter !== 'all'

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
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workplans</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkplans}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedWorkplans} completed
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
              {stats.inProgressWorkplans} in progress
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
              Allocated across all workplans
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
              Average across all workplans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="workplans">Workplans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value={activeView} className="space-y-6">
          {activeView === 'workplans' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Workplans & Activities</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage all workplans and track MERL framework across {availableFocusAreas.length} focus areas
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveView('export')}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveView('import')}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                  <Button onClick={() => setActiveView('create-workplan')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Workplan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Enhanced Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search activities, tasks, focus areas, responsible persons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quarters</SelectItem>
                      {availableQuarters.map(quarter => (
                        <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={focusAreaFilter} onValueChange={setFocusAreaFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Focus Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Focus Areas</SelectItem>
                      {availableFocusAreas.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results count and filter actions */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Showing {filteredWorkplans.length} of {workplans.length} workplans
                    </span>
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="text-xs">
                        Filters Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
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
                </div>

                <WorkplanTable 
                  workplans={filteredWorkplans}
                  onDeleteWorkplan={handleDeleteWorkplan}
                  onEditWorkplan={handleEditWorkplan}
                  onViewWorkplan={handleViewWorkplan}
                  onBulkDelete={handleBulkDeleteWorkplans}
                />
              </CardContent>
            </Card>
          )}

          {activeView === 'create-workplan' && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Workplan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use the comprehensive form to create a workplan with full MERL framework
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

          {/* Analytics View */}
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

          {/* Export View */}
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

          {/* Import View */}
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
    </div>
  )
}