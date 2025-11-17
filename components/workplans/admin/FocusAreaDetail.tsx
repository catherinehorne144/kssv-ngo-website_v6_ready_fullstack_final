// [file name]: components/workplans/admin/FocusAreaDetail.tsx
'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Download, Filter, Target, Calendar, DollarSign, Users, ChevronDown, ChevronUp, Edit, Trash2, FileText, Eye } from 'lucide-react'
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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in-progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'planned': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getProgressColor = (progress: number | null) => {
    if (!progress) return 'bg-gray-500'
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const truncateText = (text: string | null, maxLength: number = 60) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || quarterFilter !== 'all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to All Workplans
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{focusArea}</h1>
            <p className="text-muted-foreground">Focus Area Overview</p>
          </div>
        </div>
        <Button onClick={handleExportFocusArea} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Focus Area
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">
              in this focus area
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedActivities} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground">
              average progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities in this focus area..."
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
          </div>

          {/* Results count and filter actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Showing {filteredWorkplans.length} of {workplans.length} activities
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
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setQuarterFilter('all')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left p-4 font-medium w-1/3">Activity Details</th>
                  <th className="text-left p-4 font-medium w-20">Status</th>
                  <th className="text-left p-4 font-medium w-32">Progress</th>
                  <th className="text-left p-4 font-medium w-24">Budget</th>
                  <th className="text-left p-4 font-medium w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkplans.map((workplan) => (
                  <>
                    <tr 
                      key={workplan.id} 
                      className={`border-b hover:bg-muted/20 transition-colors cursor-pointer ${
                        expandedWorkplan === workplan.id ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => toggleExpand(workplan.id)}
                    >
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-foreground mb-1 flex items-center gap-2">
                            {workplan.activity_name}
                            {expandedWorkplan === workplan.id ? 
                              <ChevronUp className="h-3 w-3 text-muted-foreground" /> : 
                              <ChevronDown className="h-3 w-3 text-muted-foreground" />
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {truncateText(workplan.tasks_description, 80)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            {workplan.quarter && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{workplan.quarter}</span>
                              </div>
                            )}
                            {workplan.resource_person && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{workplan.resource_person}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(workplan.status)}
                        >
                          {workplan.status || 'planned'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${getProgressColor(workplan.progress)}`} 
                              style={{ width: `${workplan.progress || 0}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground text-center">
                            {workplan.progress || 0}%
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          KES {(workplan.budget_allocated || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(workplan)}
                            className="h-8 w-8 p-0"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(workplan)}
                            className="h-8 w-8 p-0"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenMERL(workplan)}
                            className="h-8 w-8 p-0"
                            title="Open MERL"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(workplan)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded row for additional details */}
                    {expandedWorkplan === workplan.id && (
                      <tr className="bg-muted/20">
                        <td colSpan={5} className="p-4 border-b">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium mb-2">Activity Details</h4>
                              <p className="text-muted-foreground whitespace-pre-wrap">
                                {workplan.tasks_description}
                              </p>
                              {workplan.target && (
                                <div className="mt-2">
                                  <span className="font-medium">Target: </span>
                                  <span>{workplan.target}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Additional Information</h4>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium">Timeline: </span>
                                  <span>{workplan.timeline_text}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Resource Person: </span>
                                  <span>{workplan.resource_person || 'Not assigned'}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Visibility: </span>
                                  <span>{workplan.public_visible ? 'Public' : 'Private'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {filteredWorkplans.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No activities found for the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}