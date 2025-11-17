// [file name]: components/workplans/admin/WorkplanManager.tsx
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
  DollarSign,
  Sparkles,
  Activity,
  TrendingUp,
  Shield,
  HeartHandshake,
  Building2
} from 'lucide-react'
import { WorkplanWizard } from './WorkplanWizard'
import { WorkplanAnalytics } from './WorkplanAnalytics'
import { ExportManager } from './ExportManager'
import { CSVImport } from './CSVImport'
import { MERLCard } from '@/components/merl/MERLCard'
import type { Workplan, MerlEntry } from '@/lib/types/workplan'

type ViewMode = 'workplans' | 'create-workplan' | 'edit-workplan' | 'analytics' | 'export' | 'import'

interface FocusAreaTab {
  id: string
  name: string
  color: 'red' | 'green' | 'blue' | 'purple' | 'orange'
  count: number
  icon: any
  description: string
}

export function WorkplanManager() {
  const [activeView, setActiveView] = useState<ViewMode>('workplans')
  const [selectedFocusArea, setSelectedFocusArea] = useState<string | null>(null)
  const [selectedWorkplan, setSelectedWorkplan] = useState<Workplan | null>(null)
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

  useEffect(() => {
    if (activeView === 'workplans' || activeView === 'analytics' || activeView === 'export') {
      loadWorkplans()
    }
  }, [activeView])

  // Generate dynamic focus area tabs from workplans data
  const focusAreaTabs = useMemo((): FocusAreaTab[] => {
    const areas = [...new Set(workplans.map(w => w.focus_area).filter(Boolean))] as string[]
    
    const focusAreaConfig: { [key: string]: { color: FocusAreaTab['color'], icon: any, description: string } } = {
      'Comprehensive Gender-based Violence GBV Management': { 
        color: 'red', 
        icon: Shield, 
        description: 'Protection and support services' 
      },
      'Survivors Livelihood Support Services': { 
        color: 'green', 
        icon: HeartHandshake, 
        description: 'Economic empowerment programs' 
      },
      'Institutional Development and Growth': { 
        color: 'blue', 
        icon: Building2, 
        description: 'Organizational capacity building' 
      }
    }
    
    return areas.map(area => {
      const config = focusAreaConfig[area] || { color: 'purple', icon: Activity, description: 'Program activities' }
      return {
        id: area.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: area,
        color: config.color,
        icon: config.icon,
        description: config.description,
        count: workplans.filter(w => w.focus_area === area).length
      }
    })
  }, [workplans])

  // Set default active focus area when data loads
  useEffect(() => {
    if (focusAreaTabs.length > 0 && !selectedFocusArea) {
      setSelectedFocusArea(focusAreaTabs[0].name)
    }
  }, [focusAreaTabs, selectedFocusArea])

  // Get current active focus area
  const activeFocusAreaTab = focusAreaTabs.find(tab => tab.name === selectedFocusArea) || focusAreaTabs[0] || null

  // Filter workplans for current focus area and search/filters
  const filteredWorkplans = useMemo(() => {
    if (!selectedFocusArea) return []
    
    return workplans.filter(workplan => {
      const matchesFocusArea = workplan.focus_area === selectedFocusArea
      const matchesSearch = !searchTerm || 
        workplan.activity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workplan.tasks_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workplan.resource_person?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || workplan.status === statusFilter
      
      return matchesFocusArea && matchesSearch && matchesStatus
    })
  }, [workplans, selectedFocusArea, searchTerm, statusFilter])

  // Calculate stats for current focus area
  const stats = useMemo(() => {
    const totalActivities = filteredWorkplans.length
    const completedActivities = filteredWorkplans.filter(w => w.status === 'completed').length
    const inProgressActivities = filteredWorkplans.filter(w => w.status === 'in-progress').length
    const totalBudget = filteredWorkplans.reduce((sum, workplan) => sum + (workplan.budget_allocated || 0), 0)
    const totalProgress = filteredWorkplans.reduce((sum, w) => sum + (w.progress || 0), 0)
    const avgProgress = totalActivities > 0 ? Math.round(totalProgress / totalActivities) : 0
    
    return {
      totalActivities,
      completedActivities,
      inProgressActivities,
      completionRate: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
      totalBudget: totalBudget.toLocaleString(),
      avgProgress
    }
  }, [filteredWorkplans])

  // Get color classes for focus area tabs
  const getFocusAreaColorClasses = (tab: FocusAreaTab, isActive: boolean) => {
    const colorMap = {
      red: isActive 
        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200 border-red-500 hover:from-red-600 hover:to-red-700' 
        : 'bg-white text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md',
      green: isActive 
        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 border-green-500 hover:from-green-600 hover:to-green-700' 
        : 'bg-white text-green-700 border-green-200 hover:bg-green-50 hover:border-green-300 hover:shadow-md',
      blue: isActive 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 border-blue-500 hover:from-blue-600 hover:to-blue-700' 
        : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md',
      purple: isActive 
        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 border-purple-500 hover:from-purple-600 hover:to-purple-700' 
        : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md',
      orange: isActive 
        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 border-orange-500 hover:from-orange-600 hover:to-orange-700' 
        : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md'
    }
    
    return `transition-all duration-300 transform hover:scale-105 ${colorMap[tab.color] || colorMap.purple}`
  }

  // Get gradient classes for stats cards
  const getStatsGradient = (color: string) => {
    const gradients = {
      red: 'from-red-500 to-red-600',
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    }
    return gradients[color as keyof typeof gradients] || gradients.purple
  }

  // Get status color and text
  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'completed': 
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          text: 'Completed', 
          dot: '🟢',
          gradient: 'from-green-400 to-green-500'
        }
      case 'in-progress': 
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          text: 'In Progress', 
          dot: '🟡',
          gradient: 'from-yellow-400 to-yellow-500'
        }
      case 'planned': 
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          text: 'Planned', 
          dot: '🔵',
          gradient: 'from-blue-400 to-blue-500'
        }
      default: 
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          text: 'Planned', 
          dot: '⚪',
          gradient: 'from-gray-400 to-gray-500'
        }
    }
  }

  // Get progress color with gradients
  const getProgressColor = (progress: number | null) => {
    if (!progress) return 'bg-gradient-to-r from-gray-400 to-gray-500'
    if (progress >= 80) return 'bg-gradient-to-r from-green-400 to-green-500'
    if (progress >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
    return 'bg-gradient-to-r from-red-400 to-red-500'
  }

  // Handlers
  const handleFocusAreaTabClick = (focusAreaName: string) => {
    setSelectedFocusArea(focusAreaName)
    setSearchTerm('')
    setStatusFilter('all')
    setExpandedWorkplan(null)
  }

  const handleWorkplanCreated = async (createdWorkplan: Workplan) => {
    await loadWorkplans()
    setActiveView('workplans')
    if (createdWorkplan.focus_area) {
      setSelectedFocusArea(createdWorkplan.focus_area)
    }
  }

  const handleDeleteWorkplan = async (workplanId: string) => {
    const workplan = workplans.find(w => w.id === workplanId)
    if (workplan && window.confirm(`Delete workplan "${workplan.activity_name}"?`)) {
      try {
        const response = await fetch(`/api/workplans/${workplanId}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete workplan')
        await loadWorkplans()
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
  }

  const toggleWorkplanDetails = (workplanId: string) => {
    setExpandedWorkplan(expandedWorkplan === workplanId ? null : workplanId)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all'

  // Loading state with beautiful skeleton
  if (loading && workplans.length === 0 && activeView === 'workplans') {
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
        
        {/* Enhanced Stats Overview - Only show when in workplans view */}
        {activeView === 'workplans' && activeFocusAreaTab && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-2">Total Activities</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.totalActivities}</h3>
                    <p className="text-xs text-green-600 mt-1">
                      +{stats.completedActivities} completed
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
                <Progress value={stats.completionRate} className="mt-4 h-2 bg-blue-100" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-green-50 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">Completion Rate</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.completionRate}%</h3>
                    <p className="text-xs text-yellow-600 mt-1">
                      {stats.inProgressActivities} in progress
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-green-100 rounded-full h-2 mt-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-emerald-50 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 mb-2">Total Budget</p>
                    <h3 className="text-3xl font-bold text-gray-900">KES {stats.totalBudget}</h3>
                    <p className="text-xs text-emerald-600 mt-1">
                      Allocated funds
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-2">Avg Progress</p>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.avgProgress}%</h3>
                    <p className="text-xs text-purple-600 mt-1">
                      Across activities
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2 mt-4">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.avgProgress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Beautiful Navigation Tabs */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardContent className="p-0">
            <Tabs value={activeView} onValueChange={(value: any) => setActiveView(value)} className="space-y-6">
              <div className="px-8 pt-6">
                <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl">
                  {[
                    { value: 'workplans', label: 'Workplans', icon: Target },
                    { value: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { value: 'export', label: 'Export', icon: Download },
                    { value: 'import', label: 'Import', icon: Upload }
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

              {/* WORKPLANS TAB CONTENT */}
              <TabsContent value="workplans" className="m-0 p-8">
                {activeView === 'workplans' && (
                  <div className="space-y-8">
                    {/* Focus Area Tabs Navigation */}
                    {focusAreaTabs.length > 0 && (
                      <>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-3">
                            {focusAreaTabs.map((tab) => {
                              const TabIcon = tab.icon
                              const isActive = selectedFocusArea === tab.name
                              return (
                                <Button
                                  key={tab.id}
                                  variant="outline"
                                  className={`rounded-2xl px-6 py-4 border-2 font-semibold transition-all duration-300 transform hover:scale-105 ${getFocusAreaColorClasses(tab, isActive)}`}
                                  onClick={() => handleFocusAreaTabClick(tab.name)}
                                >
                                  <TabIcon className="w-5 h-5 mr-3" />
                                  {tab.name.split(' ')[0]}
                                  <Badge 
                                    variant="secondary" 
                                    className={`ml-3 ${
                                      isActive 
                                        ? 'bg-white/20 text-white border-white/30' 
                                        : 'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}
                                  >
                                    {tab.count}
                                  </Badge>
                                </Button>
                              )
                            })}
                            <Button 
                              onClick={() => setActiveView('create-workplan')}
                              className="rounded-2xl px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white border-0 shadow-lg hover:shadow-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105"
                            >
                              <Plus className="w-5 h-5 mr-3" />
                              Add Focus Area
                              <Sparkles className="w-4 h-4 ml-2" />
                            </Button>
                          </div>

                          {/* Program Context Header */}
                          {activeFocusAreaTab && (
                            <div className={`p-6 rounded-2xl bg-gradient-to-r ${getStatsGradient(activeFocusAreaTab.color)} text-white shadow-lg`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <activeFocusAreaTab.icon className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h1 className="text-2xl font-bold">
                                      {activeFocusAreaTab.name.toUpperCase()} PROGRAM
                                    </h1>
                                    <p className="text-white/80 text-sm mt-1">
                                      {activeFocusAreaTab.description} • {activeFocusAreaTab.count} Active Initiatives
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-3xl font-bold">{stats.completionRate}%</div>
                                  <div className="text-white/70 text-sm">Overall Progress</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Search and Filters */}
                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-center">
                              <div className="flex-1 w-full">
                                <div className="relative">
                                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    placeholder={`🔍 Search ${activeFocusAreaTab?.name.split(' ')[0] || ''} activities...`}
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
                                  <SelectItem value="planned" className="rounded-lg">Planned</SelectItem>
                                  <SelectItem value="in-progress" className="rounded-lg">In Progress</SelectItem>
                                  <SelectItem value="completed" className="rounded-lg">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Results count and filter actions */}
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 font-medium">
                                  📊 Showing {filteredWorkplans.length} of {activeFocusAreaTab?.count || 0} activities
                                </span>
                                {hasActiveFilters && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                    Filters Active
                                  </Badge>
                                )}
                              </div>
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

                        {/* Activity Cards */}
                        <div className="space-y-4">
                          {filteredWorkplans.map((workplan) => {
                            const statusInfo = getStatusInfo(workplan.status)
                            const isExpanded = expandedWorkplan === workplan.id
                            
                            return (
                              <Card 
                                key={workplan.id} 
                                className={`bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                                  isExpanded ? 'ring-2 ring-blue-200' : 'hover:ring-1 hover:ring-gray-200'
                                }`}
                              >
                                <CardContent className="p-0">
                                  {/* Activity Header */}
                                  <div className="p-6 border-b border-gray-100">
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-start gap-4 flex-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleWorkplanDetails(workplan.id)}
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
                                            {workplan.activity_name}
                                          </h3>
                                          <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                                            {workplan.tasks_description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Status & Metadata */}
                                    <div className="flex flex-wrap items-center gap-4 mt-4">
                                      <Badge 
                                        variant="outline" 
                                        className={`px-3 py-1 rounded-full border-2 font-semibold ${statusInfo.color}`}
                                      >
                                        {statusInfo.dot} {statusInfo.text}
                                      </Badge>
                                      <div className="flex items-center gap-6 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <TrendingUp className="w-4 h-4" />
                                          {workplan.progress || 0}% Complete
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <DollarSign className="w-4 h-4 text-green-600" />
                                          KES {(workplan.budget_allocated || 0).toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-4 h-4 text-blue-600" />
                                          {workplan.timeline_text}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Users className="w-4 h-4 text-purple-600" />
                                          {workplan.resource_person || 'Not assigned'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                          className={`h-2.5 rounded-full transition-all duration-1000 ${getProgressColor(workplan.progress)}`}
                                          style={{ width: `${workplan.progress || 0}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100/50">
                                    <div className="flex gap-3">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleViewWorkplan(workplan)}
                                        className="rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 border-blue-200 text-blue-600 font-medium px-4"
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        VIEW
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleEditWorkplan(workplan)}
                                        className="rounded-lg bg-white hover:bg-green-50 hover:text-green-600 border-green-200 text-green-600 font-medium px-4"
                                      >
                                        <Edit className="h-4 w-4 mr-2" />
                                        EDIT
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleOpenMERL(workplan)}
                                        className="rounded-lg bg-white hover:bg-purple-50 hover:text-purple-600 border-purple-200 text-purple-600 font-medium px-4"
                                      >
                                        <FileText className="h-4 w-4 mr-2" />
                                        MERL FRAMEWORK
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="rounded-lg bg-white hover:bg-red-50 hover:text-red-600 border-red-200 text-red-600 font-medium px-4"
                                        onClick={() => handleDeleteWorkplan(workplan.id)}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        DELETE
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Expandable Details */}
                                  {isExpanded && (
                                    <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-blue-50/30 to-purple-50/30">
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Activity Details
                                          </h4>
                                          <div className="space-y-3">
                                            <div>
                                              <span className="font-semibold text-gray-700 text-sm">Description:</span>
                                              <p className="text-gray-600 mt-2 text-sm leading-relaxed whitespace-pre-wrap bg-white/50 p-4 rounded-xl">
                                                {workplan.tasks_description}
                                              </p>
                                            </div>
                                            {workplan.target && (
                                              <div>
                                                <span className="font-semibold text-gray-700 text-sm">Target:</span>
                                                <p className="text-gray-600 mt-1 text-sm bg-white/50 p-3 rounded-xl">
                                                  🎯 {workplan.target}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="space-y-4">
                                          <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-green-600" />
                                            Resource Information
                                          </h4>
                                          <div className="space-y-3 bg-white/50 p-4 rounded-xl">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                              <span className="font-semibold text-gray-700 text-sm">Quarter:</span>
                                              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                                                {workplan.quarter || 'Not set'}
                                              </Badge>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                              <span className="font-semibold text-gray-700 text-sm">Resource Person:</span>
                                              <span className="text-gray-600 text-sm">{workplan.resource_person || 'Not assigned'}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                              <span className="font-semibold text-gray-700 text-sm">Visibility:</span>
                                              <Badge variant="outline" className={workplan.public_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                                {workplan.public_visible ? 'Public' : 'Private'}
                                              </Badge>
                                            </div>
                                            <div className="flex justify-between items-center py-2">
                                              <span className="font-semibold text-gray-700 text-sm">Progress:</span>
                                              <div className="flex items-center gap-3">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                  <div 
                                                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(workplan.progress)}`}
                                                    style={{ width: `${workplan.progress || 0}%` }}
                                                  />
                                                </div>
                                                <span className="text-gray-600 text-sm font-medium">{workplan.progress || 0}%</span>
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
                            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
                              <CardContent className="py-16 text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                  <Search className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {workplans.length === 0 ? 'No workplans found' : 'No matching activities'}
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                  {workplans.length === 0 
                                    ? 'Get started by creating your first workplan to organize your programs and activities.'
                                    : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                                  }
                                </p>
                                {(searchTerm || statusFilter !== 'all') && (
                                  <Button
                                    variant="outline"
                                    onClick={clearAllFilters}
                                    className="rounded-xl border-2 border-gray-200 hover:border-gray-300"
                                  >
                                    Clear filters
                                  </Button>
                                )}
                                {workplans.length === 0 && (
                                  <Button 
                                    onClick={() => setActiveView('create-workplan')}
                                    className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 ml-3"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create First Workplan
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </>
                    )}

                    {focusAreaTabs.length === 0 && (
                      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                        <CardContent className="py-20 text-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-10 h-10 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Workplan Manager</h2>
                          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                            Start organizing your programs and activities in one beautiful, centralized workspace.
                          </p>
                          <Button 
                            onClick={() => setActiveView('create-workplan')}
                            className="rounded-2xl px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          >
                            <Plus className="w-5 h-5 mr-3" />
                            Create Your First Workplan
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>

              {/* ANALYTICS TAB CONTENT */}
              <TabsContent value="analytics" className="m-0 p-8">
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
              </TabsContent>

              {/* EXPORT TAB CONTENT */}
              <TabsContent value="export" className="m-0 p-8">
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
              </TabsContent>

              {/* IMPORT TAB CONTENT */}
              <TabsContent value="import" className="m-0 p-8">
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
              </TabsContent>

              {/* CREATE WORKPLAN VIEW */}
              <TabsContent value="create-workplan" className="m-0 p-0">
                <WorkplanWizard 
                  onSuccess={handleWorkplanCreated}
                  onCancel={() => setActiveView('workplans')}
                />
              </TabsContent>

              {/* EDIT WORKPLAN VIEW */}
              <TabsContent value="edit-workplan" className="m-0 p-0">
                {selectedWorkplan && (
                  <div className="p-8">
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
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

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