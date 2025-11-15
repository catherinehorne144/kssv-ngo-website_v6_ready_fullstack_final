// [file name]: components/programs/admin/ProgramManager.tsx
// [file content begin - COMPLETE VERSION WITH M&E INTEGRATION]
'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, BarChart3, Users, Calendar, Target, Download, Filter, Search, ArrowLeft, Loader2 } from 'lucide-react'
import { ProgramTable } from './ProgramTable'
import { ProgramWizard } from './ProgramWizard'
import { ActivityForm } from './ActivityForm'
import { ActivityTable } from './ActivityTable'
import { TaskForm } from './TaskForm'
import { TaskTable } from './TaskTable'
import { TaskMEPanel } from './TaskMEPanel'
import { ProgramAnalytics } from './ProgramAnalytics'
import { ExportManager } from './ExportManager'
import type { ProgramWithDetails, Activity, Task, TaskEvaluation, RiskAssessment } from '@/lib/types/program'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const focusAreas = [
  {
    id: 'gbv',
    name: 'GBV Management',
    description: 'Comprehensive support for gender-based violence survivors',
    strategic_outcome: 'Reduce GBV incidence by 40% and increase access to justice by 2026',
    kpi: '500+ survivors supported annually with 85% satisfaction rate',
    color: 'red'
  },
  {
    id: 'empowerment',
    name: 'Survivor Empowerment',
    description: 'Economic empowerment and livelihood programs for sustainable recovery',
    strategic_outcome: '75% of supported survivors achieve economic independence within 2 years',
    kpi: '300+ women engaged in income-generating activities annually',
    color: 'green'
  },
  {
    id: 'institutional',
    name: 'Institutional Development',
    description: 'Building organizational capacity for sustainable impact and service delivery',
    strategic_outcome: 'Enhanced organizational efficiency and 100% reporting compliance',
    kpi: '20+ staff trained annually with 95% capacity improvement',
    color: 'blue'
  },
  {
    id: 'srh',
    name: 'SRH Rights',
    description: 'Sexual and reproductive health education, services, and rights advocacy',
    strategic_outcome: 'Increase SRH knowledge by 60% and service access by 50% by 2026',
    kpi: '1000+ youth reached annually with SRH information and services',
    color: 'purple'
  }
]

type ViewMode = 'programs' | 'activities' | 'tasks' | 'create-program' | 'create-activity' | 'edit-activity' | 'create-task' | 'edit-task' | 'analytics' | 'export' | 'task-me'

