[file name]: FocusAreaDetail.tsx
[file content begin]
// [file name]: components/workplans/admin/FocusAreaDetail.tsx
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Filter, 
  Target, 
  Calendar, 
  DollarSign, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2, 
  FileText, 
  Eye,
  BarChart3,
  Shield,
  HeartHandshake,
  Building2,
  Sparkles
} from 'lucide-react'
import type { Workplan } from '@/lib/types/workplan'

interface FocusAreaDetailProps {
  focusArea: string
  workplans: Workplan[]
  onBack: () => void
  onEditWorkplan?: (workplan: Workplan) => void
  onDeleteWorkplan?: (workplanId: string) => void
  onOpenMERL?: (workplan: Workplan) => void
  onExportFocusArea?: (focusArea: string, workplanIds: string[]) => void
}

export function FocusAreaDetail({
  focusArea,
  workplans,
  onBack,
  onEditWorkplan,
  onDeleteWorkplan,
  onOpenMERL,
  onExportFocusArea
}: FocusAreaDetailProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [quarterFilter, setQuarterFilter] = useState<string>('all')
  const [expandedWorkplan, setExpandedWorkplan] = useState<string | null>(null)

  // Filter workplans for this focus area
  const filteredWorkplans = useMemo(() => {
    return workplans.filter(workplan => {
      const matchesSearch = !searchTerm || 
        workplan.activity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workplan.tasks_description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || workplan.status === statusFilter
      const matchesQuarter = quarterFilter === 'all' || workplan.quarter === quarterFilter
      
      return matchesSearch && matchesStatus && matchesQuarter
    })
  }, [workplans, searchTerm, statusFilter, quarterFilter])

  // Calculate focus area stats
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

  // Get unique quarters for this focus area
  const availableQuarters = useMemo(() => {
    const quarters = [...new Set(filteredWorkplans.map(w => w.quarter).filter(Boolean))] as string[]
    return quarters.sort()
  }, [filteredWorkplans])

  const handleEdit = (workplan: Workplan) => {
    onEditWorkplan?.(workplan)
  }

  const handleDelete = (workplan: Workplan) => {
    if (confirm(`Are you sure you want to delete "${workplan.activity_name}"?`)) {
      onDeleteWorkplan?.(workplan.id)
    }
  }

  const handleOpenMERL = (workplan: Workplan) => {
    onOpenMERL?.(workplan)
  }

  const handleView = (workplan: Workplan) => {
    alert(`Viewing: ${workplan.activity_name}\nStatus: ${workplan.status}\nProgress: ${workplan.progress}%`)
  }

  const handleExportFocusArea = () => {
    onExportFocusArea?.(focusArea, filteredWorkplans.map(w => w.id))
  }

  const toggleExpand = (workplanId: string) => {
    setExpandedWorkplan(expandedWorkplan === workplanId ? null : workplanId)
  }

  const getFocusAreaIcon = () => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management': return Shield
      case 'Survivors Livelihood Support Services': return HeartHandshake
      case 'Institutional Development and Growth': return Building2
      default: return Target
    }
  }

  const getFocusAreaColor = () => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management': return 'from-red-500 to-red-600'
      case 'Survivors Livelihood Support Services': return 'from-green-500 to-green-600'
      case 'Institutional Development and Growth': return 'from-blue-500 to-blue-600'
      default: return 'from-purple-500 to-purple-600'
    }
  }

  const getFocusAreaAccent = () => {
    switch (focusArea) {
      case 'Comprehensive Gender-based Violence GBV Management': return 'red'
      case 'Survivors Livelihood Support Services': return 'green'
      case 'Institutional Development and Growth': return 'blue'
      default: return 'purple'
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200 shadow-sm'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200 shadow-sm'
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200 shadow-sm'
      default: return 'bg-gray-100 text-gray-800 border-gray-200 shadow-sm'
    }
  }

  const getProgressColor = (progress: number | null) => {
    if (!progress) return 'bg-gradient-to-r from-gray-400 to-gray-500'
    if (progress >= 80) return 'bg-gradient-to-r from-green-400 to-green-500'
    if (progress >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
    return 'bg-gradient-to-r from-red-400 to-red-500'
  }

  const truncateText = (text: string | null, maxLength: number = 60) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || quarterFilter !== 'all'

  const FocusAreaIcon = getFocusAreaIcon()
  const accentColor = getFocusAreaAccent()
  const gradientClass = getFocusAreaColor()

  return (
    <div className="space-y-8">
      {/* Header with Beautiful Gradient */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${gradientClass} text-white p-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack} 
                  className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/20 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All Workplans
                </Button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <FocusAreaIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{focusArea}</h1>
                    <p className="text-white/80 text-lg mt-1">Focus Area Overview</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleExportFocusArea} 
                variant="secondary" 
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Focus Area
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Activities</CardTitle>
            <Target className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{stats.totalActivities}</div>
            <p className="text-xs text-blue-700 mt-1">
              in this focus area
            </p>
            <Progress value={100} className="mt-3 h-1.5 bg-blue-200" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Completion Rate</CardTitle>
            <BarChart3 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{stats.completionRate}%</div>
            <p className="text-xs text-green-700 mt-1">
              {stats.completedActivities} completed
            </p>
            <div className="w-full bg-green-200 rounded-full h-1.5 mt-3">
              <div 
                className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Total Budget</CardTitle>
            <DollarSign className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">KES {stats.totalBudget}</div>
            <p className="text-xs text-amber-700 mt-1">
              allocated budget
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Avg Progress</CardTitle>
            <Sparkles className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{stats.avgProgress}%</div>
            <p className="text-xs text-purple-700 mt-1">
              average progress
            </p>
            <div className="w-full bg-purple-200 rounded-full h-1.5 mt-3">
              <div 
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${stats.avgProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder={`Search activities in ${focusArea.split(' ')[0]}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-300"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-12 rounded-xl border-2 border-gray-200 focus:border-blue-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-xl">
                <SelectItem value="all" className="rounded-lg">All Status</SelectItem>
                <SelectItem value="planned" className="rounded-lg">Planned</SelectItem>
                <SelectItem value="in-progress" className="rounded-lg">In Progress</SelectItem>
                <SelectItem value="completed" className="rounded-lg">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={quarterFilter} onValueChange={setQuarterFilter}>
              <SelectTrigger className="w-[140px] h-12 rounded-xl border-2 border-gray-200 focus:border-blue-300">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Quarter" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 shadow-xl">
                <SelectItem value="all" className="rounded-lg">All Quarters</SelectItem>
                {availableQuarters.map(quarter => (
                  <SelectItem key={quarter} value={quarter} className="rounded-lg">{quarter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count and filter actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">
                📊 Showing {filteredWorkplans.length} of {workplans.length} activities
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
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setQuarterFilter('all')
                }}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
                  <th className="text-left p-4 font-semibold w-2/5">Activity Details</th>
                  <th className="text-left p-4 font-semibold w-20">Status</th>
                  <th className="text-left p-4 font-semibold w-32">Progress</th>
                  <th className="text-left p-4 font-semibold w-24">Budget</th>
                  <th className="text-left p-4 font-semibold w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkplans.map((workplan) => {
                  const isExpanded = expandedWorkplan === workplan.id
                  
                  return (
                    <>
                      <tr 
                        key={workplan.id} 
                        className={`border-b transition-all duration-300 cursor-pointer ${
                          isExpanded 
                            ? 'bg-blue-25 shadow-inner' 
                            : 'hover:bg-gray-50/80'
                        }`}
                        onClick={() => toggleExpand(workplan.id)}
                      >
                        <td className="p-4">
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              {workplan.activity_name}
                              {isExpanded ? 
                                <ChevronUp className="h-3 w-3 text-blue-600" /> : 
                                <ChevronDown className="h-3 w-3 text-gray-500" />
                              }
                            </div>
                            <div className="text-xs text-gray-600 leading-relaxed">
                              {truncateText(workplan.tasks_description, 80)}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              {workplan.quarter && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span className="font-medium">{workplan.quarter}</span>
                                </div>
                              )}
                              {workplan.resource_person && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  <span className="font-medium">{workplan.resource_person}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant="outline" 
                            className={`px-3 py-1.5 rounded-full font-semibold ${getStatusColor(workplan.status)}`}
                          >
                            {workplan.status || 'planned'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                              <div 
                                className={`h-2.5 rounded-full transition-all duration-1000 shadow-sm ${getProgressColor(workplan.progress)}`} 
                                style={{ width: `${workplan.progress || 0}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600 text-center font-medium">
                              {workplan.progress || 0}%
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold flex items-center gap-1 text-gray-900">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                            KES {(workplan.budget_allocated || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(workplan)}
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(workplan)}
                              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600 transition-all"
                              title="Edit"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenMERL(workplan)}
                              className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-600 transition-all"
                              title="Open MERL"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(workplan)}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded row for additional details */}
                      {isExpanded && (
                        <tr className="bg-gradient-to-r from-blue-25 to-purple-25">
                          <td colSpan={5} className="p-4 border-b">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  Activity Details
                                </h4>
                                <div className="bg-white/80 rounded-xl p-4 border border-gray-200">
                                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {workplan.tasks_description}
                                  </p>
                                  {workplan.target && (
                                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                      <span className="font-semibold text-amber-800">Target: </span>
                                      <span className="text-amber-900">{workplan.target}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-green-600" />
                                  Additional Information
                                </h4>
                                <div className="bg-white/80 rounded-xl p-4 border border-gray-200 space-y-3">
                                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-700">Timeline: </span>
                                    <span className="text-gray-900 font-medium">{workplan.timeline_text}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-medium text-gray-700">Resource Person: </span>
                                    <span className="text-gray-900 font-medium">{workplan.resource_person || 'Not assigned'}</span>
                                  </div>
                                  <div className="flex justify-between items-center py-2">
                                    <span className="font-medium text-gray-700">Visibility: </span>
                                    <Badge variant="outline" className={workplan.public_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                      {workplan.public_visible ? 'Public' : 'Private'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredWorkplans.length === 0 && (
            <div className="text-center py-16 text-gray-600">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setQuarterFilter('all')
                  }}
                  className="rounded-xl border-2 border-gray-200 hover:border-gray-300"
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
[file content end]