export function ProgramManager() {
  const [activeView, setActiveView] = useState<ViewMode>('programs')
  const [selectedProgram, setSelectedProgram] = useState<ProgramWithDetails | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [programs, setPrograms] = useState<ProgramWithDetails[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskEvaluations, setTaskEvaluations] = useState<TaskEvaluation[]>([])
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [focusAreaFilter, setFocusAreaFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load programs from API
  const loadPrograms = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/programs')
      if (!response.ok) {
        throw new Error('Failed to fetch programs')
      }
      
      const data = await response.json()
      setPrograms(data)
    } catch (err) {
      console.error('Error loading programs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load programs')
    } finally {
      setLoading(false)
    }
  }

  // Load activities for selected program
  const loadActivities = async (programId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/activities?programId=${programId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch activities')
      }
      const data = await response.json()
      setActivities(data)
    } catch (err) {
      console.error('Error loading activities:', err)
      setError(err instanceof Error ? err.message : 'Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  // Load tasks for selected activity
  const loadTasks = async (activityId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/tasks?activityId=${activityId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      console.error('Error loading tasks:', err)
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  // Load task evaluations
  const loadTaskEvaluations = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/evaluation`)
      if (!response.ok) {
        throw new Error('Failed to fetch task evaluations')
      }
      const data = await response.json()
      setTaskEvaluations(data)
    } catch (err) {
      console.error('Error loading task evaluations:', err)
    }
  }

  // Load risk assessments
  const loadRiskAssessments = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/risks`)
      if (!response.ok) {
        // If endpoint doesn't exist yet, use empty array
        setRiskAssessments([])
        return
      }
      const data = await response.json()
      setRiskAssessments(data)
    } catch (err) {
      console.error('Error loading risk assessments:', err)
      setRiskAssessments([])
    }
  }

  // Load programs on component mount and when view changes
  useEffect(() => {
    if (activeView === 'programs') {
      loadPrograms()
    }
  }, [activeView])

  // Load M&E data when task is selected for M&E view
  useEffect(() => {
    if (activeView === 'task-me' && selectedTask) {
      loadTaskEvaluations(selectedTask.id)
      loadRiskAssessments(selectedTask.id)
    }
  }, [activeView, selectedTask])

  // Filter programs based on search and filters
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.focus_area.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || program.status === statusFilter
      const matchesYear = yearFilter === 'all' || program.year.toString() === yearFilter
      const matchesFocusArea = focusAreaFilter === 'all' || program.focus_area === focusAreaFilter
      
      return matchesSearch && matchesStatus && matchesYear && matchesFocusArea
    })
  }, [programs, searchTerm, statusFilter, yearFilter, focusAreaFilter])

  // Calculate enhanced stats from real data
  const stats = useMemo(() => {
    const totalBudget = programs.reduce((sum, program) => sum + program.budget_total, 0)
    const utilizedBudget = programs.reduce((sum, program) => sum + program.impact_metrics.budget_utilized, 0)
    const totalActivities = programs.reduce((sum, program) => sum + program.activities.length, 0)
    const completedActivities = programs.reduce((sum, program) => sum + program.impact_metrics.activities_completed, 0)
    
    // Calculate task statistics
    const allTasks = programs.flatMap(program => program.tasks || [])
    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(task => task.status === 10).length
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      totalPrograms: programs.length,
      activePrograms: programs.filter(p => p.status === 'active').length,
      beneficiariesReached: programs.reduce((sum, program) => sum + program.impact_metrics.beneficiaries_reached, 0),
      completionRate: programs.length > 0 ? Math.round(programs.reduce((sum, program) => sum + program.impact_metrics.success_rate, 0) / programs.length) : 0,
      budgetUtilization: totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0,
      activityCompletion: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
      totalBudget: totalBudget.toLocaleString(),
      utilizedBudget: utilizedBudget.toLocaleString(),
      totalTasks: totalTasks,
      completedTasks: completedTasks,
      taskCompletionRate: taskCompletionRate
    }
  }, [programs])

  // Get unique years for filter
  const availableYears = useMemo(() => {
    const years = [...new Set(programs.map(p => p.year.toString()))]
    return years.sort((a, b) => parseInt(b) - parseInt(a))
  }, [programs])

  // Get focus areas for filter
  const availableFocusAreas = useMemo(() => {
    const areas = [...new Set(programs.map(p => p.focus_area))]
    return areas.sort()
  }, [programs])

  // Handle program creation with ProgramWizard
  const handleProgramCreated = async (createdProgram: ProgramWithDetails) => {
    await loadPrograms() // Refresh the list from API
    setActiveView('programs') // Go back to programs list
    alert(`Program "${createdProgram.name}" created successfully with all activities and tasks!`)
  }

  // Handle program deletion
  const handleDeleteProgram = async (programId: string) => {
    const program = programs.find(p => p.id === programId)
    if (program && window.confirm(`Delete program "${program.name}"? This will also delete all associated activities and tasks.`)) {
      try {
        const response = await fetch(`/api/programs/${programId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete program')
        }

        await loadPrograms()
        alert('Program deleted successfully!')
      } catch (error) {
        console.error('Error deleting program:', error)
        alert('Failed to delete program')
      }
    }
  }

  // Handle bulk delete programs
  const handleBulkDeletePrograms = async (programIds: string[]) => {
    if (programIds.length === 0) return
    
    const programNames = programs
      .filter(p => programIds.includes(p.id))
      .map(p => p.name)
      .slice(0, 3)
    
    const message = programIds.length === 1 
      ? `Delete program "${programNames[0]}"? This will also delete all associated activities and tasks.`
      : `Delete ${programIds.length} programs? This will also delete all associated activities and tasks.\n\nIncludes: ${programNames.join(', ')}${programIds.length > 3 ? ` and ${programIds.length - 3} more...` : ''}`
    
    if (window.confirm(message)) {
      try {
        // Delete programs sequentially
        for (const programId of programIds) {
          const response = await fetch(`/api/programs/${programId}`, {
            method: 'DELETE',
          })
          
          if (!response.ok) {
            throw new Error(`Failed to delete program ${programId}`)
          }
        }
        
        await loadPrograms()
        alert(`${programIds.length} program(s) deleted successfully!`)
      } catch (error) {
        console.error('Error deleting programs:', error)
        alert('Failed to delete programs')
      }
    }
  }

  // Handle viewing program activities
  const handleViewProgramActivities = async (program: ProgramWithDetails) => {
    setSelectedProgram(program)
    await loadActivities(program.id)
    setActiveView('activities')
  }

  // Handle viewing activity tasks
  const handleViewActivityTasks = async (activity: Activity) => {
    setSelectedActivity(activity)
    await loadTasks(activity.id)
    setActiveView('tasks')
  }

  // Handle viewing task M&E
  const handleViewTaskME = async (task: Task) => {
    setSelectedTask(task)
    await loadTaskEvaluations(task.id)
    await loadRiskAssessments(task.id)
    setActiveView('task-me')
  }

  const handleAddActivity = () => {
    setSelectedActivity(null)
    setActiveView('create-activity')
  }

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity)
    setActiveView('edit-activity')
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity? This will also delete all associated tasks.')) {
      try {
        const response = await fetch(`/api/activities/${activityId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete activity')
        }

        if (selectedProgram) {
          await loadActivities(selectedProgram.id)
        }
        alert('Activity deleted successfully!')
      } catch (error) {
        console.error('Error deleting activity:', error)
        alert('Failed to delete activity')
      }
    }
  }

  const handleAddTask = () => {
    setSelectedTask(null)
    setActiveView('create-task')
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setActiveView('edit-task')
  }

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete task')
        }

        if (selectedActivity) {
          await loadTasks(selectedActivity.id)
        }
        alert('Task deleted successfully!')
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('Failed to delete task')
      }
    }
  }

  // Handle task evaluation submission
  const handleEvaluationSubmit = async (evaluation: Omit<TaskEvaluation, 'id' | 'created_at'>) => {
    try {
      const response = await fetch(`/api/tasks/${selectedTask?.id}/evaluation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evaluation),
      })

      if (!response.ok) throw new Error('Failed to submit evaluation')
      
      const newEvaluation = await response.json()
      setTaskEvaluations(prev => [newEvaluation, ...prev])
      alert('Evaluation submitted successfully!')
    } catch (error) {
      console.error('Error submitting evaluation:', error)
      alert('Failed to submit evaluation')
    }
  }

  // Handle risk assessment submission
  const handleRiskSubmit = async (risk: Omit<RiskAssessment, 'id' | 'created_at'>) => {
    try {
      const response = await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(risk),
      })

      if (!response.ok) throw new Error('Failed to submit risk assessment')
      
      const newRisk = await response.json()
      setRiskAssessments(prev => [newRisk, ...prev])
      alert('Risk assessment submitted successfully!')
    } catch (error) {
      console.error('Error submitting risk assessment:', error)
      alert('Failed to submit risk assessment')
    }
  }

  // Handle risk update
  const handleRiskUpdate = async (riskId: string, updates: Partial<RiskAssessment>) => {
    try {
      const response = await fetch(`/api/risks/${riskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Failed to update risk')
      
      setRiskAssessments(prev => prev.map(risk => 
        risk.id === riskId ? { ...risk, ...updates } : risk
      ))
    } catch (error) {
      console.error('Error updating risk:', error)
      alert('Failed to update risk assessment')
    }
  }

  // Handle activity creation/update success
  const handleActivitySuccess = async (activity: Activity) => {
    if (selectedProgram) {
      await loadActivities(selectedProgram.id)
    }
    setActiveView('activities')
  }

  // Handle task creation/update success
  const handleTaskSuccess = async (task: Task) => {
    if (selectedActivity) {
      await loadTasks(selectedActivity.id)
    }
    setActiveView('tasks')
  }

  const handleBackToPrograms = () => {
    setSelectedProgram(null)
    setSelectedActivity(null)
    setSelectedTask(null)
    setActivities([])
    setTasks([])
    setActiveView('programs')
  }

  const handleBackToActivities = () => {
    setSelectedActivity(null)
    setSelectedTask(null)
    setTasks([])
    setActiveView('activities')
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setYearFilter('all')
    setFocusAreaFilter('all')
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || yearFilter !== 'all' || focusAreaFilter !== 'all'

  // Loading state
  if (loading && programs.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading programs...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && programs.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error loading programs</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadPrograms}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Overview</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{stats.totalPrograms} Programs</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activePrograms} active • {stats.beneficiariesReached}+ beneficiaries
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {stats.completionRate}% Success
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.budgetUtilization}%</div>
            <p className="text-xs text-muted-foreground">
              KES {stats.utilizedBudget} / {stats.totalBudget}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activityCompletion}%</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.taskCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks}/{stats.totalTasks} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="activities" disabled={!selectedProgram}>
            Activities
          </TabsTrigger>
          <TabsTrigger value="tasks" disabled={!selectedActivity}>
            Tasks
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value={activeView} className="space-y-6">
          {activeView === 'programs' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Programs & Activities</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage all programs and track their activities and tasks across {availableFocusAreas.length} focus areas
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button onClick={() => setActiveView('create-program')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Program
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
                        placeholder="Search programs, descriptions, focus areas..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {availableYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
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
                      Showing {filteredPrograms.length} of {programs.length} programs
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

                <ProgramTable 
                  programs={filteredPrograms}
                  onDeleteProgram={handleDeleteProgram}
                  onViewActivities={handleViewProgramActivities}
                  onBulkDelete={handleBulkDeletePrograms}
                />
              </CardContent>
            </Card>
          )}

          {activeView === 'create-program' && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Program</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use the multi-step wizard to create a comprehensive program with activities and tasks
                </p>
              </CardHeader>
              <CardContent>
                <ProgramWizard 
                  onSuccess={handleProgramCreated}
                  onCancel={() => setActiveView('programs')}
                />
              </CardContent>
            </Card>
          )}

          {/* Activities View */}
          {activeView === 'activities' && selectedProgram && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleBackToPrograms}
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle>Activities for {selectedProgram.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Manage activities in {selectedProgram.focus_area} program
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddActivity} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
              </CardHeader>
              <CardContent>
                <ActivityTable 
                  program={selectedProgram}
                  activities={activities}
                  onAddActivity={handleAddActivity}
                  onEditActivity={handleEditActivity}
                  onDeleteActivity={handleDeleteActivity}
                  onViewTasks={handleViewActivityTasks}
                />
              </CardContent>
            </Card>
          )}

          {/* Tasks View */}
          {activeView === 'tasks' && selectedActivity && selectedProgram && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleBackToActivities}
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle>Tasks for {selectedActivity.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Program: {selectedProgram.name} • Activity: {selectedActivity.name}
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddTask} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                <TaskTable 
                  program={selectedProgram}
                  activity={selectedActivity}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onViewTask={handleViewTaskME}
                />
              </CardContent>
            </Card>
          )}

          {/* Task M&E View */}
          {activeView === 'task-me' && selectedTask && selectedActivity && selectedProgram && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setActiveView('tasks')}
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle>M&E - {selectedTask.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Program: {selectedProgram.name} • Activity: {selectedActivity.name}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  Monitoring & Evaluation
                </Badge>
              </CardHeader>
              <CardContent>
                <TaskMEPanel 
                  taskId={selectedTask.id}
                  taskName={selectedTask.name}
                  evaluations={taskEvaluations}
                  risks={riskAssessments}
                  onEvaluationSubmit={handleEvaluationSubmit}
                  onRiskSubmit={handleRiskSubmit}
                  onRiskUpdate={handleRiskUpdate}
                />
              </CardContent>
            </Card>
          )}

          {/* Activity Forms */}
          {(activeView === 'create-activity' || activeView === 'edit-activity') && selectedProgram && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setActiveView('activities')}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>
                      {activeView === 'create-activity' ? 'Create New Activity' : 'Edit Activity'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Program: {selectedProgram.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ActivityForm 
                  programId={selectedProgram.id}
                  programName={selectedProgram.name}
                  activity={activeView === 'edit-activity' ? selectedActivity : undefined}
                  onSuccess={handleActivitySuccess}
                  onCancel={() => setActiveView('activities')}
                />
              </CardContent>
            </Card>
          )}

          {/* Task Forms */}
          {(activeView === 'create-task' || activeView === 'edit-task') && selectedActivity && selectedProgram && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setActiveView('tasks')}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>
                      {activeView === 'create-task' ? 'Create New Task' : 'Edit Task'}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Program: {selectedProgram.name} • Activity: {selectedActivity.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TaskForm 
                  activityId={selectedActivity.id}
                  activityName={selectedActivity.name}
                  programName={selectedProgram.name}
                  task={activeView === 'edit-task' ? selectedTask : undefined}
                  onSuccess={handleTaskSuccess}
                  onCancel={() => setActiveView('tasks')}
                />
              </CardContent>
            </Card>
          )}

          {/* Analytics View */}
          {activeView === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle>Program Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analytics and reporting across all programs
                </p>
              </CardHeader>
              <CardContent>
                <ProgramAnalytics 
                  programs={programs}
                  selectedProgramId={selectedProgram?.id}
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
                  Export program data in various formats for reporting and analysis
                </p>
              </CardHeader>
              <CardContent>
                <ExportManager 
                  programs={programs}
                  selectedProgramId={selectedProgram?.id}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
// [file content end]